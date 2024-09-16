'use client';

import { PlusIcon } from 'lucide-react';
import Link from 'next/link';
import ProductCard from './ProductCard';

const ProductList = ({ products }: { products: any[] }) => {
  if (!products || products.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <Link href="/products/new" className="flex flex-col items-center justify-center border-2 border-dashed border-primary rounded-lg p-6 bg-primary/10 hover:bg-primary/20 transition">
          <PlusIcon className="h-12 w-12 text-primary" />
          <p className="text-primary mt-2 font-semibold">No products found. Click here to create a new product.</p>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductList;
