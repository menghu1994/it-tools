import {  Rotate360 } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.wheel-rotate.title'),
  path: '/wheel-rotate',
  description: translate('tools.wheel-rotate.description'),
  keywords: ['coin', 'random'],
  component: () => import('./wheel-rotate.vue'),
  icon: Rotate360,
  redirectFrom: ['/wheel-rotate'],
});
