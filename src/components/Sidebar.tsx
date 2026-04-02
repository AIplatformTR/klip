import { Home, Compass, Flag, Users, Wallet, User, LogOut, Settings, Clapperboard } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { logout } from '../firebase';

export default function Sidebar() {
  const location = useLocation();
  const path = location.pathname;

  const navItems = [
    { icon: Home, path: '/dashboard' },
    { icon: Compass, path: '/creators' },
    { icon: Flag, path: '/campaigns' },
    { icon: Users, path: '/community' },
    { icon: Wallet, path: '/wallet' },
    { icon: User, path: '/profile' },
  ];

  return (
    <div className="w-20 bg-[#0b0f19] h-screen fixed left-0 top-0 flex flex-col items-center py-6 border-r border-gray-800 z-50">
      <div className="mb-8">
        <div className="bg-red-600 p-2 rounded-xl flex items-center justify-center">
          <Clapperboard className="text-white w-6 h-6" />
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-4 w-full px-3 mt-4">
        {navItems.map((item, i) => {
          const Icon = item.icon;
          const isActive = path === item.path || (path.startsWith('/creators') && item.icon === Compass) || (path.startsWith('/brands') && item.icon === Flag);
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
