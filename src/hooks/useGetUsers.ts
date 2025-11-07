// hooks/useGetUsers.ts
import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';
import { getAllUsers,deleteUser } from '../../Services/auth';

// === USER TYPES ===
export interface Agent {
  agentId: number;
  agentName: string;
  agentPlan: string;
  agentStatus: string;
  knowledgeBaseId: string;
  llmId: string;
  agentVoice: string;
  agentLanguage: string;
  createdAt: string;
  agentCreatedBy: string;
  agentWidgetDomain: string;
}

export interface Business {
  businessId: number;
  businessName: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  buisnessEmail: string;
  agents: Agent[];
}

export interface UserList {
  userId: number;
  userName: string;
  userEmail: string;
  referredBy: string | null;
  referralCode: string | null;
  createdAt: string;
  updatedAt: string;
  businesses: Business[];
}

// === SWR KEY ===
const USERS_KEY = 'api/user/list';

// === GET USERS WITH SWR ===
export function useGetUsers() {
  const { data, error, isLoading, isValidating } = useSWR(
    USERS_KEY,
    async () => {
      const result = await getAllUsers();
      return { users: result.data }; // match SWR structure
    },
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  );

  return useMemo(
    () => ({
      users: data?.users as UserList[] | undefined,
      usersLoading: isLoading,
      usersError: error,
      usersValidating: isValidating,
      usersEmpty: !isLoading && !data?.users?.length
    }),
    [data, error, isLoading, isValidating]
  );
}

// === DELETE USER (Optimistic + Server) ===
export async function deleteUserOptimistic(userId: number) {
  // Optimistic UI
  mutate(
    USERS_KEY,
    (current: any) => ({
      ...current,
      users: current?.users?.filter((u: UserList) => u.userId !== userId)
    }),
    false
  );

  try {
    await deleteUser(userId); // from Services/auth.ts
    mutate(USERS_KEY); // Revalidate
  } catch (error) {
    console.error('Delete failed, rolling back');
    mutate(USERS_KEY); // Rollback
    throw error;
  }
}