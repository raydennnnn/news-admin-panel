import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
  return (
    <div className="flex h-screen bg-dark-900 text-gray-300 overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 transition-all duration-300 flex flex-col h-screen overflow-hidden ml-20">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
