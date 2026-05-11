import { Id } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: '简历制作',
  path: '/resume',
  description: '在线编辑并保存你的简历草稿',
  keywords: ['resume', 'cv', '简历'],
  component: () => import('./resume.vue'),
  icon: Id,
  createdAt: new Date('2025-09-16'),
});
