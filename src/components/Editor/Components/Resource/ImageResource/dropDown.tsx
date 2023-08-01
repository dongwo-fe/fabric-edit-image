// @ts-nocheck
import React, { useCallback, useEffect, useRef } from 'react';

let shareEl = null

export const useDropDown = () => {
  const clickRef = useRef()
  const removeEl = useCallback((e) => {
    if (e?.target === clickRef?.current) return
    if (shareEl) {
      document.body.removeChild(shareEl)
      shareEl = null
    }
  }, [])
  useEffect(() => {
    window.addEventListener('click', removeEl)
    return () => {
      window.removeEventListener('click', removeEl)
    }
  }, [])
  const run = (e: any, item: any) => {
    removeEl()
    clickRef.current = e.target;
    const parentNode = e.target.parentNode
    const {top, left} = parentNode.getBoundingClientRect()
    const div = shareEl = document.createElement('div')
    div.innerHTML = `<div class='customMenu' style='left:${left + parentNode.offsetWidth + 10}px;top:${top}px'>
    <div class='editName'>
      <span>某某文件名...名称.png</span>
      <img src="https://ossprod.jrdaimao.com/file/1690528866207938.svg" alt=""/>
    </div>
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
