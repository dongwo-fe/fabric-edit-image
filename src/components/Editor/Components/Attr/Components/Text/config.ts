export interface TextAlignItem {
  src: string
  activeSrc: string
  key: string
}

export const textAlignList: Array<TextAlignItem> = [
  {
    src: 'https://ossprod.jrdaimao.com/file/1690963862052534.svg',
    activeSrc: 'https://ossprod.jrdaimao.com/file/1690963932538814.svg',
    key: 'left'
  },
  {
    src: 'https://ossprod.jrdaimao.com/file/1690963869720196.svg',
    activeSrc: 'https://ossprod.jrdaimao.com/file/1690963940992258.svg',
    key: 'center'
  },
  {
    src: 'https://ossprod.jrdaimao.com/file/1690963877465292.svg',
    activeSrc: 'https://ossprod.jrdaimao.com/file/1690963948610334.svg',
    key: 'right'
  },
  {
    src: 'https://ossprod.jrdaimao.com/file/1690963884592828.svg',
    activeSrc: 'https://ossprod.jrdaimao.com/file/1690963958787177.svg',
    key: 'justify'
  }
]
export const textStyleList = [
  {
    label: '常规',
    value: 'normal'
  },
  {
    label: '粗体',
    value: 600
  },
  // {
  //   label: '细体',
  //   value: 400
  // }
]
