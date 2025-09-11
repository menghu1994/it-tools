import { Palette } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.image-editor.title'),
  path: '/image-editor',
  description: translate('tools.image-editor.description'),
  keywords: ['color', 'converter'],
  component: () => import('./image-editor.vue'),
  icon: Palette,
  redirectFrom: ['/image-editor'],
});
