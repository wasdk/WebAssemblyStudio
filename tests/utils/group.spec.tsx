/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

import Group from "../../src/utils/group";
import { View } from "../../src/components/editor/View";
import { File, FileType } from "../../src/models";

function generateFiles() {
    return {
        a: new File("A", FileType.JavaScript),
        b: new File("B", FileType.JavaScript),
        c: new File("C", FileType.JavaScript)
    };
}

describe("Tab Group tests", () => {
    it("should open a file", () => {
        const files = generateFiles();
        const a = new View(files.a);
        const b = new View(files.b);
        const group = new Group(a, [a, b]);

        group.openFile(files.c);

        expect(group.currentView.file.name).toBe("C");
        expect(group.preview.file.name).toBe("C");
    });
    it("should switch between views", () => {
        const files = generateFiles();
        const a = new View(files.a);
        const b = new View(files.b);
        const group = new Group(a, [a, b]);

        group.openFile(files.c);
        expect(group.currentView.file.name).toBe("C");

        group.open(a);

        expect(group.currentView.file.name).toBe("A");
        expect(group.preview.file.name).toBe("C");
    });
    it("should close a view", () => {
        const files = generateFiles();
        const a = new View(files.a);
        const b = new View(files.b);
        const group = new Group(a, [a, b]);

        group.openFile(files.c);
        group.close(group.preview);

        expect(group.currentView.file.name).toBe("B");
        expect(group.preview).toBe(null);
    });
});
