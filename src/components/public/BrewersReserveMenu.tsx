import React, { useState, useEffect } from 'react';
import { Product } from '../../types';

const BrewersReserveMenu: React.FC = () => {
  const [menuItems, setMenuItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch('/.netlify/functions/get-brewers-reserve');
        if (!response.ok) {
          throw new Error('Failed to fetch the menu. Please try again later.');
        }
        const data = await response.json();
        setMenuItems(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-300 font-sans p-4 sm:p-6 md:p-8">
      <div className="max-w-3xl mx-auto">
        <header className="text-center mb-10 border-b-2 border-yellow-500 pb-4">
          <h1 className="text-4xl sm:text-5xl font-bold text-yellow-400 tracking-wider">
            Spinäl Äpp
          </h1>
          <p className="text-xl text-gray-200 mt-2">Brewer's Reserve</p>
        </header>

        <main>
          {loading && (
            <div className="text-center text-gray-400">
              <p>Loading our finest selections...</p>
            </div>
          )}
          {error && (
            <div className="text-center bg-red-900 text-red-200 p-4 rounded-lg">
              <p className="font-bold">Oops! Something went wrong.</p>
              <p>{error}</p>
            </div>
          )}
          {!loading && !error && menuItems.length === 0 && (
            <div className="text-center text-gray-400">
              <p>The Brewer's Reserve menu is currently empty. Please check back soon!</p>
            </div>
          )}
          {!loading && !error && menuItems.length > 0 && (
            <div className="space-y-8">
              {menuItems.map(item => (
                <div key={item.id} className="bg-gray-800 p-6 rounded-lg shadow-lg border-l-4 border-yellow-500">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-baseline">
                    <h2 className="text-2xl font-bold text-gray-50">{item.name}</h2>
                    <div className="flex items-baseline gap-4 mt-2 sm:mt-0">
                      {item.abv != null && (
                        <p className="text-lg font-semibold text-yellow-400">{item.abv}% ABV</p>
                      )}
                      {item.price != null && (
                        <p className="text-xl font-bold text-emerald-400">R {item.price.toFixed(2)}</p>
                      )}
                    </div>
                  </div>
                  {item.tastingNotes && (
                    <p className="text-gray-300 mt-3 italic">
                      {item.tastingNotes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>

        <footer className="text-center mt-12 pt-6 border-t border-gray-700">
          <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} Spinäl Täp. Enjoy responsibly.</p>
        </footer>
      </div>
    </div>
  );
};

export default BrewersReserveMenu;