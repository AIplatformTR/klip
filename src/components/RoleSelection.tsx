import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

interface RoleSelectionProps {
  onRoleSelected: (role: 'brand' | 'creator') => void;
}

export default function RoleSelection({ onRoleSelected }: RoleSelectionProps) {
  const [role, setRole] = useState<'brand' | 'creator'>('creator');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [optOutArbitration, setOptOutArbitration] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) {
      alert('You must agree to the Terms of Use to continue.');
      return;
    }

    if (!auth.currentUser) return;

    setLoading(true);
    try {
      const collectionName = role === 'brand' ? 'brands' : 'creators';
      const userRef = doc(db, collectionName, auth.currentUser.uid);
      
      await setDoc(userRef, {
        uid: auth.currentUser.uid,
        name: auth.currentUser.displayName || 'Anonymous',
        email: auth.currentUser.email || '',
        agreedToTermsAt: new Date().toISOString(),
        optedOutArbitration: optOutArbitration,
        createdAt: new Date().toISOString()
      });

      onRoleSelected(role);
    } catch (error) {
      console.error('Error saving role:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded-xl shadow-md border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Complete Your Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">I am a...</label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setRole('creator')}
              className={`flex-1 py-3 px-4 rounded-lg border ${role === 'creator' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'}`}
            >
              Creator
            </button>
            <button
              type="button"
              onClick={() => setRole('brand')}
              className={`flex-1 py-3 px-4 rounded-lg border ${role === 'brand' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'}`}
            >
              Brand
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300"
            />
            <span className="text-sm text-gray-600">
              I agree to the <a href="#" className="text-blue-600 hover:underline">Terms of Use</a> and Privacy Policy. I understand that sensitive data (e.g., medical info, SSN) is strictly prohibited.
            </span>
          </label>

          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={optOutArbitration}
              onChange={(e) => setOptOutArbitration(e.target.checked)}
              className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300"
            />
            <span className="text-sm text-gray-600">
              I wish to opt-out of the arbitration agreement.
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={!agreedToTerms || loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Saving...' : 'Continue'}
        </button>
      </form>
    </div>
  );
}
