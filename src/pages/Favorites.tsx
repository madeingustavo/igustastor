
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useFavorites } from '../hooks/useFavorites';
import { useCart } from '../hooks/useCart';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart } from 'lucide-react';

const Favorites = () => {
  const { favorites, removeFromFavorites } = useFavorites();
  const { addToCart } = useCart();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Your Favorites</h1>
          
          {favorites.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favorites.map(product => (
                <div key={product.id} className="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <Link to={`/products/${product.id}`} className="block relative">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-48 object-cover"
                    />
                  </Link>
                  
                  <div className="p-4">
                    <Link to={`/products/${product.id}`} className="block">
                      <h3 className="font-semibold hover:text-primary transition-colors">{product.name}</h3>
                    </Link>
                    <p className="text-lg font-bold text-primary mt-1">${product.price.toFixed(2)}</p>
                    
                    <div className="mt-4 flex space-x-2">
                      <Button 
                        onClick={() => addToCart(product)}
                        className="flex-grow"
                        variant="outline"
                      >
                        <ShoppingCart size={16} className="mr-2" />
                        Add to Cart
                      </Button>
                      
                      <Button 
                        variant="ghost"
                        size="icon"
                        className="border"
                        onClick={() => removeFromFavorites(product.id)}
                      >
                        <Heart size={16} className="fill-primary text-primary" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Heart className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold mb-2">No favorites yet</h2>
              <p className="text-muted-foreground mb-6">
                You haven't added any products to your favorites yet.
              </p>
              <Button asChild>
                <Link to="/products">Browse Products</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Favorites;
