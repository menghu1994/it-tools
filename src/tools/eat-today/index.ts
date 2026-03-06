import {  Rotate360 } from '@vicons/tabler';
import { defineTool } from '../tool';


export const tool = defineTool({
  name: '今天吃什么',
  path: '/eat-today',
  description: '',
  keywords: ['eat', 'food'],
  component: () => import('./eat-today.vue'),
  icon: Rotate360,
  redirectFrom: ['/eat-today'],
});
