import { Palette } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.color-gradient.title'),
  path: '/color-gradient',
  description: translate('tools.color-gradient.description'),
  keywords: ['color', 'converter'],
  component: () => import('./color-gradient.vue'),
  icon: Palette,
  redirectFrom: ['/color-gradient'],
});
