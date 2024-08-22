import Header from "@/components/Header";
import ProductList from "@/components/ProductList";
import Sidebar from "@/components/Sidebar"

async function fetchProducts() {
  const response = await fetch(`http://localhost:3000/api/product`);
  return await response.json().then(x => x.data);
}

export default async function Home() {
  const products = await fetchProducts();
  
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <div className="flex-1 bg-muted/40 p-6">
        <Header />
        <ProductList products={products} />
      </div>
    </div>
  );
}