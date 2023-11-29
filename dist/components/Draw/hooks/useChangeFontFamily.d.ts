/**
 * 过滤出非通用字体
 * @param list
 */
export declare const filterToText: (list: any) => any[];
declare const useChangeFontFamily: () => {
    fontList: never[];
    runChange: (item: any) => Promise<void> | undefined;
    loadFont: (objectsData: any) => Promise<void> | Promise<unknown[]>;
    fontLoaded: boolean;
};
export default useChangeFontFamily;
