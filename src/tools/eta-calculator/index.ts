import { Hourglass } from '@vicons/tabler';
import { defineTool } from '../tool';


export const tool = defineTool({
  name: 'ETA 计算器',
  path: '/eta-calculator',
  description: 'ETA（估计到达时间）计算器，用于知道任务的近似结束时间，例如下载的结束时刻。',
  keywords: ['eta', 'calculator', 'estimated', 'time', 'arrival', 'average'],
  component: () => import('./eta-calculator.vue'),
  icon: Hourglass,
});
