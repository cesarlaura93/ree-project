import { useQuery } from '@apollo/client';
import { GET_REE_ENTITIES } from '@/graphql/queries';
import { ReeEntity } from '@/graphql/types';

export const useReeEntities = () => {
  const { data, loading, error } = useQuery(GET_REE_ENTITIES);
  
  return {
    reeEntities: data?.reeEntities as ReeEntity[] || [],
    loading,
    error,
  };
};