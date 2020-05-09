import * as gulp from 'gulp';
import { Service, project, activeTab, params, options } from '@wasm/studio-utils';
import { transpile } from '@iceteachain/sunseed';
import { IceteaWeb3 } from '@iceteachain/web3';
import * as base64ArrayBuffer from 'base64-arraybuffer';

const buildJs = async (file: string) => {
  const inFile = project.getFile('src/' + file + '.djs');
  if (!inFile) {
    throw new Error("Please select a contract file in 'src' folder.");
  }
  const compiledSrc = await transpile(inFile.getData(), {
    prettier: true,
    project,
    context: 'src',
  });

  const outFileName = 'out/' + file + '.js';
  const outFile = project.newFile(outFileName, 'javascript', true);
  outFile.setData(compiledSrc);
  logLn('Output file: ' + outFileName);
  return outFile;
};

const deployJs = async (file: string) => {
  const tweb3 = new IceteaWeb3('https://rpc.icetea.io');

  // Create a new account to deploy
  // To use existing account, use tweb3.wallet.importAccount(privateKey)
  tweb3.wallet.createAccount();

  const inFileName = 'out/' + file + '.js';
  logLn('File to deploy: ' + inFileName);

  const inFile = project.getFile(inFileName);
  if (!inFile) {
    throw new Error('You need to build the project first.');
  }
  const deployResult = await tweb3.deploy({ data: inFile.getData(), arguments: params }, options);

  logLn('TxHash: https://scan.icetea.io/tx/' + deployResult.hash);

  return deployResult;
};

const buildWasm = async (file: string) => {
  // opt_level: "s": optimize for small build
  const options = { lto: true, opt_level: 's', debug: true };
  const inFile = project.getFile('src/' + file + '.rs');
  const compileResult = await Service.compileFileWithBindings(inFile, 'rust', 'wasm', options);
  const outFileName = 'out/' + file + '.wasm';
  const outFile = project.newFile(outFileName, 'wasm', true);
  outFile.setData(compileResult.wasm);
  logLn('Output file: ' + outFileName);
  return outFile;
};

const deployWasm = async (file: string) => {
  const tweb3 = new IceteaWeb3('https://rpc.icetea.io');

  // Create a new account to deploy
  // To use existing account, use tweb3.wallet.importAccount(privateKey)
  tweb3.wallet.createAccount();

  const inFileName = 'out/' + file + '.wasm';
  logLn('File to deploy: ' + inFileName);

  const inFile = project.getFile(inFileName);
  if (!inFile) {
    throw new Error('You need to build the project first.');
  }
  const deployResult = await tweb3.deploy({ mode: 'wasm', data: base64ArrayBuffer.encode(inFile.getData()), arguments: params }, options);

  logLn('TxHash: https://scan.icetea.io/tx/' + deployResult.hash);

  return deployResult;
};

const fileBuild = activeTab.split('.')[0];
const fileEx = activeTab.split('.')[1];

gulp.task('build', () => {
  if (fileEx === 'djs') {
    return buildJs(fileBuild);
  } else if (fileEx === 'rs') {
    return buildWasm(fileBuild);
  } else {
    throw new Error('Please select contract file.');
  }
});

gulp.task('deploy', () => {
  if (fileEx === 'djs') {
    return deployJs(fileBuild);
  } else if (fileEx === 'rs') {
    return deployWasm(fileBuild);
  } else {
    throw new Error('You need to build first.');
  }
});

gulp.task('default', ['build'], async () => {});
