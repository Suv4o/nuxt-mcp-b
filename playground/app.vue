<template>
    <div>
        <h1>nuxt-mcp-b Playground</h1>
        <p>Open your browser's console to verify MCP-B is initialized.</p>
        <p>Tools registered: {{ toolCount }}</p>
    </div>
</template>

<script setup lang="ts">
const toolCount = ref(0);

useMcpTool({
    name: "get-page-info",
    description: "Returns information about the current page",
    inputSchema: {
        type: "object",
        properties: {
            field: {
                type: "string",
                description: "Which field to return: title, url, or both",
            },
        },
    },
    execute: async (args) => {
        const field = args.field as string | undefined;
        const info: Record<string, string> = {};
        if (!field || field === "title" || field === "both") {
            info.title = document.title;
        }
        if (!field || field === "url" || field === "both") {
            info.url = window.location.href;
        }
        return {
            content: [{ type: "text", text: JSON.stringify(info) }],
        };
    },
});

onMounted(() => {
    if (typeof navigator !== "undefined" && navigator.modelContext) {
        console.log("[nuxt-mcp-b] MCP-B initialized successfully!");
        toolCount.value = 1;
    }
});
</script>
