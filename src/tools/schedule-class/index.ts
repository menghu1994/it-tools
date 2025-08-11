import { BellRinging } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: 'ScheduleClass',
  path: '/schedule-class',
  description: translate('tools.schedule-class.description'),
  keywords: ['schedule', 'web', 'class', 'custom'],
  component: () => import('./schedule-class.vue'),
  icon: BellRinging,
  createdAt: new Date('2025-08-11'),
});
