export interface AlignTypeListItem {
  icon: string
  activeIcon: string
  title: string
  key: string
}


export const alignTypeList: Array<AlignTypeListItem> = [
  {
    icon: 'https://ossprod.jrdaimao.com/file/1690799178088909.svg',
    activeIcon: 'https://ossprod.jrdaimao.com/file/1690802921403421.svg',
    title: '左对齐',
    key: 'left'
  },
  {
    icon: 'https://ossprod.jrdaimao.com/file/1690429259779371.svg',
    activeIcon: 'https://ossprod.jrdaimao.com/file/1690799287561375.svg',
    title: '顶对齐',
    key: 'top'
  },
  {
    icon: 'https://ossprod.jrdaimao.com/file/1690429281715912.svg',
    activeIcon: 'https://ossprod.jrdaimao.com/file/1690799296804215.svg',
    title: '左右居中对齐',
    key: 'alignCenter'
  },
  {
    icon: 'https://ossprod.jrdaimao.com/file/1690429302732969.svg',
    activeIcon: 'https://ossprod.jrdaimao.com/file/169079930793443.svg',
    title: '上下居中对齐',
    key: 'middleCenter'
  },
  {
    icon: 'https://ossprod.jrdaimao.com/file/1690429331770745.svg',
    activeIcon: 'https://ossprod.jrdaimao.com/file/1690799316293458.svg',
    title: '右对齐',
    key: 'right'
  },
  {
    icon: 'https://ossprod.jrdaimao.com/file/169042936033629.svg',
    activeIcon: 'https://ossprod.jrdaimao.com/file/1690799325119567.svg',
    title: '底对齐',
    key: 'bottom'
  }
]
