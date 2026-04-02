import React, { useState } from 'react';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Clapperboard } from 'lucide-react';

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

      // Also save a general user doc for easy role lookup
      await setDoc(doc(db, 'users', auth.currentUser.uid), {
        uid: auth.currentUser.uid,
        role: role,
      });

      onRoleSelected(role);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${auth.currentUser.uid}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12">
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Clapperboard className="text-red-600 w-10 h-10" />
          <h1 className="text-4xl font-bold tracking-tight text-white">CLIPSTER</h1>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Complete Your Profile</h2>
        <p className="text-gray-400">How do you want to use Clipster?</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            type="button"
            onClick={() => setRole('brand')}
            className={`p-6 rounded-2xl border-2 text-left transition-all ${
              role === 'brand' 
                ? 'border-red-600 bg-red-600/10' 
                : 'border-gray-800 bg-[#1c2333] hover:border-gray-600'
            }`}
          >
            <h3 className="text-xl font-bold text-white mb-2">I am a Brand</h3>
            <p className="text-gray-400 text-sm">
              Create campaigns, manage budgets, and discover top creators to promote your products.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setRole('creator')}
            className={`p-6 rounded-2xl border-2 text-left transition-all ${
              role === 'creator' 
                ? 'border-red-600 bg-red-600/10' 
                : 'border-gray-800 bg-[#1c2333] hover:border-gray-600'
            }`}
          >
            <h3 className="text-xl font-bold text-white mb-2">I am a Creator</h3>
            <p className="text-gray-400 text-sm">
              Find campaigns, submit content, and get paid for your creative work.
            </p>
          </button>
        </div>

        <div className="bg-[#1c2333] p-6 rounded-2xl border border-gray-800 space-y-6">
          <h3 className="font-bold text-white text-lg">Legal Agreements</h3>
          
          <div className="space-y-4">
            <label className="flex items-start gap-3 p-4 bg-[#0b0f19] rounded-xl border border-gray-800 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1 h-5 w-5 text-red-600 rounded bg-gray-800 border-gray-700 focus:ring-red-600 focus:ring-offset-gray-900 accent-red-600"
              />
              <div className="text-sm text-gray-300">
                <p className="font-medium text-white mb-1">I agree to the Terms of Use and Privacy Policy</p>
                <p className="text-gray-500">
                  By checking this box, you agree to our <a href="#" className="text-red-500 hover:underline">Terms of Use</a> and <a href="#" className="text-red-500 hover:underline">Privacy Policy</a>. 
                  <br/><br/>
                  <strong className="text-red-400">Important:</strong> Do not upload sensitive personal data (e.g., medical records, SSN, financial details) to this platform.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-4 bg-[#0b0f19] rounded-xl border border-gray-800 cursor-pointer">
              <input
                type="checkbox"
                checked={optOutArbitration}
                onChange={(e) => setOptOutArbitration(e.target.checked)}
                className="mt-1 h-5 w-5 text-red-600 rounded bg-gray-800 border-gray-700 focus:ring-red-600 focus:ring-offset-gray-900 accent-red-600"
              />
              <div className="text-sm text-gray-300">
                <p className="font-medium text-white mb-1">Opt-out of Arbitration (Optional)</p>
                <p className="text-gray-500">
                  Check this box if you wish to opt-out of the binding arbitration agreement.
                </p>
              </div>
            </label>
          </div>

          <button
            type="submit"
            disabled={!agreedToTerms || loading}
            className="w-full bg-red-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-600/20"
          >
            {loading ? 'Saving...' : 'Complete Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}
