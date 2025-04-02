
import { Heart } from 'lucide-react';
import { Product } from '../hooks/useCart';
import { useCart } from '../hooks/useCart';
import { useFavorites } from '../hooks/useFavorites';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const favorite = isFavorite(product.id);

  return (
    <Card className="h-full flex flex-col transition-all duration-300 hover:shadow-md overflow-hidden">
      <CardHeader className="p-0">
        <Link to={`/products/${product.id}`} className="block relative">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-48 object-cover"
          />
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-2 right-2 bg-background/80 hover:bg-background/90"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(product);
            }}
          >
            <Heart 
              size={18} 
              className={favorite ? 'fill-primary text-primary' : ''} 
            />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg font-semibold">
          <Link to={`/products/${product.id}`} className="hover:text-primary transition-colors">
            {product.name}
          </Link>
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1 mb-2">
          {product.description.length > 80 
            ? `${product.description.slice(0, 80)}...` 
            : product.description}
        </p>
        <p className="text-lg font-bold text-primary">${product.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={() => addToCart(product)} 
          className="w-full"
        >
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
