import McpBModule from "../../../src/module";

export default defineNuxtConfig({
    modules: [McpBModule],

    mcpB: {
        autoInitialize: true,
    },

    compatibilityDate: "2025-01-01",
});
