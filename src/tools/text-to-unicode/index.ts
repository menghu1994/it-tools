import { TextWrap } from '@vicons/tabler';
import { defineTool } from '../tool';


export const tool = defineTool({
  name: '文本转 Unicode',
  path: '/text-to-unicode',
  description: '解析文本并将其转换为 unicode，反之亦然',
  keywords: ['text', 'to', 'unicode'],
  component: () => import('./text-to-unicode.vue'),
  icon: TextWrap,
  createdAt: new Date('2024-01-31'),
});
