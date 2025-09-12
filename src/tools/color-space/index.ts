import { Palette } from '@vicons/tabler';
import { defineTool } from '../tool';


export const tool = defineTool({
  name: 'Color 主题色',
  path: '/color-space',
  description: '主题配色',
  keywords: ['color', 'converter'],
  component: () => import('./color-space.vue'),
  icon: Palette,
  redirectFrom: ['/color-space'],
});
