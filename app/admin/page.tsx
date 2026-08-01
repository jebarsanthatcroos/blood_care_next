
'use client';

export const dynamic = 'force-static';

import { AdminGuard } from '../component/RouteGuards';
import { AdminPageContent } from './(ui)/AdminPageContent';

export default function AdminPage() {
  return (
    <AdminGuard>
      <AdminPageContent />
    </AdminGuard>
  );
}