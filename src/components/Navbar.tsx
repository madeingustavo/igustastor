
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Moon, Sun, Menu, X, Home, Tag, Info } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useCart } from '../hooks/useCart';
import { useFavorites } from '../hooks/useFavorites';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

export default function Navbar() {
  const [theme, setTheme] = useTheme();
  const { cart } = useCart();
  const { favorites } = useFavorites();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-10 bg-background border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl md:text-2xl font-bold text-gradient">OfflineStore</span>
          </Link>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMenu} aria-label="Toggle menu">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/products" className="text-foreground hover:text-primary transition-colors">
              Products
            </Link>
            <Link to="/about" className="text-foreground hover:text-primary transition-colors">
              About
            </Link>
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </Button>
            
            <Link to="/favorites" className="relative">
              <Button variant="ghost" size="icon" aria-label="Favorites">
                <Heart size={20} />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full text-xs w-4 h-4 flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </Button>
            </Link>
            
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon" aria-label="Cart">
                <ShoppingCart size={20} />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full text-xs w-4 h-4 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-3 space-y-1 animate-fade-in">
            <Link 
              to="/" 
              className="flex items-center px-4 py-3 rounded-md text-foreground hover:bg-accent hover:text-primary"
              onClick={closeMenu}
            >
              <Home className="h-5 w-5 mr-3" />
              Home
            </Link>
            <Link 
              to="/products" 
              className="flex items-center px-4 py-3 rounded-md text-foreground hover:bg-accent hover:text-primary"
              onClick={closeMenu}
            >
              <Tag className="h-5 w-5 mr-3" />
              Products
            </Link>
            <Link 
              to="/about" 
              className="flex items-center px-4 py-3 rounded-md text-foreground hover:bg-accent hover:text-primary"
              onClick={closeMenu}
            >
              <Info className="h-5 w-5 mr-3" />
              About
            </Link>
            
            <div className="flex items-center justify-between pt-3 px-4 border-t border-border mt-3">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
                  {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </Button>
                
                <Link to="/favorites" className="relative" onClick={closeMenu}>
                  <Button variant="ghost" size="icon" aria-label="Favorites">
                    <Heart size={20} />
                    {favorites.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full text-xs w-4 h-4 flex items-center justify-center">
                        {favorites.length}
                      </span>
                    )}
                  </Button>
                </Link>
                
                <Link to="/cart" className="relative" onClick={closeMenu}>
                  <Button variant="ghost" size="icon" aria-label="Cart">
                    <ShoppingCart size={20} />
                    {cart.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full text-xs w-4 h-4 flex items-center justify-center">
                        {cart.length}
                      </span>
                    )}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
