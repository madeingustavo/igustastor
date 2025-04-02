
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../hooks/useCart';
import { Button } from '@/components/ui/button';
import { Trash2, MinusCircle, PlusCircle, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, getTotal } = useCart();

  const handleCheckout = () => {
    toast.success('Order placed successfully!');
    clearCart();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
          
          {cart.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="space-y-4">
                  {cart.map(({ product, quantity }) => (
                    <div 
                      key={product.id} 
                      className="flex flex-col sm:flex-row items-start sm:items-center p-4 border rounded-lg"
                    >
                      <div className="flex items-center flex-grow">
                        <Link to={`/products/${product.id}`} className="flex-shrink-0">
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-20 h-20 object-cover rounded-md"
                          />
                        </Link>
                        <div className="ml-4">
                          <Link to={`/products/${product.id}`} className="font-medium hover:text-primary">
                            {product.name}
                          </Link>
                          <p className="text-sm text-muted-foreground mt-1">${product.price.toFixed(2)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center mt-4 sm:mt-0">
                        <div className="flex items-center border rounded-md mr-4">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                          >
                            <MinusCircle size={16} />
                          </Button>
                          <span className="w-8 text-center">{quantity}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                          >
                            <PlusCircle size={16} />
                          </Button>
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeFromCart(product.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={18} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={clearCart}
                >
                  Clear Cart
                </Button>
              </div>
              
              {/* Order Summary */}
              <div>
                <div className="bg-muted p-6 rounded-lg">
                  <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${getTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>$0.00</span>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>${getTotal().toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full mt-6"
                    size="lg"
                    onClick={handleCheckout}
                  >
                    Checkout
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">Looks like you haven't added anything to your cart yet.</p>
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

export default Cart;
