import ImageResource from '../Components/Resource/ImageResource'
import TextResource from '../Components/Resource/TextResource';

export type ResourceNavItem = {
  title: string
  icon: string
  activeIcon: string
  key: string
}

export const ResourceTypeEnum = {
  ALREADY_UPLOAD: 'alreadyUpload',
  TEXT: 'i-text'
}

export const resourceNavList = [
  {
    title: '已上传',
    icon: 'https://ossprod.jrdaimao.com/file/1690351687096238.svg',
    activeIcon: 'https://ossprod.jrdaimao.com/file/1690351735822596.svg',
    key: ResourceTypeEnum.ALREADY_UPLOAD
  },
  {
    title: '文 字',
    icon: 'https://ossprod.jrdaimao.com/file/1690351715036668.svg',
    activeIcon: 'https://ossprod.jrdaimao.com/file/1690351759741179.svg',
    key: ResourceTypeEnum.TEXT
  }
]

export const ResourceContentComEnum = {
  [ResourceTypeEnum.ALREADY_UPLOAD]: ImageResource,
  [ResourceTypeEnum.TEXT]: TextResource
}
export const DefaultSelectKey = ResourceTypeEnum.ALREADY_UPLOAD
