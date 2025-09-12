import { List } from '@vicons/tabler';
import { defineTool } from '../tool';


export const tool = defineTool({
  name: 'List 转换器',
  path: '/list-converter',
  description: '该工具可以处理基于数组的数据，并将各种更改（转置、添加前缀和后缀、反向列表、排序列表、小写值、截断值）应用于每一行。',
  keywords: ['list', 'converter', 'sort', 'reverse', 'prefix', 'suffix', 'lowercase', 'truncate'],
  component: () => import('./list-converter.vue'),
  icon: List,
  createdAt: new Date('2023-05-07'),
});
