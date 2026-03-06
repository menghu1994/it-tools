import { Bookmark } from '@vicons/tabler';
import { defineTool } from '../tool';


export const tool = defineTool({
  name: '书签编辑器',
  path: '/bookmark',
  description: '编辑浏览器书签',
  keywords: ['bookmark', 'web', 'converter', 'custom'],
  component: () => import('./bookmark.vue'),
  icon: Bookmark,
  createdAt: new Date('2025-08-11'),
});
