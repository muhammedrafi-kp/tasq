import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Briefcase, Edit2, Save } from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useApp } from '../context/AppContext';

export const Profile: React.FC = () => {
  const { user, updateUser } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(formData);
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!user) return null;

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
            <p className="text-gray-600 mt-2">Manage your account settings</p>
          </div>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)} variant="outline">
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6">
              <div className="text-center">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-gray-100 shadow-lg"
                />
                <h2 className="text-xl font-bold text-gray-900 mt-4">{user.name}</h2>
                <p className="text-gray-600 mt-1">{user.role}</p>
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <Button variant="outline" className="w-full" size="sm">
                    Change Avatar
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h3>

              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Input
                    name="name"
                    label="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />

                  <Input
                    name="email"
                    type="email"
                    label="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />

                  <Input
                    name="role"
                    label="Role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                  />

                  <div className="flex gap-3 pt-4">
                    <Button type="submit">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          name: user.name,
                          email: user.email,
                          role: user.role,
                        });
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500">Full Name</p>
                      <p className="text-base font-semibold text-gray-900 mt-1">{user.name}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <Mail className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500">Email Address</p>
                      <p className="text-base font-semibold text-gray-900 mt-1">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Briefcase className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500">Role</p>
                      <p className="text-base font-semibold text-gray-900 mt-1">{user.role}</p>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <div>
                  <p className="font-medium text-gray-900">Email Notifications</p>
                  <p className="text-sm text-gray-500">Receive email updates about your tasks</p>
                </div>
                <Button variant="outline" size="sm">Configure</Button>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <div>
                  <p className="font-medium text-gray-900">Password</p>
                  <p className="text-sm text-gray-500">Change your password</p>
                </div>
                <Button variant="outline" size="sm">Update</Button>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-500">Add an extra layer of security</p>
                </div>
                <Button variant="outline" size="sm">Enable</Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};
