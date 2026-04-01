import { Palette } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: '拼豆图片',
  path: '/bead-pattern',
  description: '上传图片自动生成拼豆图，支持 A4 打印',
  keywords: ['image', 'bead', 'pixel', 'print', 'a4'],
  component: () => import('./bead-pattern.vue'),
  icon: Palette,
  redirectFrom: ['/bead-pattern'],
  createdAt: new Date('2026-04-01'),
});
