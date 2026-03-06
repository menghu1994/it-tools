import {  Rotate360 } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: '手持弹幕',
  path: '/marquee',
  description: '应援必备',
  keywords: ['vote', 'marquee'],
  component: () => import('./marquee.vue'),
  icon: Rotate360,
  redirectFrom: ['/marquee'],
});
