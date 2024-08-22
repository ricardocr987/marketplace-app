'use client'

import { PlusIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthProvider';

const Header = () => {
  const { token } = useAuth();

  return (
    <div className="flex items-center justify-between mb-6">
      {token && (
        <div className="flex items-center gap-2">
          <Input
            type="search"
            placeholder="Search products..."
            className="bg-background rounded-md px-4 py-2 text-sm"
          />
          <Button size="sm">
            <PlusIcon className="h-4 w-4 mr-2" />
            New Product
          </Button>
        </div>
      )}
    </div>
  );
};

export default Header;
