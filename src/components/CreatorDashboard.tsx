import VideoEditor from './VideoEditor';
import { Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import { collection, getDocs, doc, getDoc, addDoc, query, where, collectionGroup } from 'firebase/firestore';
import { Clapperboard, User, LineChart, History, Copy, Info, Plus, Search, DollarSign, Users, Video, Eye, Lock, Mail, Trash2, Fingerprint, Clock, Inbox, Link as LinkIcon, Wallet, X } from 'lucide-react';

const mockCampaigns = [
  { id: '1', title: 'Clown [ALL]', budget: 3000, budgetUsed: 0, creators: 27, rate: '130.00', tags: ['Music', 'New'], imgSeed: 'clown' },
  { id: '2', title: 'Jackbit [GENERAL] 10', budget: 2500, budgetUsed: 1, creators: 147, rate: '20.00', tags: ['Logo', 'New'], imgSeed: 'jackbit1' },
  { id: '3', title: 'Jackbit [SPORTS] 9', budget: 2500, budgetUsed: 2, creators: 205, rate: '50.00', tags: ['Logo', 'New'], imgSeed: 'jackbit2' },
  { id: '4', title: 'Rajbet [GENERAL] 9', budget: 20000, budgetUsed: 2, creators: 871, rate: '40.00', tags: ['Logo', 'New'], imgSeed: 'rajbet' },
  { id: '5', title: 'MONTAGEM KIRA', budget: 1000, budgetUsed: 2, creators: 37, rate: '15.00', tags: ['Music', 'New'], imgSeed: 'anime' },
  { id: '6', title: 'Funk de Mambo', budget: 1000, budgetUsed: 2, creators: 44, rate: '25.00', tags: ['Music', 'New'], imgSeed: 'mambo' },
];

function CreatorOverview() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    const fetchData = async () => {
      if (!auth.currentUser) return;
      try {
        const qCamps = query(collection(db, 'campaigns'), where('status', '==', 'active'));
        const campsSnapshot = await getDocs(qCamps);
        const camps = campsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCampaigns(camps);

        const qSubs = query(collectionGroup(db, 'content'), where('creatorUid', '==', auth.currentUser.uid));
        const subsSnapshot = await getDocs(qSubs);
        const subs = subsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        const subsWithCampaigns = await Promise.all(subs.map(async (sub: any) => {
          const campDoc = await getDoc(doc(db, 'campaigns', sub.campaignId));
          return { ...sub, campaignTitle: campDoc.exists() ? campDoc.data().title : 'Unknown Campaign' };
        }));
        
        setSubmissions(subsWithCampaigns);
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, 'campaigns or content');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const displayCampaigns = campaigns.length > 0 ? campaigns : mockCampaigns;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <h1 className="text-2xl font-bold uppercase tracking-wider text-white w-full md:w-auto text-center md:text-left">Campaigns</h1>
        <div className="flex items-center gap-2 text-3xl font-bold tracking-tight text-white">
          <Clapperboard className="w-8 h-8 text-red-600" />
          KLIPSTER
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400 w-full md:w-auto justify-center md:justify-end">
          Sort By
          <select className="bg-[#1c2333] border border-gray-700 rounded-md px-3 py-1.5 text-white outline-none focus:border-gray-500">
            <option>Newest</option>
          </select>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#1c2333] rounded-lg p-2 flex gap-2 mb-6 overflow-x-auto whitespace-nowrap">
        {['All', 'Music', 'Logo', 'Clipping', 'UGC'].map(f => (
          <button 
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors shrink-0 ${activeFilter === f ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Checkboxes */}
      <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-8 text-sm text-gray-300">
        {['TikTok', 'Instagram', 'YouTube', 'X'].map(platform => (
          <label key={platform} className="flex items-center gap-2 cursor-pointer shrink-0">
            <input 
              type="checkbox" 
              defaultChecked 
              className="w-4 h-4 text-red-600 rounded bg-gray-800 border-gray-700 focus:ring-red-600 focus:ring-offset-gray-900 accent-red-600" 
            />
            {platform}
          </label>
        ))}
        <span className="text-gray-500 w-full sm:w-auto sm:ml-auto text-center sm:text-left mt-2 sm:mt-0">50 from 50 campaigns</span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {displayCampaigns.map(campaign => (
          <div key={campaign.id} className="bg-[#1c2333] rounded-2xl p-4 flex flex-col border border-gray-800 hover:border-gray-700 transition-colors">
            <div className="flex flex-col sm:flex-row gap-4 mb-4 sm:h-40">
              {/* Image */}
              <div className="w-full sm:w-1/2 h-40 sm:h-auto relative rounded-xl overflow-hidden bg-gray-800 shrink-0">
                <img 
                  src={campaign.imageUrl || `https://picsum.photos/seed/${campaign.imgSeed || campaign.id}/400/400`} 
                  alt={campaign.title}
                  className="object-cover w-full h-full" 
                />
                <div className="absolute bottom-2 left-2 flex gap-1 flex-wrap">
                  {(campaign.tags || ['Music', 'New']).map((tag: string, i: number) => (
                    <span key={i} className={`${tag === 'Music' || tag === 'Logo' ? 'bg-red-600' : 'bg-green-500'} text-white text-[10px] font-bold px-2 py-0.5 rounded-full`}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              {/* Info */}
              <div className="w-full sm:w-1/2 flex flex-col justify-center">
                <h3 className="text-lg font-bold text-white mb-4 leading-tight">{campaign.title}</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Creators</span>
                    <div className="flex items-center">
                      <div className="flex -space-x-2">
                        <div className="w-5 h-5 rounded-full bg-gray-600 border border-[#1c2333]"></div>
                        <div className="w-5 h-5 rounded-full bg-gray-500 border border-[#1c2333]"></div>
                        <div className="w-5 h-5 rounded-full bg-gray-400 border border-[#1c2333]"></div>
                      </div>
                      <span className="text-white ml-1 text-xs">+{campaign.creators || 27}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Budget</span>
                    <span className="text-green-500 font-bold">${campaign.budget}</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Budget Used</span>
                    <span className="text-white">{campaign.budgetUsed || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-700 h-1 rounded-full mt-1">
                    <div className="bg-green-500 h-1 rounded-full" style={{ width: `${campaign.budgetUsed || 0}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="h-px bg-gray-800 w-full my-2"></div>
            
            <div className="flex justify-between items-end mt-2">
              <div>
                <p className="text-gray-400 text-xs mb-1">Rate per 1M Views</p>
                <p className="text-white text-xl font-bold">${campaign.ratePer1M || campaign.rate || '130.00'}</p>
              </div>
              <Link to={`/creators/campaign/${campaign.id}`} className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-6 py-1.5 rounded-full transition-colors">
                Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SubmitContent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [contentUrl, setContentUrl] = useState('');
  const [ftcAgreed, setFtcAgreed] = useState(false);

  useEffect(() => {
    const fetchCampaign = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'campaigns', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCampaign({ id: docSnap.id, ...docSnap.data() });
        } else {
          // Fallback to mock data if not found in db
          const mock = mockCampaigns.find(c => c.id === id);
          if (mock) setCampaign(mock);
        }
      } catch (error) {
        console.error("Error fetching campaign:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaign();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser || !id) return;

    if (!ftcAgreed) {
      alert('You must agree to the FTC material connection disclosure.');
      return;
    }

    setSubmitting(true);
    try {
      await addDoc(collection(db, `campaigns/${id}/content`), {
        campaignId: id,
        creatorUid: auth.currentUser.uid,
        url: contentUrl,
        status: 'pending',
        submittedAt: new Date().toISOString(),
        ftcAgreed: true
      });
      alert('Content submitted successfully!');
      navigate('/creators');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `campaigns/${id}/content`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-12 text-gray-400">Loading...</div>;
  if (!campaign) return <div className="text-center py-12 text-gray-400">Campaign not found.</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl md:text-2xl font-bold text-white">Submit to Campaign</h2>
        <Link to="/creators" className="text-gray-400 hover:text-white transition-colors text-sm md:text-base">Back</Link>
      </div>

      <div className="bg-[#1c2333] p-6 rounded-xl border border-gray-800">
        <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-4">
          <h3 className="text-xl font-bold text-white">{campaign.title}</h3>
          <span className="bg-green-500/20 text-green-400 font-medium px-3 py-1 rounded-full border border-green-500/30 shrink-0">${campaign.budget}</span>
        </div>
        <p className="text-gray-300 mb-4">{campaign.description || 'No description provided.'}</p>
        <div className="bg-[#0b0f19] p-4 rounded-lg border border-gray-800">
          <h4 className="font-semibold text-white mb-2">Requirements:</h4>
          <p className="text-gray-400 text-sm whitespace-pre-wrap">{campaign.requirements || 'Standard requirements apply.'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#1c2333] p-6 rounded-xl border border-gray-800 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Content URL (TikTok, Instagram, YouTube, etc.)</label>
          <input
            type="url"
            required
            value={contentUrl}
            onChange={e => setContentUrl(e.target.value)}
            className="w-full p-3 bg-[#0b0f19] border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-red-600 outline-none text-white placeholder-gray-600"
            placeholder="https://..."
          />
        </div>

        <label className="flex items-start gap-3 p-4 bg-red-900/20 rounded-lg border border-red-900/30">
          <input
            type="checkbox"
            required
            checked={ftcAgreed}
            onChange={(e) => setFtcAgreed(e.target.checked)}
            className="mt-1 h-4 w-4 text-red-600 rounded bg-gray-800 border-gray-700 focus:ring-red-600 focus:ring-offset-gray-900 accent-red-600"
          />
          <span className="text-sm text-red-200">
            <strong className="text-red-400">FTC Material Connection Disclosure:</strong> I confirm that my content clearly and conspicuously discloses my material connection to the brand (e.g., using #ad or #sponsored), in compliance with FTC guidelines.
          </span>
        </label>

        <button
          type="submit"
          disabled={submitting || !ftcAgreed || !contentUrl}
          className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Submitting...' : 'Submit Content'}
        </button>
      </form>
    </div>
  );
}

export default function CreatorDashboard() {
  return (
    <Routes>
      <Route path="/" element={<CreatorHome />} />
      <Route path="/explore" element={<CreatorOverview />} />
      <Route path="/my-campaigns" element={<MyCampaigns />} />
      <Route path="/connected-accounts" element={<ConnectedAccounts />} />
      <Route path="/balance" element={<Balance />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/campaign/:id" element={<SubmitContent />} />
      <Route path="/editor" element={<VideoEditor />} />
    </Routes>
  );
}

function CreatorHome() {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-[#1c2333] rounded-xl p-6 border border-gray-800">
          <div className="flex items-center gap-2 mb-6">
            <User className="text-red-600 w-6 h-6" />
            <h2 className="text-xl font-bold text-white">Profile</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-gray-300">
              <User className="w-5 h-5 text-gray-400" />
              <span>Username: <span className="text-gray-400">{auth.currentUser?.displayName || 'User'}</span></span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-gray-300">
              <Fingerprint className="w-5 h-5 text-gray-400 shrink-0" />
              <span className="truncate max-w-[150px] sm:max-w-none">User ID: <span className="text-gray-400">{auth.currentUser?.uid?.substring(0, 16)}...</span></span>
              <button className="text-red-500 hover:text-red-400 flex items-center gap-1 text-sm ml-auto shrink-0">
                <Copy className="w-4 h-4" /> Copy
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Card */}
        <div className="bg-[#1c2333] rounded-xl p-6 border border-gray-800">
          <div className="flex items-center gap-2 mb-6">
            <LineChart className="text-red-600 w-6 h-6" />
            <h2 className="text-xl font-bold text-white">Statistics</h2>
          </div>
          <div className="flex items-center justify-center h-32 text-gray-500 gap-2">
            <Clock className="w-5 h-5" /> Coming soon...
          </div>
        </div>

        {/* Video Editor Card */}
        <div className="bg-[#1c2333] rounded-xl p-6 border border-gray-800 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <Video className="text-red-600 w-6 h-6" />
            <h2 className="text-xl font-bold text-white">Video Editor</h2>
          </div>
          <p className="text-gray-400 mb-6 text-sm">Edit your content directly in Klipster.</p>
          <Link to="/creators/editor" className="mt-auto bg-red-600 hover:bg-red-700 text-white text-center py-2 rounded-lg font-medium transition-colors">
            Open Editor
          </Link>
        </div>

        {/* Recent Activity Card */}
        <div className="bg-[#1c2333] rounded-xl p-6 border border-gray-800">
          <div className="flex items-center gap-2 mb-6">
            <History className="text-red-600 w-6 h-6" />
            <h2 className="text-xl font-bold text-white">Recent Activity</h2>
          </div>
          <div className="flex items-center justify-center h-32 text-gray-500 gap-2">
            <Inbox className="w-5 h-5" /> No recent activity
          </div>
        </div>
      </div>
    </div>
  );
}

function MyCampaigns() {
  return (
    <div className="w-full">
      <div className="bg-[#1c2333] rounded-xl p-4 mb-8 border border-gray-800 flex items-start gap-3">
        <Info className="text-blue-400 w-5 h-5 mt-0.5 shrink-0" />
        <p className="text-gray-300 text-sm">
          Earnings will be credited to your Klipster Wallet. Please go to the <Link to="/creators/balance" className="text-red-500 hover:underline">Balance</Link> page to withdraw your earnings. All posts are subject to review and earnings are not final.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="w-24 h-24 rounded-full bg-red-900/20 flex items-center justify-center mb-6">
          <Search className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-4">No Campaigns</h2>
        <p className="text-gray-400 text-center max-w-md">
          You do not participate in any campaigns at the moment. Try submitting a video to one of the campaigns on the <Link to="/creators/explore" className="text-red-500 hover:underline">Explore</Link> page.
        </p>
      </div>
    </div>
  );
}

function ConnectedAccounts() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileLink, setProfileLink] = useState('');

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-red-600 text-center md:text-left">Connected Accounts</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white px-6 py-3 md:py-2 rounded-full font-medium flex items-center justify-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" /> Connect Account
        </button>
      </div>

      <div className="border border-dashed border-gray-700 rounded-2xl p-12 flex flex-col items-center justify-center min-h-[400px]">
        <Plus className="w-16 h-16 text-red-600 mb-6" />
        <h2 className="text-2xl font-bold text-white mb-2">No Connected Accounts</h2>
        <p className="text-gray-400">Connect your social media accounts to get started</p>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1c2333] rounded-xl w-full max-w-md overflow-hidden border border-gray-800 shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-gray-800">
              <h2 className="text-xl font-bold text-red-500">Connect Social Media Account</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Profile Link</label>
                <input
                  type="url"
                  value={profileLink}
                  onChange={(e) => setProfileLink(e.target.value)}
                  placeholder="https://www.tiktok.com/@pawlash"
                  className="w-full p-3 bg-[#0b0f19] border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-red-600 outline-none text-white placeholder-gray-600"
                />
              </div>
              <button 
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition-colors mt-4"
                onClick={() => {
                  alert('Verification started for: ' + profileLink);
                  setIsModalOpen(false);
                  setProfileLink('');
                }}
              >
                Start Verification
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Balance() {
  return (
    <div className="w-full max-w-5xl">
      <h1 className="text-3xl font-bold text-white mb-8">My Balance</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {/* Campaign Balance */}
        <div className="bg-[#1c2333] rounded-xl p-6 border border-gray-800 flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-lg font-medium text-white">Campaign Balance</h2>
            <div className="w-10 h-10 rounded-full bg-red-900/30 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-red-500" />
            </div>
          </div>
          <div className="text-4xl font-bold text-red-500 mb-6">$0.00</div>
          <p className="text-gray-400 text-sm mb-2">Minimum withdrawal amount is $50.00</p>
          <p className="text-gray-500 text-xs italic mb-6 flex-1">
            Campaign earnings will show up in your balance after a campaign has ended. If the campaign is awaiting payout, you still need to wait.
          </p>
          <button className="w-full bg-red-900/50 text-red-400/50 py-3 rounded-lg font-medium cursor-not-allowed">
            Request Campaign Payout
          </button>
        </div>

        {/* Referral Balance */}
        <div className="bg-[#1c2333] rounded-xl p-6 border border-gray-800 flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-lg font-medium text-white">Referral Balance</h2>
            <div className="w-10 h-10 rounded-full bg-red-900/30 flex items-center justify-center">
              <Users className="w-5 h-5 text-red-500" />
            </div>
          </div>
          <div className="text-4xl font-bold text-red-500 mb-6">$0.00</div>
          <p className="text-gray-400 text-sm mb-6 flex-1">Minimum withdrawal amount is $50.00</p>
          <div className="space-y-3">
            <button className="w-full bg-red-900/50 text-red-400/50 py-3 rounded-lg font-medium cursor-not-allowed">
              Request Referral Payout
            </button>
            <button className="w-full border border-gray-600 text-gray-300 hover:bg-gray-800 py-3 rounded-lg font-medium transition-colors">
              My Referrals
            </button>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-white mb-6">Payment Information</h2>
      <div className="bg-[#1c2333] rounded-xl p-6 border border-gray-800 space-y-6 mb-12">
        <div className="flex gap-4">
          <div className="mt-1">
            <div className="w-6 h-6 rounded-full border border-red-500 flex items-center justify-center">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            </div>
          </div>
          <div>
            <h3 className="text-white font-medium mb-2">Minimum Withdrawal</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              To optimize the payment process and minimize transaction costs for all parties involved, we maintain a minimum withdrawal threshold of $50. This policy helps ensure that the processing fees remain proportional to the transferred amount while maintaining the efficiency of our payment operations. This threshold has been carefully calculated to provide the best balance between frequent access to your earnings and cost-effectiveness.
            </p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="mt-1">
            <div className="w-6 h-6 rounded-full border border-red-500 flex items-center justify-center text-red-500 font-bold text-xs">
              !
            </div>
          </div>
          <div>
            <h3 className="text-white font-medium mb-2">Payment Fees</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              A platform service fee of 3% is applied to all withdrawals to cover operational costs. Additionally, each payment processor has its own fee structure that varies by payment method and region. The final amount you receive will depend on your chosen payment method and your geographical location. We continuously work with our payment partners to negotiate the most favorable rates for our users while ensuring secure and reliable transactions.
            </p>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-white mb-6">Recent Transactions</h2>
      <div className="bg-[#1c2333] rounded-xl p-8 border border-gray-800 text-center mb-8">
        <p className="text-gray-400">Your recent transaction history will appear here once you have completed payments.</p>
      </div>

      <div className="bg-[#1c2333] rounded-xl p-6 border border-gray-800">
        <h2 className="text-xl font-bold text-white mb-4">Need Help?</h2>
        <p className="text-gray-400 mb-4">If you have any questions about payments or need assistance, our support team is here to help.</p>
        <button className="text-red-500 hover:text-red-400 font-medium flex items-center gap-1 transition-colors">
          Contact Support <span className="text-lg">›</span>
        </button>
      </div>
    </div>
  );
}

function Profile() {
  const user = auth.currentUser;
  
  return (
    <div className="w-full max-w-5xl">
      <h1 className="text-3xl font-bold text-red-600 mb-8">Profile</h1>

      {/* User Info Card */}
      <div className="bg-[#1c2333] rounded-xl p-6 border border-gray-800 mb-6 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
        <div className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center text-3xl font-bold text-white shrink-0">
          {user?.displayName?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div className="flex flex-col items-center sm:items-start">
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-2xl font-bold text-white">{user?.displayName || 'User'}</h2>
            <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full">User</span>
          </div>
          <p className="text-gray-400 text-sm mb-1">Member since: March 23, 2026</p>
          <p className="text-gray-400 text-sm">Email: {user?.email}</p>
        </div>
      </div>

      {/* Statistics Card */}
      <div className="bg-[#1c2333] rounded-xl p-6 border border-gray-800 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-2">
            <LineChart className="text-red-600 w-6 h-6" />
            <h2 className="text-xl font-bold text-white">Statistics</h2>
          </div>
          <button className="w-full sm:w-auto justify-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors text-sm">
            <LinkIcon className="w-4 h-4" /> Generate Referral Link
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#252d40] rounded-xl p-6 relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-gray-400 text-sm mb-2">Total videos</p>
              <p className="text-3xl font-bold text-red-500">0</p>
            </div>
            <Video className="absolute right-4 bottom-4 w-16 h-16 text-red-900/20" />
          </div>
          <div className="bg-[#252d40] rounded-xl p-6 relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-gray-400 text-sm mb-2">Money earned</p>
              <p className="text-3xl font-bold text-red-500">$0</p>
            </div>
            <DollarSign className="absolute right-4 bottom-4 w-16 h-16 text-red-900/20" />
          </div>
          <div className="bg-[#252d40] rounded-xl p-6 relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-gray-400 text-sm mb-2">Total views</p>
              <p className="text-3xl font-bold text-red-500">0</p>
            </div>
            <Eye className="absolute right-4 bottom-4 w-16 h-16 text-red-900/20" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Payment Methods */}
        <div className="bg-[#1c2333] rounded-xl p-6 border border-gray-800">
          <div className="border border-dashed border-gray-700 rounded-xl p-6 flex flex-col items-center justify-center text-center mb-6">
            <Wallet className="w-8 h-8 text-gray-600 mb-3" />
            <p className="text-white font-medium mb-1">No payment method added</p>
            <p className="text-gray-500 text-sm">Add a payment method to receive earnings</p>
          </div>
          <div className="space-y-4 border border-dashed border-gray-700 rounded-xl p-4">
            <select 
              defaultValue=""
              className="w-full p-3 bg-[#0b0f19] border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-red-600 outline-none text-white appearance-none"
            >
              <option value="" disabled>Select payment method</option>
              <option value="paypal">PayPal</option>
              <option value="bank">Bank Transfer</option>
            </select>
            <input 
              type="text" 
              placeholder="Enter payment details" 
              className="w-full p-3 bg-[#0b0f19] border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-red-600 outline-none text-white placeholder-gray-600"
            />
            <input 
              type="text" 
              placeholder="Nickname (optional)" 
              className="w-full p-3 bg-[#0b0f19] border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-red-600 outline-none text-white placeholder-gray-600"
            />
            <button className="w-full bg-red-900/50 text-red-400 py-3 rounded-lg font-medium hover:bg-red-900/70 transition-colors">
              Add Payment Method
            </button>
          </div>
        </div>

        {/* Login Methods */}
        <div className="bg-[#1c2333] rounded-xl p-6 border border-gray-800">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-red-900/30 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-red-500" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-gray-400 text-xs">Email</p>
                  <p className="text-white text-sm truncate">{user?.email || 'dostatok.tr@gmail.com'}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-red-900/30 flex items-center justify-center shrink-0">
                  <span className="text-red-500 font-bold">G</span>
                </div>
                <div>
                  <p className="text-white text-sm">Google</p>
                </div>
              </div>
              <button className="text-red-500 hover:text-red-400">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center shrink-0">
                  <span className="text-gray-400 font-bold">D</span>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Discord</p>
                </div>
              </div>
              <button className="text-red-500 hover:text-red-400 text-sm font-medium">
                + Add
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center shrink-0">
                  <span className="text-gray-400 font-bold">A</span>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Apple</p>
                </div>
              </div>
              <button className="text-red-500 hover:text-red-400 text-sm font-medium">
                + Add
              </button>
            </div>
          </div>
        </div>

        {/* Username */}
        <div className="bg-[#1c2333] rounded-xl p-6 border border-gray-800">
          <div className="bg-[#0b0f19] border border-gray-700 rounded-lg p-3 flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Lock className="w-4 h-4 text-yellow-500" />
              <span className="text-gray-300">{user?.displayName?.toLowerCase().replace(/\s+/g, '') || 'romank'}</span>
            </div>
            <button className="text-red-500 hover:text-red-400 flex items-center gap-1 text-sm">
              <Copy className="w-4 h-4" /> Copy
            </button>
          </div>
          <div className="flex gap-2 text-gray-500 text-xs">
            <Info className="w-4 h-4 shrink-0" />
            <p>Your username cannot be changed once set. It is used for your referral link and profile URL.</p>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-[#1c2333] rounded-xl p-6 border border-gray-800">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-red-500 font-bold text-xl">⚠️</span>
          <h2 className="text-xl font-bold text-white">Danger Zone</h2>
        </div>
        <p className="text-gray-400 mb-6">Once you delete your account, there is no going back. Please be certain.</p>
        <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
          Delete Account
        </button>
      </div>
    </div>
  );
}

