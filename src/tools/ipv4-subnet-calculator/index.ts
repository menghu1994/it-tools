import { RouterOutlined } from '@vicons/material';
import { defineTool } from '../tool';


export const tool = defineTool({
  name: 'IPv4子网计算器',
  path: '/ipv4-subnet-calculator',
  description: '解析IPv4 CIDR块，并获取有关子网络的所有所需信息。',
  keywords: ['ipv4', 'subnet', 'calculator', 'mask', 'network', 'cidr', 'netmask', 'bitmask', 'broadcast', 'address'],
  component: () => import('./ipv4-subnet-calculator.vue'),
  icon: RouterOutlined,
});
