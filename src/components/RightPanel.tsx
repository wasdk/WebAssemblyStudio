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

import * as React from 'react';
import { Header } from './Header';
import { DirectoryTree } from './DirectoryTree';
import { Project, File, Directory, ModelRef } from '../models';
import { SplitOrientation, SplitInfo, Split } from './Split';
import appStore from '../stores/AppStore';
import CallContractDialog from './CallContractDialog';
import { IceteaWeb3 } from '@iceteachain/web3';
const tweb3 = new IceteaWeb3('https://rpc.icetea.io');

export interface MethodInfo {
  name?: string;
  decorators?: string[];
  params?: { name?: string; type?: string }[];
  returnType?: string[];
}

export interface RightPanelProps {
  /**
   * Active file.
   */
  address: string[];
}
export interface RightPanelState {
  splits: SplitInfo[];
  listFunc: MethodInfo[];
  funcInfo: {};
  addr: String;
  isCallParam: boolean;
  isWasmFuncs: boolean;
}

export function tryStringifyJsonHelper(p, replacer, space) {
  if (typeof p === 'string') {
    return p;
  }
  try {
    return JSON.stringify(p, replacer, space);
  } catch (e) {
    return String(p);
  }
}

export function tryStringifyJson(value) {
  return tryStringifyJsonHelper(value, undefined, 2);
}

export function replaceAll(text, search, replacement) {
  return text.split(search).join(replacement);
}

export function tryParseJson(p) {
  try {
    return JSON.parse(p);
  } catch (e) {
    return p;
  }
}

export function parseParamsFromField(selector) {
  return parseParamList(document.querySelector(selector).value.trim());
}

export function parseParamList(pText) {
  pText = replaceAll(pText, '\r', '\n');
  pText = replaceAll(pText, '\n\n', '\n');
  let params = pText
    .split('\n')
    .filter(e => e.trim())
    .map(tryParseJson);

  return params;
}

export function fmtType(t, convert) {
  if (!t) return 'any';
  if (!Array.isArray(t)) {
    t = [t];
  }
  if (convert) {
    t = t.map(item => (item === 'undefined' ? 'void' : item));
  }
  return t.join('|');
}

export function formatResult(r, isError) {
  const fail = isError || r.deliver_tx.code || r.check_tx.code;
  let msg;
  if (fail) {
    msg =
      '<b>Result</b>: <span class="Error":>ERROR</span><br><b>Message</b>: <span class="Error">' +
      (r.deliver_tx.log || r.check_tx.log || tryStringifyJson(r)) +
      '</span>' +
      '<br><b>Hash</b>: ';
    if (r.hash) {
      msg += '<a href="https://scan.icetea.io/tx/' + r.hash + '">' + r.hash + '</a>';
    } else {
      msg += 'N/A';
    }
    return msg;
  } else {
    msg =
      '<b>Result</b>: <span class="Success"><b>SUCCESS</b></span>' +
      '<br><b>Returned Value</b>:  <span class="Success">' +
      tryStringifyJson(r.returnValue) +
      '</span>' +
      '<br><b>Hash</b>: <a href="https://scan.icetea.io/tx/' +
      r.hash +
      '" target="_blank" rel="noopener noreferrer">' +
      r.hash +
      '</a>';
    msg +=
      '<br><b>Height</b>: ' +
      r.height +
      '<br><b>Tags</b>: ' +
      tryStringifyJson(r.tags) +
      '<br><b>Events:</b> ' +
      tryStringifyJson(r.events);
    return msg;
  }
}

export class RightPanel extends React.Component<RightPanelProps, RightPanelState> {
  directoryTree: DirectoryTree;
  constructor(props: any) {
    super(props);
    this.state = {
      splits: [
        {},
        {
          value: 300,
        },
        {
          value: 400,
        },
      ],
      listFunc: [],
      funcInfo: {},
      addr: '',
      isCallParam: false,
      isWasmFuncs: false,
    };
  }

