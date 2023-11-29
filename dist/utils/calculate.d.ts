/**
 * 加减乘除
 * 为了实现常用数字加减乘除的精准运算，下列封装了函数，主要思路是，先将小数点右移，
 * 将算式两边的数变成整数再进行运算，得到运算结果后，再将小数点左移回去。
 */
export declare function add(num1: number, num2: number): number;
export declare function subtract(num1: number, num2: number): number;
export declare function multiply(num1: number, num2: number): number;
export declare function divide(num1: number, num2: number): number;
export declare function floatRound(num: number, len?: number): string;
