import { CompilerService, ServiceInput, ServiceOutput, Language } from "./types";

import { sendRequestJSON, ServiceTypes } from "./sendRequest";
import { decodeBinary } from "./utils";

export class GoService implements CompilerService {
    async compile(input: ServiceInput): Promise<ServiceOutput> {
        let result, fileRef, content, console;
        const items: any = {}
        const extraItems: any = {}
        const options = input.options;

        if (result.success) {
            content = await decodeBinary(result.output)
        }

        if (result.tasks && result.tasks.length > 0) {
            console = result.tasks[0].console
        }

        if (result.goJs) {
            extraItems["wasm_exec.js"] = {
                content: result.goJs,
            }
        }

        return {
            success: result.success,
            items: {
                "main.wasm": { content, fileRef, console, },
                ...extraItems
            },
            console: result.message
        }
    }
}