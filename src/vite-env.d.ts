// FIX: Manually define the ImportMeta interface to resolve type errors
// related to `import.meta.env` and to fix the "Cannot find type definition file for 'vite/client'" error.
// The original reference `/// <reference types="vite/client" />` was removed as it could not be resolved.

interface ImportMetaEnv {
  readonly VITE_AUTH0_DOMAIN: string;
  readonly VITE_AUTH0_CLIENT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
