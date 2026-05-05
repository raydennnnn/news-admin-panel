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
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAppContext } from '../../context/AppContext';

const Sidebar = () => {
  const [isHovered, setIsHovered] = useState(false);
  const isCollapsed = !isHovered;

  const { user, logout } = useAuth();
  const { pendingReports, pendingVerifications } = useAppContext();

  const initials = user
    ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
    : 'SA';
  const displayName = user ? `${user.firstName} ${user.lastName}` : 'Super Admin';
  const displayEmail = user?.email || 'admin@newsapp.com';

  const renderBadge = (count) => {
    if (!count || count <= 0) return null;
    if (isCollapsed) {
      return (
        <span className="absolute top-2.5 right-[22px] w-2.5 h-2.5 bg-brand-red rounded-full border-2 border-[#050816] z-20 shadow-[0_0_8px_rgba(239,68,68,0.8)] transition-all duration-300"></span>
      );
    }
    return <span className="bg-brand-red text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center ml-auto z-10 animate-fade-in">{count}</span>;
  };

  const DividerOrLabel = ({ label }) => {
    if (isCollapsed) {
      return <div className="h-[1px] bg-gradient-to-r from-transparent via-gray-700/40 to-transparent my-1.5 mx-auto w-8 shrink-0 transition-all duration-300" />;
    }
    return (
      <div className="pt-4 pb-1 px-5 shrink-0 animate-fade-in">
        <span className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em]">{label}</span>
      </div>
    );
  };

  const NavItem = ({ to, icon: Icon, label, badgeCount, end }) => {
    return (
      <NavLink to={to} end={end} title={isCollapsed ? label : ""}>
        {({ isActive }) => (
          <div className={`relative flex items-center ${isCollapsed ? 'justify-center w-full h-[52px]' : 'px-5 py-3 h-[52px]'} group cursor-pointer transition-colors duration-300 ${isActive ? 'text-brand-green' : 'text-gray-500 hover:text-white'}`}>
            {/* Active Background Pill */}
            {isActive && isCollapsed && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 h-11 w-[60px] bg-brand-green/10 border-l-[3px] border-brand-green rounded-r-2xl z-0 transition-all duration-300" />
            )}
            {isActive && !isCollapsed && (
              <div className="absolute left-3 right-3 top-1.5 bottom-1.5 bg-brand-green/10 shadow-[inset_3px_0_0_rgba(34,197,94,1)] rounded-xl z-0 animate-fade-in" />
            )}
            {!isActive && (
              <div className={`absolute z-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100 ${isCollapsed ? 'left-2 right-2 top-1.5 bottom-1.5 rounded-xl bg-white/5' : 'left-3 right-3 top-1.5 bottom-1.5 rounded-xl bg-white/5'}`} />
            )}
            
            <div className={`relative z-10 flex items-center gap-3.5 ${isCollapsed ? '' : 'w-full'}`}>
              <div className="shrink-0 flex items-center justify-center w-[20px]">
                <Icon size={20} strokeWidth={1.75} className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
              </div>
              {!isCollapsed && <span className="tracking-wide text-sm font-medium whitespace-nowrap animate-fade-in">{label}</span>}
            </div>
            {renderBadge(badgeCount)}
          </div>
        )}
      </NavLink>
    );
  };

  return (
    <aside 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`${isHovered ? 'w-64' : 'w-20'} transition-all duration-300 ease-in-out bg-[#050816] border-r border-white/5 flex flex-col h-screen fixed top-0 left-0 z-[60] shadow-[4px_0_24px_rgba(0,0,0,0.4)] overflow-hidden`}
    >
      {/* Header Section */}
      <div className={`flex flex-col ${isCollapsed ? 'items-center gap-4 pt-6' : 'px-5 pt-6'} pb-4 shrink-0 transition-all duration-300`}>
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-4'} w-full`}>
          <div className="w-12 h-12 rounded-2xl bg-brand-green flex items-center justify-center shrink-0 shadow-[0_0_16px_rgba(34,197,94,0.4)] transition-transform hover:scale-105 cursor-pointer">
            <span className="text-white font-bold text-xl">⚡</span>
          </div>
          {!isCollapsed && (
            <div className="animate-fade-in truncate whitespace-nowrap">
              <h1 className="text-white font-bold tracking-wide text-lg leading-tight">NewsAdmin</h1>
              <p className="text-[10px] text-brand-green font-medium uppercase tracking-widest opacity-80">Control Panel</p>
            </div>
          )}
        </div>
      </div>

      {/* Scrollable Navigation */}
      <div className="flex-1 flex flex-col py-2 overflow-y-auto overflow-x-hidden sidebar-scroll">
        <NavItem to="/" end label="Dashboard" icon={LayoutDashboard} />
        
        <DividerOrLabel label="Content" />
        <NavItem to="/articles" label="All Articles" icon={FileText} />
        <NavItem to="/reported-articles" label="Reported" icon={AlertTriangle} badgeCount={pendingReports} />
        
        <DividerOrLabel label="Publishers" />
        <NavItem to="/publishers" label="Directory" icon={Building2} />
        <NavItem to="/verification" label="Verification" icon={Shield} badgeCount={pendingVerifications} />
        
        <DividerOrLabel label="System" />
        <NavItem to="/media-houses" label="Media Houses" icon={Building2} />
        <NavItem to="/users" label="Users" icon={Users} />
        <NavItem to="/topics" label="Topics" icon={Hash} />
        <NavItem to="/comments" label="Comments" icon={MessageSquare} />
        <NavItem to="/analytics" label="Analytics" icon={BarChart2} />
        <NavItem to="/audit-logs" label="Audit Logs" icon={FileText} />
      </div>

      {/* Footer / User Profile & Logout */}
      <div className="shrink-0 pb-6 pt-2 transition-all duration-300">
        {isCollapsed && <div className="h-[1px] bg-gradient-to-r from-transparent via-gray-700/40 to-transparent mb-4 mx-auto w-8" />}
        
        {isCollapsed ? (
          <div className="flex flex-col items-center gap-4 animate-fade-in">
            <div className="w-10 h-10 rounded-full bg-brand-green flex items-center justify-center text-[#050816] font-extrabold text-sm shrink-0 shadow-[0_0_15px_rgba(34,197,94,0.3)] border border-brand-green cursor-pointer">
              {initials}
            </div>
            <button
              onClick={logout}
              className="w-12 h-12 flex items-center justify-center text-gray-500 hover:text-brand-red transition-all group"
              title="Logout"
            >
              <LogOut size={20} strokeWidth={1.75} className="group-hover:scale-110 transition-transform duration-300" />
            </button>
          </div>
        ) : (
          <div className="px-5 flex items-center justify-between animate-fade-in whitespace-nowrap">
            <div className="flex items-center gap-3.5 overflow-hidden cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-brand-green flex items-center justify-center text-[#050816] font-extrabold text-sm shrink-0 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                {initials}
              </div>
              <div className="truncate">
                <p className="text-sm text-white font-semibold tracking-wide">{displayName}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">{displayEmail}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-2 text-gray-500 hover:text-brand-red hover:bg-brand-red/10 rounded-xl transition-all shrink-0 group"
              title="Logout"
            >
              <LogOut size={18} strokeWidth={1.75} className="group-hover:scale-110 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
