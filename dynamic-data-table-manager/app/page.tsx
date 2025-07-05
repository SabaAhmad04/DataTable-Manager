'use client';

import React from 'react';
import DataTable from '@/components/DataTable';

export default function HomePage() {
  return (
    <main className="p-4 min-h-screen bg-gray-100 dark:bg-gray-900">
      <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
        Dynamic Data Table Manager
      </h1>
      <DataTable />
    </main>
  );
}
