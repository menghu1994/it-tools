import { ref } from 'vue';

export interface IComment {
  id: number
  userName: string
  text: string
  date: Date
  avatar?: string
}

export const useComment = (articleId: number) => {
  const comments = ref<any[]>([]);
  const newComment = ref({
    author: '',
    content: ''
  });
  const newReply = ref({
    author: '',
    content: '',
    parentId: null
  });
  const replyingTo = ref(null);

  // 保存评论到localStorage
  const saveComments = () => {
    localStorage.setItem('vue3-comments', JSON.stringify(comments.value));
  };

// 添加新评论
  const addComment = () => {
    if (!newComment.value.content.trim()) {
      alert('请填写评论内容');
      return;
    }

    const comment = {
      id: Date.now(),
      author: newComment.value.author,
      content: newComment.value.content,
      timestamp: Date.now(),
      likes: 0,
      liked: false,
      replies: []
    };

    comments.value.unshift(comment);
    newComment.value.author = '';
    newComment.value.content = '';
    saveComments();
  };

// 点赞/取消点赞
  const toggleLike = (comment: any) => {
    comment.liked = !comment.liked;
    comment.likes += comment.liked ? 1 : -1;
    saveComments();
  };

// 显示/隐藏回复表单
  const toggleReply = (comment: any) => {
    if (replyingTo.value === comment.id) {
      replyingTo.value = null;
      comment.replying = false;
    } else {
      // 隐藏其他回复表单
      comments.value.forEach(c => {
        c.replying = false;
      });
      comment.replying = true;
      replyingTo.value = comment.id;
      newReply.value.parentId = comment.id;
    }
  };

// 取消回复
  const cancelReply = () => {
    if (replyingTo.value) {
      const comment = comments.value.find(c => c.id === replyingTo.value);
      if (comment) {
        comment.replying = false;
      }
      replyingTo.value = null;
      newReply.value.author = '';
      newReply.value.content = '';
    }
  };

// 添加回复
  const addReply = (comment: any) => {
    if (!newReply.value.content.trim()) {
      alert('回复内容');
      return;
    }

    const reply = {
      id: Date.now(),
      author: newReply.value.author,
      content: newReply.value.content,
      timestamp: Date.now()
    };

    comment.replies.push(reply);
    comment.replying = false;
    replyingTo.value = null;
    newReply.value.author = '';
    newReply.value.content = '';
    saveComments();
  };

  return {
    comments,
    newComment,
    newReply,
    addComment,
    toggleLike,
    saveComments,
    toggleReply,
    addReply,
    cancelReply
  }
}
