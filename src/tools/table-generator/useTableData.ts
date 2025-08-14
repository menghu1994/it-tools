import { type Ref, ref, watchEffect } from 'vue';

export function useTableData(cols: Ref<number>, rows: Ref<number>) {
  const columns = ref<any[]>([]);
  const tableData = ref<any[]>([]);
  const exportedHTML = ref<string>('');
  const clearTh = ref<boolean>(false);

  watchEffect(() => generateTable())

  function generateTable() {
    columns.value = Array.from({ length: cols.value }, (_, i) => i);
    tableData.value = Array.from({ length: rows.value }, (_, rowIndex) => ({
      cells: Array.from({ length: cols.value }, (_, colIndex) => ({
        colspan: 1,
        rowspan: 1,
        width: 100,
        classes: [`c${colIndex}`, `r${rowIndex}`],
      })),
    }));
    exportHTML();
  }

  function addRow(atIndex = rows.value) {
    rows.value++;
    tableData.value.splice(atIndex, 0, {
      cells: Array.from({ length: cols.value }, (_, colIndex) => ({
        colspan: 1,
        rowspan: 1,
        width: 100,
        classes: [`c${colIndex}`, `r${atIndex}`],
      })),
    });
    exportHTML();
  }

  function addCol(atIndex = cols.value) {
    cols.value++;
    columns.value.splice(atIndex, 0, cols.value - 1);
    tableData.value.forEach((row, rowIndex) => {
      row.cells.splice(atIndex, 0, {
        colspan: 1,
        rowspan: 1,
        width: 100,
        classes: [`c${atIndex}`, `r${rowIndex}`],
      });
    });
    exportHTML();
  }

  function removeRow(atIndex = rows.value - 1) {
    if (rows.value <= 1) return;
    tableData.value.splice(atIndex, 1);
    rows.value--;
    exportHTML();
  }

  function removeCol(atIndex = cols.value - 1) {
    if (cols.value <= 1) return;
    tableData.value.forEach(row => row.cells.splice(atIndex, 1));
    columns.value.splice(atIndex, 1);
    cols.value--;
    exportHTML();
  }

  function exportHTML() {
    let theadHTML = '';
    if (!clearTh.value) {
      theadHTML = `<tr>${columns.value.map(() => `<th></th>`).join('')}</tr>`;
    }
    const tbodyHTML = tableData.value.map(row => {
      return `<tr>${row.cells.map((c: any) => `<td colspan="${c.colspan}" rowspan="${c.rowspan}" style="width:${c.width}px"></td>`).join('')}</tr>`;
    }).join('');
    exportedHTML.value = `<table>${theadHTML}${tbodyHTML}</table>`;
  }

  return {
    columns,
    clearTh,
    tableData,
    exportedHTML,
    generateTable,
    addRow,
    addCol,
    removeRow,
    removeCol,
    exportHTML,
  };
}
