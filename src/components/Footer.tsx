
import { Link } from 'react-router-dom';
import { StorageManager } from '../storage/StorageManager';
import { useRef } from 'react';
import { toast } from 'sonner';

export default function Footer() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    StorageManager.exportData();
  };

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const success = await StorageManager.importData(file);
      if (success) {
        toast.success('Data imported successfully. Reloading page...');
        // Give toast time to show
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        toast.error('Failed to import data');
      }
    } catch (error) {
      toast.error('Error importing data');
      console.error(error);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <footer className="bg-muted mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">OfflineStore</h3>
            <p className="text-muted-foreground">
              A fully offline store experience with local storage.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-muted-foreground hover:text-primary transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Data Management</h3>
            <div className="space-y-2">
              <button 
                onClick={handleExport}
                className="block text-muted-foreground hover:text-primary transition-colors"
              >
                Export Data
              </button>
              <button 
                onClick={handleImportClick}
                className="block text-muted-foreground hover:text-primary transition-colors"
              >
                Import Data
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImport} 
                accept=".json" 
                className="hidden" 
              />
            </div>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t border-border">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} OfflineStore. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
