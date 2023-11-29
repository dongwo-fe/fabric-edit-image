declare const useAttr: () => {
    getActiveObject: () => import("fabric/fabric-impl").Object | undefined;
    setAttr: (attr: any) => void;
};
export default useAttr;
