/**
 * 加减乘除
 * 为了实现常用数字加减乘除的精准运算，下列封装了函数，主要思路是，先将小数点右移，
 * 将算式两边的数变成整数再进行运算，得到运算结果后，再将小数点左移回去。
 */

export function add(num1: number, num2: number) {
  const num1Digits = (num1.toString().split('.')[1] || '').length
  const num2Digits = (num2.toString().split('.')[1] || '').length
  const baseNum = Math.pow(10, Math.max(num1Digits, num2Digits))
  return (multiply(num1, baseNum) + multiply(num2, baseNum)) / baseNum
}

export function subtract(num1: number, num2: number) {
  const num1Digits = (num1.toString().split('.')[1] || '').length
  const num2Digits = (num2.toString().split('.')[1] || '').length
  const baseNum = Math.pow(10, Math.max(num1Digits, num2Digits))
  return (multiply(num1, baseNum) - multiply(num2, baseNum)) / baseNum
}

export function multiply(num1: number, num2: number) {
  const num1String = num1.toString()
  const num2String = num2.toString()
  const num1Digits = (num1String.split('.')[1] || '').length
  const num2Digits = (num2String.split('.')[1] || '').length
  const baseNum = Math.pow(10, num1Digits + num2Digits)
  return Number(num1String.replace('.', '')) * Number(num2String.replace('.', '')) / baseNum
}

export function divide(num1: number, num2: number) {
  const num1String = num1.toString()
  const num2String = num2.toString()
  const num1Digits = (num1String.split('.')[1] || '').length
  const num2Digits = (num2String.split('.')[1] || '').length
  const baseNum = Math.pow(10, num1Digits + num2Digits)
  const n1 = multiply(num1, baseNum)
  const n2 = multiply(num2, baseNum)
  return Number(n1) / Number(n2)
}

export function floatRound(num: number, len = 0) {
  const n = divide(Math.round(multiply(num, Math.pow(10, len))), Math.pow(10, len))
  return n.toFixed(len)
}

