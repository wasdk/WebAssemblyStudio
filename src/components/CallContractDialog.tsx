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
import * as ReactModal from 'react-modal';
import QueueAnim from 'rc-queue-anim';
import { Button } from './shared/Button';
import { GoX, GoCheck } from './shared/Icons';
import { IceteaWeb3 } from '@iceteachain/web3';
import { MethodInfo, parseParamsFromField, formatResult, tryStringifyJson } from './RightPanel';
const tweb3 = new IceteaWeb3('https://rpc.icetea.io');

export default class CallContractDialog extends React.Component<
  {
    isOpen: boolean;
    isWasmFuncs: boolean;
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
      funcs: {},
    };
  }

  cancel = () => {
    this.props.onCancel();
  };

  exContractMethod = async () => {
    const { funcInfo, address } = this.props;
    if (funcInfo) {
      let result;
      const decotator = funcInfo.decorators[0];
      try {
        const params = (funcInfo && funcInfo.params) || [];
        const paramsValue = Object.keys(params).map(key => {
          const params = parseParamsFromField('#param' + key);
          // console.log('Get params', params)
          return params[0];
        });
        const name = funcInfo.name;

        document.getElementById('funcName').innerHTML = name;
        document.getElementById('resultJson').innerHTML = "<span class='Error'>sending...</span>";
        if (decotator === 'transaction') {
          const ct = tweb3.contract(address);
          result = await ct.methods[name](...paramsValue).sendCommit();

          // console.log(result);
          document.getElementById('resultJson').innerHTML = formatResult(result, false);
        } else if (decotator === 'pure') {
          const method = 'callPureContractMethod';
          result = await tweb3[method](address, name, paramsValue);
          // console.log(result);
          document.getElementById('resultJson').innerHTML = tryStringifyJson(result);
        } else if (decotator === 'view') {
          const method = 'callReadonlyContractMethod';
          result = await tweb3[method](address, name, paramsValue);
          // console.log(result);
          document.getElementById('resultJson').innerHTML = tryStringifyJson(result);
        }
      } catch (error) {
        // console.log(error);
        if (decotator === 'transaction') {
          document.getElementById('resultJson').innerHTML = formatResult(error, true);
        } else if (decotator === 'pure' || decotator === 'view') {
          document.getElementById('resultJson').innerHTML = tryStringifyJson(error);
        }
      }
    }

    this.props.onCancel();
  };

  callSendMethod = async () => {
    const { funcInfo, address } = this.props;
    try {
      const name = funcInfo.name;
      document.getElementById('funcName').innerHTML = name;
      const params = parseParamsFromField('#params');
      document.getElementById('resultJson').innerHTML = "<span class='Error'>sending...</span>";
      const ct = tweb3.contract(address);
      const result = await ct.methods[name](...params).sendCommit();
      document.getElementById('resultJson').innerHTML = formatResult(result, false);
    } catch (error) {
      // console.log(error);
      document.getElementById('resultJson').innerHTML = formatResult(error, true);
    }
    this.props.onCancel();
  };

  callViewMethod = async () => {
    const { funcInfo, address } = this.props;
    try {
      const name = funcInfo.name;
      document.getElementById('funcName').innerHTML = name;
      const params = parseParamsFromField('#params');
      document.getElementById('resultJson').innerHTML = "<span class='Error'>sending...</span>";
      const method = 'callReadonlyContractMethod';
      const result = await tweb3[method](address, name, params);
      document.getElementById('resultJson').innerHTML = tryStringifyJson(result);
    } catch (error) {
      // console.log(error);
      document.getElementById('resultJson').innerHTML = tryStringifyJson(error);
    }
    this.props.onCancel();
  };

  callPureMethod = async () => {
    const { funcInfo, address } = this.props;
    try {
      const name = funcInfo.name;
      document.getElementById('funcName').innerHTML = name;
      const params = parseParamsFromField('#params');
      document.getElementById('resultJson').innerHTML = "<span class='Error'>sending...</span>";
      const method = 'callPureContractMethod';
      const result = await tweb3[method](address, name, params);
      document.getElementById('resultJson').innerHTML = tryStringifyJson(result);
    } catch (error) {
      // console.log(error);
      document.getElementById('resultJson').innerHTML = tryStringifyJson(error);
    }
    this.props.onCancel();
  };

  render() {
    const { funcInfo, isOpen, isWasmFuncs } = this.props;
    // console.log('funcInfo', this.props);
    const params = (funcInfo && funcInfo.params) || [];
    const paramsDes = Object.keys(params).map(key => {
      return (
        <li className="list-group-item item-contract-method">
          <div className="row">
            <div className="py-1 col">
              <span className="input-name">{params[key].name}</span>:
              <span className="px-1 input-type">{params[key].type}</span>
            </div>
            <div className="py-1 col">
              {params[key].type === 'any' ? (
                <textarea
                  placeholder={params[key].type}
                  className="input-value input-value-textarea"
                  id={'param' + [key]}
                />
              ) : (
                <input placeholder={params[key].type} className="input-value" id={'param' + [key]} />
              )}
            </div>
          </div>
        </li>
      );
    });

    return (
      <ReactModal
        isOpen={isOpen}
        contentLabel="Call Contract"
        className="modal modal-rightpanel "
        overlayClassName="overlay overlayCallContract"
        ariaHideApp={false}
      >
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <header className="modal-title-bar">Call function :{funcInfo && funcInfo.name}</header>
          <div className="modal-body">
            {isWasmFuncs ? (
              <div>
                <p>
                  <label>Params (each param 1 row, JSON accepted, use " to denote string)</label>
                </p>
                <p>
                  <textarea id="params" className="input-value input-value-textarea" rows={7} />
                </p>
              </div>
            ) : (
              <ul className="list-group list-group-flush">{paramsDes}</ul>
            )}
          </div>
          <div style={{ flex: 1, padding: '8px' }} />
          <footer className="modal-footer-bar">
            <Button customClassName="saveBtn" icon={<GoX />} label="Cancel" title="Cancel" onClick={this.cancel} />
            {isWasmFuncs ? (
              <React.Fragment>
                <Button
                  customClassName="saveBtn"
                  icon={<GoCheck />}
                  label="Send(Write)"
                  title="Send(Write)"
                  onClick={this.callSendMethod}
                />
                <Button
                  customClassName="saveBtn"
                  icon={<GoCheck />}
                  label="Call(View)"
                  title="call(View)"
                  onClick={this.callViewMethod}
                />
                <Button
                  customClassName="saveBtn"
                  icon={<GoCheck />}
                  label="Call(Pure)"
                  title="call(Pure)"
                  onClick={this.callPureMethod}
                />
              </React.Fragment>
            ) : (
              <Button
                customClassName="saveBtn"
                icon={<GoCheck />}
                label="Call"
                title="call"
                onClick={this.exContractMethod}
              />
            )}
          </footer>
        </div>
      </ReactModal>
    );
  }
}
