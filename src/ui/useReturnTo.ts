import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router';
import type { ReturnState } from '@/app/paths';

export function useReturnTo(): (target: string) => void {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as ReturnState | null)?.from;
  return useCallback(
    (target: string) => {
      if (from === target && location.key !== 'default') void navigate(-1);
      else void navigate(target, { replace: true });
    },
    [from, location.key, navigate],
  );
}
