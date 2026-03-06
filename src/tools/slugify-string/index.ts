import { AbcRound } from '@vicons/material';
import { defineTool } from '../tool';


export const tool = defineTool({
  name: '打乱字符串',
  path: '/slugify-string',
  description: '确保字符串 url、文件名和 id 安全。',
  keywords: ['slugify', 'string', 'escape', 'emoji', 'special', 'character', 'space', 'trim'],
  component: () => import('./slugify-string.vue'),
  icon: AbcRound,
});
