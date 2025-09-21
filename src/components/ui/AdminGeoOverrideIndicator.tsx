import React from 'react';

const AdminGeoOverrideIndicator: React.FC = () => {
  return (
    <div className="bg-purple-900 border-l-4 border-purple-500 text-purple-100 p-4 mb-6 rounded-r-lg" role="alert">
      <p className="font-bold">Admin Override Active</p>
      <p>Geofence restrictions are currently bypassed for your account.</p>
    </div>
  );
};

export default AdminGeoOverrideIndicator;
