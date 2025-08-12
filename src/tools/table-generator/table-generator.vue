<template>
  <div>
    <div class="controls">
      <div>
        <label>Columns: <input type="number" v-model.number="cols" min="1"></label>
        <label>Rows: <input type="number" v-model.number="rows" min="1"></label>
        <c-button @click="generateTable">Generate</c-button>
      </div>
      <div>
        <c-button @click="addRow">Add Row</c-button>
        <c-button @click="addCol">Add Col</c-button>
        <c-button @click="removeRow">Remove Row</c-button>
        <c-button @click="removeCol">Remove Col</c-button>
        <c-button @click="mergeCells" :disabled="!selectedCells.length">Merge Cells</c-button>
      </div>
      <div>
        <label>
          <input type="checkbox" v-model="bsEnter"> Compact Formatting
        </label>
        <label>
          <input type="checkbox" v-model="clearTh"> Hide Header
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
            <div contenteditable="true" @blur="exportHTML">&nbsp;</div>
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
              @mousemove="dragSelection($event, 'td', cellIndex, rowIndex)">
            <div contenteditable="true" @blur="exportHTML">&nbsp;</div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <div class="export-area">
      <textarea id="export" v-model="exportedHTML" readonly></textarea>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

let cols = ref(5)
let rows = ref(5)
let columns = ref([])
let tableData = ref([])
let isMouseDown = ref(false)
let isDragging = ref(false)
let startCell = ref(null)
let selectedCells = ref([])
let bsEnter = ref(false)
let clearTh = ref(false)
let exportedHTML = ref('')

onMounted(() => {
  generateTable();
})

function generateTable() {
  columns.value = Array.from({ length: cols.value }, (_, i) => i);

  tableData.value = Array.from({ length: rows.value }, (_, rowIndex) => ({
    cells: Array.from({ length: cols.value }, (_, colIndex) => ({
      colspan: 1,
      rowspan: 1,
      classes: [`c${colIndex}`, `r${rowIndex}`]
    }))
  }));

  exportHTML();
}

function addRow() {
  rows.value++;
  tableData.value.push({
    cells: Array.from({ length: cols.value }, (_, colIndex) => ({
      colspan: 1,
      rowspan: 1,
      classes: [`c${colIndex}`, `r${rows.value-1}`]
    }))
  });
  exportHTML();
}

function addCol() {
  cols.value++;
  columns.value.push(cols.value-1);

  tableData.value.forEach((row, rowIndex) => {
    row.cells.push({
      colspan: 1,
      rowspan: 1,
      classes: [`c${cols.value-1}`, `r${rowIndex}`]
    });
  });
  exportHTML();
}

function removeRow() {
  if (rows.value <= 1) return;

  // Adjust rowspans for cells that span into the last row
  tableData.value[rows.value-2].cells.forEach(cell => {
    if (cell.rowspan > 1 && (cell.rowspan + rows.value-2) >= rows.value) {
      cell.rowspan--;
    }
  });

  rows.value--;
  tableData.value.pop();
  exportHTML();
}

function removeCol() {
  if (cols.value <= 1) return;

  // Adjust colspans for cells that span into the last column
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

  // Remove last cell from each row
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
    selected.classes.some(cls => cell.classes.includes(cls))
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

function selectCells(startCell, endCell) {
  const startCols = getCellCols(startCell);
  const startRows = getCellRows(startCell);
  const endCols = getCellCols(endCell);
  const endRows = getCellRows(endCell);

  // Find min/max cols.value and rows
  const minCol = Math.min(...startCols, ...endCols);
  const maxCol = Math.max(...startCols, ...endCols);
  const minRow = Math.min(...startRows, ...endRows);
  const maxRow = Math.max(...startRows, ...endRows);

  // Select all cells in the rectangle
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

  // Calculate colspan and rowspan
  const minCol = Math.min(...selectedCells.value.flatMap(cell => getCellCols(cell)));
  const maxCol = Math.max(...selectedCells.value.flatMap(cell => getCellCols(cell)));
  const minRow = Math.min(...getCellRows(selectedCells.value[0]));
  const maxRow = Math.max(...getCellRows(selectedCells.value[0]));

  const colspan = maxCol - minCol + 1;
  const rowspan = maxRow - minRow + 1;

  // Get all unique classes from selected cells
  const allClasses = [...new Set(selectedCells.value.flatMap(cell => cell.classes))];

  // Find the first cell in the selection (top-left)
  const firstCell = selectedCells.value[0];

  // Create merged cell
  firstCell.colspan = colspan;
  firstCell.rowspan = rowspan;
  firstCell.classes = allClasses.filter(cls => !cls.startsWith('s'));

  // Remove other selected cells
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
  const enter = bsEnter.value ? "" : "\n";
  const bs = bsEnter.value ? "" : "    ";

  let theadHTML = "";
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
  let html = "";
  html += `${enter}${bs}${bs}<tr>${enter}${bs}`;

  for (let i = 0; i < columns.value.length; i++) {
    const cellContent = "&nbsp;"; // You might want to get actual content here
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
  let html = "";

  for (let rowIndex = 0; rowIndex < tableData.value.length; rowIndex++) {
    const row = tableData.value[rowIndex];
    html += `${enter}${bs}${bs}<tr>${enter}${bs}`;

    for (let cellIndex = 0; cellIndex < row.cells.length; cellIndex++) {
      const cell = row.cells[cellIndex];
      const cellContent = "&nbsp;"; // You might want to get actual content here

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
.controls {
  margin-bottom: 20px;
}
.table-wrap {
  margin-bottom: 20px;
}
#export {
  width: 100%;
  height: 200px;
}
.s {
  background-color: #d4edff;
}
table {
  width: 100%;
}
table, td ,th{
  border: solid 1px black;
}
table>thead>tr>th{
  font-weight: bolder;
  background: #dedede;
}

table {
  border-collapse: collapse;
  border-spacing: 0;
}

td, th{
  padding: 8px;
}

.s {
  background: #d0eaf9;
}

#rows, #cols {
  width: 20px;
}

td div,th div {
  outline: none;
}

#tableWrap {
  padding: 10px;
}

input[type="button"] {
  width: 110px;
}
i.annotation{
  color: gray;
  font-size: 10px;
}
</style>