  componentDidMount() {
    // appStore.onDidChangeDirty.register(this.refreshTree);
    // appStore.onDidChangeChildren.register(this.refreshTree);
    const { address } = this.props;
    if (address && address.length > 0) {
      this.setState({ addr: address[0] });
      this.getFuncList(address[0]);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { address } = this.props;
    if (address != nextProps.address) {
      this.setState({ addr: nextProps.address[0] });
      this.getFuncList(nextProps.address[0]);
    }
  }

  componentWillUnmount() {
    // appStore.onDidChangeDirty.unregister(this.refreshTree);
    // appStore.onDidChangeChildren.unregister(this.refreshTree);
  }

  refreshTree = () => {
    this.directoryTree.tree.refresh();
  };

  getFuncList(address) {
    tweb3.getMetadata(address).then(funcs => {
      // console.log('funcs', funcs);
      const lookLikeBot = funcs.botInfo || (funcs.getName && funcs.getDescription);
      if (!lookLikeBot) {
        document.getElementById('lookLikeBot').style.display = 'none';
      }
      // console.log('lookLikeBot', lookLikeBot);
      const newFunc = Object.keys(funcs).map(item => {
        const meta = funcs[item];
        if (meta.type === 'unknown') {
          return {
            name: item,
            decorators: 'unknown',
            params: 'unknown',
            returnType: 'unknown',
          };
        } else
          return {
            name: item,
            decorators: meta.decorators || [],
            params: meta.params || [],
            returnType: fmtType(meta.fieldType || meta.returnType, meta.returnType),
          };
      });

      this.setState({ listFunc: newFunc });
    });
  }

  callContractMethod = async func => {
    let result;
    const { addr } = this.state;
    const decotator = func.decorators[0];
    // console.log('func', func)

    func.decorators === 'unknown' &&
      this.setState({
        isWasmFuncs: true,
        isCallParam: true,
        funcInfo: func,
      });

    try {
      const params = func.params;
      if (params.length > 0) {
        this.setState({ isCallParam: true, funcInfo: func });
      } else {
        document.getElementById('callCtResult').innerHTML = "<span class='callCtResult'>Result</span>";
        document.getElementById('funcName').innerHTML = func.name;
        document.getElementById('resultJson').innerHTML = "<span class='Error'>sending...</span>";
        const addr = this.state.addr;
        const name = func.name;
        if (decotator === 'transaction') {
          const ct = tweb3.contract(addr);
          result = await ct.methods[name](...params).sendCommit();
          // console.log(result);
          document.getElementById('resultJson').innerHTML = formatResult(result, false);
        } else if (decotator === 'pure' || decotator === 'view') {
          const method = decotator === 'view' ? 'callReadonlyContractMethod' : 'callPureContractMethod';
          result = await tweb3[method](addr, name, params);
          // console.log(result);
          document.getElementById('resultJson').innerHTML = tryStringifyJson(result);
        }
      }
    } catch (error) {
      // console.log(error);
      document.getElementById('callCtResult').innerHTML = "<span class='callCtResultErr'>Result</span>";
      if (decotator === 'transaction') {
        document.getElementById('resultJson').innerHTML = formatResult(error, true);
      } else if (decotator === 'pure' || decotator === 'view') {
        document.getElementById('resultJson').innerHTML = tryStringifyJson(error);
      }
    }
  };

  changeAddress(event: React.FormEvent) {
    const address = (event.target as any).value;
    // console.log(address); // in chrome => B
    this.setState(
      {
        addr: address,
      },
      () => {
        this.getFuncList(address);
      }
    );
  }

  popupwindow (url, title, w, h) {
    var left = (window.screen.width / 2) - (w / 2)
    var top = (window.screen.height / 2) - (h / 2)
    return window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left)
  }

  chatWithBot() {
    const url = 'https://devtools.icetea.io/botpoup.html' + '?address=' + this.state.addr;
    this.popupwindow(url, 'title', 800, 600)
  }

