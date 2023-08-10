import { CSSProperties } from 'react';

export type TextListItem = {
  title: string
  key: string
  style: CSSProperties
}

export const textList:Array<TextListItem> = [
  {
    title: '添加标题',
    key: 'addTitle',
    style: {
      fontSize: 20,
      fontWeight: 600
    }
  },
  {
    title: '添加副标题',
    key: 'addSubTitle',
    style: {
      fontSize: 16,
      fontWeight: 600
    }
  },
  {
    title: '添加正文',
    key: 'addText',
    style: {
      fontSize: 14
    }
  },
  {
    title: '添加注释',
    key: 'addAnnotation',
    style: {
      fontSize: 12
    }
  }
]
