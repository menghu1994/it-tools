import { Palette } from '@vicons/tabler';
import { defineTool } from '../tool';


export const tool = defineTool({
  name: '图片编辑器',
  path: '/image-editor',
  description: '图片涂改',
  keywords: ['image', 'editor'],
  component: () => import('./image-editor.vue'),
  icon: Palette,
  redirectFrom: ['/image-editor'],
});
