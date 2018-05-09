// Preview of the module generated frames.

import WasmModule from './module.js';

const rows = 30, cols = 40, frameCount = 50, fps = 10;

async function preview() {
  const { transform } = await WasmModule();

  const buffer = new ArrayBuffer(cols * rows * frameCount * 3);
  transform(buffer, rows, cols, frameCount, fps, true);

  const gridContainer = document.querySelector("#lights-grid");
  const grid = createGrid(gridContainer, rows, cols);

  const generator = showFrame(grid, buffer, rows, cols, frameCount);
  return setInterval(generator.next.bind(generator), 1000 / fps);
}

function createGrid(container, rowCount, colCount) {
  const rows = [];

  for (let y = 0; y < rowCount; y++) {
    const row = rows[y] = [];
    for (let x = 0; x < colCount; x++) {
      const light = row[x] = document.createElement('div');
      light.classList.add('light');
      container.appendChild(light);
    }
  }

  container.style.gridTemplateColumns = `repeat(${colCount}, min-content)`;

  return rows;
}

function* showFrame(grid, buffer, rows, cols, frameCount) {
  const frameSize = rows * cols * 3;
  let i = -1;
  while (true) {
    i = (i + 1) % frameCount;
    let frame = new Uint8Array(buffer, frameSize * i, frameSize);

    let pos = 0;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const light = grid[y][x];
        const lightR = frame[pos++];
        const lightG = frame[pos++];
        const lightB = frame[pos++];
        light.style.background = `radial-gradient(rgb(${lightR},${lightG},${lightB}), grey 300% )`;
      }
    }

    yield;
  }
}

preview();