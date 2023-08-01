export interface CoverOrderListItem {
  icon: string
  activeIcon: string
  title: string
  key: string
}

export const coverOrderList: Array<CoverOrderListItem> = [
  {
    icon: 'https://ossprod.jrdaimao.com/file/1690802981178203.svg',
    activeIcon: 'https://ossprod.jrdaimao.com/file/1690430789758861.svg',
    title: '上移一层',
    key: 'up'
  },
  {
    icon: 'https://ossprod.jrdaimao.com/file/1690430798470387.svg',
    activeIcon: 'https://ossprod.jrdaimao.com/file/1690803025753461.svg',
    title: '移到顶层',
    key: 'upTop'
  },
  {
    icon: 'https://ossprod.jrdaimao.com/file/1690430807961422.svg',
    activeIcon: 'https://ossprod.jrdaimao.com/file/1690803032757409.svg',
    title: '下移一层',
    key: 'down'
  },
  {
    icon: 'https://ossprod.jrdaimao.com/file/1690430815475268.svg',
    activeIcon: 'https://ossprod.jrdaimao.com/file/1690803040084442.svg',
    title: '移到底层',
    key: 'downTop'
  }
]
