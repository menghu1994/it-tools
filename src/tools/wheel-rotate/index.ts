import {  Rotate360 } from '@vicons/tabler';
import { defineTool } from '../tool';


export const tool = defineTool({
  name: '大转盘',
  path: '/wheel-rotate',
  description: '随机大挑战',
  keywords: ['coin', 'random'],
  component: () => import('./wheel-rotate.vue'),
  icon: Rotate360,
  redirectFrom: ['/wheel-rotate'],
});
