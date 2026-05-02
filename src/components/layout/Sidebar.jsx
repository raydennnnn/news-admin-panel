import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  AlertTriangle,
  Building2,
  Users,
  Hash,
  MessageSquare,
  BarChart2,
  Shield,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  Menu
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAppContext } from '../../context/AppContext';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const { user, logout } = useAuth();
  const { pendingReports, pendingVerifications } = useAppContext();

  // Accordion state
  const [expanded, setExpanded] = useState({
    content: true,
    publishers: true,
    more: true
  });

  const toggleGroup = (group) => {
    if (isCollapsed) setIsCollapsed(false); // Expand sidebar if trying to toggle a group
    setExpanded(prev => ({ ...prev, [group]: !prev[group] }));
  };

  const initials = user
    ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
    : 'SA';
  const displayName = user ? `${user.firstName} ${user.lastName}` : 'Super Admin';
  const displayEmail = user?.email || 'admin@newsapp.com';

  const getNavLinkClass = ({ isActive }) => 
    `flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 relative group ${isActive ? 'bg-brand-green/10 text-brand-green shadow-[inset_4px_0_0_rgba(34,197,94,1),0_0_12px_rgba(34,197,94,0.1)]' : 'text-gray-400 hover:text-white hover:bg-white/5 hover:translate-x-1'}`;

  const renderBadge = (count) => {
    if (!count || count <= 0) return null;
    if (isCollapsed) {
      return <span className="absolute top-2 right-2 w-2 h-2 bg-brand-red rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>;
    }
    return <span className="bg-brand-red text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">{count}</span>;
  };

  return (
    <aside className={`${isCollapsed ? 'w-20' : 'w-64'} transition-all duration-300 bg-gradient-to-b from-[#050816] to-[#0a0e1c] border-r border-white/5 flex flex-col h-screen fixed top-0 left-0 z-50 shadow-[4px_0_24px_rgba(0,0,0,0.4)] backdrop-blur-xl`}>
      {/* Header */}
      <div className={`p-5 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} border-b border-white/5 h-[80px]`}>
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-4'} overflow-hidden`}>
          <div className="w-10 h-10 rounded-xl bg-brand-green flex items-center justify-center shrink-0 shadow-[0_0_16px_rgba(34,197,94,0.4)] border border-white/10 group-hover:shadow-[0_0_20px_rgba(34,197,94,0.6)] transition-shadow">
            <span className="text-white font-bold text-xl">⚡</span>
          </div>
          {!isCollapsed && (
            <div className="animate-fade-in truncate">
              <h1 className="text-white font-bold tracking-wide text-lg leading-tight truncate">NewsAdmin</h1>
              <p className="text-[10px] text-brand-green font-medium truncate uppercase tracking-widest opacity-80">Control Panel</p>
            </div>
          )}
        </div>
        {!isCollapsed && (
          <button onClick={() => setIsCollapsed(true)} className="text-gray-500 hover:text-white transition-all p-1.5 rounded-lg hover:bg-white/5 shrink-0">
            <Menu size={20} />
          </button>
        )}
      </div>
      
      {isCollapsed && (
        <div className="flex justify-center pt-4">
          <button onClick={() => setIsCollapsed(false)} className="text-gray-500 hover:text-white transition-all p-2 rounded-xl hover:bg-white/5">
            <Menu size={20} strokeWidth={1.5} />
          </button>
        </div>
      )}
      
      {/* Scrollable Navigation */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-5 px-3 space-y-1.5 sidebar-scroll">
        <NavLink to="/" end className={getNavLinkClass} title={isCollapsed ? "Dashboard" : ""}>
          <div className="flex items-center gap-3.5">
            <LayoutDashboard size={18} className="shrink-0 group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
            {!isCollapsed && <span className="tracking-wide">Dashboard</span>}
          </div>
        </NavLink>

        {/* Content Control Section */}
        <div className="pt-4 pb-1">
          <button 
            onClick={() => toggleGroup('content')}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-4 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-1 hover:text-gray-300 transition-colors`}
          >
            {!isCollapsed ? <span>Content</span> : <div className="h-[1px] w-6 bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>}
            {!isCollapsed && (expanded.content ? <ChevronDown size={14} className="opacity-50" /> : <ChevronRight size={14} className="opacity-50" />)}
          </button>
          
          {(expanded.content || isCollapsed) && (
            <div className="space-y-1.5 animate-fade-in">
              <NavLink to="/articles" className={getNavLinkClass} title={isCollapsed ? "All Articles" : ""}>
                <div className="flex items-center gap-3.5">
                  <FileText size={18} className="shrink-0 group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
                  {!isCollapsed && <span className="tracking-wide">All Articles</span>}
                </div>
              </NavLink>
              <NavLink to="/reported-articles" className={getNavLinkClass} title={isCollapsed ? "Reported Articles" : ""}>
                <div className="flex items-center gap-3.5">
                  <AlertTriangle size={18} className="shrink-0 group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
                  {!isCollapsed && <span className="tracking-wide">Reported</span>}
                </div>
                {renderBadge(pendingReports)}
              </NavLink>
            </div>
          )}
        </div>

        {/* Publisher System Section */}
        <div className="pt-4 pb-1">
          <button 
            onClick={() => toggleGroup('publishers')}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-4 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-1 hover:text-gray-300 transition-colors`}
          >
            {!isCollapsed ? <span>Publishers</span> : <div className="h-[1px] w-6 bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>}
            {!isCollapsed && (expanded.publishers ? <ChevronDown size={14} className="opacity-50" /> : <ChevronRight size={14} className="opacity-50" />)}
          </button>

          {(expanded.publishers || isCollapsed) && (
            <div className="space-y-1.5 animate-fade-in">
              <NavLink to="/publishers" className={getNavLinkClass} title={isCollapsed ? "All Publishers" : ""}>
                <div className="flex items-center gap-3.5">
                  <Building2 size={18} className="shrink-0 group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
                  {!isCollapsed && <span className="tracking-wide">Directory</span>}
                </div>
              </NavLink>
              <NavLink to="/verification" className={getNavLinkClass} title={isCollapsed ? "Verification Queue" : ""}>
                <div className="flex items-center gap-3.5">
                  <Shield size={18} className="shrink-0 group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
                  {!isCollapsed && <span className="tracking-wide">Verification</span>}
                </div>
                {renderBadge(pendingVerifications)}
              </NavLink>
            </div>
          )}
        </div>

        {/* More Section */}
        <div className="pt-4 pb-4">
          <button 
            onClick={() => toggleGroup('more')}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-4 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-1 hover:text-gray-300 transition-colors`}
          >
            {!isCollapsed ? <span>System</span> : <div className="h-[1px] w-6 bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>}
            {!isCollapsed && (expanded.more ? <ChevronDown size={14} className="opacity-50" /> : <ChevronRight size={14} className="opacity-50" />)}
          </button>

          {(expanded.more || isCollapsed) && (
            <div className="space-y-1 animate-fade-in">
              {[
                { to: '/media-houses', icon: Building2, label: 'Media Houses' },
                { to: '/users', icon: Users, label: 'Users' },
                { to: '/topics', icon: Hash, label: 'Topics' },
                { to: '/comments', icon: MessageSquare, label: 'Comments' },
                { to: '/analytics', icon: BarChart2, label: 'Analytics' },
                { to: '/audit-logs', icon: FileText, label: 'Audit Logs' },
              ].map(item => (
                <NavLink key={item.to} to={item.to} className={getNavLinkClass} title={isCollapsed ? item.label : ""}>
                  <div className="flex items-center gap-3.5">
                    <item.icon size={18} className="shrink-0 group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
                    {!isCollapsed && <span className="tracking-wide">{item.label}</span>}
                  </div>
                </NavLink>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer / User Profile */}
      <div className={`p-4 border-t border-white/5 ${isCollapsed ? 'flex flex-col items-center gap-5' : ''}`}>
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} w-full`}>
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3.5'} overflow-hidden`}>
            <div className="w-10 h-10 rounded-full bg-brand-green flex items-center justify-center text-[#050816] font-extrabold text-sm shrink-0 shadow-[0_0_15px_rgba(34,197,94,0.3)] border border-white/10">
              {initials}
            </div>
            {!isCollapsed && (
              <div className="truncate">
                <p className="text-sm text-white font-semibold truncate tracking-wide">{displayName}</p>
                <p className="text-xs text-gray-400 truncate opacity-80">{displayEmail}</p>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <button
              onClick={logout}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all shrink-0 group"
              title="Logout"
            >
              <LogOut size={18} className="group-hover:scale-110 transition-transform" strokeWidth={1.5} />
            </button>
          )}
        </div>
        {isCollapsed && (
          <button
            onClick={logout}
            className="p-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all group"
            title="Logout"
          >
            <LogOut size={20} className="group-hover:scale-110 transition-transform" strokeWidth={1.5} />
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
