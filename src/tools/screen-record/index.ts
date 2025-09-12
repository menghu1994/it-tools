import { Palette } from '@vicons/tabler';
import { defineTool } from '../tool';


export const tool = defineTool({
  name: '屏幕录制',
  path: '/screen-record',
  description: '屏幕录像并下载',
  keywords: ['color', 'converter'],
  component: () => import('./screen-record.vue'),
  icon: Palette,
  redirectFrom: ['/screen-record'],
});
