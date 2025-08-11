import { Bookmark } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: 'Bookmark',
  path: '/bookmark',
  description: translate('tools.color-converter.description'),
  keywords: ['bookmark', 'web', 'converter', 'custom'],
  component: () => import('./bookmark.vue'),
  icon: Bookmark,
  createdAt: new Date('2025-08-11'),
});
