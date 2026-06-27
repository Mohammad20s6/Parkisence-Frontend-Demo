import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";

export default defineConfig({
  plugins: [
    react(),
    eslint({
      emitWarning: true,
      emitError: true,
      failOnWarning: false, // ⛔ لا overlay للـ warnings
      failOnError: true, // ✅ overlay فقط للأخطاء الحقيقية
    }),
  ],
});
