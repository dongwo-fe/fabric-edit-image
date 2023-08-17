// @ts-nocheck
import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { getFontManage } from '../../../api/text'
import useAttr from './useAttr'
import FontFaceObserver from 'fontfaceobserver'
import { Context } from '../../Editor/Context';


// 通用字体，不需要加载字体包
const GeneralTextList = ['serif']
// 缓存已经加载过的字体包名称，有重复的引用无需再次架子啊
const Font = new Map()
// 缓存字体列表
let globalFontList = null

/**
 * 过滤出非通用字体
 * @param list
 */
export const filterToText = (list: any) => {
  if (!Array.isArray(list)) return []
  return list.filter((item: any) => item.type === 'i-text' && !GeneralTextList.includes(item.fontFamily))
}


const useChangeFontFamily = () => {
  const {setAttr} = useAttr()
  const {setLoading} = useContext(Context)
  const [fontList, setFontList] = useState([])
  const [fontLoaded, setFontLoaded] = useState(false)
  const useFontListLast = useRef()
  useFontListLast.current = fontList


  useEffect(() => {
    // 缓存处理下，不用每次加载
    (async () => {
      let list = []
      if (globalFontList) {
        list = globalFontList
      } else {
        const res = await getFontManage()
        list = res.map(item => {
          return {
            value: item.key,
            label: item.fontlibName,
            url: item.fontlibfile
          }
        })
      }
      setFontLoaded(true)
      globalFontList = list
      setFontList(list)
    })()
  }, [])
  /**
   * 字体修改
   */
  const runChange = useCallback((item) => {
    // 已经加载过不需要重新加载 直接设置字体
    if (Font.has(item.name)) {
      setAttr({fontFamily: item.name})
      return
    }
    setLoading(true)
    const styleContent = `
     @font-face {
      font-family: ${item.name};
      src: url('${item.src}');
     }`
    const style = document.createElement('style')
    style.innerHTML = styleContent
    document.body.appendChild(style)
    const font = new FontFaceObserver(item.name);
    return font.load(item.name, 2000000).then(function () {
      Font.set(item.name, true)
      setLoading(false)
      console.log('Font is available');
      setAttr({fontFamily: item.name})
    }, function (e) {
      setLoading(false)
      document.body.removeChild(style)
      console.log('Font is not available', e);
    });
  }, [setAttr])
  /**
   * 加载多个字体
   */
  const loadFont = useCallback((objectsData) => {
    if (!objectsData) return Promise.resolve()
    // 拿到需要加载字体包的字体
    const textList = filterToText(objectsData)
    let style = ''
    textList.forEach(item => {
      useFontListLast.current.forEach(r => {
        if (item.fontFamily === r.value && !Font.has(r.value)) {
          style += `@font-face {font-family: ${r.value};src: url('${r.url}');}`
        }
      })
    })
    if (style === '') return Promise.resolve()
    // 组装一下font-face，放到body中
    const el = document.createElement('style')
    el.innerHTML = style
    document.body.appendChild(el)
    // 加载多个字体
    const fontFamiliesAll = textList.map((item) => {
      return new Promise((resolve, reject) => {
        const font = new FontFaceObserver(item.fontFamily);
        font.load(item.fontFamily, 2000000).then(() => {
          Font.set(item.fontFamily, true)
          resolve()
        }).catch(err => {
          reject()
          console.log('loadFont', err)
        })
      })
    });
    return Promise.all(fontFamiliesAll);
  }, [fontList, fontLoaded])


  return {
    fontList,
    runChange,
    loadFont,
    fontLoaded
  }
}

export default useChangeFontFamily
