import { type Ref, ref } from 'vue';

export function useResize(tableData: Ref<any[]>) {
  const isResizing = ref(false);
  const resizeInfo = ref<any>({ startX: 0, colIndex: null, startWidth: 0 });

  const startRowResize = (event: any, type: any, colIndex: number, rowIndex: number) => {
    event.preventDefault();
    const startX = event.pageX;
    const cell = event.target.closest(type);
    const startWidth = cell.offsetWidth;

    const onMouseMove = (e: any) => {
      const newWidth = startWidth + (e.pageX - startX);
      cell.style.width = `${newWidth}px`;
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  function startRowDrag(e: any) {
    if (!isResizing.value) return;
    const delta = e.clientX - resizeInfo.value.startX;
    const newWidth = Math.max(40, resizeInfo.value.startWidth + delta);
    tableData.value.forEach(row => {
      row.cells[resizeInfo.value.colIndex].width = newWidth;
    });
  }

  function stopRowResize() {
    isResizing.value = false;
    document.removeEventListener('mousemove', startRowDrag);
    document.removeEventListener('mouseup', stopRowResize);
  }

  return {
    isResizing,
    startRowResize
  };
}
