import { SpeedFilled } from '@vicons/material';
import { defineTool } from '../tool';


export const tool = defineTool({
  name: '基准生成器',
  path: '/benchmark-builder',
  description: '简单的在线基准构建器可以轻松比较任务的执行时间。',
  keywords: ['benchmark', 'builder', 'execution', 'duration', 'mean', 'variance'],
  component: () => import('./benchmark-builder.vue'),
  icon: SpeedFilled,
  createdAt: new Date('2023-04-05'),
});
