/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { auth, loginWithGoogle, logout } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm p-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-blue-600">Klipster</Link>
          <div className="space-x-4">
            <Link to="/brands" className="text-gray-600 hover:text-blue-600">Brands</Link>
            <Link to="/creators" className="text-gray-600 hover:text-blue-600">Creators</Link>
            {user ? (
              <button onClick={logout} className="text-red-600">Logout</button>
            ) : (
              <button onClick={loginWithGoogle} className="text-blue-600">Login</button>
            )}
          </div>
        </nav>
        <main className="p-8">
          <Routes>
            <Route path="/" element={<h1 className="text-4xl font-bold">Welcome to Klipster</h1>} />
            <Route path="/brands" element={<h1 className="text-4xl font-bold">Brand Dashboard</h1>} />
            <Route path="/creators" element={<h1 className="text-4xl font-bold">Creator Dashboard</h1>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

