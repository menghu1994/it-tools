import { Palette } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.coin-toss.title'),
  path: '/coin-toss',
  description: translate('tools.coin-toss.description'),
  keywords: ['coin', 'random'],
  component: () => import('./coin-toss.vue'),
  icon: Palette,
  redirectFrom: ['/coin-toss'],
});
