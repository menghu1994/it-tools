import { Palette } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.color-space.title'),
  path: '/color-space',
  description: translate('tools.color-space.description'),
  keywords: ['color', 'converter'],
  component: () => import('./color-space.vue'),
  icon: Palette,
  redirectFrom: ['/color-space'],
});
