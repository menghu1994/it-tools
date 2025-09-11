import { Palette } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.screen-record.title'),
  path: '/screen-record',
  description: translate('tools.screen-record.description'),
  keywords: ['color', 'converter'],
  component: () => import('./screen-record.vue'),
  icon: Palette,
  redirectFrom: ['/screen-record'],
});
