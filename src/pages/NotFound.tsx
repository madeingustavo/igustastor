
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Layout from '../components/Layout';
import { FileQuestion } from 'lucide-react';

const NotFound = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <FileQuestion className="h-24 w-24 text-muted-foreground mb-6" />
        <h1 className="text-5xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-6">Página Não Encontrada</h2>
        <p className="text-muted-foreground mb-8 max-w-md">
          A página que você está procurando pode ter sido removida, teve seu nome alterado
          ou está temporariamente indisponível.
        </p>
        <Button asChild>
          <Link to="/">Voltar para o Dashboard</Link>
        </Button>
      </div>
    </Layout>
  );
};

export default NotFound;
