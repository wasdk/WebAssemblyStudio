import * as React from "react";
import { Service } from "../service";
import * as ReactModal from "react-modal";
import { Button } from "./Button";
import { GoGear, GoFile, GoX, Icon } from "./Icons";
import { File, FileType, Directory, extensionForFileType, nameForFileType } from "../model";
import { KeyboardEvent, ChangeEvent, ChangeEventHandler } from "react";
import { ListBox, ListItem, TextInputBox } from "./Widgets";

export class ShareDialog extends React.Component<{
  isOpen: boolean;
  fiddle: string;
  onCancel: () => void;
}, {
  }> {
  constructor(props: any) {
    super(props);
    this.state = {
    };
  }

  render() {
    let urlPrefix = `${location.protocol}//${location.host}${location.pathname}`;

    // let embedCode = `<iframe src="${urlPrefix}?embed&f=${this.props.fiddle}" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>`;
    return <ReactModal
      isOpen={this.props.isOpen}
      contentLabel="Share Project"
      className="modal"
      overlayClassName="overlay"
      ariaHideApp={false}
    >
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div className="modal-title-bar">
          Share Project
        </div>
        <div style={{ flex: 1, padding: "8px" }}>
          <TextInputBox label="URL" value={`${urlPrefix}?f=${this.props.fiddle}`}/>
          <TextInputBox label="IFrame" value={`<iframe src="${urlPrefix}?embed&f=${this.props.fiddle}" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>`}/>
        </div>
        <div>
          <Button icon={<GoX />} label="Cancel" title="Cancel" onClick={() => {
            this.props.onCancel();
          }} />
        </div>
      </div>
    </ReactModal>;
  }
}