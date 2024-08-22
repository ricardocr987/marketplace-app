'use client'
import Link from 'next/link';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { PackageIcon, PlusIcon, MoveVerticalIcon, SettingsIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthProvider';
import Wallet from './Wallet';
import { AvatarIcon } from '@radix-ui/react-icons';

const Sidebar = () => {
  const { token, user } = useAuth();

  return (
    <aside className="bg-background border-r w-64 flex flex-col">
      <div className="flex-1 overflow-auto">
        <nav className="px-4 py-6 space-y-2">
          <div className="font-semibold text-sm text-muted-foreground">Products</div>
          <Link
            href="#"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            prefetch={false}
          >
            <PackageIcon className="h-5 w-5" />
            Products
          </Link>
          {token && (
            <>
              <div className="font-semibold text-sm text-muted-foreground mt-6">Create</div>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                prefetch={false}
              >
                <PlusIcon className="h-5 w-5" />
                New Product
              </Link>
            </>
          )}
        </nav>
      </div>
      {user && (
        <div className="border-t px-4 py-4 flex items-center gap-2">
          <Avatar className="w-8 h-8">
            {user.avatar_url ? 
              <AvatarImage src={user.avatar_url} alt="Avatar" />
            :
              <AvatarIcon className='w-full h-full'/>
            }
          </Avatar>
          <div className="flex-1 min-w-0">
            <Link href={`https://www.solana.fm/address/${user.address}`} rel="noopener noreferrer" target="_blank">
              <div className="text-xs truncate">{user.address}</div>
            </Link>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <SettingsIcon className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
      <Wallet />
    </aside>
  );
};

export default Sidebar;
