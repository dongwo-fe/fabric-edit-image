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
  if (!value) return '0'
  const result = ('' + value).replace(/[^0-9]/g, '')
  return Number(result) + ''
}

export function colorRGBtoHex(color: string) {
  const rgb = color.split(',');
  const r = parseInt(rgb[0]);
  const g = parseInt(rgb[1]);
  const b = parseInt(rgb[2]);
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

export function arrayMoveMutable(array: Array<any>, fromIndex: number, toIndex: number) {
  const startIndex = fromIndex < 0 ? array.length + fromIndex : fromIndex;

  if (startIndex >= 0 && startIndex < array.length) {
    const endIndex = toIndex < 0 ? array.length + toIndex : toIndex;
    const [item] = array.splice(fromIndex, 1);
    array.splice(endIndex, 0, item);
  }
}

export function arrayMoveImmutable(array: Array<any>, fromIndex: number, toIndex: number) {
  array = [...array];
  arrayMoveMutable(array, fromIndex, toIndex);
  return array;
}
