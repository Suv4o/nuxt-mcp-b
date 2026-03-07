import { initializeWebModelContext } from "@mcp-b/global";
import { defineNuxtPlugin, useRuntimeConfig } from "#imports";

export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig();
    const options = config.public.mcpB as {
        autoInitialize?: boolean;
        transport?: Record<string, unknown>;
        nativeModelContextBehavior?: "preserve" | "patch";
        installTestingShim?: boolean | "always" | "if-missing";
    };

    if (options?.autoInitialize === false) {
        return;
    }

    initializeWebModelContext({
        transport: options?.transport as Parameters<
            typeof initializeWebModelContext
        >[0]["transport"],
        nativeModelContextBehavior: options?.nativeModelContextBehavior,
        installTestingShim: options?.installTestingShim,
    });
});
