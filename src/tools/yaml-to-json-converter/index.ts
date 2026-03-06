import { AlignJustified } from '@vicons/tabler';
import { defineTool } from '../tool';


export const tool = defineTool({
  name: 'YAML到JSON转换器',
  path: '/yaml-to-json-converter',
  description: '使用此在线转换器将YAML转换为JSON。',
  keywords: ['yaml', 'to', 'json'],
  component: () => import('./yaml-to-json.vue'),
  icon: AlignJustified,
  createdAt: new Date('2023-04-10'),
});
