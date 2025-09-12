import { Qrcode } from '@vicons/tabler';
import { defineTool } from '../tool';


export const tool = defineTool({
  name: '二维码生成器',
  path: '/qrcode-generator',
  description: '生成并下载url或文本的QR代码，并自定义背景和前景颜色。',
  keywords: ['qr', 'code', 'generator', 'square', 'color', 'link', 'low', 'medium', 'quartile', 'high', 'transparent'],
  component: () => import('./qr-code-generator.vue'),
  icon: Qrcode,
});
