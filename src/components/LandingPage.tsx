import React from 'react';
import { Link } from 'react-router-dom';
import { Clapperboard, ChevronRight, Eye, DollarSign, ArrowRight, Play } from 'lucide-react';

const mockCampaigns = {
  popular: [
    { id: '1', title: 'ECom [UGC]', budget: 100000, rate: 2000, used: 0, img: 'https://picsum.photos/seed/ecom/400/400' },
    { id: '2', title: 'Klipster.gg [UGC]', budget: 10000, rate: 1500, used: 0, img: 'https://picsum.photos/seed/clipster/400/400' },
    { id: '3', title: 'PrizePicks [CLIPPING]', budget: 20000, rate: 1500, used: 9, img: 'https://picsum.photos/seed/prize/400/400' },
    { id: '4', title: 'MyNetDiary [CLIPPING]', budget: 2500, rate: 1000, used: 2, img: 'https://picsum.photos/seed/diary/400/400' },
    { id: '5', title: 'Zing Coach [CLIPPING]', budget: 2000, rate: 1000, used: 8, img: 'https://picsum.photos/seed/zing/400/400' },
  ],
  music: [
    { id: '6', title: 'Recall [EDITS V2]', budget: 2080, rate: 1000, used: 14, img: 'https://picsum.photos/seed/recall/400/400' },
    { id: '7', title: 'Mystery Girl [EDITS V2]', budget: 1876, rate: 1000, used: 33, img: 'https://picsum.photos/seed/mystery/400/400' },
    { id: '8', title: 'Everlong Hoodtrap [EDITS]', budget: 1660, rate: 1000, used: 47, img: 'https://picsum.photos/seed/everlong/400/400' },
    { id: '9', title: 'Love Letter [EDITS V2]', budget: 3000, rate: 1000, used: 27, img: 'https://picsum.photos/seed/love/400/400' },
    { id: '10', title: 'REAL - TENN [EDITS]', budget: 1660, rate: 1000, used: 63, img: 'https://picsum.photos/seed/real/400/400' },
  ],
  clipping: [
    { id: '11', title: 'PrizePicks [CLIPPING]', budget: 20000, rate: 1500, used: 9, img: 'https://picsum.photos/seed/prize2/400/400' },
    { id: '12', title: 'MyNetDiary [CLIPPING]', budget: 2500, rate: 1000, used: 2, img: 'https://picsum.photos/seed/diary2/400/400' },
    { id: '13', title: 'Zing Coach [CLIPPING]', budget: 2000, rate: 1000, used: 8, img: 'https://picsum.photos/seed/zing2/400/400' },
    { id: '14', title: 'Plutus.gg [CLIPPING]', budget: 4000, rate: 1000, used: 66, img: 'https://picsum.photos/seed/plutus/400/400' },
    { id: '15', title: '1ilan1 [CLIPPING]', budget: 3200, rate: 1000, used: 91, img: 'https://picsum.photos/seed/1ilan/400/400' },
  ],
  logo: [
    { id: '16', title: 'CSGOWin.com [CS2] 2', budget: 5000, rate: 100, used: 36, img: 'https://picsum.photos/seed/csgo/400/400' },
    { id: '17', title: 'Bitz.io [GERMANY]', budget: 10000, rate: 100, used: 40, img: 'https://picsum.photos/seed/bitz/400/400' },
    { id: '18', title: 'Hellcase [CS2] 9', budget: 4035, rate: 100, used: 100, img: 'https://picsum.photos/seed/hellcase/400/400' },
    { id: '19', title: 'Bitz.io [LATAM]', budget: 10000, rate: 80, used: 69, img: 'https://picsum.photos/seed/bitz2/400/400' },
    { id: '20', title: 'Betstrike [SPORTS/GAMIN...', budget: 1900, rate: 60, used: 20, img: 'https://picsum.photos/seed/betstrike/400/400' },
  ]
};

