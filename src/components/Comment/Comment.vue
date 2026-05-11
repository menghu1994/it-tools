<script setup lang="ts">
import { toolCommentsService } from '@/api/tool-comments.service';
import { useLoginModalStore } from '@/stores/login-modal.store';
import { useUserStore } from '@/stores/user.store';

interface ToolComment {
  _id: string
  content: string
  author?: {
    _id?: string
    username?: string
    avatar?: string
  }
  createdAt: string
  upvotes: string[]
  downvotes: string[]
  replies: ToolComment[]
}

const props = defineProps<{ toolKey: string }>();

const userStore = useUserStore();
const loginModalStore = useLoginModalStore();
const message = useMessage();
const comments = ref<ToolComment[]>([]);
const loading = ref(false);
const posting = ref(false);
const newComment = ref('');
const replyContent = ref('');
const replyingTo = ref<string | null>(null);

async function loadComments() {
  loading.value = true;
  try {
    const res = await toolCommentsService.list(props.toolKey);
    comments.value = res.data || [];
  } finally {
    loading.value = false;
  }
}

async function ensureLogin() {
  if (userStore.user) {
    return true;
  }
  return loginModalStore.open();
}

async function submitComment(parentId?: string) {
  const content = (parentId ? replyContent.value : newComment.value).trim();
  if (!content) {
    message.warning('请输入评论内容');
    return;
  }
  if (!await ensureLogin()) {
    return;
  }

  posting.value = true;
  try {
    await toolCommentsService.create({
      toolKey: props.toolKey,
      content,
      parentId,
    });
    if (parentId) {
      replyContent.value = '';
      replyingTo.value = null;
    } else {
      newComment.value = '';
    }
    await loadComments();
  } finally {
    posting.value = false;
  }
}

async function vote(comment: ToolComment, type: 'upvote' | 'downvote') {
  if (!await ensureLogin()) {
    return;
  }
  await toolCommentsService.vote(comment._id, type);
  await loadComments();
}

async function remove(comment: ToolComment) {
  if (!await ensureLogin()) {
    return;
  }
  await toolCommentsService.remove(comment._id);
  await loadComments();
}

function canRemove(comment: ToolComment) {
  const roles = userStore.user?.roles || [];
  const isAdmin = Array.isArray(roles) && roles.some((role: any) => role === 'admin' || role?.code === 'admin');
  return isAdmin || comment.author?._id === userStore.user?._id;
}

function formatTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  return date.toLocaleString();
}

onMounted(loadComments);
watch(() => props.toolKey, loadComments);
</script>

<template>
  <section class="comments">
    <div class="comments-head">
      <h2>评论</h2>
      <span>{{ comments.length }} 条</span>
    </div>

    <div class="composer">
      <n-input
        v-model:value="newComment"
        type="textarea"
        :autosize="{ minRows: 3, maxRows: 6 }"
        placeholder="写下你的评论"
      />
      <div class="composer-actions">
        <c-button :disabled="posting" @click="submitComment()">发表评论</c-button>
      </div>
    </div>

    <n-spin :show="loading">
      <div v-if="comments.length === 0" class="empty">
        暂无评论
      </div>

      <div v-for="comment in comments" :key="comment._id" class="comment">
        <div class="comment-main">
          <n-avatar round :src="comment.author?.avatar">
            <!-- {{ comment.author?.username?.slice(0, 1) || 'U' }} -->
          </n-avatar>
          <div class="comment-body">
            <div class="comment-meta">
              <strong>{{ comment.author?.username || '用户' }}</strong>
              <span>{{ formatTime(comment.createdAt) }}</span>
            </div>
            <p>{{ comment.content }}</p>
            <div class="comment-actions">
              <button @click="vote(comment, 'upvote')">赞 {{ comment.upvotes.length }}</button>
              <button @click="vote(comment, 'downvote')">踩 {{ comment.downvotes.length }}</button>
              <button @click="replyingTo = replyingTo === comment._id ? null : comment._id">回复</button>
              <button v-if="canRemove(comment)" @click="remove(comment)">删除</button>
            </div>

            <div v-if="replyingTo === comment._id" class="reply-box">
              <n-input
                v-model:value="replyContent"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4 }"
                placeholder="写下你的回复"
              />
              <div class="composer-actions">
                <c-button :disabled="posting" @click="submitComment(comment._id)">提交回复</c-button>
                <c-button variant="text" @click="replyingTo = null">取消</c-button>
              </div>
            </div>

            <div v-if="comment.replies?.length" class="replies">
              <div v-for="reply in comment.replies" :key="reply._id" class="comment reply">
                <n-avatar round :src="reply.author?.avatar">
                  <!-- {{ reply.author?.username?.slice(0, 1) || 'U' }} -->
                </n-avatar>
                <div class="comment-body">
                  <div class="comment-meta">
                    <strong>{{ reply.author?.username || '用户' }}</strong>
                    <span>{{ formatTime(reply.createdAt) }}</span>
                  </div>
                  <p>{{ reply.content }}</p>
                  <div class="comment-actions">
                    <button @click="vote(reply, 'upvote')">赞 {{ reply.upvotes.length }}</button>
                    <button @click="vote(reply, 'downvote')">踩 {{ reply.downvotes.length }}</button>
                    <button v-if="canRemove(reply)" @click="remove(reply)">删除</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </n-spin>
  </section>
</template>

<style scoped lang="less">
.comments {
  width: min(860px, calc(100vw - 32px));
  margin: 40px auto 0;
  padding-top: 24px;
  border-top: 1px solid var(--n-border-color);
}

.comments-head {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 16px;

  h2 {
    margin: 0;
    font-size: 22px;
    font-weight: 600;
  }

  span {
    color: var(--n-text-color-3);
  }
}

.composer {
  margin-bottom: 18px;
}

.composer-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 10px;
}

.empty {
  padding: 24px;
  color: var(--n-text-color-3);
  text-align: center;
}

.comment {
  padding: 16px 0;
  border-bottom: 1px solid var(--n-border-color);
}

.comment-main,
.reply {
  display: flex;
  gap: 12px;
}

.comment-body {
  flex: 1;
  min-width: 0;

  p {
    margin: 8px 0;
    white-space: pre-wrap;
    word-break: break-word;
  }
}

.comment-meta {
  display: flex;
  gap: 10px;
  align-items: center;

  span {
    color: var(--n-text-color-3);
    font-size: 12px;
  }
}

.comment-actions {
  display: flex;
  gap: 12px;

  button {
    padding: 0;
    border: 0;
    background: transparent;
    color: var(--n-text-color-3);
    cursor: pointer;
  }
}

.reply-box {
  margin-top: 12px;
}

.replies {
  margin-top: 12px;
  padding-left: 14px;
  border-left: 2px solid var(--n-border-color);
}
</style>
