import {  Rotate360 } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.marquee.title'),
  path: '/marquee',
  description: translate('tools.marquee.description'),
  keywords: ['vote', 'marquee'],
  component: () => import('./marquee.vue'),
  icon: Rotate360,
  redirectFrom: ['/marquee'],
});
