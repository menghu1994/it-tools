import { Palette } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: '图片包浆',
  path: '/image-patina',
  description: '',
  keywords: ['color', 'converter'],
  component: () => import('./image-patina.vue'),
  icon: Palette,
  redirectFrom: ['/image-patina'],
});
