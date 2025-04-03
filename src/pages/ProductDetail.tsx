
import { useParams, useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getProductById } from '../storage/ProductData';
import { useCart } from '../hooks/useCart';
import { useFavorites } from '../hooks/useFavorites';
import { Button } from '@/components/ui/button';
import { Heart, ChevronLeft, MinusCircle, PlusCircle, ShoppingCart, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = getProductById(id || '');
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [quantity, setQuantity] = useState(1);
  const isMobile = useIsMobile();

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-10 md:py-16">
          <div className="text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-amber-500 mb-4" />
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <p className="mb-6">The product you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/products')} size={isMobile ? "mobile" : "default"} className={isMobile ? "max-w-xs mx-auto" : ""}>
              <ChevronLeft size={16} className="mr-1" />
              Back to Products
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const favorite = isFavorite(product.id);

  const decrementQuantity = () => {
    setQuantity(prev => Math.max(1, prev - 1));
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-4 md:py-8">
          <Button
            variant="ghost"
            className="mb-4 md:mb-6 inline-flex items-center"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft size={18} className="mr-1" />
            Back
          </Button>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Product Image */}
            <div className="bg-muted rounded-lg overflow-hidden">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-auto object-cover aspect-square"
              />
            </div>
            
            {/* Product Info */}
            <div>
              <div className="flex justify-between items-start">
                <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => toggleFavorite(product)}
                  aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
                >
                  <Heart className={favorite ? "fill-primary text-primary" : ""} size={24} />
                </Button>
              </div>
              
              <div className="text-2xl font-bold text-primary mt-2">
                ${product.price.toFixed(2)}
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">{product.description}</p>
              </div>
              
              <div className="mt-8">
                <div className={`flex items-center ${isMobile ? 'justify-between' : ''} mb-6 border rounded-md p-2`}>
                  <label className="mr-3 font-medium">Quantity:</label>
                  <div className="flex items-center">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                    >
                      <MinusCircle size={isMobile ? 22 : 18} />
                    </Button>
                    <span className="w-12 text-center text-lg">{quantity}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={incrementQuantity}
                    >
                      <PlusCircle size={isMobile ? 22 : 18} />
                    </Button>
                  </div>
                </div>
                
                <Button 
                  onClick={handleAddToCart}
                  className="w-full"
                  size={isMobile ? "mobile" : "lg"}
                >
                  <ShoppingCart size={isMobile ? 20 : 18} className="mr-2" />
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
