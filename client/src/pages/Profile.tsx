import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { User, Mail, Edit2, Save, Loader2 } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import type { IUser, ValidationErrors } from '../types/index';
import { getUser,updateUser } from "../services/userService";
import { setUser as setAuthUser } from '../redux/authSlice';

const Profile: React.FC = () => {
  const dispatch = useDispatch();
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    // role: '',
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getUser();
        if (response.success && response.data) {
          setUser(response.data);
          setFormData({
            name: response.data.name || '',
            email: response.data.email || '',
            // role: response.data.role || '',
          });
        } else {
          setError('Failed to fetch user data');
        }
      } catch (err) {
        console.error('Error fetching user:', err);
        setError('Failed to fetch user data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const [isUpdating, setIsUpdating] = useState(false);

  // Validation function for name
  const validateName = (name: string): string | null => {
    if (!name.trim()) {
      return "Full name is required";
    }
    if (name.trim().length < 3 || name.trim().length > 15) {
      return "Name must be between 3 and 15 characters";
    }
    if (/^_+$/.test(name.trim())) {
      return "Name cannot be only underscores";
    }
    if (/^\d+$/.test(name.trim())) {
      return "Name cannot be only numbers";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous validation errors
    setValidationErrors({});
    
    // Validate name
    const nameError = validateName(formData.name);
    if (nameError) {
      setValidationErrors({ name: nameError });
      return;
    }
    
    try {
      setIsUpdating(true);
      setError(null);
      const response = await updateUser(formData.name);
      if (response.success && response.data) {
        setUser(response.data);
        dispatch(setAuthUser({ user: response.data }));
        setIsEditing(false);
      } else {
        setError('Failed to update user');
      }
    } catch (err) {
      console.error('Error updating user:', err);
      setError('Failed to update user');
    } finally {
      setIsUpdating(false);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error for the field being changed
    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Loading animation component for user details card only
  const UserDetailsLoadingSpinner = () => (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-4" />
        <p className="text-gray-600">Loading your details...</p>
      </div>
    </div>
  );

  // Error state component for user details card only
  const UserDetailsErrorState = () => (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load details</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Try Again
        </Button>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div
        className="max-w-4xl mx-auto space-y-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
            <p className="text-gray-600 mt-2">Manage your account settings</p>
          </div>
          {!isEditing && user && (
            <Button onClick={() => setIsEditing(true)} variant="outline">
              <Edit2 className="w-4 h-4 mr-2" />
              {/* Edit Profile */}
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <Card className="p-6">
              <div className="text-center">
                <div className="w-28 h-28 rounded-full bg-gray-300 flex items-center justify-center mx-auto border-4 border-gray-100 shadow-lg">
                  <User className="w-14 h-14 text-gray-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mt-4">{user?.name}</h2>
                {/* <p className="text-gray-600 mt-1">{user.role}</p> */}
                {/* <div className="mt-6 pt-6 border-t border-gray-200">
                  <Button variant="outline" className="w-full" size="sm">
                    Change Avatar
                  </Button>
                </div> */}
              </div>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h3>

              {isLoading ? (
                <UserDetailsLoadingSpinner />
              ) : error && !user ? (
                <UserDetailsErrorState />
              ) : isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Input
                    name="name"
                    label="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={isUpdating}
                    error={validationErrors.name}
                  />

                  <Input
                    name="email"
                    type="email"
                    label="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={isUpdating}
                  />

                  {/* <Input
                    name="role"
                    label="Role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                  /> */}

                  <div className="flex gap-3 pt-4">
                    <Button type="submit" disabled={isUpdating}>
                      {isUpdating ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      {isUpdating ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        setValidationErrors({});
                        if (user) {
                          setFormData({
                            name: user.name,
                            email: user.email
                          });
                        }
                      }}
                      disabled={isUpdating}
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
                      <p className="text-base font-semibold text-gray-900 mt-1">{user?.name}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <Mail className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500">Email Address</p>
                      <p className="text-base font-semibold text-gray-900 mt-1">{user?.email}</p>
                    </div>
                  </div>

                  {/* <div className="flex items-start gap-4">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Briefcase className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500">Role</p>
                      <p className="text-base font-semibold text-gray-900 mt-1">{user.role}</p>
                    </div>
                  </div> */}
                </div>
              )}
            </Card>
          </div>
        </div>

        <div>
          {/* <Card className="p-6">
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
          </Card> */}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;