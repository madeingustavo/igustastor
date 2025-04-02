
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { StorageManager } from '../storage/StorageManager';
import { Button } from '@/components/ui/button';

const About = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">About OfflineStore</h1>
          
          <div className="max-w-3xl mx-auto">
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
              <p className="text-muted-foreground mb-4">
                OfflineStore was created to demonstrate the power of modern web technologies
                for building offline-capable applications. We believe your data should be yours,
                and that shopping experiences can be fast, reliable, and private.
              </p>
              <p className="text-muted-foreground mb-4">
                Our application uses LocalStorage to keep all your data on your device,
                ensuring that your shopping preferences and cart items are never sent to any server.
              </p>
            </section>
            
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">Features</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-card p-4 rounded-lg">
                  <h3 className="font-medium mb-2">100% Offline</h3>
                  <p className="text-sm text-muted-foreground">
                    All data is stored locally on your device. No data ever leaves your browser.
                  </p>
                </div>
                <div className="bg-card p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Dark Mode</h3>
                  <p className="text-sm text-muted-foreground">
                    A toggleable dark mode for comfortable browsing day or night.
                  </p>
                </div>
                <div className="bg-card p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Data Export/Import</h3>
                  <p className="text-sm text-muted-foreground">
                    Back up and restore your shopping data with our simple export/import functionality.
                  </p>
                </div>
                <div className="bg-card p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Shopping Cart</h3>
                  <p className="text-sm text-muted-foreground">
                    A fully functional shopping cart that persists across sessions.
                  </p>
                </div>
              </div>
            </section>
            
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
              <p className="text-muted-foreground mb-4">
                OfflineStore uses a combination of modern web technologies to provide a seamless offline experience:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li>
                  <strong>LocalStorage:</strong> All your shopping data is stored in your browser's localStorage.
                </li>
                <li>
                  <strong>React:</strong> The UI is built with React for a responsive and dynamic user experience.
                </li>
                <li>
                  <strong>Custom Hooks:</strong> We use custom React hooks to manage state and localStorage interactions.
                </li>
                <li>
                  <strong>JSON Export/Import:</strong> Data can be exported as JSON files and later imported back.
                </li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">Data Management</h2>
              <p className="text-muted-foreground mb-6">
                You can export your data for backup or transfer to another device. You can also import previously exported data.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={() => StorageManager.exportData()}>
                  Export Your Data
                </Button>
                <Button variant="outline" onClick={() => StorageManager.clear()}>
                  Clear All Data
                </Button>
              </div>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
