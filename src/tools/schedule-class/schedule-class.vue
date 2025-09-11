<script setup>
import { ref } from 'vue';
import { Plus } from '@vicons/tabler';

const classes = ref([
  { uid: 1, name: '语文' },
  { uid: 2, name: '数学' },
  { uid: 3, name: '英语' },
  { uid: 4, name: '体育' },
  { uid: 5, name: '音乐' },
]);

const userInfo = ref({ id: 3 });
let weekDays = ref(['周一', '周二', '周三', '周四', '周五', '周六', '周日']);
const timePeriodDefine = ref(['上午', '下午', '课后服务']);
const showWeekend = ref(true);

watch(showWeekend, (val) => {
  weekDays.value = val ? ['周一', '周二', '周三', '周四', '周五', '周六', '周日'] : ['周一', '周二', '周三', '周四', '周五'];
})

const timePeriods = ref([
  [
    { id: 'm1', time: '08:00 - 08:45' },
    { id: 'm2', time: '08:55 - 09:40' },
    { id: 'm3', time: '10:00 - 10:45' },
    { id: 'm4', time: '10:55 - 11:40' }
  ],
  [
    { id: 'a1', time: '14:00 - 14:45' },
    { id: 'a2', time: '14:55 - 15:40' },
    { id: 'a3', time: '16:00 - 16:45' },
    { id: 'a4', time: '16:55 - 17:40' }
  ],
  [
    { id: 'e1', time: '19:00 - 19:45' },
    { id: 'e2', time: '20:00 - 20:45' },
    { id: 'e3', time: '21:00 - 21:45' },
  ]
]);

const courses = ref({
  '周一': {
    'm1': { name: '数学', uid: 2 },
    'm2': { name: '英语', uid: 3 },
    'a2': { name: '体育', uid: 1 }
  },
  '周三': {
    'm3': { name: '音乐', uid: 2 }
  }
});

const showContextMenu = ref(false);
const contextMenuPosition = ref([0, 0]);
const currentDay = ref();
const currentSessionId = ref();

const addValue = () => {
  classes.value = [...classes.value, { uid: classes.value.length + 1, name: '新课程' }];
}

const getCourse = (day, sessionId) => {
  return courses.value[day]?.[sessionId];
};

const onDragClassStart = (event, element) => {
  event.dataTransfer.setData('text/application', JSON.stringify(element));
  event.dataTransfer.setData('text/plain', JSON.stringify(element.name));
};

const onDragStart = (e, day, sessionId) => {
  const dragData = {
    ...getCourse(day, sessionId),
    sourceDay: day,
    sourceSessionId: sessionId
  };
  e.dataTransfer.setData('text/application', JSON.stringify(dragData));
  e.dataTransfer.effectAllowed = e.ctrlKey ? 'copy' : 'move';
};

const onDrop = (e, targetDay, targetSessionId) => {
  e.preventDefault();

  const textData = e.dataTransfer.getData('text/application');
  if (!textData) {return}
  let droppedItem;
  try {
    droppedItem = JSON.parse(textData);
  } catch {
    droppedItem = {
      name: textData?.name,
      uid: textData?.uid
    };
  }

  // 处理从外部拖拽（Excel等）
  if (!droppedItem.sourceDay && !droppedItem.sourceSessionId) {
    if (!courses.value[targetDay]) {
      courses.value[targetDay] = {};
    }
    courses.value[targetDay][targetSessionId] = {
      name: droppedItem.name,
      uid: droppedItem.uid || null
    };
    return;
  }

  // 处理内部拖拽
  const { sourceDay, sourceSessionId } = droppedItem;

  if (sourceDay === targetDay && sourceSessionId === targetSessionId) {
    return;
  }

  const sourceCourse = { ...courses.value[sourceDay][sourceSessionId] }

  // 如果目标单元格有内容，则交换
  if (courses.value[targetDay]?.[targetSessionId]) {
    const targetCourse = { ...courses.value[targetDay][targetSessionId] };
    courses.value[sourceDay][sourceSessionId] = targetCourse;
    courses.value[targetDay][targetSessionId] = sourceCourse;
  }
  // 如果目标单元格为空，则移动
  else {
    if (!courses.value[targetDay]) {
      courses.value[targetDay] = {};
    }
    courses.value[targetDay][targetSessionId] = sourceCourse;
    if(e.dataTransfer.effectAllowed === 'move') {
      delete courses.value[sourceDay][sourceSessionId];
    }
  }
};
const onRightClick = (event, day, sessionId) => {
  if (!getCourse(day, sessionId)) {
    return;
  }
  showContextMenu.value = true;
  contextMenuPosition.value = [event.clientX, event.clientY];
  currentDay.value = day;
  currentSessionId.value = sessionId;
};

const deleteCourse = () => {
  delete courses.value[currentDay.value][currentSessionId.value];
  currentDay.value = undefined;
  currentSessionId.value = undefined;
  showContextMenu.value = false;
};

const exportTableToImage = () => {
  // Implementation for image export
};

const exportTableToExcel = () => {
  // Implementation for Excel export
};

