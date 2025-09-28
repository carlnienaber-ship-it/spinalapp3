// FIX: Replaced Auth0 Action script with a proper TypeScript module for JWT verification.
// The original content was for an Auth0 Action and not usable as a server-side utility module.
// This new implementation provides the `verifyJwtAndCheckRole` function needed by the Netlify functions.

import { HandlerEvent } from "@netlify/functions";
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

// These environment variables need to be set in your Netlify build settings.
// They should match the ones used in your frontend Auth0 configuration.
const AUTH0_DOMAIN = process.env.VITE_AUTH0_DOMAIN;
const AUTH0_AUDIENCE = process.env.VITE_AUTH0_AUDIENCE;

if (!AUTH0_DOMAIN || !AUTH0_AUDIENCE) {
    throw new Error('VITE_AUTH0_DOMAIN and VITE_AUTH0_AUDIENCE must be set in the environment for Netlify functions.');
}

const client = jwksClient({
  jwksUri: `https://${AUTH0_DOMAIN}/.well-known/jwks.json`
});

const getKey: jwt.GetPublicKeyOrSecret = (header, callback) => {
  if (!header.kid) {
    return callback(new Error("Authorization error: Missing 'kid' in JWT header."));
  }
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      console.error("Error getting signing key:", err);
      return callback(err);
    }
    // The key object can be of different types, getPublicKey() is for RSA
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
};

const verifyJwt = (token: string): Promise<jwt.JwtPayload> => {
    const options: jwt.VerifyOptions = {
        audience: AUTH0_AUDIENCE,
        issuer: `https://${AUTH0_DOMAIN}/`,
        algorithms: ['RS256']
    };

    return new Promise((resolve, reject) => {
        jwt.verify(token, getKey, options, (err, decoded) => {
            if (err) {
                console.error("JWT Verification Error:", err.message);
                return reject(new Error("Authorization error: " + err.message));
            }
            if (!decoded || typeof decoded === 'string') {
                return reject(new Error("Authorization error: Invalid token payload."));
            }
            resolve(decoded as jwt.JwtPayload);
        });
    });
};

export const verifyJwtAndCheckRole = async (event: HandlerEvent, requiredRole?: string) => {
    const authHeader = event.headers.authorization;
    if (!authHeader) {
        throw new Error("Authorization error: Authorization header missing.");
    }

    const tokenMatch = authHeader.match(/^Bearer (.+)$/);
    if (!tokenMatch || tokenMatch.length < 2) {
        throw new Error("Authorization error: Malformed Bearer token.");
    }
    const token = tokenMatch[1];

    try {
        const decoded = await verifyJwt(token);

        if (requiredRole) {
            const roles = decoded['https://spinalapp.com/roles'] as string[] | undefined;
            if (!roles || !roles.includes(requiredRole)) {
                throw new Error(`Access denied. User does not have the required '${requiredRole}' role.`);
            }
        }
        
        return decoded; // Success
    } catch (error) {
        // Re-throw the specific error from verifyJwt or the role check
        throw error;
    }
};

/**
 * The code below is a reference for the Auth0 Action script that should be created in the Auth0 dashboard.
 * This script is responsible for adding the user's roles to the access token.
 * It is NOT used by the Netlify functions directly.
 * 
 * To create the action:
 * 1. Go to Auth0 Dashboard > Actions > Library > Custom.
 * 2. Click "Create Action".
 * 3. Name: "Add Roles to Token", Trigger: "Login / Post Login", Runtime: Node 18 (or later).
 * 4. Paste the onExecutePostLogin function into the editor.
 * 5. Deploy the action.
 * 6. Go to Actions > Flows > Login.
 * 7. Drag your new action into the flow.
 * 8. Apply changes.
 *
 * --- SCRIPT FOR AUTH0 ACTION ---
 *
 * exports.onExecutePostLogin = async (event, api) => {
 *   const namespace = 'https://spinalapp.com';
 * 
 *   // Get roles from the top-level user object (for database connections)
 *   // or from the authorization context (for enterprise connections, etc.)
 *   const roles = (event.authorization && event.authorization.roles) || (event.user && event.user.roles) || [];
 * 
 *   if (roles.length > 0) {
 *     // This adds the roles to the Access Token (for the backend API)
 *     api.accessToken.setCustomClaim(`${namespace}/roles`, roles);
 *     // This adds the roles to the ID Token (for the frontend UI)
 *     api.idToken.setCustomClaim(`${namespace}/roles`, roles);
 *   }
 * };
 */
