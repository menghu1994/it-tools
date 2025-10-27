import {blogRoutes} from './blog-route'

function convertBlogToRoutesArray(blogStructureArray, options = {}) {
  const {
    basePath = '/blog',
    importBasePath = '../../public/blog',
    defaultFiles = ['index.md', 'README.md'],
    useDynamicImport = true,
    routeNameTransformer = (name) => name.replace(/\//g, '-'),
    pathTransformer = (path) => path.toLowerCase()
  } = options;

  function processNodes(nodes, currentPath = '', depth = 0) {
    return nodes.map(node => {
      const isFile = node.title.match(/\.(md|mdx|txt|html)$/);
      const nodeName = isFile ? node.title.replace(/\.(md|mdx|txt|html)$/, '') : node.title;
      const nodePath = pathTransformer(`${currentPath}/${nodeName}`);

      // 构建路由节点
      const routeNode = {
        path: nodePath,
        name: routeNameTransformer(nodePath.slice(1)),
        title: nodeName,
        meta: {
          isFile,
          isBlog: true,
          depth,
          originalTitle: node.title
        }
      };

      // 处理文件节点
      if (isFile) {
        if (useDynamicImport) {
          routeNode.component = "() => import('@/blog/blog-view.vue')";
        } else {
          routeNode.component = `${importBasePath}${currentPath}/${node.title}`;
        }
      }
      // 处理目录节点
      else if (node.children && node.children.length > 0) {
        routeNode.children = processNodes(node.children, `${currentPath}/${node.title}`, depth + 1);

        // 查找默认文件
        const defaultFileNode = node.children.find(child =>
          defaultFiles.includes(child.title)
        );

        if (defaultFileNode) {
          if (useDynamicImport) {
            routeNode.component = "() => import('@/blog/blog-view.vue')";
          } else {
            routeNode.component = `${importBasePath}${currentPath}/${node.title}/${defaultFileNode.title}`;
          }
        }
      }

      return routeNode;
    });
  }

  return processNodes(blogStructureArray, basePath);
}

const routes = convertBlogToRoutesArray(blogRoutes);

export default routes;
