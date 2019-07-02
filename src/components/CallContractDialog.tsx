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
import { GoX } from "./shared/Icons";
import { TextInputBox } from "./Widgets";
import { IceteaWeb3 } from "@iceteachain/web3";
const tweb3 = new IceteaWeb3("https://rpc.icetea.io");

export class CallContractDialog extends React.Component<
  {
    isOpen: boolean;
    deployedAddresses: string[];
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

  async callFuncs(address) {
    const funcs = await tweb3.getMetadata(address);
    this.setState({ isCallFuncs: true, funcs: funcs });
  }

  render() {
    const urlPrefix = `${location.protocol}//${location.host}${
      location.pathname
    }`;
    console.log("state CK", this.state);
    const { funcs } = this.state;
    const temp = 0;
    const funcsList = Object.keys(funcs).map(key => (
      <ul>
        <li>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              marginRight: "-10px",
              marginLeft: "-10px"
            }}
          >
            <div style={{ marginRight: "10em" }}>
              <span>
                {(function() {
                  if (key.indexOf("$") !== 0) {
                    const meta = funcs[key];
                    if (meta.params) {
                      let ps = meta.params
                        .reduce((prev, p) => {
                          prev.push(p.name + ": " + p.type);
                          return prev;
                        }, [])
                        .join(", ");
                      key += "(" + ps + ")";
                      return key;
                    } else {
                      return key;
                    }
                  }
                })()}
              </span>
            </div>
            <div className="btnCall">
              <Button
                customClassName="saveBtn"
                label="Call"
                onClick={() => {
                  document.getElementById("funcName").innerHTML = key;
                }}
              />
            </div>
          </div>
        </li>
      </ul>
    ));
    return (
      <ReactModal
        isOpen={this.props.isOpen}
        contentLabel="Call Contract"
        className="modalCallContract"
        overlayClassName="overlayCallContract"
        ariaHideApp={false}
      >
        <div
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          <div className="modal-title-bar">Call Contract</div>
          {this.props.deployedAddresses.length > 0 ? (
            <div style={{ flex: 1, padding: "8px" }}>
              <p>
                Contract:&nbsp;
                <select id="callContractAddr">
                  {this.props.deployedAddresses.map((addr, i) => (
                    <option key={i} value={addr}>
                      {addr}
                    </option>
                  ))}
                </select>
              </p>
              <Button
                label=" Call this contract "
                title="Call all functions of this contract"
                onClick={() => {
                  const addr = (document.getElementById(
                    "callContractAddr"
                  ) as HTMLSelectElement).value;
                  this.callFuncs(addr);
                  // const url = "https://devtools.icetea.io/contract.html?address=" + addr;
                  // this.props.onCancel();
                  // const win = window.open(url, '_blank');
                  // win.focus();
                }}
              />
              {this.state.isCallFuncs && (
                <div>
                  <div className="funcList">{funcsList}</div>
                  <p>
                    <label>
                      Params (each param 1 row, JSON accepted, use " to denote
                      string)
                    </label>
                  </p>
                  <p>
                    <textarea
                      id="params"
                      style={{ height: "50px", width: "99%" }}
                    />
                  </p>
                  <section id="result">
                    <div>
                      <b id="funcName" />
                    </div>
                    <div>
                      <code id="resultJson" />
                    </div>
                  </section>
                </div>
              )}
            </div>
          ) : (
            <p style={{ flex: 1, padding: "8px" }}>
              No deployed contract. Deploy one first.
            </p>
          )}
          <div>
            <Button
              icon={<GoX />}
              label="Cancel"
              title="Cancel"
              onClick={() => {
                this.props.onCancel();
              }}
            />
          </div>
        </div>
      </ReactModal>
    );
  }
}
