// Type definitions for [tar-js]
// Project: [WebAssemblyStudios]
// Definitions by: [Florian Gilcher] <flo@andersground.net>

declare module '*';

interface Clipboard {
  readText(): Promise<string>;
  writeText(newClipText: string): Promise<void>;
}

interface NavigatorClipboard {
  readonly clipboard?: Clipboard;
}

interface Navigator extends NavigatorClipboard {}
