import { Palette } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.watermark.title'),
  path: '/watermark',
  description: translate('tools.watermark.description'),
  keywords: ['color', 'converter'],
  component: () => import('./watermark.vue'),
  icon: Palette,
  redirectFrom: ['/watermark'],
});
