import React from 'react';
import { Link } from 'react-router-dom';
import { Clapperboard } from 'lucide-react';

export default function StartCampaignForm() {
  return (
    <div className="min-h-screen bg-[#252836] font-sans selection:bg-red-500/30 flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full">
        <Link to="/" className="flex items-center gap-2">
          <Clapperboard className="w-8 h-8 text-white" />
          <span className="text-xl font-bold text-white tracking-widest uppercase">Klipster</span>
        </Link>
        <Link to="/login" className="bg-[#f43f5e] hover:bg-[#e11d48] text-white font-medium px-6 py-2 rounded-full transition-colors text-sm">
          Join as creator
        </Link>
      </nav>

      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 md:py-20 flex flex-col lg:flex-row gap-12 lg:gap-24">
        {/* Left Column */}
        <div className="flex-1">
          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-purple-500 text-white text-sm font-medium mb-6">
            121,354,294,486 views generated so far!
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-12 tracking-tight leading-tight">
            Start your first campaign within hours.
          </h1>

          <div className="space-y-10">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold shrink-0">1</div>
              <div>
                <h3 className="text-xl font-medium text-white mb-2">Fill out the form</h3>
                <p className="text-gray-400 leading-relaxed">Takes 1 minute and gives us everything we need to understand your goals.</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold shrink-0">2</div>
              <div>
                <h3 className="text-xl font-medium text-white mb-2">Get onboarded</h3>
                <p className="text-gray-400 leading-relaxed">Our team reviews your brief and reaches out with clear next steps to set up your campaign.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold shrink-0">3</div>
              <div>
                <h3 className="text-xl font-medium text-white mb-2">Go live</h3>
                <p className="text-gray-400 leading-relaxed">Your campaign launches immediately after and you only pay for verified results.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Form */}
        <div className="w-full lg:w-[500px] shrink-0">
          <div className="bg-[#2d303e] rounded-3xl p-8 shadow-2xl">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Full name*</label>
                <input 
                  type="text" 
                  placeholder="Your full name"
                  className="w-full p-4 bg-transparent border border-gray-600 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-red-600 outline-none text-white placeholder-gray-500 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Business email*</label>
                <input 
                  type="email" 
                  placeholder="you@company.com"
                  className="w-full p-4 bg-transparent border border-gray-600 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-red-600 outline-none text-white placeholder-gray-500 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Company name*</label>
                <input 
                  type="text" 
                  placeholder="Your company name or the name of the artist"
                  className="w-full p-4 bg-transparent border border-gray-600 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-red-600 outline-none text-white placeholder-gray-500 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Campaign goals & additional details</label>
                <textarea 
                  placeholder="Tell us about your campaign goals, target audience, or any specific requirements"
                  rows={4}
                  className="w-full p-4 bg-transparent border border-gray-600 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-red-600 outline-none text-white placeholder-gray-500 transition-all resize-none"
                ></textarea>
              </div>

              {/* Fake reCAPTCHA */}
              <div className="bg-white rounded-md p-4 flex items-center justify-between border border-gray-300">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 border-2 border-gray-300 rounded-sm bg-white cursor-pointer"></div>
                  <span className="text-gray-700 font-medium">I'm not a robot</span>
                </div>
                <div className="flex flex-col items-center">
                  <img src="https://www.gstatic.com/recaptcha/api2/logo_48.png" alt="reCAPTCHA" className="w-8" />
                  <span className="text-[10px] text-gray-500 mt-1">reCAPTCHA</span>
                  <div className="text-[8px] text-gray-500 flex gap-1">
                    <span>Privacy</span> - <span>Terms</span>
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                className="bg-[#f43f5e] hover:bg-[#e11d48] text-white font-medium px-8 py-3 rounded-full transition-colors"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 pt-16 pb-8 px-6 mt-12 bg-[#252836]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-gray-500 text-sm mb-8">Trusted by leading brands</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale">
              <span className="text-white font-bold text-xl">UNIVERSAL</span>
              <span className="text-white font-bold text-xl">SONY MUSIC</span>
              <span className="text-white font-bold text-xl">ATLANTIC</span>
              <span className="text-white font-bold text-xl">apg</span>
              <span className="text-white font-bold text-xl">ada</span>
              <span className="text-white font-bold text-xl">Capitol</span>
              <span className="text-white font-bold text-xl">EMPIRE</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 pt-12 border-t border-gray-800/50">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Clapperboard className="w-6 h-6 text-white" />
                <span className="text-lg font-bold text-white tracking-widest uppercase">KLIPSTER</span>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-medium mb-6">Legal</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Creator Terms of Use</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Brand Terms of Use</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">General Website Terms</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Do Not Sell</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-medium mb-6">Company</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-2">Contact Us <span className="bg-gray-800 text-gray-300 text-[10px] px-2 py-0.5 rounded-full">soon</span></a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Support</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Jobs</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-medium mb-6">Resources</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-2">General Campaign Rules <span className="bg-gray-800 text-gray-300 text-[10px] px-2 py-0.5 rounded-full">soon</span></a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-2">Skool Community <span className="bg-gray-800 text-gray-300 text-[10px] px-2 py-0.5 rounded-full">soon</span></a></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-gray-800/50">
            <div className="flex gap-4">
              <a href="#" className="bg-transparent border border-gray-700 hover:border-gray-500 rounded-lg px-4 py-2 flex items-center gap-2 transition-colors">
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-400 leading-none">GET IT ON</span>
                  <span className="text-sm text-white font-medium leading-tight">Google Play</span>
                </div>
              </a>
              <a href="#" className="bg-transparent border border-gray-700 hover:border-gray-500 rounded-lg px-4 py-2 flex items-center gap-2 transition-colors">
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-400 leading-none">Download on the</span>
                  <span className="text-sm text-white font-medium leading-tight">App Store</span>
                </div>
              </a>
            </div>

            <p className="text-sm text-gray-500">© 2026 Klipster. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
