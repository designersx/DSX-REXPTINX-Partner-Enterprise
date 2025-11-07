import { useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';
import { getAllUsersByReferralCode } from '../../Services/auth';

const endpoints = {
  key: 'api/customer'
};

export function useGetCustomer() {
  const [referralCode, setReferralCode] = useState<string | null>(null);

  useEffect(() => {
    const storedCode = localStorage.getItem('referralCode');
    if (storedCode) setReferralCode(storedCode);
  }, []);

  const { data, isLoading, error, isValidating, mutate } = useSWR(
    referralCode ? [`${endpoints.key}-${referralCode}`, referralCode] : null,
    async () => {
      const response = await getAllUsersByReferralCode(referralCode);
      return response.users;
    },
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  );

  return useMemo(
    () => ({
      customers: data || [],
      customersLoading: !referralCode || isLoading,
      customersError: error,
      customersValidating: isValidating,
      customersEmpty: !isLoading && (!data || data.length === 0),
      mutate // ✅ mutate is now available
    }),
    [data, error, isLoading, isValidating, referralCode, mutate]
  );
}
