import { Language } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: '正则表达实验室',
  path: '/regex-tester',
  description: '',
  keywords: ['regex', 'tester', 'sample', 'expression'],
  component: () => import('./regex-tester.vue'),
  icon: Language,
  createdAt: new Date('2024-09-20'),
});
