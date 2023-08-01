type ReFn = (...args: any) => void
type ThFn = (fn: ReFn, timer: number) => ReFn
export const throttle: ThFn = (fn, timer) => {
  let time: any = null
  return (...args: any) => {
    if (time) clearTimeout(time)
    time = setTimeout(() => {
      // @ts-ignore
      fn.apply(this, args)
    }, timer)
  }
}

export function uuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export function retainNumber(value: string | number): string {
  return ('' + value).replace(/[^0-9]/g, '')
}

