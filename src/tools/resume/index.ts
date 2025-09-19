import { ArrowsShuffle } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: '简',
  path: '/resume',
  description: '开发中...',
  keywords: ['resume'],
  component: () => import('./resume.vue'),
  icon: ArrowsShuffle,
  createdAt: new Date('2025-09-16'),
});
