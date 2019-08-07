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
import { IceteaWeb3 } from '@iceteachain/web3';
import { MethodInfo, parseParamsFromField, formatResult, tryStringifyJson } from './RightPanel';
const tweb3 = new IceteaWeb3('https://rpc.icetea.io');
import Vue from 'vue';
import BotUI from 'botui';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'bot-ui': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      // 'my-botui-app': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

// const initWeb3 = (privateKey, showAlert = true) => {
//   try {
//     tweb3.wallet.importAccount(privateKey);
//     return true;
//   } catch (error) {
//     console.error(error);
//     const err = 'Please go to Wallet tab to create or import one first.';
//     byId('address').textContent = err;
//     showAlert && window.alert(err);
//     return false;
//   }
// };
// let web3Inited;

const queue = [];
let botui = null;

let handleInterval = null;

const say = (text, options) => {
  botui.message.add(Object.assign({ content: String(text) }, options || {}));
};

/**
 * generate buttons
 * @param {string} action array of button title
 */
const sayButton = action => {
  if (!Array.isArray(action)) {
    action = [action];
  }
  return botui.action.button({ action });
};

const saySelect = action => {
  return botui.action.select({ action });
};

const speak = items => {
  if (!items) return;
  if (!Array.isArray(items)) {
    items = [items];
  }
  if (!items.length) return;

  return items.reduce((prev, item) => {
    if (typeof item === 'string') {
      return say(item, '');
    }

    item.type = item.type || 'text';
    switch (item.type) {
      case 'text':
      case 'html': {
        return botui.message.add(item);
      }
      case 'input':
        return botui.action.text({
          action: item.content,
        });
      case 'button':
        return sayButton(item.content);
      case 'select':
        return saySelect(item.content);
    }
  }, undefined);
};

/**
 * get element by id
 * @param {string} id element id
 */
function byId(id) {
  return document.getElementById(id);
}

function fmtMicroTea(n) {
  const tea = n / Math.pow(10, 6);
  return tea.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 9,
  });
}

function confirmTransfer(amount) {
  say(`ATTENTION: you are about to transfer <b>${fmtMicroTea(amount)}</b> TEA to this bot.`, {
    type: 'html',
    cssClass: 'bot-confirm',
  });
  return sayButton([{ text: "Let's transfer", value: 'transfer' }, { text: 'No way', value: 'no' }]).then(
    result => !!result && result.value === 'transfer'
  );
}

function callContract(method, type, value, from, ...params) {
  if (value) {
    type = 'write';
  }
  const map = {
    none: 'callPure',
    read: 'call',
    write: 'sendCommit',
  };
  return method(...params)
    [map[type]]({ value, from })
    .then(r => (type === 'write' ? r.returnValue : r));
}

function pushToQueue(type, content, stateAccess, transferValue, sendback) {
  if (content.value.indexOf(':') > 0) {
    const parts = content.value.split(':', 2);
    type = parts[0];
    content.value = parts[1];
  }
  queue.push({
    type,
    content,
    transferValue,
    sendback,
    stateAccess,
  });
}

function setCommands(commands, defStateAccess) {
  const t = byId('bot-menu-items');
  t.innerHTML = '';
  commands.forEach(c => {
    const a = document.createElement('A');
    // a.href = '#';
    a.setAttribute('data-value', c.value);
    a.textContent = c.text || c.value;
    t.appendChild(a);
    a.onclick = () => {
      closeNav();
      // botui.action.hide()
      say(c.text || c.value, { human: true });
      // console.log('Check', `${c.text} Xem ${c.value}`);
      pushToQueue('command', c, c.stateAccess || defStateAccess, '', '');
    };
  });
}

