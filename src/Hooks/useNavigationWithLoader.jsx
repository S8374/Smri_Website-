import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function useNavigationWithLoader() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        setLoading(true);
        setTimeout(() => {
            navigate(path);
            setLoading(false);
        }, 1000); // Simulated delay (1 second)
    };

    return { loading, handleNavigation };
}
