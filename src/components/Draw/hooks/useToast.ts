import { useCallback } from 'react';
import toast from 'react-hot-toast';

const useToast = () => {
  const error = useCallback((text: string) => {
    toast(text,
      {
        duration: 1500,
        // icon: 'err',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      }
    );
  }, [])

  return {
    error
  }
}
export default useToast
