import { BellRinging } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: '排课',
  path: '/schedule-class',
  description: '课程编辑器',
  keywords: ['schedule', 'web', 'class', 'custom'],
  component: () => import('./schedule-class.vue'),
  icon: BellRinging,
  createdAt: new Date('2025-08-11'),
});
