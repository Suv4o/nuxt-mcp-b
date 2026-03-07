export default defineNuxtConfig({
    modules: ["../src/module"],

    mcpB: {
        autoInitialize: true,
    },

    devtools: { enabled: true },

    compatibilityDate: "2025-01-01",
});
