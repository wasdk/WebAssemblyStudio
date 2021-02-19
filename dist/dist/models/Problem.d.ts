import { File } from "./File";
export declare function monacoSeverityToString(severity: monaco.MarkerSeverity): "info" | "error" | "warning";
export declare class Problem {
    file: File;
    description: string;
    severity: "error" | "warning" | "info" | "ignore";
    marker?: monaco.editor.IMarkerData;
    readonly key: string;
    constructor(file: File, description: string, severity: "error" | "warning" | "info" | "ignore", marker?: monaco.editor.IMarkerData);
    static fromMarker(file: File, marker: monaco.editor.IMarkerData): Problem;
}
