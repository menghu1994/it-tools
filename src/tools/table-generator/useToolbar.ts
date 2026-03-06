import { ref } from 'vue';

export function useToolbar(addRow: Function, addCol: Function, removeRow: Function, removeCol: Function) {
  const toolbarVTop = ref(0);
  const toolbarColIndex = ref(0);
  const toolbarHLeft = ref(0);
  const toolbarRowIndex = ref(0);

  function updateToolbarPosition(e: any, tableRect: any, cols: number, rows: number) {
    const cellWidth = tableRect.width / cols;
    const cellHeight = tableRect.height / rows;

    toolbarColIndex.value = Math.floor((e.clientX - tableRect.left) / cellWidth);
    toolbarRowIndex.value = Math.floor((e.clientY - tableRect.top) / cellHeight);

    toolbarVTop.value = toolbarRowIndex.value * cellHeight;
    toolbarHLeft.value = toolbarColIndex.value * cellWidth;
  }

  return {
    toolbarVTop,
    toolbarColIndex,
    toolbarHLeft,
    toolbarRowIndex,
    updateToolbarPosition,
    addRow,
    addCol,
    removeRow,
    removeCol
  };
}
