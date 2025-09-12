import { Language } from '@vicons/tabler';
import { defineTool } from '../tool';


export const tool = defineTool({
  name: 'tools.regexTester.title',
  path: '/regex-tester',
  description: 'tools.regexTester.description',
  keywords: ['regex', 'tester', 'sample', 'expression'],
  component: () => import('./regex-tester.vue'),
  icon: Language,
  createdAt: new Date('2024-09-20'),
});
