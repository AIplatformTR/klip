/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { auth, db, loginWithGoogle, logout } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

import RoleSelection from './components/RoleSelection';
import BrandDashboard from './components/BrandDashboard';
import CreatorDashboard from './components/CreatorDashboard';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<'brand' | 'creator' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Check if user is a brand
        const brandDoc = await getDoc(doc(db, 'brands', currentUser.uid));
        if (brandDoc.exists()) {
          setUserRole('brand');
          setLoading(false);
          return;
        }
        
        // Check if user is a creator
        const creatorDoc = await getDoc(doc(db, 'creators', currentUser.uid));
        if (creatorDoc.exists()) {
          setUserRole('creator');
          setLoading(false);
          return;
        }

        // User exists but has no role yet
        setUserRole(null);
      } else {
        setUserRole(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading...</div>;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm p-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-blue-600">Klipster</Link>
          <div className="space-x-4">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  {user.displayName} {userRole ? `(${userRole})` : ''}
                </span>
                <button onClick={logout} className="text-red-600 hover:text-red-700 font-medium">Logout</button>
              </div>
            ) : (
              <button onClick={loginWithGoogle} className="text-blue-600 hover:text-blue-700 font-medium">Login</button>
            )}
          </div>
        </nav>
        <main className="p-8 max-w-7xl mx-auto">
          {!user ? (
            <div className="text-center py-20">
              <h1 className="text-5xl font-bold text-gray-900 mb-6">Welcome to Klipster</h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                The premier marketplace connecting Brands with top-tier Creators for impactful marketing campaigns.
              </p>
              <button onClick={loginWithGoogle} className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-bold hover:bg-blue-700 transition-colors">
                Get Started
              </button>
            </div>
          ) : !userRole ? (
            <RoleSelection onRoleSelected={setUserRole} />
          ) : (
            <Routes>
              <Route path="/" element={<Navigate to={`/${userRole}s`} replace />} />
              <Route 
                path="/brands/*" 
                element={userRole === 'brand' ? <BrandDashboard /> : <Navigate to="/creators" replace />} 
              />
              <Route 
                path="/creators/*" 
                element={userRole === 'creator' ? <CreatorDashboard /> : <Navigate to="/brands" replace />} 
              />
            </Routes>
          )}
        </main>
      </div>
    </Router>
  );
}


