<script setup lang="ts">
import { onMounted  } from 'vue';
import { useComment } from '@/components/Comment/useComment';

const {
  comments,
  newComment,
  newReply,
  addComment,
  toggleLike,
  saveComments,
  toggleReply,
  addReply,
  cancelReply
} = useComment(123);

const isAuthenticated = ref<boolean>(false);

// 初始化示例数据
const initData = () => {
  const stored = localStorage.getItem('vue3-comments');
  if (stored) {
    comments.value = JSON.parse(stored);
  } else {
    // 默认示例数据
    comments.value = [
      {
        id: 1,
        author: '张三',
        content: '这个观点很有见地，我完全同意！',
        timestamp: Date.now() - 3600000,
        likes: 3,
        liked: false,
        replies: [
          {
            id: 11,
            author: '李四',
            content: '谢谢你的认可！',
            timestamp: Date.now() - 1800000
          }
        ]
      },
      {
        id: 2,
        author: '王五',
        content: '我觉得还可以从另一个角度思考这个问题。',
        timestamp: Date.now() - 7200000,
        likes: 1,
        liked: false,
        replies: []
      }
    ];
    saveComments();
  }
};

// 格式化时间
const formatTime = (timestamp: number) => {
  const now = Date.now();
  const diff = now - timestamp;

  if (diff < 60000) {
    return '刚刚';
  } else if (diff < 3600000) {
    return `${Math.floor(diff / 60000)}分钟前`;
  } else if (diff < 86400000) {
    return `${Math.floor(diff / 3600000)}小时前`;
  } else {
    return new Date(timestamp).toLocaleDateString();
  }
};

onMounted(() => {
  initData();
});
</script>

<template>
  <div class="container">
    <div class="comment-section">
      <h2 class="section-title">
        <i class="fas fa-comments"></i>
        评论区
      </h2>

      <!-- 发表评论表单 -->
      <div class="comment-form" v-if="isAuthenticated">
        <div class="form-group">
          <textarea v-model="newComment.content" class="form-textarea" placeholder="写下您的评论..."></textarea>
        </div>
        <button @click="addComment" class="btn btn-primary">发表评论</button>
      </div>
      <div v-else class="login-prompt">
        <p>请<a href="/login">登录</a>后发表评论</p>
      </div>

      <!-- 评论列表 -->
      <div class="comment-list">
        <div v-if="comments.length === 0" class="empty-state">
          <i class="fas fa-comment-slash"></i>
          <p>暂无评论，快来发表第一条评论吧！</p>
        </div>

        <div v-for="comment in comments" :key="comment._id" class="comment-item">
          <div class="comment-header">
            <div class="avatar"><n-avatar round :src="comment.author.avatar || '/default-avatar.png'"></n-avatar></div>
            <div class="comment-author">{{ comment.author.username }}</div>
            <div class="comment-time">{{ formatTime(comment.createdAt) }}</div>
          </div>

          <div class="comment-content">{{ comment.content }}</div>

          <div class="comment-actions">
<!--            <button @click="toggleLike(comment)" class="action-btn">-->
<!--              {{ comment.likes }} 赞-->
<!--            </button>-->
            <button @click="vote(comment._id, 'upVote')">👍 {{ comment.upvotes.length }}</button>
            <button @click="vote(comment._id, 'dowVote')">👎 {{ comment.downvotes.length }}</button>
            <button @click="toggleReply(comment)" class="action-btn">回复</button>
          </div>

          <!-- 回复表单 -->
          <div v-if="comment.replying && replyingTo === comment._id" class="comment-form" style="margin-top: 15px;">
            <div class="form-group">
              <textarea v-model="newReply.content" class="form-textarea" placeholder="写下您的回复..."></textarea>
            </div>
            <button @click="addReply(comment._id)" class="btn btn-primary btn-sm">回复</button>
            <button @click="cancelReply" class="btn btn-sm" style="margin-left: 10px;">取消</button>
          </div>

          <!-- 回复列表 -->
          <div v-if="comment.replies && comment.replies.length > 0" class="replies">
            <div v-for="reply in comment.replies" :key="reply.id" class="comment-item">
              <div class="comment-header">
                <div class="avatar">
                  <n-avatar round :src="comment.author.avatar || '/default-avatar.png'"></n-avatar>
                </div>
                <div class="comment-author">{{ reply.author.username }}</div>
                <div class="comment-time">{{ formatTime(reply.timestamp) }}</div>
              </div>
              <div class="comment-content">{{ reply.content }}</div>
            </div>
            <button @click="cancelReply" class="btn btn-sm" style="margin-left: 10px;">取消</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.comment-section {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 24px;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 20px;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 10px;
}

.comment-form {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.form-group {
  margin-bottom: 15px;
}

.form-input, .form-textarea {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-input:focus, .form-textarea:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

.form-textarea {
  min-height: 100px;
  resize: vertical;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s;
}

.btn-primary {
  background-color: #3498db;
  color: white;
}

.btn-primary:hover {
  background-color: #2980b9;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 0.875rem;
}

.comment-list {
  margin-top: 20px;
}

.comment-item {
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;
}

.comment-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 12px;
  background-color: #3498db;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
}

.comment-author {
  font-weight: 600;
  color: #2c3e50;
}

.comment-time {
  font-size: 0.8rem;
  color: #7f8c8d;
  margin-left: 10px;
}

.comment-content {
  margin-left: 52px;
  margin-bottom: 12px;
  color: #34495e;
}

.comment-actions {
  margin-left: 52px;
  display: flex;
  gap: 15px;
}

.action-btn {
  background: none;
  border: none;
  color: #7f8c8d;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: color 0.3s;
}

.action-btn:hover {
  color: #3498db;
}

.replies {
  margin-left: 52px;
  margin-top: 15px;
  padding-left: 15px;
  border-left: 3px solid #eaeaea;
}

.empty-state {
  text-align: center;
  padding: 30px;
  color: #7f8c8d;
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 15px;
  color: #ddd;
}
</style>
