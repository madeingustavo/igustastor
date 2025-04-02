
import { useLocalStorage } from './useLocalStorage';
import { Product } from './useCart';
import { toast } from 'sonner';

export function useFavorites() {
  const [favorites, setFavorites] = useLocalStorage<Product[]>('favorites', []);

  const addToFavorites = (product: Product) => {
    setFavorites((prevFavorites) => {
      // Check if product is already in favorites
      if (prevFavorites.some((item) => item.id === product.id)) {
        toast.info(`${product.name} is already in your favorites`);
        return prevFavorites;
      }
      
      toast.success(`Added ${product.name} to favorites`);
      return [...prevFavorites, product];
    });
  };

  const removeFromFavorites = (productId: string) => {
    setFavorites((prevFavorites) => {
      const product = prevFavorites.find(item => item.id === productId);
      if (product) {
        toast.info(`Removed ${product.name} from favorites`);
      }
      return prevFavorites.filter((product) => product.id !== productId);
    });
  };

  const toggleFavorite = (product: Product) => {
    const exists = favorites.some((item) => item.id === product.id);
    if (exists) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  const isFavorite = (productId: string) => {
    return favorites.some((product) => product.id === productId);
  };

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
  };
}
