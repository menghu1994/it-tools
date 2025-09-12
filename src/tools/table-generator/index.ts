import { EyeTable } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: '表格生成器',
  path: '/table-generator',
  description: '自定义表格',
  keywords: ['table', 'converter'],
  component: () => import('./table-generator.vue'),
  icon: EyeTable,
  redirectFrom: ['/table-generator'],
});
