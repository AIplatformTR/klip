import { Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { collection, getDocs, doc, getDoc, addDoc, query, where, collectionGroup } from 'firebase/firestore';

function CreatorOverview() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!auth.currentUser) return;
      try {
        // Fetch active campaigns
        const qCamps = query(collection(db, 'campaigns'), where('status', '==', 'active'));
        const campsSnapshot = await getDocs(qCamps);
        const camps = campsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCampaigns(camps);

        // Fetch user's submissions using collectionGroup
        const qSubs = query(collectionGroup(db, 'content'), where('creatorUid', '==', auth.currentUser.uid));
        const subsSnapshot = await getDocs(qSubs);
        const subs = subsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Fetch campaign details for each submission to display the title
        const subsWithCampaigns = await Promise.all(subs.map(async (sub: any) => {
          const campDoc = await getDoc(doc(db, 'campaigns', sub.campaignId));
          return { ...sub, campaignTitle: campDoc.exists() ? campDoc.data().title : 'Unknown Campaign' };
        }));
        
        setSubmissions(subsWithCampaigns);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const approvedSubmissions = submissions.filter(s => s.status === 'approved');
  const pendingPayouts = approvedSubmissions.reduce((acc, curr: any) => {
    // In a real app, we'd check if 30 days have passed. For now, we sum all approved.
    const camp = campaigns.find(c => c.id === curr.campaignId);
    return acc + (camp?.budget || 0);
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Creator Dashboard</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Total Submissions</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{submissions.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Pending Payouts (30-day hold)</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">${pendingPayouts.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Available Balance</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">$0.00</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Available Campaigns</h2>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading campaigns...</div>
          ) : campaigns.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No active campaigns available right now.</div>
          ) : (
            <div className="space-y-4">
              {campaigns.map(campaign => (
                <div key={campaign.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-gray-900">{campaign.title}</h3>
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">${campaign.budget}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{campaign.description}</p>
                  <Link to={`/creators/campaign/${campaign.id}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View Details & Submit &rarr;
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">My Content Submissions</h2>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading submissions...</div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              You haven't submitted any content yet.
            </div>
          ) : (
            <div className="space-y-4">
              {submissions.map(sub => (
                <div key={sub.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900">{sub.campaignTitle}</h3>
                    <span className={`px-2.5 py-0.5 rounded text-xs font-medium capitalize ${
                      sub.status === 'approved' ? 'bg-green-100 text-green-800' : 
                      sub.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {sub.status}
                    </span>
                  </div>
                  <a href={sub.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm break-all">
                    {sub.url}
                  </a>
                  <p className="text-xs text-gray-500 mt-2">Submitted: {new Date(sub.submittedAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
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
      console.error('Error submitting content:', error);
      alert('Failed to submit content.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (!campaign) return <div className="text-center py-12">Campaign not found.</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Submit to Campaign</h2>
        <Link to="/creators" className="text-gray-500 hover:text-gray-700">Back</Link>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gray-900">{campaign.title}</h3>
          <span className="bg-green-100 text-green-800 font-medium px-3 py-1 rounded-full">${campaign.budget}</span>
        </div>
        <p className="text-gray-700 mb-4">{campaign.description}</p>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-2">Requirements:</h4>
          <p className="text-gray-600 text-sm whitespace-pre-wrap">{campaign.requirements}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Content URL (TikTok, Instagram, YouTube, etc.)</label>
          <input
            type="url"
            required
            value={contentUrl}
            onChange={e => setContentUrl(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="https://..."
          />
        </div>

        <label className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <input
            type="checkbox"
            required
            checked={ftcAgreed}
            onChange={(e) => setFtcAgreed(e.target.checked)}
            className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300"
          />
          <span className="text-sm text-blue-900">
            <strong>FTC Material Connection Disclosure:</strong> I confirm that my content clearly and conspicuously discloses my material connection to the brand (e.g., using #ad or #sponsored), in compliance with FTC guidelines.
          </span>
        </label>

        <button
          type="submit"
          disabled={submitting || !ftcAgreed || !contentUrl}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
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

