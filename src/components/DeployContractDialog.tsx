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
import { Button } from './shared/Button';
import { GoX, GoCheck } from './shared/Icons';
import { parseParamsFromField } from './RightPanel';
import { IceteaWeb3 } from '@iceteachain/web3';
const tweb3 = new IceteaWeb3('https://rpc.icetea.io');

export class DeployContractDialog extends React.Component<
  {
    isOpen: boolean;
    signer: string[];
    onCancel: () => void;
    onDeploy: (arg0: object) => void;
  },
  {
    showMore: boolean;
    addr: string;
    from: string;
    payer: string;
    value: string;
    fee: string;
    params: [];
  }
> {
  constructor(props: any) {
    super(props);
    this.state = {
      showMore: false,
      addr: this.props.signer[0],
      from: '',
      payer: '',
      value: '',
      fee: '',
      params: [],
    };
  }

  cancel = () => {
    this.props.onCancel();
  };

  deploy = () => {
    let params;
    const element = document.getElementById('cal_preview');
    if (element != null) {
      params = parseParamsFromField('#params');
    } else {
      params = [];
    }
    this.setState(
      {
        showMore: false,
        params: params,
      },
      () => {
        this.props.onDeploy && this.props.onDeploy(this.state);
      }
    );
  };

  showMore = () => {
    this.setState({
      showMore: !this.state.showMore,
    });
  };

  changeAddress(event: React.FormEvent) {
    const address = (event.target as any).value;
    this.setState({
      addr: address,
    });
  }

  changeFrom = e => {
    const value = e.currentTarget.value.trim();
    this.setState({
      from: value,
    });
  };

  changePayer = e => {
    const value = e.currentTarget.value.trim();
    this.setState({
      payer: value,
    });
  };

  changeValue = e => {
    const value = e.currentTarget.value.trim();
    this.setState({
      value: value,
    });
  };

  changeFee = e => {
    const value = e.currentTarget.value.trim();
    this.setState({
      fee: value,
    });
  };

  render() {
    const { isOpen, signer } = this.props;
    const { showMore, addr } = this.state;
    // console.log('State CK', this.state);

    return (
      <ReactModal
        isOpen={isOpen}
        contentLabel="Deploy Contract"
        className="modal modal-rightpanel "
        overlayClassName="overlay overlayCallContract"
        ariaHideApp={false}
      >
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <header className="modal-title-bar">Deploy Contract</header>

          <div className="modal-body">
            <p>
              <span>From Account: </span>
            </p>
            <select className="custom-select" onChange={e => this.changeAddress(e)}>
              {signer.map((signer, i) => (
                <option key={i} value={signer}>
                  {signer}
                </option>
              ))}
            </select>
            <p>
              <div style={{ display: 'flex' }}>
                <span>Advance Options:&nbsp;</span>
                <span className={showMore ? 'arrow-down' : 'arrow-left'} onClick={this.showMore} />
              </div>
            </p>
            {showMore && (
              <div id="collapse_contract" className="collapse show showMore">
                <li className="list-group-item row">
                  <div className="row">
                    <div className="col">
                      <span className="badge badge-light-grey d-inline">From:</span>
                    </div>
                    <div className="col">
                      <div className="row">
                        <input
                          type="text"
                          placeholder="Leave blank if same as signer"
                          className="deployContract"
                          onChange={this.changeFrom}
                        />
                      </div>
                    </div>
                  </div>
                </li>
                <li className="list-group-item row">
                  <div className="row">
                    <div className="col">
                      <span className="badge badge-light-grey d-inline">Payer:</span>
                    </div>
                    <div className="col">
                      <div className="row">
                        <input
                          type="text"
                          placeholder="Leave blank if same as from"
                          className="deployContract"
                          onChange={this.changePayer}
                        />
                      </div>
                    </div>
                  </div>
                </li>
                <li className="list-group-item row">
                  <div className="row">
                    <div className="col">
                      <span className="badge badge-light-grey d-inline">Value:</span>
                    </div>
                    <div className="col">
                      <div className="row">
                        <input
                          type="nunmber"
                          placeholder="Value (TEA)"
                          className="deployContract"
                          step="0.01"
                          onChange={this.changeValue}
                        />
                      </div>
                    </div>
                  </div>
                </li>
                <li className="list-group-item row">
                  <div className="row">
                    <div className="col">
                      <span className="badge badge-light-grey d-inline">Fee:</span>
                    </div>
                    <div className="col">
                      <div className="row">
                        <input
                          type="nunmber"
                          placeholder="Gas limit (MicroTEA)"
                          className="deployContract"
                          step="1"
                          onChange={this.changeFee}
                        />
                      </div>
                    </div>
                  </div>
                </li>
                <li className="list-group-item row">
                  <div className="row">
                    <div className="col">
                      <span className="badge badge-light-grey d-inline">Params:</span>
                    </div>
                  </div>
                  <div>
                    <p>
                      <label>ondeploy params (each param 1 row, JSON accepted, use " to denote string)</label>
                    </p>
                    <p>
                      <textarea id="params" className="input-value input-value-textarea" rows={4} />
                    </p>
                  </div>
                </li>
              </div>
            )}
          </div>
          <div style={{ flex: 1, padding: '8px' }} />
          <footer className="modal-footer-bar">
            <Button customClassName="saveBtn" icon={<GoX />} label="Cancel" title="Cancel" onClick={this.cancel} />
            <Button customClassName="saveBtn" icon={<GoCheck />} label="Deploy" title="Deploy" onClick={this.deploy} />
          </footer>
        </div>
      </ReactModal>
    );
  }
}
