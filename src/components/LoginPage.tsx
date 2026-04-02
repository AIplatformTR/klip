import React, { useState } from 'react';
import { Clapperboard } from 'lucide-react';
import { loginWithGoogle } from '../firebase';

export default function LoginPage() {
  const [email, setEmail] = useState('');

  return (
    <div className="min-h-screen bg-[#131826] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 mb-8">
            <Clapperboard className="text-red-600 w-8 h-8" />
            <span className="text-xl font-bold text-white tracking-widest">KLIPSTER</span>
          </div>
          <h1 className="text-4xl font-bold text-white text-center mb-2">Get started with Klipster.</h1>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">Email address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-[#1c2333] border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-red-600 outline-none text-white"
            />
          </div>
          <button className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition-colors">
            Continue
          </button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-[#131826] text-gray-500">or</span>
          </div>
        </div>

        <div className="space-y-3">
          <button onClick={loginWithGoogle} className="w-full flex items-center justify-center gap-3 p-3 bg-[#1c2333] border border-gray-700 rounded-lg text-white hover:bg-gray-800 transition-colors">
            <span className="font-bold">G</span> Continue with Google
          </button>
          <button className="w-full flex items-center justify-center gap-3 p-3 bg-[#1c2333] border border-gray-700 rounded-lg text-white hover:bg-gray-800 transition-colors">
            <span className="font-bold">D</span> Continue with Discord
          </button>
          <button className="w-full flex items-center justify-center gap-3 p-3 bg-[#1c2333] border border-gray-700 rounded-lg text-white hover:bg-gray-800 transition-colors">
            <span className="font-bold">A</span> Continue with Apple
          </button>
        </div>

        <p className="text-center text-xs text-gray-500">
          By continuing, you agree to our <a href="#" className="underline hover:text-gray-300">Terms of Service</a> and <a href="#" className="underline hover:text-gray-300">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}
