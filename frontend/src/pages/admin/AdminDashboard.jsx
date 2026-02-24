import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const stats = [
    { title: "Total Users", count: "10+", path: "/admin/users", color: "bg-blue-500" },
    { title: "Total Admissions", count: "5+", path: "/admin/showadmission", color: "bg-green-500" },
    // Aane wale pages ke liye:
    // { title: "Enquiries", count: "20+", path: "/admin/enquiries", color: "bg-yellow-500" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Welcome, Admin!</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((item, index) => (
          <div 
            key={index} 
            onClick={() => navigate(item.path)}
            className={`${item.color} text-white p-6 rounded-lg shadow-lg cursor-pointer transform hover:scale-105 transition`}
          >
            <h3 className="text-lg opacity-80">{item.title}</h3>
            <p className="text-3xl font-bold">{item.count}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;