import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router';

export function useGoBack(fallback: string): () => void {
  const navigate = useNavigate();
  const location = useLocation();
  return useCallback(() => {
    if (location.key !== 'default') void navigate(-1);
    else void navigate(fallback, { replace: true });
  }, [navigate, location.key, fallback]);
}
