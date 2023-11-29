/// <reference types="react" />
export interface AttrTabListItem {
    title: string;
    key: string;
    bg: string;
}
export declare const attrTabList: Array<AttrTabListItem>;
export declare const attrAreaComponent: {
    image: () => import("react").JSX.Element;
    'i-text': () => import("react").JSX.Element;
};
export declare const DefaultKey = "Attr";