const formatCurrency = (num: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num);
};

const CampaignRow = ({ title, campaigns, viewAllStats }: { title: string, campaigns: any[], viewAllStats?: { amount: string, count: number } }) => (
  <div className="mb-12">
    <div className="flex items-center gap-2 mb-6 cursor-pointer group w-fit">
      <h3 className="text-xl font-medium text-white group-hover:text-gray-300 transition-colors">{title}</h3>
      <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-gray-300 transition-colors" />
    </div>
    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
      {campaigns.map((camp) => (
        <div key={camp.id} className="min-w-[240px] w-[240px] bg-[#1c2130] rounded-2xl p-3 border border-gray-800/50 snap-start shrink-0 hover:border-gray-600 transition-colors cursor-pointer">
          <div className="w-full aspect-square rounded-xl overflow-hidden mb-4 bg-gray-800">
            <img src={camp.img} alt={camp.title} className="w-full h-full object-cover" />
          </div>
          <h4 className="text-white font-medium mb-4 truncate">{camp.title}</h4>
          <div className="flex justify-between items-center mb-3">
            <div className="flex flex-col">
              <DollarSign className="w-4 h-4 text-green-500 mb-1" />
              <span className="text-white font-bold text-sm">{formatCurrency(camp.budget)}</span>
            </div>
            <div className="flex flex-col items-end">
              <Eye className="w-4 h-4 text-gray-400 mb-1" />
              <span className="text-white font-bold text-sm">{formatCurrency(camp.rate)}<span className="text-gray-500 text-xs font-normal">/1M</span></span>
            </div>
          </div>
          <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden mb-1">
            <div className={`h-full rounded-full ${camp.used >= 100 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${Math.min(camp.used, 100)}%` }}></div>
          </div>
          <p className="text-xs text-gray-500">{camp.used}% budget used</p>
        </div>
      ))}
      
      {viewAllStats && (
        <div className="min-w-[240px] w-[240px] bg-[#1c2130] rounded-2xl p-6 border border-gray-800/50 snap-start shrink-0 flex flex-col items-center justify-center text-center cursor-pointer hover:border-gray-600 transition-colors">
          <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
            <DollarSign className="w-6 h-6 text-green-500" />
          </div>
          <h4 className="text-white font-bold text-xl mb-1">{viewAllStats.amount}</h4>
          <p className="text-gray-400 text-sm mb-6">from {viewAllStats.count} campaigns</p>
          <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
            <ArrowRight className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      )}
    </div>
  </div>
);

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#151822] font-sans selection:bg-red-500/30">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Clapperboard className="w-8 h-8 text-white" />
          <span className="text-xl font-bold text-white tracking-widest">KLIPSTER</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-gray-300 hover:text-white font-medium px-4 py-2 rounded-full border border-gray-700 hover:border-gray-500 transition-colors text-sm">
            Launch your campaign
          </Link>
          <Link to="/login" className="bg-[#f43f5e] hover:bg-[#e11d48] text-white font-medium px-6 py-2 rounded-full transition-colors text-sm">
            Join as creator
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center pt-20 pb-16 px-4">
        <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-purple-600/20 border border-purple-500/30 text-purple-400 text-sm font-medium mb-8">
          121,341,623,722 views generated so far!
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
          Creators have earned <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">$4.5M+ on Klipster.</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          Join 100K+ creators and explore campaigns from 200+ brands to turn short form videos into real payouts.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/login" className="w-full sm:w-auto bg-[#f43f5e] hover:bg-[#e11d48] text-white font-medium px-8 py-3.5 rounded-full transition-colors text-lg">
            Start earning
          </Link>
          <Link to="/login" className="w-full sm:w-auto text-gray-300 hover:text-white font-medium px-8 py-3.5 rounded-full border border-gray-700 hover:border-gray-500 transition-colors text-lg">
            Launch your campaign
          </Link>
        </div>
      </div>

      {/* Campaigns Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <CampaignRow title="Most Popular campaigns" campaigns={mockCampaigns.popular} viewAllStats={{ amount: '$351,096+', count: 51 }} />
        <CampaignRow title="Best Music campaigns for TikTok" campaigns={mockCampaigns.music} />
        <CampaignRow title="Best Clipping campaigns" campaigns={mockCampaigns.clipping} />
        <CampaignRow title="Best Logo campaigns" campaigns={mockCampaigns.logo} />
        
        <div className="flex justify-center mt-8 mb-24">
          <Link to="/login" className="bg-[#f43f5e] hover:bg-[#e11d48] text-white font-medium px-8 py-3 rounded-full transition-colors">
            Start earning
          </Link>
        </div>
      </div>

      {/* How it works */}
      <div className="max-w-7xl mx-auto px-6 py-24 border-t border-gray-800/50">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">How Klipster works.</h2>
          <p className="text-xl text-gray-400">The easiest way to get paid for your content.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Step 1 */}
          <div className="flex flex-col">
            <div className="bg-[#e8d5c4] rounded-3xl p-8 aspect-square mb-6 relative overflow-hidden flex items-center justify-center">
              <div className="relative w-full max-w-[240px]">
                {/* Mockup of linking accounts */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-16 h-16 bg-red-800 rounded-2xl flex items-center justify-center z-10 shadow-xl border-4 border-[#e8d5c4]">
                  <Clapperboard className="w-8 h-8 text-white" />
                </div>
                
                <div className="ml-12 space-y-4">
                  <div className="bg-white/90 backdrop-blur rounded-full py-2 px-4 flex items-center gap-3 shadow-sm transform translate-x-4">
                    <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white text-xs">♪</div>
                    <span className="text-sm font-medium text-gray-800">best_ttacc</span>
                  </div>
                  <div className="bg-white/90 backdrop-blur rounded-full py-2 px-4 flex items-center gap-3 shadow-sm transform translate-x-8">
                    <div className="w-6 h-6 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs">IG</div>
                    <span className="text-sm font-medium text-gray-800">first_acc</span>
                  </div>
                  <div className="bg-white/90 backdrop-blur rounded-full py-2 px-4 flex items-center gap-3 shadow-sm transform translate-x-4">
                    <div className="w-6 h-6 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs">IG</div>
                    <span className="text-sm font-medium text-gray-800">best_igacc</span>
                  </div>
                </div>
                
                {/* Connecting lines */}
                <svg className="absolute left-8 top-1/2 -translate-y-1/2 w-16 h-32 -z-10" viewBox="0 0 100 200" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="4">
                  <path d="M0,100 C50,100 50,20 100,20" />
                  <path d="M0,100 C50,100 50,100 100,100" />
                  <path d="M0,100 C50,100 50,180 100,180" />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Link account</h3>
            <p className="text-gray-400 leading-relaxed">Connect your social profiles to Klipster to verify ownership.</p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col">
            <div className="bg-[#e8b4b8] rounded-3xl p-8 aspect-square mb-6 relative overflow-hidden flex items-center justify-center">
              <div className="w-[220px] h-[380px] bg-black rounded-[2rem] border-4 border-gray-800 relative overflow-hidden shadow-2xl">
                <img src="https://picsum.photos/seed/tiktok/400/800" alt="Content" className="w-full h-full object-cover opacity-80" />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur">
                      <div className="w-4 h-4 border-2 border-white rounded-full"></div>
                    </div>
                    <div className="bg-white/20 backdrop-blur rounded-full px-3 py-1 text-white text-xs font-medium flex-1 truncate">
                      /p/DRdEhgIExtW/
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-[10px] text-white/70 leading-tight">Use Yeat's music on stream clips vibing to the music. Must tag sound. Reference videos on Discord.</p>
                </div>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Submit content</h3>
            <p className="text-gray-400 leading-relaxed">Create and post content, then submit your link to start tracking views.</p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col">
            <div className="bg-[#d4c4e8] rounded-3xl p-8 aspect-square mb-6 relative overflow-hidden flex items-center justify-center">
              <div className="w-[240px] bg-[#1c2130] rounded-3xl border border-gray-700 shadow-2xl overflow-hidden">
                <div className="p-5 border-b border-gray-800">
                  <p className="text-gray-400 text-sm mb-1">My balance</p>
                  <h4 className="text-3xl font-bold text-white mb-4">$8,512.71</h4>
                  <button className="w-full bg-green-600 text-white text-sm font-medium py-2.5 rounded-full">
                    Withdraw Earnings
                  </button>
                </div>
                <div className="p-4 space-y-4">
                  {[
                    { name: 'Yeat x Klipster', date: 'November 3rd, 2025', amount: '+$1,399.60' },
                    { name: 'Duel.com x Klipster', date: 'November 2nd, 2025', amount: '+$691.04' },
                    { name: 'Ed Sheeran x Klipster', date: 'November 2nd, 2025', amount: '+$847.65' },
                    { name: 'Logan Paul x Klipster', date: 'September 1st, 2025', amount: '+$2,015.80' },
                  ].map((tx, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                          <DollarSign className="w-4 h-4 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-white text-xs font-medium">{tx.name}</p>
                          <p className="text-gray-500 text-[10px]">{tx.date}</p>
                        </div>
                      </div>
                      <span className="text-green-500 text-xs font-medium">{tx.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Get paid</h3>
            <p className="text-gray-400 leading-relaxed">Earn automatically for every verified view your content generates.</p>
          </div>
        </div>

        <div className="flex justify-center">
          <Link to="/login" className="bg-[#f43f5e] hover:bg-[#e11d48] text-white font-medium px-8 py-3 rounded-full transition-colors">
            Start earning
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 pt-16 pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Clapperboard className="w-6 h-6 text-white" />
                <span className="text-lg font-bold text-white tracking-widest">KLIPSTER</span>
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
                <Play className="w-5 h-5 text-white fill-white" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-400 leading-none">GET IT ON</span>
                  <span className="text-sm text-white font-medium leading-tight">Google Play</span>
                </div>
              </a>
              <a href="#" className="bg-transparent border border-gray-700 hover:border-gray-500 rounded-lg px-4 py-2 flex items-center gap-2 transition-colors">
                <svg className="w-5 h-5 text-white fill-white" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.09 2.31-.86 3.65-.74 1.84.15 3.15.96 4.04 2.3-3.46 1.97-2.88 6.55.63 7.98-.8 2.01-1.93 4.04-3.4 5.63zm-4.32-14.2c.2-1.9 1.34-3.66 3.03-4.08-.4 2.06-1.74 3.7-3.34 4.08-.12.03-.24.03-.36.03-.02-.01-.04-.02-.06-.03z"/></svg>
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-400 leading-none">Download on the</span>
                  <span className="text-sm text-white font-medium leading-tight">App Store</span>
                </div>
              </a>
            </div>

            <p className="text-sm text-gray-500">© 2026 Klipster. All rights reserved.</p>

            <div className="flex gap-4">
              {/* Social icons placeholders */}
              <a href="#" className="text-gray-400 hover:text-white"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/></svg></a>
              <a href="#" className="text-gray-400 hover:text-white"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
              <a href="#" className="text-gray-400 hover:text-white"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg></a>
              <a href="#" className="text-gray-400 hover:text-white"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.34 2.88 2.88 0 012.31-4.53 2.66 2.66 0 011.14.24V9.12a6.3 6.3 0 00-1.14-.1 6.33 6.33 0 106.33 6.33V8.11a8.21 8.21 0 004.78 1.54V6.2a5.36 5.36 0 01-1-.01z"/></svg></a>
              <a href="#" className="text-gray-400 hover:text-white"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
