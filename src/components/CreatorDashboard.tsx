import { Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import { collection, getDocs, doc, getDoc, addDoc, query, where, collectionGroup } from 'firebase/firestore';
import { Clapperboard } from 'lucide-react';

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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold uppercase tracking-wider text-white">Campaigns</h1>
        <div className="flex items-center gap-2 text-3xl font-bold tracking-tight text-white">
          <Clapperboard className="w-8 h-8" />
          CLIPSTER
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          Sort By
          <select className="bg-[#1c2333] border border-gray-700 rounded-md px-3 py-1.5 text-white outline-none focus:border-gray-500">
            <option>Newest</option>
          </select>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#1c2333] rounded-lg p-2 flex gap-2 mb-6">
        {['All', 'Music', 'Logo', 'Clipping', 'UGC'].map(f => (
          <button 
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${activeFilter === f ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Checkboxes */}
      <div className="flex items-center gap-6 mb-8 text-sm text-gray-300">
        {['TikTok', 'Instagram', 'YouTube', 'X'].map(platform => (
          <label key={platform} className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              defaultChecked 
              className="w-4 h-4 text-red-600 rounded bg-gray-800 border-gray-700 focus:ring-red-600 focus:ring-offset-gray-900 accent-red-600" 
            />
            {platform}
          </label>
        ))}
        <span className="text-gray-500 ml-auto">50 from 50 campaigns</span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {displayCampaigns.map(campaign => (
          <div key={campaign.id} className="bg-[#1c2333] rounded-2xl p-4 flex flex-col border border-gray-800 hover:border-gray-700 transition-colors">
            <div className="flex gap-4 mb-4 h-40">
              {/* Image */}
              <div className="w-1/2 relative rounded-xl overflow-hidden bg-gray-800">
                <img 
                  src={campaign.imageUrl || `https://picsum.photos/seed/${campaign.imgSeed || campaign.id}/400/400`} 
                  alt={campaign.title}
                  className="object-cover w-full h-full" 
                />
                <div className="absolute bottom-2 left-2 flex gap-1">
                  {(campaign.tags || ['Music', 'New']).map((tag: string, i: number) => (
                    <span key={i} className={`${tag === 'Music' || tag === 'Logo' ? 'bg-red-600' : 'bg-green-500'} text-white text-[10px] font-bold px-2 py-0.5 rounded-full`}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              {/* Info */}
              <div className="w-1/2 flex flex-col justify-center">
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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Submit to Campaign</h2>
        <Link to="/creators" className="text-gray-400 hover:text-white transition-colors">Back</Link>
      </div>

      <div className="bg-[#1c2333] p-6 rounded-xl border border-gray-800">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-white">{campaign.title}</h3>
          <span className="bg-green-500/20 text-green-400 font-medium px-3 py-1 rounded-full border border-green-500/30">${campaign.budget}</span>
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
      <Route path="/" element={<CreatorOverview />} />
      <Route path="/campaign/:id" element={<SubmitContent />} />
    </Routes>
  );
}

