import { Compass, Flag, Users, Wallet, User, LogOut, Settings, Clapperboard, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { logout } from '../firebase';

export default function Sidebar({ userRole }: { userRole?: 'brand' | 'creator' | null }) {
  const location = useLocation();
  const path = location.pathname;

  const creatorNavItems = [
    { icon: Home, path: '/creators' },
    { icon: Compass, path: '/creators/explore' },
    { icon: Flag, path: '/creators/my-campaigns' },
    { icon: Users, path: '/creators/connected-accounts' },
    { icon: Wallet, path: '/creators/balance' },
    { icon: User, path: '/creators/profile' },
  ];

  const brandNavItems = [
    { icon: Home, path: '/brands' },
    { icon: Compass, path: '/brands/campaigns' },
    { icon: User, path: '/brands/profile' },
  ];

  const navItems = userRole === 'creator' ? creatorNavItems : brandNavItems;
  const homePath = userRole === 'creator' ? '/creators' : '/brands';

  return (
    <div className="fixed bottom-0 left-0 w-full h-16 md:w-20 md:h-screen md:top-0 bg-[#0b0f19] flex md:flex-col items-center justify-around md:justify-start md:py-6 border-t md:border-t-0 md:border-r border-gray-800 z-50">
      <div className="hidden md:block mb-8">
        <Link to={homePath} className="bg-red-600 p-2 rounded-xl flex items-center justify-center hover:bg-red-700 transition-colors">
          <Clapperboard className="text-white w-6 h-6" />
        </Link>
      </div>
      <div className="flex md:flex-col gap-1 md:gap-4 w-full px-2 md:px-3 md:mt-4 justify-around md:justify-start h-full md:h-auto items-center">
        {navItems.map((item, i) => {
          const Icon = item.icon;
          const isActive = path === item.path;
          return (
            <Link 
              key={i} 
              to={item.path} 
              className={`flex justify-center p-2 md:py-3 md:w-full rounded-xl transition-colors ${isActive ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-gray-500 hover:text-white hover:bg-gray-800'}`}
            >
              <Icon className="w-5 h-5 md:w-6 md:h-6" strokeWidth={isActive ? 2.5 : 2} />
            </Link>
          );
        })}
      </div>
      <div className="hidden md:flex mt-auto flex-col gap-4 w-full px-3">
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
