/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_BACKEND_URL?: string;
  readonly VITE_MENU_ENDPOINT?: string;
  readonly VITE_LOGIN_ENDPOINT?: string;
  readonly VITE_REGISTER_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
