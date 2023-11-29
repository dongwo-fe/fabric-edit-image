declare const useClipImage: () => {
    saveClipImage: () => Promise<void>;
    cancelClipImage: () => void;
};
export default useClipImage;
