import React from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ListTodo, BarChart3, User, LogOut } from 'lucide-react';
import type { RootState } from "../../redux/store";
import { clearUser } from "../../redux/authSlice";
import { logoutUser } from "../../services/authService";

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: ListTodo, label: 'Tasks', path: '/tasks' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: User, label: 'Profile', path: '/profile' },
];

interface SidebarProps {
  isOpen?: boolean;
  isMobile?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, isMobile = false, onClose }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  const location = useLocation();
  const handleLogout = async () => {
    try {
      const res = await logoutUser();
      if (res.success) {
        console.log("logout success");
      }
    } catch (error) {
      console.log("error while loggout")
    } finally {
      dispatch(clearUser());
    }
  }

  return (
    <aside className={`sidebar ${isMobile ? 'sidebar-mobile' : ''} ${!isOpen ? 'sidebar-hidden' : ''}`}>
      <div className="flex flex-col h-full">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-blue-600">TasQ</h1>
          <p className="text-sm text-gray-500 mt-1">your task buddy</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link key={item.path} to={item.path} onClick={isMobile ? onClose : undefined}>
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
              <User className="w-6 h-6 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.name || 'Guest User'}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email || 'guest@example.com'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;