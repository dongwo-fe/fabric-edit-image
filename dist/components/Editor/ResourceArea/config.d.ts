/// <reference types="react" />
export declare type ResourceNavItem = {
    title: string;
    icon: string;
    activeIcon: string;
    key: string;
};
export declare const ResourceTypeEnum: {
    ALREADY_UPLOAD: string;
    TEXT: string;
};
export declare const resourceNavList: {
    title: string;
    icon: string;
    activeIcon: string;
    key: string;
}[];
export declare const ResourceContentComEnum: {
    [x: string]: () => import("react").JSX.Element;
};
export declare const DefaultSelectKey: string;
