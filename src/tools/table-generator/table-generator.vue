<template>
  <div>
    <div class="mb-14">
      <div flex gap-2 items-center>
        <label>列: <input type="number" v-model.number="cols" min="1"></label>
        <label>行: <input type="number" v-model.number="rows" min="1"></label>
        <c-button @click="generateTable">Generate</c-button>
      </div>
      <div flex gap-2 items-center>
        <c-button @click="addRow">添加一行</c-button>
        <c-button @click="addCol">添加一列</c-button>
        <c-button @click="removeRow">移除一行</c-button>
        <c-button @click="removeCol">移除一列</c-button>
        <c-button @click="mergeCells" :disabled="!selectedCells.length">合并单元格</c-button>
        <label>
          <input type="checkbox" v-model="clearTh"> 隐藏头
        </label>
      </div>
    </div>

    <div class="table-wrap" ref="tableWrap" @mousedown="clearSelection">
      <table>
        <thead :style="{ display: clearTh ? 'none' : '' }">
        <tr>
          <th v-for="(col, colIndex) in columns" :key="'th-'+colIndex"
              :class="'c'+colIndex"
              @mousedown="startSelection($event, 'th', colIndex, 0)"
              @mousemove="dragSelection($event, 'th', colIndex, 0)">
            <div contenteditable="true" @blur="exportHTML">{{ 'h' + colIndex }}</div>
            <div class="resizer" v-if="colIndex !== 0"></div>
          </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(row, rowIndex) in tableData" :key="'row-'+rowIndex">
          <td v-for="(cell, cellIndex) in row.cells" :key="'cell-'+rowIndex+'-'+cellIndex"
              :class="getCellClasses(cell)"
              :colspan="cell.colspan"
              :rowspan="cell.rowspan"
              @mousedown="startSelection($event, 'td', cellIndex, rowIndex)"
              @mousemove="dragSelection($event, 'td', cellIndex, rowIndex)"
              @mouseup="isMouseDown = false">
            <div contenteditable="true" @blur="exportHTML">{{ rowIndex }}{{ cellIndex }}</div>
            <div class="resizer" v-if="cellIndex !== 0"
                 @mousedown="startRowResize($event, 'td', cellIndex, rowIndex)"
                 @mousemove="startRowDrag($event, 'td', cellIndex, rowIndex)"></div>
          </td>
        </tr>
        </tbody>
      </table>
      <div class="toolbar toolbar_v">
        <div class="toolbar__content">
          <div class="toolbar__insertion-button" style="top: -12.5px;"><span>●</span>
            <div class="toolbar__plus-btn">+</div>
          </div>
        </div>
      </div>
      <div class="toolbar toolbar_h">
        <div class="toolbar__content">
          <div class="toolbar__insertion-button" style="left: -12.5px;"><span>●</span>
            <div class="toolbar__plus-btn">+</div>
          </div>
        </div>
      </div>
    </div>

    <div class="export-area">
      <textarea-copyable id="export" :value="exportedHTML"></textarea-copyable>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

let cols = ref(5);
let rows = ref(5);
let columns = ref([]);
let tableData = ref([]);
let isMouseDown = ref(false);
let isDragging = ref(false);
let startCell = ref(null);
let selectedCells = ref([]);
let clearTh = ref(false);
let exportedHTML = ref('');

onMounted(() => {
  generateTable();
});

function generateTable() {
  columns.value = Array.from({ length: cols.value }, (_, i) => i);

  tableData.value = Array.from({ length: rows.value }, (_, rowIndex) => ({
    cells: Array.from({ length: cols.value }, (_, colIndex) => ({
      colspan: 1,
      rowspan: 1,
      classes: [`c${colIndex}`, `r${rowIndex}`],
    })),
  }));

  exportHTML();
}

function addRow() {
  rows.value++;
  tableData.value.push({
    cells: Array.from({ length: cols.value }, (_, colIndex) => ({
      colspan: 1,
      rowspan: 1,
      classes: [`c${colIndex}`, `r${rows.value - 1}`],
    })),
  });
  exportHTML();
}

function addCol() {
  cols.value++;
  columns.value.push(cols.value - 1);

  tableData.value.forEach((row, rowIndex) => {
    row.cells.push({
      colspan: 1,
      rowspan: 1,
      classes: [`c${cols.value - 1}`, `r${rowIndex}`],
    });
  });
  exportHTML();
}

