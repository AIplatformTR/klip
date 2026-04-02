/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { auth, db, loginWithGoogle, logout, handleFirestoreError, OperationType } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { Clapperboard } from 'lucide-react';

import RoleSelection from './components/RoleSelection';
import BrandDashboard from './components/BrandDashboard';
import CreatorDashboard from './components/CreatorDashboard';
import Sidebar from './components/Sidebar';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<'brand' | 'creator' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
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
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `brands or creators`);
        }
      } else {
        setUserRole(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#131826] flex items-center justify-center">
        <div className="text-white text-xl flex items-center gap-3">
          <Clapperboard className="animate-spin text-red-600" /> Loading Klipster...
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-[#131826] text-white flex font-sans">
        {user && userRole && <Sidebar userRole={userRole} />}
        <main className={`flex-1 ${user && userRole ? 'md:ml-20 mb-16 md:mb-0' : ''} p-4 md:p-8 overflow-x-hidden`}>
          {!user ? (
            <div className="flex flex-col items-center justify-center min-h-[80vh]">
              <div className="flex items-center gap-3 mb-8">
                <Clapperboard className="text-red-600 w-12 h-12" />
                <h1 className="text-5xl font-bold tracking-tight">KLIPSTER</h1>
              </div>
              <p className="text-xl text-gray-400 mb-8 max-w-md text-center">
                The premier marketplace connecting Brands and Creators for marketing campaigns.
              </p>
              <button onClick={loginWithGoogle} className="bg-red-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20">
                Sign in with Google
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
              <Route path="/dashboard" element={<Navigate to={`/${userRole}s`} replace />} />
              <Route path="/campaigns" element={<Navigate to={`/${userRole}s`} replace />} />
            </Routes>
          )}
        </main>
      </div>
    </Router>
  );
}