const printDOM = (tableId) => {
  const iframe = document.createElement('iframe');
  iframe.setAttribute('style', 'display: none');
  document.body.appendChild(iframe);

  const iframeDocument = iframe.contentWindow?.document;
  if (!iframeDocument) {
    console.error('Failed to access iframe document');
    return;
  }

  const printContents = document.getElementById(tableId).innerHTML;

  const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Print</title>
        <style>
          @media print {
            body {
              margin: 0;
              padding: 0;
            }
            #course-table {
              background-color: #fff;
              border: 1px solid #000;
              padding: 10px;
            }
            .course-table {
              border-collapse: collapse;
              height: 100%;
              width: 100%;
            }
            table {
              background: red;
            }
            th {
              width: 200px;
              background-color: #f2f2f2;
              font-weight: bold;
              border: 1px solid #ddd;
              text-align: center;
              padding: 1rem 4px;
            }
            td {
              border: 1px solid #ddd;
              text-align: center;
              height: 60px;
              vertical-align: middle;
              position: relative;
              overflow: hidden;
            }
            .session-time {
              background-color: #f9f9f9;
              width: 100px;
            }
            .release-time {
              height: 10px;
            }
            .time-cell {
              background-color: #f9f9f9;
              font-weight: bold;
              writing-mode: vertical-rl;
              text-orientation: mixed;
              width: 30px;
              text-align: center;
              letter-spacing: 0.4rem;
            }
            .my-course {
              background-color: #e6f7ff;
              box-shadow: inset 0 0 2px #82d7ff;
            }
          }
        </style>
      </head>
      <body>
        ${printContents}
      </body>
      </html>
      `;

  iframeDocument.open();
  iframeDocument.write(html);
  iframeDocument.close();

  iframe.contentWindow?.focus();
  iframe.contentWindow?.print();

  setTimeout(() => {
    document.body.removeChild(iframe);
  }, 1000);
};

document.addEventListener('click', () => {
  showContextMenu.value = false;
});
</script>

<template>
  <div class="w-full">
    <div class="flex flex-row-reverse gap-2 mb-2">
<!--      <button @click="exportTableToImage()">导出为图片</button>-->
<!--      <button @click="exportTableToExcel()">导出为Excel</button>-->
<!--      <button @click="printDOM('table-wrapper')">打印</button>-->
      <n-switch v-model:value="showWeekend" :round="false" >
        <template #checked> 显示周末 </template>
        <template #unchecked>隐藏周末</template>
      </n-switch>
    </div>
    <div class="flex h-full gap-2">
      <div class="w-40 border p-2">
        <h3>可选课程</h3>
        <div class="flex flex-col gap-1">
          <div v-for="element in classes"
               :key="element.uid"
               class="teacher-item border-2 p-2 bg-white rounded hover:bg-gray-100 text-center"
               draggable="true"
               @dragstart="onDragClassStart($event, element)">
            <span class="font-bold">
              {{ element.name }}
            </span>
          </div>
          <c-button @click="addValue">
            <n-icon :component="Plus" depth="3" mr-2 size="18" />
            添加
          </c-button>
        </div>
      </div>


      <div id="table-wrapper" class="w-full h-full">
        <table id="course-table" class="course-table w-full h-full">
          <thead>
            <tr>
              <th :colspan="2">时间</th>
              <th v-for="weekDay in weekDays" :key="weekDay">{{ weekDay }}</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(timePeriod, timePeriodIndex) in timePeriods" :key="timePeriodIndex">
              <template v-for="(session, i) in timePeriod" :key="session.id">
                <tr>
                  <td v-if="i === 0" class="time-cell" :rowspan="timePeriod.length">{{ timePeriodDefine[timePeriodIndex] }}</td>
                  <td class="session-time">{{ session.time }}</td>
                  <td v-for="day in weekDays" :key="day" class="course-cell cursor-pointer"
                    :class="{ 'my-course': getCourse(day, session.id)?.uid === userInfo.id }"
                    @contextmenu.prevent="onRightClick($event, day, session.id)">
                    <div v-if="getCourse(day, session.id)" class="h-full flex flex-col justify-center" draggable="true"
                         @dragstart="(e) => onDragStart(e, day, session.id)"
                         @drop="(e) => onDrop(e, day, session.id)"
                         @dragover.prevent @dragenter.prevent>
                      {{ getCourse(day, session.id).name }}
                    </div>
                    <div v-else class="empty-slot h-full"
                         @drop="(e) => onDrop(e, day, session.id)" @dragover.prevent @dragenter.prevent></div>
                  </td>
                </tr>
              </template>
              <tr v-if="timePeriodIndex !== timePeriods.length - 1" class="release-time"></tr>
            </template>
          </tbody>
        </table>
      </div>

      <div v-if="showContextMenu" class="custom-context-menu"
        :style="{ left: contextMenuPosition[0] + 'px', top: contextMenuPosition[1] + 'px' }">
        <div @click="deleteCourse">删除</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-context-menu {
  position: fixed;
  background-color: #fff;
  border: 1px solid #ccc;
  padding: 5px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}

.custom-context-menu div {
  cursor: pointer;
  padding: 0 10px;
}

.custom-context-menu div:hover {
  background-color: #f0f0f0;
}

.course-table {
  border-collapse: collapse;
}

.course-table th {
  width: calc(100% / 8);
  background-color: #f2f2f2;
  font-weight: bold;
  border: 1px solid #ddd;
  text-align: center;
  padding: 1rem 4px;
}

.course-table td {
  border: 1px solid #ddd;
  text-align: center;
  height: 60px;
  vertical-align: middle;
  transition: background-color 0.2s;
  position: relative;
  overflow: hidden;
}

.course-table .session-time {
  background-color: #f9f9f9;
  width: 100px;
}

.course-table .session-time:hover {
  background-color: #f0f8ff;
}

.course-table .release-time {
  height: 10px;
}

.course-table .time-cell {
  background-color: #f9f9f9;
  font-weight: bold;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  width: 30px;
  text-align: center;
  letter-spacing: 0.4rem;
}

.course-table .my-course {
  background-color: #e6f7ff;
  box-shadow: inset 0 0 2px #82d7ff;
}

.teacher-item {
  cursor: grab;
  border: 2px solid;
  margin-bottom: 12px;
  padding: 8px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
}

.teacher-item:hover {
  background-color: #f0f0f0;
}

.empty-slot {
  min-height: 60px;
}
</style>