function removeRow() {
  if (rows.value <= 1) return;

  tableData.value[rows.value - 2].cells.forEach(cell => {
    if (cell.rowspan > 1 && (cell.rowspan + rows.value - 2) >= rows.value) {
      cell.rowspan--;
    }
  });

  rows.value--;
  tableData.value.pop();
  exportHTML();
}

function removeCol() {
  if (cols.value <= 1) return;

  tableData.value.forEach(row => {
    row.cells.forEach(cell => {
      const cellCol = parseInt(cell.classes.find(c => c.startsWith('c')).substring(1));
      if (cell.colspan > 1 && (cellCol + cell.colspan) >= cols.value) {
        cell.colspan--;
      }
    });
  });

  cols.value--;
  columns.value.pop();

  tableData.value.forEach(row => {
    row.cells.pop();
  });

  exportHTML();
}

function getCellClasses(cell) {
  return [...cell.classes, ...(isCellSelected(cell) ? ['s'] : [])].join(' ');
}

function isCellSelected(cell) {
  return selectedCells.value.some(selected =>
    selected.classes.every(cls => cell.classes.includes(cls)),
  );
}

function startSelection(event, cellType, colIndex, rowIndex) {
  if (event.button !== 0) return; // Only left mouse button

  removeSelection();
  isMouseDown.value = true;
  isDragging.value = false;

  if (cellType === 'td') {
    startCell.value = tableData.value[rowIndex].cells[colIndex];
  }
}

function dragSelection(event, cellType, colIndex, rowIndex) {
  if (!isMouseDown.value || cellType !== 'td') return;

  isDragging.value = true;
  removeSelection();

  const endCell = tableData.value[rowIndex].cells[colIndex];
  selectCells(startCell.value, endCell);
}

function startRowResize(event, cellType, colIndex, rowIndex) {
  if (event.button !== 0) return;

}

function startRowDrag(event, cellType, colIndex, rowIndex) {
  if (event.button !== 0) return;

}

function selectCells(startCell, endCell) {
  const startCols = getCellCols(startCell);
  const startRows = getCellRows(startCell);
  const endCols = getCellCols(endCell);
  const endRows = getCellRows(endCell);

  const minCol = Math.min(...startCols, ...endCols);
  const maxCol = Math.max(...startCols, ...endCols);
  const minRow = Math.min(...startRows, ...endRows);
  const maxRow = Math.max(...startRows, ...endRows);

  selectedCells.value = [];
  for (let row = minRow; row <= maxRow; row++) {
    for (let col = minCol; col <= maxCol; col++) {
      const cell = findCellByPosition(col, row);
      if (cell) {
        selectedCells.value.push(cell);
      }
    }
  }
}

function findCellByPosition(col, row) {
  for (const rowData of tableData.value) {
    for (const cell of rowData.cells) {
      const cellCols = getCellCols(cell);
      const cellRows = getCellRows(cell);

      if (cellCols.includes(col) && cellRows.includes(row)) {
        return cell;
      }
    }
  }
  return null;
}

function getCellCols(cell) {
  return cell.classes
    .filter(cls => cls.startsWith('c'))
    .map(cls => parseInt(cls.substring(1)));
}

function getCellRows(cell) {
  return cell.classes
    .filter(cls => cls.startsWith('r'))
    .map(cls => parseInt(cls.substring(1)));
}

function clearSelection(event) {
  if (event.button !== 0) return;
  removeSelection();
}

function removeSelection() {
  selectedCells.value = [];
}

function mergeCells() {
  if (selectedCells.value.length < 2) return;

  const minCol = Math.min(...selectedCells.value.flatMap(cell => getCellCols(cell)));
  const maxCol = Math.max(...selectedCells.value.flatMap(cell => getCellCols(cell)));
  const minRow = Math.min(...getCellRows(selectedCells.value[0]));
  const maxRow = Math.max(...getCellRows(selectedCells.value[0]));

  const colspan = maxCol - minCol + 1;
  const rowspan = maxRow - minRow + 1;

  const allClasses = [...new Set(selectedCells.value.flatMap(cell => cell.classes))];

  const firstCell = selectedCells.value[0];

  firstCell.colspan = colspan;
  firstCell.rowspan = rowspan;
  firstCell.classes = allClasses.filter(cls => !cls.startsWith('s'));

  const cellsToRemove = selectedCells.value.slice(1);
  for (const cell of cellsToRemove) {
    const rowIndex = getCellRows(cell)[0];
    const cellIndex = tableData.value[rowIndex].cells.indexOf(cell);
    if (cellIndex > -1) {
      tableData.value[rowIndex].cells.splice(cellIndex, 1);
    }
  }

  selectedCells.value = [];
  exportHTML();
}

