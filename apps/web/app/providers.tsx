'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import ToastContainer from '../components/shared/ToastContainer';
import ConfirmDialog from '../components/shared/ConfirmDialog';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ToastContainer />
      <ConfirmDialog />
    </QueryClientProvider>
  );
}
