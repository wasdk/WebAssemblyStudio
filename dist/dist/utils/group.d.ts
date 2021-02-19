import { View, ViewType } from "../components/editor/View";
import { File } from "../models";
export default class Group {
    currentView: View;
    views: View[];
    preview: View;
    constructor(view: View, views?: View[]);
    open(view: View, shouldPreview?: boolean): void;
    openFile(file: File, type?: ViewType, preview?: boolean): void;
    close(view: View): void;
}
