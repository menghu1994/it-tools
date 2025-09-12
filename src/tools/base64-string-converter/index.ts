import { FileDigit } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Base64 字符串编码/解码',
  path: '/base64-string-converter',
  description: '将字符串编码和解码为其 Base64 格式表示形式即可。',
  keywords: ['base64', 'converter', 'conversion', 'web', 'data', 'format', 'atob', 'btoa'],
  component: () => import('./base64-string-converter.vue'),
  icon: FileDigit,
  redirectFrom: ['/file-to-base64', '/base64-converter'],
});
