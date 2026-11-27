/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_AI_SERVICE_URL?: string;
  readonly VITE_SOCKET_URL?: string;
  readonly VITE_MAPLIBRE_STYLE?: string;
  readonly VITE_OSRM_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
