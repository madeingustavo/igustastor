
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { products } from '../storage/ProductData';
import { Button } from '@/components/ui/button';

const Index = () => {
  // Get 4 featured products
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary/10 to-secondary/10 py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Welcome to <span className="text-gradient">OfflineStore</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
              A fully offline shopping experience with local storage. 
              Your data never leaves your device.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg">
                <Link to="/products">
                  Browse Products
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/about">
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold">Featured Products</h2>
              <Link to="/products" className="text-primary hover:underline">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-muted">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Why Choose OfflineStore?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-3">Fully Offline</h3>
                <p className="text-muted-foreground">
                  All data is stored locally on your device. No internet connection required.
                </p>
              </div>
              <div className="bg-card rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-3">Data Export/Import</h3>
                <p className="text-muted-foreground">
                  Easily backup and restore your data using our export/import functionality.
                </p>
              </div>
              <div className="bg-card rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-3">Dark Mode Support</h3>
                <p className="text-muted-foreground">
                  Toggle between light and dark mode for a comfortable browsing experience.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
