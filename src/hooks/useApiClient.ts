import { useAuth0 } from '@auth0/auth0-react';
import { useState, useCallback } from 'react';
import { ShiftState, ShiftRecord } from '../types';

const API_BASE_URL = '/.netlify/functions';

type ApiClient = {
  submitShift: (shiftData: ShiftState) => Promise<{ documentId: string }>;
  getShifts: () => Promise<ShiftRecord[]>;
  loading: boolean;
  error: Error | null;
};

export function useApiClient(): ApiClient {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { getAccessTokenSilently } = useAuth0();

  const getHeaders = useCallback(async () => {
    const token = await getAccessTokenSilently();
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }, [getAccessTokenSilently]);

  const submitShift = useCallback(
    async (shiftData: ShiftState) => {
      setLoading(true);
      setError(null);
      try {
        const headers = await getHeaders();
        const response = await fetch(`${API_BASE_URL}/submit-shift`, {
          method: 'POST',
          headers,
          body: JSON.stringify(shiftData),
        });

        if (!response.ok) {
          const errorBody = await response.json();
          throw new Error(errorBody.error || 'Failed to submit shift report.');
        }

        return await response.json();
      } catch (e) {
        setError(e as Error);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [getHeaders]
  );

  const getShifts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const headers = await getHeaders();
      const response = await fetch(`${API_BASE_URL}/get-shifts`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.error || 'Failed to fetch shifts.');
      }

      return await response.json() as ShiftRecord[];
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [getHeaders]);

  return { submitShift, getShifts, loading, error };
}