function handleQueue(contract, defStateAccess) {
  if (queue.length) {
    const item = queue.shift();
    callContract(
      contract.methods[`on${item.type}`],
      item.stateAccess,
      item.transferValue || 0,
      tweb3.wallet.defaultAccount,
      item.content.value,
      { sendback: item.sendback }
    )
      .then(contractResult => {
        // console.log(contractResult);
        return speak(contractResult.messages || contractResult).then(speakResult => {
          if (typeof speakResult === 'object') {
            speakResult.sendback = contractResult.sendback;
            speakResult.stateAccess = (contractResult.options || {}).nextStateAccess;
          }
          if (contractResult.options && contractResult.options.value) {
            return confirmTransfer(contractResult.options.value).then(ok => {
              if (!ok) {
                say('Transfer canceled. You could reconnect to this bot to start a new conversation.', '');
                return sayButton({ text: 'Restart', value: 'command:start' });
              }

              speakResult.transferValue = contractResult.options.value;
              return speakResult;
            });
          }
          return speakResult;
        });
      })
      .then(r => {
        if (r && r.value) {
          pushToQueue('text', r, r.stateAccess || defStateAccess, r.transferValue, r.sendback);
        }
      })
      .catch(err => {
        console.error(err);
        say(`An error has occured: ${err}`, { type: 'html', cssClass: 'bot-error' });
      });
  }
}

function closeNav() {
  byId('side-bar_right').style.width = '0px';
  byId('content-rsideba').style.display = 'none';
  byId('btnClose').style.display = 'none';
}

/**
 * connect to bot smart contract
 * @param {string} botAddr bot smart contract address
 */
export async function connectBot(botAddr, privateKey) {
  botui = new BotUI('my-botui-app', {
    vue: Vue,
  });
  // if (!web3Inited) {
  //   web3Inited = initWeb3(privateKey);
  // }
  // if (!web3Inited) return;

  const contract = tweb3.contract(botAddr);

  // get bot info
  const botInfo = await await tweb3
    .contract(botAddr)
    .methods.botInfo()
    .callPure();
  const commands = botInfo.commands || [
    {
      text: 'Start',
      value: 'start',
      stateAccess: 'none',
    },
  ];

  if (!botInfo.stateAccess) {
    const meta = await tweb3.getMetadata(botAddr);
    if (meta && meta.oncommand && meta.oncommand.decorators && meta.oncommand.decorators.length > 0) {
      const deco = meta.oncommand.decorators[0];
      if (deco === 'transaction' || deco === 'payable') {
        botInfo.stateAccess = 'write';
      } else if (deco === 'pure') {
        botInfo.stateAccess = 'none';
      } else {
        botInfo.stateAccess = 'read';
      }
    } else {
      botInfo.stateAccess = 'read';
    }
  } else if (!['read', 'write', 'none'].includes(botInfo.stateAccess)) {
    botInfo.stateAccess = 'read';
  }

  !botInfo.name && (botInfo.name = botAddr.split('.', 2)[1]);
  !botInfo.description && (botInfo.description = 'No description.');

  botui.message.removeAll();

  setCommands(commands, botInfo.stateAccess);

  // display bot info
  await say(`<b>${botInfo.name}</b><br>${botInfo.description}`, { type: 'html', cssClass: 'bot-intro' });
  sayButton({ text: botInfo.startButtonText || 'Start', value: 'start' }).then(r => {
    pushToQueue('command', r, botInfo.stateAccess, '', '');
  });

  // console.log('Connect to Contract', contract);

  handleInterval = setInterval(() => {
    handleQueue(contract, botInfo.stateAccess);
  }, 100);
}

export function disConnectBot() {
  clearInterval(handleInterval);
}

export default class CallChatBot extends React.Component<
  {
    isOpen: boolean;
    botAddress: String;
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

  componentDidMount() {
    connectBot(this.props.botAddress, '');
  }

  componentWillUnmount() {
    disConnectBot();
  }

  cancel = () => {
    this.props.onCancel();
  };

  render() {
    const { botAddress, isOpen } = this.props;
    return (
      <ReactModal
        isOpen={isOpen}
        contentLabel="Call Contract"
        className="modal modal-rightpanel "
        overlayClassName="overlay overlayCallContract"
        ariaHideApp={false}
      >
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <header className="modal-title-bar">Chat with bot</header>
          <div className="modal-body">
            <p>
              <label>Your address: {botAddress}</label>
            </p>
            <div id="my-botui-app">
              <bot-ui />
            </div>
          </div>
          <footer className="modal-footer-bar">
            <Button customClassName="saveBtn" icon={<GoX />} label="Cancel" title="Cancel" onClick={this.cancel} />
          </footer>
        </div>
      </ReactModal>
    );
  }
}
