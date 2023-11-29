import React from 'react';
interface EditorContext {
    attrTab: string;
    setAttrTab: (value: string) => void;
    loading: boolean;
    setLoading: (value: boolean) => void;
    loadingText: string;
    setLoadingText: (value: string) => void;
}
export declare const Context: React.Context<EditorContext>;
export declare const EditorProvider: React.FC;
export {};
