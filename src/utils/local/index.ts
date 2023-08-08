/**
 * local crud
 */
import { isObject } from '../index';


export const getLocal = (key: string) => {
  const value = localStorage.getItem(key);
  if (value) {
    return JSON.parse(value)
  }
  return value
}

export const setLocal = (key: string, value: any) => {
  if (isObject(value)) {
    localStorage.setItem(key, JSON.stringify(value))
    return
  }
  localStorage.setItem(key, value)
}

export const removeLocal = (key: string) => {
  localStorage.removeItem(key)
}

export const clearLocal = () => {
  localStorage.clear()
}