  render() {
    const { address } = this.props;
    const { funcInfo, listFunc, isCallParam, addr, isWasmFuncs } = this.state;
    const resultJson = document.getElementById('resultJson');
    // console.log('address', address)

    const makeMethodCallContract = () => {
      return listFunc.map((func: MethodInfo, i: number) => {
        // console.log('MethodInfo', func);
        return (
          <li className="list-group-item row">
            <div className="row">
              <div className="col-7">
                <span className="badge badge-warning d-inline">
                  {func.decorators[0] === 'u' ? 'function' : func.decorators[0]}
                </span>
                <span
                  className={
                    func.decorators[0] === 'transaction' ? 'mx-1 px-1 text-danger' : 'mx-1 px-1 text-notDanger'
                  }
                >
                  {func.name}:&nbsp;{func.returnType}
                </span>
              </div>
              <div className="col-2">
                <button
                  type="button"
                  className="btn btn-outline-warning py-0 px-3 ml-3"
                  onClick={() => this.callContractMethod(func)}
                >
                  Call
                </button>
              </div>
            </div>
          </li>
        );
      });
    };

    return (
      <div className="rightPanelContainer">
        <div className="wasmStudioHeader">
          <span className="waHeaderText waHeaderTextCallCt">Call Contracts</span>
        </div>

        <div style={{ height: 'calc(100% - 41px)' }}>
          <Split
            name="CallContract"
            orientation={SplitOrientation.Horizontal}
            splits={this.state.splits}
            onChange={splits => {
              this.setState({ splits: splits });
            }}
          >
            <div />
            <div className="rightPanelfill">
              <div className="wrapper-method-list card">
                {/* <div className="card-header font-weight-bold border-light align-middle">Contracts:</div> */}
                <div className="mt-1">
                  {/* <div className="card-header border-bottom border-primary bg-black">
                    <div className="row justify-content-around align-items-center">
                      <div className="col">
                        <span className="badge badge-success">Deployed</span>
                        <span className="contract-name">:{contractName}</span>
                      </div>
                      <div className="col-1">
                        <span
                          title="icon expand"
                          aria-hidden="true"
                          aria-controls="collapse_contract"
                          aria-expanded="true"
                          className="btn btn-black oi oi-caret-bottom"
                        />
                      </div>
                    </div>
                  </div> */}
                  <div id="collapse_contract" className="collapse show">
                    {address.length > 0 ? (
                      <div className="row contract-instance-address px-4 py-2 font-weight-bold text-pure-white">
                        <span className="badge">Deployed contract address: </span>
                        <div className="py-1">
                          <select className="custom-select" id="callContractAddr" onChange={e => this.changeAddress(e)}>
                            {address.map((addr, i) => (
                              <option key={i} value={addr}>
                                {addr}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div id="lookLikeBot" className="hide">
                          <span>This contract looks like a chatbot</span>
                          <button
                            className="btn btn-outline-warning py-0 px-3 ml-3"
                            type="button"
                            onClick={() => this.chatWithBot()}
                          >
                            Start chat
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p style={{ flex: 1, padding: '8px' }}>
                        <span className="badge badge-danger">No contract deployed.</span>
                      </p>
                    )}
                    <ul className="list-group list-group-flush bg-dark">{makeMethodCallContract()}</ul>
                  </div>
                </div>
              </div>
            </div>
            {address.length > 0 && (
              <div className="rightPanelfill">
                <div style={{ height: 'calc(100% - 40px)' }}>
                  <span id="callCtResult">Result</span>
                  <section id="result">
                    <div className="funcName">
                      <b id="funcName" />
                    </div>
                    <div className="callCtRes">
                      <pre>
                        <code id="resultJson" />
                      </pre>
                    </div>
                  </section>
                </div>
              </div>
            )}
          </Split>
          {isCallParam && (
            <CallContractDialog
              isOpen={isCallParam}
              isWasmFuncs={isWasmFuncs}
              funcInfo={funcInfo}
              address={addr}
              onCancel={() => {
                this.setState({ isCallParam: false, isWasmFuncs: false });
              }}
            />
          )}
        </div>
      </div>
    );
  }
}
