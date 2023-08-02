// @ts-nocheck
import React, { useEffect, useState } from 'react'
import style from './index.module.scss'
import Select from 'react-select'
import { ReactSelectStyles, DropdownIndicator } from '../../../../Select'
import InputNumber from '../../../../InputNumber'
import { textAlignList, textStyleList } from './config';
import useAttr from '../../../../../Draw/hooks/useAttr'
import { SketchPicker } from 'react-color'

const ColorPicker: any = SketchPicker

const options = [
  {value: 'chocolate', label: 'Chocolate'},
  {value: 'strawberry', label: 'Strawberry'},
  {value: 'vanilla', label: 'Vanilla'},
];

const TextAttr = () => {
  const [fontSize, setFontSize] = useState('12')
  const [color, setColor] = useState('#000000')
  const [visible, setVisible] = useState(false)
  const [fontWeight, setFontWeight] = useState(false)
  const [underline, setUnderline] = useState(false)
  const [incline, setIncline] = useState(false)
  const [align, setAlign] = useState('')
  const [fontStyle, setFontStyle] = useState<any>(null)
  const {getActiveObject, setAttr} = useAttr()


  useEffect(() => {
    const activeObject = getActiveObject()
    if (!activeObject) return
    setFontSize(activeObject.get('fontSize'))
    setColor(activeObject.get('fill'))
    setUnderline(activeObject.get('underline'))
    setAlign(activeObject.get('textAlign'))
    setIncline(activeObject.get('fontStyle') === 'italic')
    const fontWeight = activeObject.get('fontWeight')
    const isWeight = fontWeight === 'bold' || fontWeight > 500
    setFontWeight(isWeight)
    setFontStyle(isWeight ? textStyleList[1] : textStyleList[0])
  }, [getActiveObject])

  useEffect(() => {
    const el = document.querySelector('#attr-content')
    if (!el) return
    if (visible) {
      el.style.overflow = 'inherit'
    } else {
      el.style.overflow = 'auto'
    }
    return () => {
      el.style.overflow = 'auto'
    }
  }, [visible])
  /**
   * 修改字体大小
   * @param e
   */
  const onFontSizeChange = e => {
    setAttr({fontSize: +e})
    setFontSize(e)
  }

  /**
   * 颜色
   * @param e
   */
  const onChangeComplete = e => {
    setAttr({fill: e.hex})
    setColor(e.hex)
  }
  /**
   * 加粗
   */
  const onWeightChange = () => {
    if (fontWeight) {
      setAttr({fontWeight: 'normal'})
    } else {
      setAttr({fontWeight: 'bold'})
    }
    setFontWeight(prevState => !prevState)
  }

  /**
   * 下划线
   */
  const onUnderlineChange = () => {
    setAttr({underline: !underline})
    setUnderline(prevState => !prevState)
  }

  /**
   * 对齐方式
   * @param item
   */
  const onAlignChange = item => {
    setAttr({textAlign: item.key})
    setAlign(item.key)
  }

  /**
   * 倾斜
   */
  const onInclineChange = () => {
    if (incline) {
      setAttr({fontStyle: 'normal'})
    } else {
      setAttr({fontStyle: 'italic'})
    }
    setIncline(prevState => !prevState)
  }
  const onFontStyleChange = item => {
    setFontStyle(item)
    setAttr({fontWeight: item.value})
  }
  return (
    <div className={style.textArea}>
      <div className={style.title}>文字</div>
      <div className={style.textAreaContent}>
        <div className={style.fontFamily}>
          <Select
            components={{DropdownIndicator}}
            className={style.select}
            styles={ReactSelectStyles}
            isSearchable={false}
            options={options}
          />
          <div className={style.size}>
            <InputNumber
              value={fontSize}
              onChange={onFontSizeChange}
            />
          </div>
        </div>
        <div className={style.color}>
          <Select
            isDisabled
            onChange={onFontStyleChange}
            value={fontStyle}
            components={{DropdownIndicator}}
            className={`${style.select} ${style.disabledSelect}`}
            styles={ReactSelectStyles}
            isSearchable={false}
            options={textStyleList}
          />
          <div className={style.colorContent} onClick={() => setVisible(prevState => !prevState)}>
            <div style={{background: color}}></div>
            <span>{color}</span>
          </div>
        </div>
        <div className={style.style}>
          <div className={style.alignGroup}>
            {
              textAlignList.map(item => {
                return <div
                  className={item.key === align ? style.alignGroupActive : ''}
                  onClick={() => onAlignChange(item)}
                  key={item.key}
                >
                  <img src={item.src} alt=""/>
                  <img src={item.activeSrc} alt=""/>
                </div>
              })
            }
          </div>
          <div className={style.styleGroup}>
            <div onClick={onWeightChange}>
              <div className={fontWeight ? style.styleGroupActive : ''}>
                <img src="https://ossprod.jrdaimao.com/file/1690964441564257.svg" alt=""/>
                <img src="https://ossprod.jrdaimao.com/file/1690964450733564.svg" alt=""/>
              </div>
            </div>
            <div onClick={onInclineChange}>
              <div className={incline ? style.styleGroupActive : ''}>
                <img src="https://ossprod.jrdaimao.com/file/1690971550502930.svg" alt=""/>
                <img src="https://ossprod.jrdaimao.com/file/1690971566471578.svg" alt=""/>
              </div>
            </div>
            {/*行间距，字间距，做不完了，下回再说*/}
            {/*<div style={{cursor: 'not-allowed'}}>*/}
            {/*  <div>*/}
            {/*    <img src="https://ossprod.jrdaimao.com/file/1690964468758155.svg" alt=""/>*/}
            {/*    <img src="https://ossprod.jrdaimao.com/file/1690964475042947.svg" alt=""/>*/}
            {/*  </div>*/}
            {/*</div>*/}
            <div onClick={onUnderlineChange}>
              <div className={underline ? style.styleGroupActive : ''}>
                <img src="https://ossprod.jrdaimao.com/file/1690964614214969.svg" alt=""/>
                <img src="https://ossprod.jrdaimao.com/file/1690964622200366.svg" alt=""/>
              </div>
            </div>
          </div>
        </div>
      </div>
      {
        visible ? <div className={style.fixColorPicker}>
          <ColorPicker
            onChangeComplete={onChangeComplete}
            color={color}
          />
        </div> : null
      }
    </div>
  )
}

export default TextAttr
