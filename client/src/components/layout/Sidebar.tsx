import React,{useState} from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ListTodo, BarChart3, User, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import type {IUser} from "../../types/index";

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: ListTodo, label: 'Tasks', path: '/tasks' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: User, label: 'Profile', path: '/profile' },
];

const mockUser: IUser = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
  // role: 'Product Manager',
};

export const Sidebar: React.FC = () => {
    const [user, setUser] = useState<IUser | null>(mockUser);
  
  const location = useLocation();
  const handleLogout = ()=>{

  }

  return (
    <motion.aside
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 shadow-sm z-40"
    >
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
              <Link key={item.path} to={item.path}>
                <motion.div
                  whileHover={{ x: 4 }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </motion.div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <img
              src={user?.avatar}
              alt={user?.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
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
    </motion.aside>
  );
};
