// @ts-nocheck
import React, { useEffect, useRef, useState } from 'react'
import styles from './index.module.scss'
import { retainNumber } from '../../../utils/utils';

interface InputNumberProps {
  value: string | number
  onChange: (value: string | number) => void
}

const InputNumber: React.FC<InputNumberProps> = ({value, onChange: callback}) => {
  const [number, setNumber] = useState(value)
  const last = useRef()
  last.current = number
  const inputRef = useRef()

  useEffect(() => {
    setNumber(value)
  }, [value])

  useEffect(() => {
    inputRef.current?.addEventListener('keydown', keyDownChange)
    return () => {
      inputRef.current?.removeEventListener('keydown', keyDownChange)
    }
  }, [value, callback])

  const keyDownChange = (e) => {
    if (e.key === 'ArrowUp') {
      add()
    } else if (e.key === 'ArrowDown') {
      sub()
    }
  }
  const onNumberChange = (e: { target: { value: string }, preventDefault: () => {} }) => {
    const value = retainNumber(e.target.value)
    setNumber(value)
    callback(value)
  }
  const add = () => {
    const n = +last.current + 1
    setNumber(n)
    callback(n)
  }
  const sub = () => {
    if (last.current <= 12) return
    const n = +last.current - 1
    setNumber(n)
    callback(n)
  }
  return (
    <div className={styles.inputNumber}>
      <input ref={inputRef} value={number} onChange={onNumberChange}/>
      <span className={styles.control}>
        <span onClick={add}>
          <img src="https://ossprod.jrdaimao.com/file/1690962892247333.svg" alt=""/>
          <img src="https://ossprod.jrdaimao.com/file/1691034645816626.svg" alt=""/>
        </span>
        <span onClick={sub}>
          <img src="https://ossprod.jrdaimao.com/file/1690962924824666.svg" alt=""/>
          <img src="https://ossprod.jrdaimao.com/file/1691035025689960.svg" alt=""/>
        </span>
      </span>
    </div>
  )
}

export default InputNumber
