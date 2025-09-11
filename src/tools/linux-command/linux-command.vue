<template>
  <div class="linux_command" flex flex-col gap-2>
    <n-modal
      v-model:show="showModal"
      :mask-closable="false"
      style="width: 800px"
      preset="card"
      :title="command"
    >
      <div v-html="content"></div>
      <template #footer>
        <c-button class="close-modal" @click="closeModal">
          关闭
        </c-button>
      </template>
    </n-modal>

    <c-card title="Linux 命令查询">
      <c-input-text
        v-model:value="searchVal"
        :label="geting ? '获取数据中···' : '请输入要查询的命令'"
        placeholder="alias"
      />
      <div v-if="searchVal" class="nya-subtitle">
        搜索结果（点击查看详情）
      </div>
      <ul v-if="searchVal" class="nya-list">
        <li v-for="(item, index) in searchResults" :key="index" @click="query(item)">
          <b>{{ data[item].n }}</b>：{{ data[item].d }}
        </li>
      </ul>
    </c-card>

    <c-card title="说明">
      <ul class="nya-list">
        <li>
          数据来自
          <a
            href="https://github.com/jaywcjlove/linux-command"
            target="_blank"
            rel="noopener noreferrer"
          >
            jaywcjlove/linux-command
          </a>
        </li>
        <li>部分地区无法访问 unpkg 的 cdn，如果出现网络错误请自行更换环境使用</li>
      </ul>
    </c-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import markdownit from 'markdown-it';
import axios from 'axios'

const geting = ref(true)
const data = ref({})
const searchVal = ref('')
const command = ref(null)
const commandData = ref(null)
const showModal = ref(false)
const md = markdownit();

const searchResults = computed(() =>
  Object.keys(data.value).filter(comm =>
    data.value[comm].n.toLowerCase().includes(searchVal.value.toLowerCase())
  )
)

const content = computed(() => (commandData.value ? md.render(commandData.value) : ''))

onMounted(() => {
  getData()
})

function getData() {
  axios
    .get('https://unpkg.com/linux-command@1.2.5/dist/data.json')
    .then(e => {
      data.value = e.data
      geting.value = false
    })
    .catch(err => {
      geting.value = false
    })
}

function query(cmd) {
  clear()
  axios
    .get(`https://unpkg.com/linux-command/command/${cmd}.md`)
    .then(e => {
      commandData.value = e.data
      command.value = cmd
      showModal.value = true
    })
    .catch(err => {
    })
}

function clear() {
  command.value = ''
  commandData.value = ''
}

function closeModal() {
  showModal.value = false
}
</script>

<style scoped lang="less">
.linux_command {
  .nya-subtitle {
    margin-top: 15px;
  }
  li {
    cursor: pointer;
    list-style: none;
    &:active,
    &:hover {
      text-decoration: underline;
    }
  }
  .readCommand_modal {
    padding: 15px;
    border-radius: 5px;
    max-width: 100%;
    .title {
      text-align: center;
      margin-bottom: 10px;
      font-weight: bold;
      font-size: 20px;
      padding-bottom: 15px;
      border-bottom: 1px solid #dad9d9;
    }
    .close-modal {
      text-align: center;
      padding-top: 15px;
      font-weight: bold;
      border-top: 1px solid #dad9d9;
      margin-top: 15px;
      font-size: 20px;
      cursor: pointer;
    }
  }
}
</style>
