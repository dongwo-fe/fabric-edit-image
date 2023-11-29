declare const useHistory: () => {
    undo: () => void;
    redo: () => void;
    backLength: number;
    forwardLength: number;
};
export default useHistory;
