import { BrandGit } from '@vicons/tabler';
import { defineTool } from '../tool';


export const tool = defineTool({
  name: 'Git 备忘录',
  path: '/git-memo',
  description: 'Git是一种去中心化的版本管理软件。使用此备忘单，您可以快速访问最常见的git命令.',
  keywords: ['git', 'push', 'force', 'pull', 'commit', 'amend', 'rebase', 'merge', 'reset', 'soft', 'hard', 'lease'],
  component: () => import('./git-memo.vue'),
  icon: BrandGit,
});
