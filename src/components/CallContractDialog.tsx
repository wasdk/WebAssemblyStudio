/* Copyright 2018 Mozilla Foundation
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import * as React from "react";
import * as ReactModal from "react-modal";
import { Button } from "./shared/Button";
import { GoX, GoCheck } from "./shared/Icons";
import { IceteaWeb3 } from "@iceteachain/web3";
import { MethodInfo, parseParamsFromField, formatResult } from "./RightPanel";
const tweb3 = new IceteaWeb3("https://rpc.icetea.io");

export default class CallContractDialog extends React.Component<
  {
    isOpen: boolean;
    funcInfo: MethodInfo;
    address: String;
    onCancel: () => void;
  },
  { isCallFuncs: boolean; funcs: object }
> {
  constructor(props: any) {
    super(props);
    this.state = {
      isCallFuncs: false,
      funcs: {}
    };
  }

  cancel = () => {
    this.props.onCancel();
  };

  call = async () => {
    const { funcInfo, address } = this.props;
    if (funcInfo) {
      let result;
      try {
        //Can xem lai param0
        const params = parseParamsFromField('#param0');
        document.getElementById("funcName").innerHTML = funcInfo.name;
        document.getElementById("resultJson").innerHTML =
          "<span class='Error'>sending...</span>";
        const name = funcInfo.name;
        const ct = tweb3.contract(address);
        result = await ct.methods[name](...params).sendCommit();
        console.log(result);
        document.getElementById("resultJson").innerHTML = formatResult(
          result,
          false
        );
      } catch (error) {
        console.log(error);
        document.getElementById("resultJson").innerHTML = formatResult(
          error,
          true
        );
      }
    }
    this.props.onCancel();
  };

  render() {
    const { funcInfo, isOpen } = this.props;
    // console.log("funcInfo", funcInfo);
    let funcDes = "LuongHV";
    if (funcInfo) {
      const params = funcInfo.params;
      // const { name } = params[0];
      // const { type } = params[0];
      // console.log("params name", params[0]['name']);
      // console.log("name", name);
      // console.log("type", type[0]);

      for (let i = 0; i < params.length; i++) {
        const name = params[i].name;
        const type = params[i].type[0];
        funcDes = name + ": " + type;
      }
    }

    let pramsDes;

    if (funcInfo) {
      const params = funcInfo.params;
      console.log("params", params);
      pramsDes = Object.keys(params).map((key, i) => {
        return (
          <li>
            <div>{params[i].name + ": " + params[i].type[0]}</div>
            {params[i].type[0] === "any" ? (
              <textarea id={"param" + [i]} />
            ) : (
              <input id={"param" + [i]} />
            )}
          </li>
        );
      });
    }

    return (
      <ReactModal
        isOpen={isOpen}
        contentLabel="Call Contract"
        className="modalCallContract"
        overlayClassName="overlayCallContract"
        ariaHideApp={false}
      >
        <div
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          <div className="modal-title-bar">
            Call function :{funcInfo && funcInfo.name}
          </div>
          <div>
            <ul>{pramsDes}</ul>
          </div>
          <Button
            customClassName="saveBtn"
            icon={<GoCheck />}
            label="Call"
            title="call"
            onClick={() => {
              this.call();
            }}
          />
          <Button
            customClassName="saveBtn"
            icon={<GoX />}
            label="Cancel"
            title="Cancel"
            onClick={() => {
              this.cancel();
            }}
          />
        </div>
      </ReactModal>
    );
  }
}
