import { Palette } from '@vicons/tabler';
import { defineTool } from '../tool';


export const tool = defineTool({
  name: '水印',
  path: '/watermark',
  description: '图片加水印',
  keywords: ['color', 'converter'],
  component: () => import('./watermark.vue'),
  icon: Palette,
  redirectFrom: ['/watermark'],
});
