import React from 'react';
import Store from '../components/Store.jsx';

const Dashboard = ({ cart, addToCart, searchTerm, filter }) => {
  return (
    <main className="flex-grow p-6 bg-gray-100">
      <Store addToCart={addToCart} searchTerm={searchTerm} filter={filter} />
    </main>
  );
};

export default Dashboard;

