import React from 'react';
import { AdminLoader } from '@/components/ui/AdminLoader';

export default function AdminLoading() {
  return (
    <AdminLoader
      variant="fullscreen"
      title="JTC COMMAND TERMINAL"
      subtitle="Loading admin dashboard view..."
    />
  );
}
