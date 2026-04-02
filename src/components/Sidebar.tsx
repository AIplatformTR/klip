import { Compass, Flag, Users, Wallet, User, LogOut, Settings, Clapperboard } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { logout } from '../firebase';

export default function Sidebar({ userRole }: { userRole?: 'brand' | 'creator' | null }) {
  const location = useLocation();
  const path = location.pathname;

  const creatorNavItems = [
    { icon: Compass, path: '/creators/explore' },
    { icon: Flag, path: '/creators/my-campaigns' },
    { icon: Users, path: '/creators/connected-accounts' },
    { icon: Wallet, path: '/creators/balance' },
    { icon: User, path: '/creators/profile' },
  ];

  const brandNavItems = [
    { icon: Compass, path: '/brands' },
    { icon: Flag, path: '/brands/campaigns' },
    { icon: User, path: '/brands/profile' },
  ];

  const navItems = userRole === 'creator' ? creatorNavItems : brandNavItems;
  const homePath = userRole === 'creator' ? '/creators' : '/brands';

  return (
    <div className="w-20 bg-[#0b0f19] h-screen fixed left-0 top-0 flex flex-col items-center py-6 border-r border-gray-800 z-50">
      <div className="mb-8">
        <Link to={homePath} className="bg-red-600 p-2 rounded-xl flex items-center justify-center hover:bg-red-700 transition-colors">
          <Clapperboard className="text-white w-6 h-6" />
        </Link>
      </div>
      <div className="flex-1 flex flex-col gap-4 w-full px-3 mt-4">
        {navItems.map((item, i) => {
          const Icon = item.icon;
          const isActive = path === item.path;
          return (
            <Link 
              key={i} 
              to={item.path} 
              className={`w-full flex justify-center py-3 rounded-xl transition-colors ${isActive ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-gray-500 hover:text-white hover:bg-gray-800'}`}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            </Link>
          );
        })}
      </div>
      <div className="mt-auto flex flex-col gap-4 w-full px-3">
        <button onClick={logout} className="w-full flex justify-center py-3 rounded-xl text-gray-500 hover:text-white hover:bg-gray-800 transition-colors">
          <LogOut size={24} />
        </button>
        <button className="w-full flex justify-center py-3 rounded-xl text-gray-500 hover:text-white hover:bg-gray-800 transition-colors">
          <Settings size={24} />
        </button>
      </div>
    </div>
  );
}
