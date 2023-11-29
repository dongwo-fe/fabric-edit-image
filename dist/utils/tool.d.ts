export declare const loadImage: (src: string) => Promise<unknown>;
/**
 * 预加载图片多张
 * @param list
 */
export declare const loadImageList: (list: Array<string>) => Promise<unknown[]>;
/**
 * base64转file
 * @param {string} urlData base64格式图片
 * @returns
 */
export declare function base64ConvertFile(urlData: string): File;
