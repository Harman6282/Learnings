import Image from "next/image";


export default async function page() {
  const res = await fetch("http://localhost:8080/api/products");
  if (!res.ok) {
    console.log("error loading products");
  }

  const products = await res.json();
  console.log("products", products);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-8">
      {products.map((product) => (
        <div
          key={product.name}
          className="bg-white rounded-2xl shadow hover:shadow-md transition overflow-hidden flex flex-col"
        >
          <div className="relative w-full aspect-[4/3]">
            <Image
              src={`https://do1vbrd2aouom.cloudfront.net/${product.filename}` || ""}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          </div>

          <div className="p-4 flex flex-col gap-2 flex-1">
            <h2 className="text-lg font-semibold text-gray-900">
              {product.name}
            </h2>
            <p className="text-sm text-gray-500 flex-1">
              {product.description}
            </p>
            <p className="text-base font-bold text-gray-800 mt-2">
              ${product.price}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
