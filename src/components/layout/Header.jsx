import { useState, useRef, useEffect } from 'react';
import { ChevronDown, User, Shield, ChevronUp, Check, Keyboard, LogOut } from 'lucide-react';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isRoleOpen, setIsRoleOpen] = useState(true);
  const [activeRole, setActiveRole] = useState('Super Admin');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 border-b border-dark-600/50 bg-[#0B0F17]/95 backdrop-blur-sm sticky top-0 z-50 flex items-center justify-end px-6">
      {/* <div className="flex-1 flex max-w-2xl">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-500" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-12 py-2 border border-dark-600 rounded-md leading-5 bg-dark-800 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-brand-green sm:text-sm transition-colors"
            placeholder="Search articles, users, publishers..."
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-500 text-xs border border-dark-600 rounded px-1.5 py-0.5 font-medium">⌘K</span>
          </div>
        </div>
      </div> */}

      <div className="flex items-center gap-6 ml-4">
        {/* <button className="relative text-gray-400 hover:text-white transition-colors">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-red text-[10px] text-white font-bold ring-2 ring-[#0B0F17]">
            5
          </span>
        </button> */}

        <div className="relative" ref={dropdownRef}>
          <div 
            className="flex items-center gap-3 cursor-pointer hover:bg-dark-800 p-1.5 rounded-lg transition-colors border border-transparent hover:border-dark-600"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className="w-8 h-8 rounded-full bg-brand-green flex items-center justify-center text-dark-900 font-bold text-sm">
              SA
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium text-white">Super Admin</span>
              <ChevronDown size={16} className={`text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </div>
          </div>

          {/* Settings Dropdown Panel */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-[#111827] rounded-xl border border-dark-600 shadow-2xl py-2 z-50">
              {/* User Identity */}
              <div className="px-4 py-3 border-b border-dark-600/50 mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-green flex items-center justify-center text-dark-900 font-bold text-lg">
                    SA
                  </div>
                  <div>
                    <h4 className="text-white font-bold leading-tight">Admin User</h4>
                    <p className="text-gray-400 text-xs mt-0.5">admin@newsapp.io</p>
                  </div>
                </div>
                <div className="mt-3 inline-flex items-center gap-1.5 text-brand-green bg-brand-green/10 border border-brand-green/20 px-2.5 py-1 rounded-md text-xs font-bold">
                  <Shield size={12} fill="currentColor" className="text-brand-green" /> Super Admin
                </div>
              </div>

              {/* Menu Options */}
              <div className="space-y-1 px-2">
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-dark-800 rounded-lg transition-colors">
                  <User size={16} className="text-gray-500" />
                  Profile & Preferences
                </button>

                {/* Switch Role Submenu */}
                <div className="py-1">
                  <button 
                    className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-dark-800 rounded-lg transition-colors"
                    onClick={() => setIsRoleOpen(!isRoleOpen)}
                  >
                    <div className="flex items-center gap-3">
                      <Shield size={16} className="text-gray-500" />
                      Switch Role
                    </div>
                    {isRoleOpen ? <ChevronUp size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
                  </button>

                  {isRoleOpen && (
                    <div className="mt-1 ml-4 border-l border-dark-600 space-y-1">
                      <button 
                        onClick={() => setActiveRole('Super Admin')}
                        className={`w-full flex items-start gap-3 px-4 py-2 text-left hover:bg-dark-800 rounded-r-lg transition-colors ${activeRole === 'Super Admin' ? 'bg-dark-800/50' : ''}`}
                      >
                        <div className="w-6 h-6 rounded-full bg-brand-green shrink-0 flex items-center justify-center text-[10px] font-bold text-dark-900 mt-0.5">SA</div>
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${activeRole === 'Super Admin' ? 'text-white' : 'text-gray-300'}`}>Super Admin</p>
                          <p className="text-xs text-gray-500">Full access to all features</p>
                        </div>
                        {activeRole === 'Super Admin' && <Check size={16} className="text-brand-green mt-1" />}
                      </button>

                      <button 
                        onClick={() => setActiveRole('Moderator')}
                         className={`w-full flex items-start gap-3 px-4 py-2 text-left hover:bg-dark-800 rounded-r-lg transition-colors ${activeRole === 'Moderator' ? 'bg-dark-800/50' : ''}`}
                      >
                        <div className="w-6 h-6 rounded-full bg-blue-500 shrink-0 flex items-center justify-center text-[10px] font-bold text-white mt-0.5">MO</div>
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${activeRole === 'Moderator' ? 'text-white' : 'text-gray-300'}`}>Moderator</p>
                          <p className="text-xs text-gray-500">Manage content & users</p>
                        </div>
                        {activeRole === 'Moderator' && <Check size={16} className="text-brand-green mt-1" />}
                      </button>

                      <button 
                        onClick={() => setActiveRole('Analyst')}
                         className={`w-full flex items-start gap-3 px-4 py-2 text-left hover:bg-dark-800 rounded-r-lg transition-colors ${activeRole === 'Analyst' ? 'bg-dark-800/50' : ''}`}
                      >
                        <div className="w-6 h-6 rounded-full bg-purple-500 shrink-0 flex items-center justify-center text-[10px] font-bold text-white mt-0.5">AN</div>
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${activeRole === 'Analyst' ? 'text-white' : 'text-gray-300'}`}>Analyst</p>
                          <p className="text-xs text-gray-500">Read-only analytics access</p>
                        </div>
                        {activeRole === 'Analyst' && <Check size={16} className="text-brand-green mt-1" />}
                      </button>
                    </div>
                  )}
                </div>

                <button className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-dark-800 rounded-lg transition-colors mt-1">
                  <div className="flex items-center gap-3">
                     <Keyboard size={16} className="text-gray-500" />
                     Keyboard Shortcuts
                  </div>
                  <span className="text-xs bg-dark-700 text-gray-400 px-1.5 py-0.5 rounded border border-dark-600">?</span>
                </button>
              </div>

              <div className="border-t border-dark-600/50 mt-2 pt-2 px-2">
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-brand-red font-medium hover:bg-brand-red/10 rounded-lg border border-transparent hover:border-brand-red/20 transition-colors">
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>

            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
