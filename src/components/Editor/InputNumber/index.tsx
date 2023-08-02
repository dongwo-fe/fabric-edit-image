import React from 'react'
import styles from './index.module.scss'
import { retainNumber } from '../../../utils/utils';

interface InputNumberProps {
  value: string | number
  onChange: (value: string | number) => void
}

const InputNumber: React.FC<InputNumberProps> = ({value, onChange: callback}) => {
  const onChange = (e: { target: { value: string } }) => {
    const value = retainNumber(e.target.value)
    callback(value)
  }
  return (
    <div className={styles.inputNumber}>
      <input value={value} onChange={onChange}/>
      <span className={styles.control}>
        <img src="https://ossprod.jrdaimao.com/file/1690962892247333.svg" alt=""/>
        <img src="https://ossprod.jrdaimao.com/file/1690962924824666.svg" alt=""/>
      </span>
    </div>
  )
}

export default InputNumber
