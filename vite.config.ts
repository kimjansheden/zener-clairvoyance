import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { getBackendPort } from "./src/utils/getBackendPort";

// https://vite.dev/config/
export default defineConfig({
  base: "/clairvoyance/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Explicit production security settings
  build: {
    // Remove console.log in production builds
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true, // Remove all console statements
        drop_debugger: true, // Remove debugger statements
      },
    },
    // Disable source maps in production for security
    sourcemap: false,
  },
  // Proxy API requests to the backend server using the dynamic port
  server: {
    proxy: {
      "/api": {
        target: `http://localhost:${getBackendPort()}`,
        changeOrigin: true,
        configure: (proxy) => {
          // Add error handler to log proxy issues
          proxy.on("error", (err) => {
            console.log("Proxy error:", err);
          });

          // Add proxy event listeners for better debugging
          proxy.on("proxyReq", (proxyReq, req) => {
            console.log(`Proxying ${req.method} request to: ${proxyReq.path}`);
          });
        },
      },
    },
  },
});
