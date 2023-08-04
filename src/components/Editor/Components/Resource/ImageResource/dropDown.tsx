// @ts-nocheck
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { saveAs } from 'file-saver';
import { delstock } from '../../../../../api/image';
import { Context } from '../../../Context';

let shareEl = null

export const useDropDown = () => {
  const clickRef = useRef()
  const cacheItem = useRef()
  const [show, setShow] = useState(false)
  const {setLoading} = useContext(Context)

  useEffect(() => {
    const el = document.querySelector('#img-file-list')
    if (!el) return
    if (show) {
      el.style.overflow = 'hidden'
    } else {
      el.style.overflow = 'auto'
    }
  }, [show])
  useEffect(() => {
    window.addEventListener('click', removeEl)
    return () => {
      window.removeEventListener('click', removeEl)
    }
  }, [])

  const removeEl = useCallback((e) => {
    if (e?.target === clickRef?.current) return
    if (shareEl) {
      document.body.removeChild(shareEl)
      shareEl = null
      setShow(false)
    }
  }, [])
  const onClick = async (e) => {
    // e.stopPropagation()
    if (!e.target || !cacheItem.current) return
    const {imgSrc, stockName, _id, callback} = cacheItem.current
    if (e.target.innerHTML === '下载') {
      saveAs(imgSrc, `${stockName}${imgSrc.slice(imgSrc.lastIndexOf('.'))}`)
    }
    if (e.target.innerHTML === '删除') {
      try {
        setLoading(true)
        await delstock({id: _id})
        await callback?.()
        setLoading(false)
      } catch (err) {
        setLoading(false)
      }
    }
  }
  const run = (e: any, item: any) => {
    setShow(true)
    cacheItem.current = item
    if (shareEl) {
      document.body.removeChild(shareEl)
      shareEl = null
    }
    clickRef.current = e.target;
    const parentNode = e.target.parentNode
    const {top, left} = parentNode.getBoundingClientRect()
    const div = shareEl = document.createElement('div')
    div.addEventListener('click', onClick)
    div.innerHTML = `<div class='customMenu' style='left:${left + parentNode.offsetWidth + 10}px;top:${top}px'>
<!--    <div class='editName'>-->
<!--      <span>某某文件名...名称.png</span>-->
<!--      <img src="https://ossprod.jrdaimao.com/file/1690528866207938.svg" alt=""/>-->
<!--    </div>-->
    <div class='buttons'>
      <div>下载</div>
      <div>删除</div>
    </div>
  </div>`
    document.body.appendChild(div)
  }
  return {
    run
  }
}
