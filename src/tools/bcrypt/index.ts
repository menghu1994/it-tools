import { LockSquare } from '@vicons/tabler';
import { defineTool } from '../tool';


export const tool = defineTool({
  name: '加密',
  path: '/bcrypt',
  description: '使用bcrypt对文本字符串进行哈希和比较。Bcrypt是一个基于Blowfish密码的密码哈希函数。',
  keywords: ['bcrypt', 'hash', 'compare', 'password', 'salt', 'round', 'storage', 'crypto'],
  component: () => import('./bcrypt.vue'),
  icon: LockSquare,
});
