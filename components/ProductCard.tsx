'use client'

import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FilePenIcon, TrashIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthProvider';

const ProductCard = ({ product }: { product: any }) => {
  const { token } = useAuth();

  return (
    <Card key={product.id}>
      <CardHeader>
        <img
          src={product.image || '/placeholder.svg'}
          alt={product.name}
          width={300}
          height={200}
          className="rounded-md object-cover w-full"
          style={{ aspectRatio: '300/200', objectFit: 'cover' }}
        />
      </CardHeader>
      <CardContent>
        <div className="font-medium text-lg">{product.name}</div>
        <div className="text-muted-foreground">${product.price}</div>
      </CardContent>
      <CardFooter>
        <div className="flex items-center justify-between">
          <Badge variant="outline">{product.active ? 'In Stock' : 'Out of Stock'}</Badge>
          {token && (
            <div className="flex items-center gap-2">
              <Button size="icon" variant="ghost">
                <FilePenIcon className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost">
                <TrashIcon className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
