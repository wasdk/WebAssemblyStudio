import { CompilerService, ServiceInput, ServiceOutput, Language } from "./types";
import { sendRequestJSON, ServiceTypes } from "./sendRequest";
import { decodeBinary } from "./utils";

export class GoService implements CompilerService {
    async compile(input: ServiceInput): Promise<ServiceOutput> {
    }
}