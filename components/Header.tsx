'use client';

import { PlusIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthProvider';
import { useState } from 'react';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import ProductForm from './ProductForm';

const Header = () => {
  const { token } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex items-center justify-between mb-6">
      {token && (
        <div className="flex items-center gap-2">
          <Input
            type="search"
            placeholder="Search products..."
            className="bg-background rounded-md px-4 py-2 text-sm"
          />
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" onClick={() => setIsOpen(true)}>
                <PlusIcon className="h-4 w-4 mr-2" />
                New Product
              </Button>
            </DialogTrigger>
            <DialogContent>
              <ProductForm />
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
};

export default Header;
