import React from 'react'
import style from './index.module.scss'

interface InputProps {
  title: string
  afterText?: string | React.ReactElement
  value: string | number
  onChange: (e: { target: { value: string } }) => void
}

const Input: React.FC<InputProps> = (props) => {
  const {title, afterText, value, onChange} = props;
  return (
    <div className={style.customInput}>
      <div className={style.title}>{title}</div>
      <div className={style.inputWrap}>
        <input onChange={onChange} value={value} type="text"/>
        {afterText ?
          React.isValidElement(afterText) ?
            afterText :
            <span>{afterText}</span> : ''}
      </div>
    </div>
  )
}

export default Input
