export type BookmarkType = 'folder' | 'bookmark'

export interface Bookmark {
  type: BookmarkType
  title: string
  addDate?: string
  lastModified?: string
  url?: string
  children?: Bookmark[]
}
