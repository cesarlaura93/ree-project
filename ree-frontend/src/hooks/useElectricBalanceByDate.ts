import { useQuery } from '@apollo/client';
import { GET_ELECTRIC_BALANCE_BY_DATE } from '@/graphql/queries';
import { ElectricBalanceData } from '@/graphql/types';

export const useElectricBalanceByDate = (date: string) => {
  const { data, loading, error, refetch } = useQuery(GET_ELECTRIC_BALANCE_BY_DATE, {
    variables: { date },
    notifyOnNetworkStatusChange: true,
    skip: !date,
  });
  
  return {
    electricBalanceData: data?.electricBalanceByDate as ElectricBalanceData[] || [],
    loading,
    error,
    refetch,
  };
};