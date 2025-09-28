import { HandlerEvent } from "@netlify/functions";
import jwt, { JwtPayload } from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

const client = jwksClient({
  jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
});

function getKey(header: any, callback: (err: Error | null, key?: string) => void) {
  client.getSigningKey(header.kid, function(err, key) {
    if (err) {
        callback(err, undefined);
        return;
    }
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

/**
 * Verifies the Auth0 JWT from the Authorization header and optionally checks for a specific role.
 * @param event The Netlify handler event.
 * @param requiredRole An optional role to check for (e.g., 'Admin').
 * @returns A promise that resolves with the decoded JWT payload.
 * @throws An error if the token is invalid, missing, or the user lacks the required role.
 */
export const verifyJwtAndCheckRole = (event: HandlerEvent, requiredRole?: string): Promise<JwtPayload> => {
  return new Promise((resolve, reject) => {
    const { authorization } = event.headers;

    if (!authorization) {
      return reject(new Error('Missing Authorization header.'));
    }

    const token = authorization.split(' ')[1];
    if (!token) {
      return reject(new Error('Malformed Authorization header.'));
    }

    jwt.verify(token, getKey, {
      audience: process.env.AUTH0_API_AUDIENCE,
      issuer: `https://${process.env.AUTH0_DOMAIN}/`,
      algorithms: ['RS256']
    }, (err, decoded) => {
      if (err) {
        return reject(err);
      }

      const payload = decoded as JwtPayload;

      if (requiredRole) {
        const roles = payload['https://spinalapp.com/roles'] as string[] | undefined;
        if (!roles || !roles.includes(requiredRole)) {
          return reject(new Error(`Access denied. User does not have the required '${requiredRole}' role.`));
        }
      }

      resolve(payload);
    });
  });
};