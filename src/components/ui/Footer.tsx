import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-50 border-t border-stone-100">
      <div className="container mx-auto px-4 py-12 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-white font-bold">
                O
              </div>
              <span className="text-xl font-bold tracking-tight text-stone-900">
                Organic
              </span>
            </div>
            <p className="text-sm text-stone-600 leading-relaxed">
              Providing the freshest organic produce directly from local farmers
              to your doorstep. Healthy living made easy.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-stone-900 uppercase tracking-wider">
              Shop
            </h3>
            <ul className="space-y-2 text-sm text-stone-600">
              <li>
                <a href="#" className="hover:text-green-600">
                  All Products
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-600">
                  Fresh Fruits
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-600">
                  Vegetables
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-600">
                  Pantry
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-stone-900 uppercase tracking-wider">
              Company
            </h3>
            <ul className="space-y-2 text-sm text-stone-600">
              <li>
                <a href="#" className="hover:text-green-600">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-600">
                  Sustainability
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-600">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-600">
                  Careers
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-stone-900 uppercase tracking-wider">
              Newsletter
            </h3>
            <p className="mb-4 text-sm text-stone-600">
              Subscribe to get special offers, free giveaways, and
              once-in-a-lifetime deals.
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-md border border-stone-200 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 bg-white"
              />
              <button className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700">
                Join
              </button>
            </form>
          </div>
        </div>
        <div className="mt-12 border-t border-stone-200 pt-8 text-center text-sm text-stone-500">
          <p>
            &copy; {new Date().getFullYear()} Organic Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