function exportHTML() {
  const enter = '\n';
  const bs = '    ';

  let theadHTML = '';
  if (!clearTh.value) {
    theadHTML = generateHeaderHTML(enter, bs);
  }

  const tbodyHTML = generateBodyHTML(enter, bs);

  if (clearTh.value) {
    exportedHTML.value = `<table>${tbodyHTML}${enter}</table>`;
  } else {
    exportedHTML.value = `<table>${enter}${bs}<thead>${theadHTML}${enter}${bs}</thead>${enter}${bs}<tbody>${tbodyHTML}${enter}${bs}</tbody>${enter}</table>`;
  }
}

function generateHeaderHTML(enter, bs) {
  let html = '';
  html += `${enter}${bs}${bs}<tr>${enter}${bs}`;

  for (let i = 0; i < columns.value.length; i++) {
    const cellContent = '';
    if (i > 0) {
      html += `${enter}${bs}<th>${cellContent}</th>`;
    } else {
      html += `${bs}${bs}<th>${cellContent}</th>`;
    }
  }

  html += `${enter}${bs}${bs}</tr>`;
  return html;
}

function generateBodyHTML(enter, bs) {
  let html = '';

  for (let rowIndex = 0; rowIndex < tableData.value.length; rowIndex++) {
    const row = tableData.value[rowIndex];
    html += `${enter}${bs}${bs}<tr>${enter}${bs}`;

    for (let cellIndex = 0; cellIndex < row.cells.length; cellIndex++) {
      const cell = row.cells[cellIndex];
      const cellContent = '';

      if (cellIndex > 0) {
        html += `${enter}${bs}<td`;
      } else {
        html += `${bs}${bs}<td`;
      }

      if (cell.colspan > 1) {
        html += ` colspan="${cell.colspan}"`;
      }

      if (cell.rowspan > 1) {
        html += ` rowspan="${cell.rowspan}"`;
      }

      html += `>${cellContent}</td>`;
    }

    html += `${enter}${bs}${bs}</tr>`;
  }

  return html;
}

</script>

<style scoped lang="less">
#export {
  width: 100%;
  height: 200px;
  overflow-x: hidden;
}

table, td, th {
  border: solid 1px black;
}

table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  table-layout: fixed;
  th {
    font-weight: bolder;
    background: #dedede;
  }
  td, th {
    padding: 8px;
  }
  td div, th div {
    outline: none;
  }
  .s {
    background-color: #d4edff;
  }
}

.table-wrap {
  position: relative;

  .toolbar {
    position: absolute;
    top: 0;
  }
  .toolbar_h {
    top: -30px;
    width: 100%;
    height: 30px;
  }
  .toolbar_v {
    left: -30px;
    width: 30px;
    height: 100%;
  }
  .toolbar__insertion-button {
    position: absolute;
    top: 0;
    cursor: pointer;
    span {
      position: absolute;
      text-align: center;
      color: #cfcfcf;
      width: 100%;
      margin-top: -1px;
    }
    .toolbar__plus-btn {
      position: relative;
      background: #91cfff;
      border-radius: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 25px;
      height: 25px;
      opacity: 0;
    }
    &:hover {
      .toolbar__plus-btn {
        opacity: 1;
      }
    }
  }

  .resizer {
    position: absolute;
    bottom: 0;
    overflow: visible;
    width: 5px;
    top: 0;
    cursor: col-resize;
    z-index: 3;
    margin-left: -12px;

    &:after {
      content: "";
      position: absolute;
      width: 2px;
      height: 100%;
      background: #91cfff;
      left: 2px;
      opacity: 0;
    }

    &:hover:after {
      opacity: 1;
    }
  }
}


</style>
