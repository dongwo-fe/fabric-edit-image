// @ts-nocheck
import { useCallback, useContext, useEffect, useState } from 'react'
import { getFontManage } from '../../../api/text'
import useAttr from './useAttr'
import FontFaceObserver from 'fontfaceobserver'
import {Context} from '../../Editor/Context';

const Font = new Map()
let globalFontList = null

const useChangeFontFamily = () => {
  const {setAttr} = useAttr()
  const {setLoading} = useContext(Context)
  const [fontList, setFontList] = useState([])

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
  const loadFont = () => {

  }
  return {
    fontList,
    runChange,
    loadFont
  }
}

export default useChangeFontFamily
