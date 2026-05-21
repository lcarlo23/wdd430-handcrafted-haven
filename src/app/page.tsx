import ProductRow from "@/components/ProductRow";

export default function Home() {
  return (
    <div className="page-wrapper">
      <main className="main-content">
        
        {/* Row 1: Top Products */}
        <ProductRow 
          rowId="top-products" 
          sectionTitle="Top Products" 
          gridClass="columns-4" 
        />

        {/* Row 2: Featured Handcrafter */}

        {/* Row 3: Seasonal Products */}
        <ProductRow 
          rowId="spring-2026" 
          sectionTitle="Best of spring 2026" 
          gridClass="columns-5" 
        />

      </main>
    </div>
  );
}