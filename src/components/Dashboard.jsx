import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [tokenData, setTokenData] = useState(null);
  const [showTokenData, setShowTokenData] = useState(false);
  const [isTokenEditing, setIsTokenEditing] = useState(false);
  const [tokenEditForm, setTokenEditForm] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isPhotoEditing, setIsPhotoEditing] = useState(false);
  const [photoEditForm, setPhotoEditForm] = useState(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/login');
      return;
    }

    try {
      const response = await axios.get(
        'https://interview-task-bmcl.onrender.com/api/user/userDetails',
        {
          params: { userId }
        }
      );

      if (response.data && response.data.data) {
        setUserData(response.data.data);
        setEditForm(response.data.data); // Initialize edit form with current data
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm(userData); // Reset form to current user data
  };

  const handleChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };
  const handleUpdate = async () => {
    const userId = localStorage.getItem('userId');
    try {
      const response = await axios.put(
        `https://interview-task-bmcl.onrender.com/api/user/updateUser?userId=${userId}`,
        editForm,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setUserData(editForm);
        setIsEditing(false);
        alert('Profile updated successfully!');
        fetchUserData(); // Refresh data
      } else {
        alert('Failed to update profile');
      }
    } catch (error) {
      console.error('Update error:', error.response?.data?.message || error.message);
      alert('Failed to update profile');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleTokenDisplay = async () => {
    const token = localStorage.getItem('token');
    console.log('Using token for authentication:', token);
    if (!token) {
      alert('No token found. Please login again.');
      navigate('/login');
      return;
    }

    try {
      const response = await axios.get(
        'https://interview-task-bmcl.onrender.com/api/user/display',
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          }
        }
      );

      console.log('Token Response:', response.data);

      if (response.data && response.data.data) {
        setTokenData(response.data.data);
        setShowTokenData(true);
      } else {
        alert('No data found with this token');
      }
    } catch (error) {
      console.error('Token data error:', error.response?.data?.message || error.message);
      if (error.response?.status === 401) {
        alert('Token expired or invalid. Please login again.');
        localStorage.clear();
        navigate('/login');
      } else {
        alert('Failed to fetch data with token');
      }
    }
  };

  const handleCloseTokenDisplay = () => {
    setShowTokenData(false);
    setTokenData(null);
  };

  const handleTokenEdit = () => {
    setTokenEditForm({...userData});
    setIsTokenEditing(true);
  };

  const handleTokenEditChange = (e) => {
    setTokenEditForm({
      ...tokenEditForm,
      [e.target.name]: e.target.value
    });
  };

  const handleTokenUpdate = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No token found. Please login again.');
      navigate('/login');
      return;
    }

    try {
      const response = await axios.put(
        'https://interview-task-bmcl.onrender.com/api/user/updateWithToken',
        tokenEditForm,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          }
        }
      );

      if (response.data.success) {
        setUserData(tokenEditForm);
        setIsTokenEditing(false);
        setTokenEditForm(null);
        alert('Profile updated successfully!');
        fetchUserData();
      } else {
        alert(response.data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Token update error:', error);
      if (error.response?.status === 401) {
        alert('Token expired or invalid. Please login again.');
        localStorage.clear();
        navigate('/login');
      } else {
        alert(error.response?.data?.message || 'Failed to update profile');
      }
    }
  };

  const handleCancelTokenEdit = () => {
    setIsTokenEditing(false);
    setTokenEditForm(null);
  };

  const handlePhotoEdit = () => {
    setIsPhotoEditing(true);
    setError('');
    setFile(null);
  };

  const handlePhotoEditChange = (e) => {
    if (e.target.name === 'photo') {
      setSelectedPhoto(e.target.files[0]);
    } else {
      setPhotoEditForm({
        ...photoEditForm,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }

      if (selectedFile.size > 5000000) {
        setError('File size should be less than 5MB');
        return;
      }

      setFile(selectedFile);
      setError('');
      console.log('Selected file:', {
        name: selectedFile.name,
        type: selectedFile.type,
        size: `${(selectedFile.size / 1024).toFixed(2)} KB`
      });
    }
  };

  const handlePhotoUpdate = async () => {
    if (!file) {
      setError('Please select a photo first');
      return;
    }

    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');

      if (!token) {
        setError('Authentication token not found. Please login again.');
        navigate('/login');
        return;
      }

      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('profile_photo', file);

      const response = await axios({
        method: 'put',
        url: 'https://interview-task-bmcl.onrender.com/api/user/updateWithPhoto',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': token
        }
      });

      console.log('Photo update response:', response.data);

      if (response.data.success) {
        // Update local state immediately with the file URL
        const fileUrl = URL.createObjectURL(file);
        setUserData(prev => ({
          ...prev,
          photo: fileUrl
        }));

        // Fetch fresh user data
        const userResponse = await axios.get(
          'https://interview-task-bmcl.onrender.com/api/user/userDetails',
          {
            params: { userId }
          }
        );

        if (userResponse.data && userResponse.data.data) {
          console.log('Updated user data:', userResponse.data.data);
          setUserData(userResponse.data.data);
        }

        setIsPhotoEditing(false);
        setFile(null);
        setError('');
        alert('Profile photo updated successfully!');
      } else {
        setError(response.data.message || 'Failed to update photo');
      }
    } catch (error) {
      console.error('Photo update error:', error);
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate('/login');
      } else {
        setError('Failed to update photo. Please try again.');
      }
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200">
                {(userData?.photo || userData?.profile_photo) ? (
                  <img 
                    src={userData.photo || userData.profile_photo}
                    alt={userData.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.log('Image load error');
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = `
                        <div class="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600">
                          ${userData.name.charAt(0).toUpperCase()}
                        </div>
                      `;
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600">
                    {userData?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {isEditing ? 'Edit Profile' : `Welcome, ${userData?.name}`}
              </h1>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          </div>

          {userData && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {isEditing ? (
                // Edit Form
                <>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={editForm.name}
                        onChange={handleChange}
                        className="mt-1 w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={editForm.email}
                        onChange={handleChange}
                        className="mt-1 w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Mobile</label>
                      <input
                        type="text"
                        name="mobile"
                        value={editForm.mobile}
                        onChange={handleChange}
                        className="mt-1 w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Gender</label>
                      <select
                        name="gender"
                        value={editForm.gender}
                        onChange={handleChange}
                        className="mt-1 w-full p-2 border rounded"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                      <input
                        type="date"
                        name="dob"
                        value={editForm.dob?.split('T')[0]}
                        onChange={handleChange}
                        className="mt-1 w-full p-2 border rounded"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Address</label>
                      <textarea
                        name="address"
                        value={editForm.address}
                        onChange={handleChange}
                        className="mt-1 w-full p-2 border rounded"
                        rows="3"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">City</label>
                      <input
                        type="text"
                        name="city"
                        value={editForm.city}
                        onChange={handleChange}
                        className="mt-1 w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">State</label>
                      <input
                        type="text"
                        name="state"
                        value={editForm.state}
                        onChange={handleChange}
                        className="mt-1 w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Country</label>
                      <input
                        type="text"
                        name="country"
                        value={editForm.country}
                        onChange={handleChange}
                        className="mt-1 w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Pincode</label>
                      <input
                        type="text"
                        name="pincode"
                        value={editForm.pincode}
                        onChange={handleChange}
                        className="mt-1 w-full p-2 border rounded"
                      />
                    </div>
                  </div>
                </>
              ) : (
                // Display Mode
                <>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                      <p className="mt-1 text-lg text-gray-900">{userData.name}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Email</h3>
                      <p className="mt-1 text-lg text-gray-900">{userData.email}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Mobile</h3>
                      <p className="mt-1 text-lg text-gray-900">{userData.mobile}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Gender</h3>
                      <p className="mt-1 text-lg text-gray-900 capitalize">{userData.gender}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Date of Birth</h3>
                      <p className="mt-1 text-lg text-gray-900">
                        {new Date(userData.dob).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Address</h3>
                      <p className="mt-1 text-lg text-gray-900">{userData.address}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">City</h3>
                      <p className="mt-1 text-lg text-gray-900">{userData.city}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">State</h3>
                      <p className="mt-1 text-lg text-gray-900">{userData.state}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Country</h3>
                      <p className="mt-1 text-lg text-gray-900">{userData.country}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Pincode</h3>
                      <p className="mt-1 text-lg text-gray-900">{userData.pincode}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {isEditing && (
            <div className="mt-8 flex gap-4 justify-center">
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Save Changes
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {!isEditing && !isTokenEditing && !isPhotoEditing && (
          <div className="mt-6 flex gap-4 justify-center">
            <button
              onClick={handleTokenDisplay}
              className="px-6 py-2.5 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              Display with Token
            </button>
            <button
              onClick={handleTokenEdit}
              className="px-6 py-2.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Update with Token
            </button>
            <button
              onClick={handlePhotoEdit}
              className="px-6 py-2.5 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
            >
              Update with Photo
            </button>
            <button
              onClick={handleEdit}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Edit Profile
            </button>
          </div>
        )}

        {showTokenData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-semibold">User Data (From Token)</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Authenticated using token: {localStorage.getItem('token')?.substring(0, 20)}...
                  </p>
                </div>
                <button
                  onClick={handleCloseTokenDisplay}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                    <p className="mt-1 text-lg text-gray-900">{tokenData.name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                    <p className="mt-1 text-lg text-gray-900">{tokenData.email}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Mobile</h3>
                    <p className="mt-1 text-lg text-gray-900">{tokenData.mobile}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Gender</h3>
                    <p className="mt-1 text-lg text-gray-900 capitalize">{tokenData.gender}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Date of Birth</h3>
                    <p className="mt-1 text-lg text-gray-900">
                      {new Date(tokenData.dob).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Address</h3>
                    <p className="mt-1 text-lg text-gray-900">{tokenData.address}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">City</h3>
                    <p className="mt-1 text-lg text-gray-900">{tokenData.city}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">State</h3>
                    <p className="mt-1 text-lg text-gray-900">{tokenData.state}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Country</h3>
                    <p className="mt-1 text-lg text-gray-900">{tokenData.country}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Pincode</h3>
                    <p className="mt-1 text-lg text-gray-900">{tokenData.pincode}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {isTokenEditing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-semibold">Update Profile (With Token)</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Authenticated using token: {localStorage.getItem('token')?.substring(0, 20)}...
                  </p>
                </div>
                <button
                  onClick={handleCancelTokenEdit}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={tokenEditForm?.name || ''}
                      onChange={handleTokenEditChange}
                      className="mt-1 w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={tokenEditForm?.email || ''}
                      onChange={handleTokenEditChange}
                      className="mt-1 w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Mobile</label>
                    <input
                      type="text"
                      name="mobile"
                      value={tokenEditForm?.mobile || ''}
                      onChange={handleTokenEditChange}
                      className="mt-1 w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Gender</label>
                    <select
                      name="gender"
                      value={tokenEditForm?.gender || ''}
                      onChange={handleTokenEditChange}
                      className="mt-1 w-full p-2 border rounded"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                    <input
                      type="date"
                      name="dob"
                      value={tokenEditForm?.dob?.split('T')[0] || ''}
                      onChange={handleTokenEditChange}
                      className="mt-1 w-full p-2 border rounded"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Address</label>
                    <textarea
                      name="address"
                      value={tokenEditForm?.address || ''}
                      onChange={handleTokenEditChange}
                      className="mt-1 w-full p-2 border rounded"
                      rows="3"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">City</label>
                    <input
                      type="text"
                      name="city"
                      value={tokenEditForm?.city || ''}
                      onChange={handleTokenEditChange}
                      className="mt-1 w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">State</label>
                    <input
                      type="text"
                      name="state"
                      value={tokenEditForm?.state || ''}
                      onChange={handleTokenEditChange}
                      className="mt-1 w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={tokenEditForm?.country || ''}
                      onChange={handleTokenEditChange}
                      className="mt-1 w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Pincode</label>
                    <input
                      type="text"
                      name="pincode"
                      value={tokenEditForm?.pincode || ''}
                      onChange={handleTokenEditChange}
                      className="mt-1 w-full p-2 border rounded"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-4 justify-end">
                <button
                  onClick={handleTokenUpdate}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Update Profile
                </button>
                <button
                  onClick={handleCancelTokenEdit}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {isPhotoEditing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Update Profile Photo</h2>
                <button
                  onClick={() => {
                    setIsPhotoEditing(false);
                    setFile(null);
                    setError('');
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Select Photo</label>
                  <input
                    type="file"
                    name="profile_photo"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="mt-1 w-full p-2 border rounded"
                  />
                  {file && (
                    <div className="mt-2 text-sm text-gray-500">
                      <p>Selected file: {file.name}</p>
                      <p>Size: {(file.size / 1024).toFixed(2)} KB</p>
                      <p>Type: {file.type}</p>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="text-red-500 text-sm">{error}</div>
                )}

                <div className="flex gap-4 justify-end mt-6">
                  <button
                    onClick={handlePhotoUpdate}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    disabled={!file}
                  >
                    Update Photo
                  </button>
                  <button
                    onClick={() => {
                      setIsPhotoEditing(false);
                      setFile(null);
                      setError('');
                    }}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;