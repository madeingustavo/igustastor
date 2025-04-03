
import { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { products, categories } from '../storage/ProductData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, X, Filter, ChevronDown } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Products = () => {
  const isMobile = useIsMobile();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);

  const filteredProducts = products.filter(product => {
    // Filter by category
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    
    // Filter by search query
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const clearFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-6 md:py-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-8">Products</h1>
          
          {/* Search and filters - Mobile */}
          {isMobile && (
            <div className="flex gap-2 mb-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <Input 
                  type="text" 
                  placeholder="Search..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10 h-12"
                />
                {searchQuery && (
                  <button 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                    onClick={() => setSearchQuery('')}
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
              
              <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="h-12 w-12">
                    <Filter size={18} />
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[80vh]">
                  <SheetHeader>
                    <SheetTitle>Filter Products</SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col gap-3 pt-6">
                    <div className="grid grid-cols-2 gap-2">
                      {categories.map(category => (
                        <Button
                          key={category.id}
                          variant={selectedCategory === category.id ? "default" : "outline"}
                          onClick={() => {
                            setSelectedCategory(category.id);
                            setFilterOpen(false);
                          }}
                          className="w-full justify-start"
                        >
                          {category.name}
                        </Button>
                      ))}
                    </div>
                    
                    {(selectedCategory !== 'all' || searchQuery) && (
                      <Button 
                        variant="ghost" 
                        onClick={() => {
                          clearFilters();
                          setFilterOpen(false);
                        }}
                        className="mt-2"
                      >
                        <X size={16} className="mr-2" />
                        Clear Filters
                      </Button>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          )}
          
          {/* Search and filters - Desktop */}
          {!isMobile && (
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <Input 
                  type="text" 
                  placeholder="Search products..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map(category => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category.id)}
                    className="whitespace-nowrap"
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          {/* Product grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground mb-4">No products found.</p>
              <Button onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Products;
