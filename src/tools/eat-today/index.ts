import {  Rotate360 } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.eat-today.title'),
  path: '/eat-today',
  description: translate('tools.eat-today.description'),
  keywords: ['eat', 'food'],
  component: () => import('./eat-today.vue'),
  icon: Rotate360,
  redirectFrom: ['/eat-today'],
});
