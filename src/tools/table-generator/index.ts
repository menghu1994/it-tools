import { EyeTable } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.table-generator.title'),
  path: '/table-generator',
  description: translate('tools.table-generator.description'),
  keywords: ['table', 'converter'],
  component: () => import('./table-generator.vue'),
  icon: EyeTable,
  redirectFrom: ['/table-generator'],
});
