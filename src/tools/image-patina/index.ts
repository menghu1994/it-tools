import { Palette } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.image-patina.title'),
  path: '/image-patina',
  description: translate('tools.image-patina.description'),
  keywords: ['color', 'converter'],
  component: () => import('./image-patina.vue'),
  icon: Palette,
  redirectFrom: ['/image-patina'],
});
