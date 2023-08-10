import ImageSpaceAttr from '../Components/Attr/ImageSpaceAttr'
import TextSpaceAttr from '../Components/Attr/TextSpaceAttr';

export interface AttrTabListItem {
  title: string
  key: string
  bg: string
}

export const attrTabList: Array<AttrTabListItem> = [
  {
    title: '属性',
    key: 'Attr',
    bg: 'https://ossprod.jrdaimao.com/file/1690510922616482.svg'
  },
  {
    title: '图层',
    key: 'coverage',
    bg: 'https://ossprod.jrdaimao.com/file/1690511949701720.svg'
  }
]
export const attrAreaComponent = {
  'image': ImageSpaceAttr,
  'textbox': TextSpaceAttr
}
export const DefaultKey = 'Attr'
