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
                 @mousedown="startRowResize($event, 'td', cellIndex, rowIndex)"></div>
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
import { ref } from 'vue';
import { useTableData } from './useTableData';
import { useSelection } from './useSelection';
import { useResize } from './useResize';
import { useToolbar } from './useToolbar';

let cols = ref(5);
let rows = ref(5);

const { columns, tableData, exportedHTML, generateTable, addRow, addCol, removeRow, removeCol, exportHTML, get, clearTh } = useTableData(cols, rows);

const { selectedCells, startSelection, dragSelection, mergeCells, isMouseDown, isDragging, getCellClasses, clearSelection } = useSelection(tableData);

const { startRowResize, isResizing } = useResize(tableData);

const { toolbarVTop, toolbarColIndex, toolbarHLeft, toolbarRowIndex, updateToolbarPosition } = useToolbar(addRow, addCol, removeRow, removeCol);

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
.export-area {
  width: 400px;
  overflow: hidden;
}

</style>
