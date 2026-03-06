import { Palette } from '@vicons/tabler';
import { defineTool } from '../tool';


export const tool = defineTool({
  name: 'linux 命令',
  path: '/linux-command',
  description: 'linux 命令搜索',
  keywords: ['color', 'converter'],
  component: () => import('./linux-command.vue'),
  icon: Palette,
  redirectFrom: ['/linux-command'],
});
