import { Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import { collection, addDoc, query, where, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';

function BrandOverview() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      if (!auth.currentUser) return;
      try {
        const q = query(collection(db, 'campaigns'), where('brandUid', '==', auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        const camps = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCampaigns(camps);
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, 'campaigns');
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Brand Dashboard</h1>
        <Link to="/brands/new" className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors">
          Create Campaign
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1c2333] p-6 rounded-xl shadow-sm border border-gray-800">
          <h3 className="text-gray-400 text-sm font-medium">Active Campaigns</h3>
          <p className="text-3xl font-bold text-white mt-2">{campaigns.length}</p>
        </div>
        <div className="bg-[#1c2333] p-6 rounded-xl shadow-sm border border-gray-800">
          <h3 className="text-gray-400 text-sm font-medium">Pending Approvals</h3>
          <p className="text-3xl font-bold text-white mt-2">0</p>
        </div>
        <div className="bg-[#1c2333] p-6 rounded-xl shadow-sm border border-gray-800">
          <h3 className="text-gray-400 text-sm font-medium">Total Budget Allocated</h3>
          <p className="text-3xl font-bold text-white mt-2">
            ${campaigns.reduce((acc, curr) => acc + (curr.budget || 0), 0).toFixed(2)}
          </p>
        </div>
      </div>

      <div className="bg-[#1c2333] rounded-xl shadow-sm border border-gray-800 p-6">
        <h2 className="text-xl font-bold text-white mb-4">My Campaigns</h2>
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading campaigns...</div>
        ) : campaigns.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            No campaigns created yet. Click "Create Campaign" to get started.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="py-3 px-4 font-semibold text-gray-400">Title</th>
                  <th className="py-3 px-4 font-semibold text-gray-400">Budget</th>
                  <th className="py-3 px-4 font-semibold text-gray-400">Status</th>
                  <th className="py-3 px-4 font-semibold text-gray-400">Action</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map(campaign => (
                  <tr key={campaign.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                    <td className="py-3 px-4 font-medium text-white">{campaign.title}</td>
                    <td className="py-3 px-4 text-gray-300">${campaign.budget}</td>
                    <td className="py-3 px-4">
                      <span className="bg-green-500/20 text-green-400 border border-green-500/30 text-xs font-medium px-2.5 py-0.5 rounded capitalize">
                        {campaign.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Link to={`/brands/campaign/${campaign.id}`} className="text-red-500 hover:text-red-400 font-medium text-sm">
                        View Submissions
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function CampaignDetails() {
  const { id } = useParams();
  const [campaign, setCampaign] = useState<any>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'campaigns', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCampaign({ id: docSnap.id, ...docSnap.data() });
        }

        const q = query(collection(db, `campaigns/${id}/content`));
        const querySnapshot = await getDocs(q);
        const subs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setSubmissions(subs);
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `campaigns/${id}`);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleUpdateStatus = async (submissionId: string, newStatus: 'approved' | 'rejected') => {
    try {
      const subRef = doc(db, `campaigns/${id}/content`, submissionId);
      await updateDoc(subRef, { status: newStatus });
      setSubmissions(submissions.map(sub => sub.id === submissionId ? { ...sub, status: newStatus } : sub));
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `campaigns/${id}/content/${submissionId}`);
    }
  };

  if (loading) return <div className="text-center py-12 text-gray-400">Loading...</div>;
  if (!campaign) return <div className="text-center py-12 text-gray-400">Campaign not found.</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">{campaign.title} - Submissions</h2>
        <Link to="/brands" className="text-gray-400 hover:text-white transition-colors">Back to Dashboard</Link>
      </div>

      <div className="bg-[#1c2333] rounded-xl shadow-sm border border-gray-800 p-6">
        {submissions.length === 0 ? (
          <div className="text-center py-12 text-gray-400">No content submitted yet.</div>
        ) : (
          <div className="space-y-4">
            {submissions.map(sub => (
              <div key={sub.id} className="border border-gray-800 rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#0b0f19]">
                <div>
                  <a href={sub.url} target="_blank" rel="noopener noreferrer" className="text-red-500 hover:underline font-medium break-all">
                    {sub.url}
                  </a>
                  <p className="text-sm text-gray-400 mt-1">Submitted: {new Date(sub.submittedAt).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-400">FTC Compliant: {sub.ftcAgreed ? 'Yes' : 'No'}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                    sub.status === 'approved' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 
                    sub.status === 'rejected' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 
                    'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                  }`}>
                    {sub.status}
                  </span>
                  {sub.status === 'pending' && (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleUpdateStatus(sub.id, 'approved')}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm font-medium transition-colors"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleUpdateStatus(sub.id, 'rejected')}
                        className="bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-600 text-sm font-medium transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CreateCampaign() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    requirements: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'campaigns'), {
        brandUid: auth.currentUser.uid,
        title: formData.title,
        description: formData.description,
        budget: parseFloat(formData.budget),
        requirements: formData.requirements,
        createdAt: new Date().toISOString(),
        status: 'active'
      });
      navigate('/brands');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'campaigns');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-[#1c2333] p-8 rounded-xl shadow-sm border border-gray-800">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Create New Campaign</h2>
        <Link to="/brands" className="text-gray-400 hover:text-white transition-colors">Cancel</Link>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Campaign Title</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})}
            className="w-full p-3 bg-[#0b0f19] border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-red-600 outline-none text-white placeholder-gray-600"
            placeholder="e.g., Summer TikTok Challenge"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
          <textarea
            required
            rows={4}
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
            className="w-full p-3 bg-[#0b0f19] border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-red-600 outline-none text-white placeholder-gray-600"
            placeholder="Describe your campaign goals and what you are looking for..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Budget ($)</label>
          <input
            type="number"
            required
            min="1"
            step="0.01"
            value={formData.budget}
            onChange={e => setFormData({...formData, budget: e.target.value})}
            className="w-full p-3 bg-[#0b0f19] border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-red-600 outline-none text-white placeholder-gray-600"
            placeholder="500.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Content Requirements</label>
          <textarea
            required
            rows={3}
            value={formData.requirements}
            onChange={e => setFormData({...formData, requirements: e.target.value})}
            className="w-full p-3 bg-[#0b0f19] border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-red-600 outline-none text-white placeholder-gray-600"
            placeholder="e.g., Must include product placement, 15-30 seconds long..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Creating...' : 'Publish Campaign'}
        </button>
      </form>
    </div>
  );
}

export default function BrandDashboard() {
  return (
    <Routes>
      <Route path="/" element={<BrandOverview />} />
      <Route path="/new" element={<CreateCampaign />} />
      <Route path="/campaign/:id" element={<CampaignDetails />} />
    </Routes>
  );
}


