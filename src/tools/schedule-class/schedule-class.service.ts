export { parseBookmarks };

function parseBookmarks (htmlContent: string): { treeBookmarks: any[] } | undefined{
  const parser = new DOMParser()
  const doc = parser.parseFromString(htmlContent, 'text/html')

  // 获取最外层的DL元素
  const dlElements = doc.querySelectorAll('dl')
  if (!dlElements.length) {return}

  // 从根DL开始解析
  const rootDl = dlElements[0];
  const treeBookmarks = parseDlElement(rootDl);

  return {
    treeBookmarks,
    // flattenedBookmarks: flattenBookmarks(treeBookmarks),
  }
}

// 解析DL元素（文件夹）
function parseDlElement (dlElement: any): any[] {
  const children = []
  let currentNode = dlElement.firstElementChild

  while (currentNode) {
    if (currentNode.nodeName === 'DT') {
      const firstChild = currentNode.firstElementChild

      if (firstChild.nodeName === 'H3') {
        // 文件夹节点
        const folder: any = {
          type: 'folder',
          title: firstChild.textContent.trim(),
          addDate: firstChild.getAttribute('add_date') || null,
          lastModified: firstChild.getAttribute('last_modified') || null,
          children: []
        }

        // 查找子DL
        let nextNode = firstChild.nextElementSibling
        while (nextNode) {
          if (nextNode.nodeName === 'DL') {
            folder.children = parseDlElement(nextNode)
            break
          }
          nextNode = nextNode.nextElementSibling
        }

        children.push(folder)
      } else if (firstChild.nodeName === 'A') {
        // 书签节点
        const bookmark = {
          type: 'bookmark',
          title: firstChild.textContent.trim(),
          url: firstChild.getAttribute('href'),
          addDate: firstChild.getAttribute('add_date') || null,
          icon: firstChild.getAttribute('icon') || null
        }
        children.push(bookmark)
      }
    }

    currentNode = currentNode.nextElementSibling
  }

  return children
}


// 将树状结构扁平化
function flattenBookmarks (tree: any[], path: any[] = [], result: any[] = []) {
  tree.forEach(item => {
    if (item.type === 'folder') {
      flattenBookmarks(item.children, [...path, item.title], result)
    } else {
      result.push({
        ...item,
        path: [...path]
      })
    }
  })
  return result
}