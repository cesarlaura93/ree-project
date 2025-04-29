import { useQuery } from '@apollo/client';
import { GET_ELECTRIC_BALANCE } from '@/graphql/queries';
import { ElectricBalanceData } from '@/graphql/types';

export const useElectricBalance = (startDate: string, endDate: string, energyType: string = '') => {
  const { data, loading, error, refetch } = useQuery(GET_ELECTRIC_BALANCE, {
    variables: { startDate, endDate, energyType },
    notifyOnNetworkStatusChange: true,
    skip: !startDate || !endDate,
  });
  
  return {
    electricBalanceData: data?.electricBalance as ElectricBalanceData[] || [],
    loading,
    error,
    refetch,
  };
};