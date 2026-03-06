import { AlignJustified } from '@vicons/tabler';
import { defineTool } from '../tool';


export const tool = defineTool({
  name: 'YAML格式化',
  path: '/yaml-prettify',
  description: '将YAML字符串修饰为友好的可读格式。',
  keywords: ['yaml', 'viewer', 'prettify', 'format'],
  component: () => import('./yaml-viewer.vue'),
  icon: AlignJustified,
  createdAt: new Date('2024-01-31'),
});
