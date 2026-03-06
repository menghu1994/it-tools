import { ArrowsLeftRight } from '@vicons/tabler';
import { defineTool } from '../tool';


export const tool = defineTool({
  name: '整数基转换器',
  path: '/base-converter',
  description: '在不同的基数（十进制、十六进制、二进制、八进制、base64…）之间转换数字',
  keywords: ['integer', 'number', 'base', 'conversion', 'decimal', 'hexadecimal', 'binary', 'octal', 'base64'],
  component: () => import('./integer-base-converter.vue'),
  icon: ArrowsLeftRight,
});
