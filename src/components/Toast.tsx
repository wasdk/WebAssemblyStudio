import * as React from "react";
import * as ReactModal from "react-modal";
import { Button } from "./Button";
import { GoX } from "./Icons";

export class Toast extends React.Component<{
    onDismiss: Function;
    uri: string;
}, {
}> {
    constructor(props: any) {
        super(props);
    }

    render() {

        return <ReactModal
            isOpen={true}
            contentLabel="Gist Created"
            className="toast"
            ariaHideApp={false}
            style={{overlay: {background: "rgba(255, 255, 255, 0)", position: "inherit"}}}>
            <div style={{ flexDirection: "column", height: "100%" }}>
                <div className="modal-title-bar toast-title">
                    Gist Created! <a href={this.props.uri} target="_blank" style={{color: "#fff"}}>Open in new tab.</a>
                </div>
                <div className={"button-toast-container"}>
                    <Button icon={<GoX />} customClass={"button button-toast"} label="Dismiss" title="Dismiss" onClick={this.props.onDismiss} />
                </div>
            </div>
        </ReactModal>;
    }
}