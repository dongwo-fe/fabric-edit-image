declare type ReFn = (...args: any) => void;
declare type ThFn = (fn: ReFn, timer: number) => ReFn;
export declare const throttle: ThFn;
export declare function uuid(): string;
export declare function retainNumber(value: string | number): string;
export declare function arrayMoveMutable(array: Array<any>, fromIndex: number, toIndex: number): void;
export declare function arrayMoveImmutable(array: Array<any>, fromIndex: number, toIndex: number): any[];
export {};
