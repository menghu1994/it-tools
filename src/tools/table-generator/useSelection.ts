import { type Ref, ref } from 'vue';

export function useSelection(tableData: Ref<any[]>) {
  const isMouseDown = ref<boolean>(false);
  const isDragging = ref<boolean>(false);
  const startCell = ref(null);
  const selectedCells = ref<any[]>([]);

  function getCellCols(cell: any) {
    return cell.classes.filter((c: string) => c.startsWith('c')).map((c: string) => parseInt(c.slice(1)));
  }
  function getCellRows(cell: any) {
    return cell.classes.filter((c: string) => c.startsWith('r')).map((c: string) => parseInt(c.slice(1)));
  }
  function findCellByPosition(col: number, row: number) {
    for (const rowData of tableData.value) {
      for (const cell of rowData.cells) {
        const cols = getCellCols(cell);
        const rows = getCellRows(cell);
        if (cols.includes(col) && rows.includes(row)) return cell;
      }
    }
    return null;
  }

  function startSelection(e: any, cellType: string, colIndex: number, rowIndex: number) {
    if (e.button !== 0) return;
    removeSelection();
    isMouseDown.value = true;
    if (cellType === 'td') {
      startCell.value = tableData.value[rowIndex].cells[colIndex];
    }
  }

  function dragSelection(e: any, cellType: string, colIndex: number, rowIndex: number) {
    if (!isMouseDown.value || cellType !== 'td') return;
    isDragging.value = true;
    removeSelection();
    const endCell = tableData.value[rowIndex].cells[colIndex];
    selectCells(startCell.value, endCell);
  }

  const clearSelection = () => {
    selectedCells.value = [];
    isMouseDown.value = false;
  };

  const getCellClasses = (cell: any) => {
    return [...cell.classes, ...(isCellSelected(cell) ? ['s'] : [])].join(' ');
  };

  function isCellSelected(cell: any) {
    return selectedCells.value.includes(cell);
  }

  function selectCells(startCell: any, endCell: any) {
    const startCols = getCellCols(startCell);
    const startRows = getCellRows(startCell);
    const endCols = getCellCols(endCell);
    const endRows = getCellRows(endCell);

    const minCol = Math.min(...startCols, ...endCols);
    const maxCol = Math.max(...startCols, ...endCols);
    const minRow = Math.min(...startRows, ...endRows);
    const maxRow = Math.max(...startRows, ...endRows);

    selectedCells.value = [];
    for (let r = minRow; r <= maxRow; r++) {
      for (let c = minCol; c <= maxCol; c++) {
        const cell = findCellByPosition(c, r);
        if (cell) selectedCells.value.push(cell);
      }
    }
  }

  function removeSelection() {
    selectedCells.value = [];
  }

  function mergeCells(exportHTML: Function) {
    if (selectedCells.value.length < 2) return;
    const colsArr = selectedCells.value.flatMap(getCellCols);
    const rowsArr = selectedCells.value.flatMap(getCellRows);
    const minCol = Math.min(...colsArr);
    const maxCol = Math.max(...colsArr);
    const minRow = Math.min(...rowsArr);
    const maxRow = Math.max(...rowsArr);

    const firstCell = findCellByPosition(minCol, minRow);
    firstCell.colspan = maxCol - minCol + 1;
    firstCell.rowspan = maxRow - minRow + 1;

    const toRemove = selectedCells.value.filter(c => c !== firstCell);
    toRemove.forEach(c => {
      const r = getCellRows(c)[0];
      const idx = tableData.value[r].cells.indexOf(c);
      if (idx > -1) tableData.value[r].cells.splice(idx, 1);
    });

    selectedCells.value = [];
    exportHTML();
  }

  return {
    isMouseDown,
    isDragging,
    selectedCells,
    startSelection,
    dragSelection,
    removeSelection,
    mergeCells,
    getCellClasses,
    clearSelection
  };
}
