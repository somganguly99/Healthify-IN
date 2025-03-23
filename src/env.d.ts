/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_APP_TITLE: string
    readonly VITE_GOOGLE_MAPS_API_KEY: string
    // add other env variables here
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }