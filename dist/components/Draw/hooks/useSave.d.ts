declare const useSave: () => {
    saveToJson: () => void;
    saveHistory: () => Promise<import("axios").AxiosResponse<any, any>> | undefined;
    unloadSendBeacon: () => void;
    saveToImage: () => Promise<void>;
};
export default useSave;
