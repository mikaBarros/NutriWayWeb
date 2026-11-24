import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const nextConfig = {
  // Define a raiz do projeto para evitar que o Next use o lockfile da pasta pai como workspace.
  turbopack: {
    root: dirname(fileURLToPath(import.meta.url))
  }
};

export default nextConfig;
