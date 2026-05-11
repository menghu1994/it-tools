import { Notebook } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: '记事本',
  path: '/note-book',
  description: '记录生活、学习、工作中的想法和资料。',
  keywords: ['note', 'daily', 'diary'],
  component: () => import('./note-book.vue'),
  icon: Notebook,
  redirectFrom: ['/note-book'],
  meta: { needLogin: true },
  children: [],
});
