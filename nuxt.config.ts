// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@nuxt/icon", "@pinia/nuxt"],
  srcDir: "src/",
  css: ["~/assets/css/main.css"],
  ssr: false,
});
