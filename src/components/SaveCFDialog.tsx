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
/*
 * Usage:
 *
 * Wrap any element with this component and you'll get a confirmation
 * dialog popup when the element inside is clicked.
 *
 * <SaveCFDialog onSave={() => Do something }
 *   onSaveAll={() => Do something }
 *   onCancel={() => Do something}
 *   content={(props: any) => <div>Are you sure?</div>}
 *   cancelOnClickOutside={true} >
 * </SaveCFDialog>
 *
 */

import * as React from 'react';
import * as ReactModal from 'react-modal';
import { Button } from './shared/Button';
import { GoX, GoCheck } from './shared/Icons';

interface SaveCFDialogProps<ContentProps> {
  onSave: () => void;
  onSaveAll: () => void;
  onCancel: () => void;
  content: (props: ContentProps) => JSX.Element;
  isOpen?: boolean;
  cancelOnClickOutside?: boolean;
  contentProps?: ContentProps;
  confirmButtonContent?: JSX.Element | string;
  cancelButtonContent?: JSX.Element | string;
}

interface SaveCFDialogState {
  hidden: boolean;
  cancelOnClickOutside: boolean;
}

export class SaveCFDialog<ContentProps> extends React.Component<SaveCFDialogProps<ContentProps>, SaveCFDialogState> {
  constructor(props: SaveCFDialogProps<ContentProps>) {
    super(props);

    this.state = {
      hidden: true,
      cancelOnClickOutside: this.props.cancelOnClickOutside || false,
    };
  }

  componentWillUnmount() {
    window.removeEventListener('mousedown', this.windowMouseDown);
  }

  show = () => {
    this.setState({
      hidden: false,
    } as any);
    this.mouseOver = false;
  };

  hide = () => {
    this.setState({
      hidden: true,
    } as any);
    window.removeEventListener('mousedown', this.windowMouseDown);
    this.mouseOver = false;
  };

  save = () => {
    this.props.onSave();
    this.hide();
  };

  saveAll = () => {
    this.props.onSaveAll();
    this.hide();
  };

  cancel = () => {
    this.props.onCancel();
    this.hide();
  };

  mouseOver = false;
  onMouseEnter = () => {
    this.mouseOver = true;
  };

  onMouseleave = () => {
    this.mouseOver = false;
  };

  windowMouseDown = () => {
    if (this.state.cancelOnClickOutside && !this.state.hidden && !this.mouseOver) {
      this.cancel();
    }
  };

  clicked = () => {
    if (!this.state.hidden) return;
    this.show();
    window.addEventListener('mousedown', this.windowMouseDown);
  };

  render() {
    return (
      <ReactModal
        isOpen={this.props.isOpen}
        contentLabel="Confirm Dialog"
        className="saveModal"
        overlayClassName="overlay"
        ariaHideApp={false}
      >
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div className="modal-title-bar">Confirm Save</div>
          <div style={{ fontSize: '1.2em', fontWeight: 'bold', flex: 1, padding: '20px' }}>
            Do you want to save your changes?
          </div>
          <div style={{ borderTop: 0, marginLeft: '4em' }} className="modal-footer-bar">
            <Button customClassName="saveBtn" icon={<GoX />} label="Cancel" title="Cancel" onClick={this.cancel} />
            <Button
              customClassName="saveBtn"
              icon={<GoCheck />}
              label="Save All"
              title="saveAll"
              onClick={this.saveAll}
            />
            <Button
              customClassName="saveBtn"
              icon={<GoCheck />}
              label="Save"
              title="save"
              onClick={this.save}
            />
          </div>
        </div>
      </ReactModal>
    );
  }
}
