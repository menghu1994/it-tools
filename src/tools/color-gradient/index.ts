import { Palette } from '@vicons/tabler';
import { defineTool } from '../tool';


export const tool = defineTool({
  name: 'Color 渐变',
  path: '/color-gradient',
  description: '背景渐变色生成',
  keywords: ['color', 'converter'],
  component: () => import('./color-gradient.vue'),
  icon: Palette,
  redirectFrom: ['/color-gradient'],
});
