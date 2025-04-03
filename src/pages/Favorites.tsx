
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useFavorites } from '../hooks/useFavorites';
import { useCart } from '../hooks/useCart';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, ArrowRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Favorites = () => {
  const { favorites, removeFromFavorites } = useFavorites();
  const { addToCart } = useCart();
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-6 md:py-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-8">Your Favorites</h1>
          
          {favorites.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
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
                    
                    {isMobile ? (
                      <div className="mt-4 grid grid-cols-1 gap-2">
                        <Button 
                          onClick={() => addToCart(product)}
                          className="w-full"
                          size="mobile"
                        >
                          <ShoppingCart size={18} />
                          Add to Cart
                        </Button>
                        
                        <Button 
                          variant="outline"
                          className="w-full"
                          onClick={() => removeFromFavorites(product.id)}
                        >
                          <Heart size={18} className="fill-primary text-primary mr-2" />
                          Remove
                        </Button>
                      </div>
                    ) : (
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
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 md:py-16">
              <Heart className="mx-auto h-12 w-12 md:h-16 md:w-16 text-muted-foreground mb-4" />
              <h2 className="text-xl md:text-2xl font-bold mb-2">No favorites yet</h2>
              <p className="text-muted-foreground mb-6 px-4">
                You haven't added any products to your favorites yet.
              </p>
              <Button asChild size={isMobile ? "mobile" : "default"} className={isMobile ? "max-w-xs mx-auto" : ""}>
                <Link to="/products">
                  Browse Products
                  <ArrowRight size={16} />
                </Link>
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
