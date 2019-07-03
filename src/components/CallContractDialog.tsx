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

  tryStringifyJsonHelper(p, replacer, space) {
    if (typeof p === "string") {
      return p;
    }
    try {
      return JSON.stringify(p, replacer, space);
    } catch (e) {
      return String(p);
    }
  }

  tryStringifyJson(value) {
    return this.tryStringifyJsonHelper(value, undefined, 2);
  }

  replaceAll(text, search, replacement) {
    return text.split(search).join(replacement);
  }

  tryParseJson(p) {
    try {
      return JSON.parse(p);
    } catch (e) {
      return p;
    }
  }

  parseParamsFromField(selector) {
    return this.parseParamList(document.querySelector(selector).value.trim());
  }

  parseParamList(pText) {
    pText = this.replaceAll(pText, "\r", "\n");
    pText = this.replaceAll(pText, "\n\n", "\n");
    let params = pText
      .split("\n")
      .filter(e => e.trim())
      .map(this.tryParseJson);

    return params;
  }

  formatResult(r, isError) {
    const fail = isError || r.deliver_tx.code || r.check_tx.code;
    let msg;
    if (fail) {
      msg =
        '<b>Result</b>: <span class="Error":>ERROR</span><br><b>Message</b>: <span class="Error">' +
        (r.deliver_tx.log || r.check_tx.log || this.tryStringifyJson(r)) +
        "</span>" +
        "<br><b>Hash</b>: ";
      if (r.hash) {
        msg += '<a href="/tx.html?hash=' + r.hash + '">' + r.hash + "</a>";
      } else {
        msg += "N/A";
      }
      return msg;
    } else {
      msg =
        '<b>Result</b>: <span class="Success"><b>SUCCESS</b></span>' +
        '<br><b>Returned Value</b>:  <span class="Success">' +
        this.tryStringifyJson(r.returnValue) +
        "</span>" +
        '<br><b>Hash</b>: <a href="https://devtools.icetea.io/tx.html?hash=' +
        r.hash +
        '" target="_blank" rel="noopener noreferrer">' +
        r.hash +
        "</a>";
      msg +=
        "<br><b>Height</b>: " +
        r.height +
        "<br><b>Tags</b>: " +
        this.tryStringifyJson(r.tags) +
        "<br><b>Events:</b> " +
        this.tryStringifyJson(r.events);
      return msg;
    }
  }

  render() {
    console.log("state CK", this.state);
    const { funcs } = this.state;
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
            <div style={{ marginRight: "2em" }}>
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
                customClassName="callCtBtn"
                label="Call"
                onClick={async () => {
                  document.getElementById("funcName").innerHTML = key;
                  let name;
                  if (key.includes("(")) {
                    name = key.substring(0, key.indexOf("("));
                  } else {
                    name = key;
                  }
                  const params = this.parseParamsFromField("#params");

                  const addr = (document.getElementById(
                    "callContractAddr"
                  ) as HTMLSelectElement).value;
                  
                  let result;
                  try {
                    document.getElementById("resultJson").innerHTML =
                      "<span class='Error'>sending...</span>";
                    const ct = tweb3.contract(addr);
                    result = await ct.methods[name](...params).sendCommit();
                    console.log(result);
                    document.getElementById(
                      "resultJson"
                    ).innerHTML = this.formatResult(result, false);
                  } catch (error) {
                    console.log(error);
                    document.getElementById(
                      "resultJson"
                    ).innerHTML = this.formatResult(error, true);
                  }
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
            <div
              className="callContractContent"
              style={{ flex: 1, padding: "8px" }}
            >
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
