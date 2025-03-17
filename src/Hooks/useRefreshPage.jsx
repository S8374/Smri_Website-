import { useCallback } from 'react';
const useRefreshPage = () => {
    const refreshPage = useCallback(() => {
        window.location.reload();
    }, []);

    return refreshPage;
};
export default useRefreshPage;
