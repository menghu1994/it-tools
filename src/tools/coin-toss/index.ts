import { Palette } from '@vicons/tabler';
import { defineTool } from '../tool';


export const tool = defineTool({
  name: '抛硬币',
  path: '/coin-toss',
  description: '来看看你的运气',
  keywords: ['coin', 'random'],
  component: () => import('./coin-toss.vue'),
  icon: Palette,
  redirectFrom: ['/coin-toss'],
});
