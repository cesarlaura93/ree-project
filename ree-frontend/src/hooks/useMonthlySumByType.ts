import { useQuery } from '@apollo/client';
import { GET_MONTHLY_SUM_BY_TYPE } from '@/graphql/queries';
import { MonthlySumData } from '@/graphql/types';

export const useMonthlySumByType = (
  startYear: number,
  startMonth: number,
  endYear: number,
  endMonth: number
) => {
  const { data, loading, error, refetch } = useQuery(GET_MONTHLY_SUM_BY_TYPE, {
    variables: { startYear, startMonth, endYear, endMonth },
    notifyOnNetworkStatusChange: true,
  });
  
  return {
    monthlySumData: data?.monthlySumByType as MonthlySumData[] || [],
    loading,
    error,
    refetch,
  };
};