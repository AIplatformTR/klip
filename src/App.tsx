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

import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import RoleSelection from './components/RoleSelection';
import BrandDashboard from './components/BrandDashboard';
import CreatorDashboard from './components/CreatorDashboard';
import Sidebar from './components/Sidebar';
import StartCampaignForm from './components/StartCampaignForm';

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
        <main className={`flex-1 ${user && userRole ? 'md:ml-20 mb-16 md:mb-0 p-4 md:p-8' : ''} overflow-x-hidden`}>
          {!user ? (
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/start-campaign" element={<StartCampaignForm />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          ) : !userRole ? (
            <div className="p-4 md:p-8">
              <RoleSelection onRoleSelected={setUserRole} />
            </div>
          ) : (
            <Routes key={userRole}>
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


