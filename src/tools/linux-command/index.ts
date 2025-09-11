import { Palette } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.linux-command.title'),
  path: '/linux-command',
  description: translate('tools.linux-command.description'),
  keywords: ['color', 'converter'],
  component: () => import('./linux-command.vue'),
  icon: Palette,
  redirectFrom: ['/linux-command'],
});
