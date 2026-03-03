import React from "react";
import { useQuery } from "@tanstack/react-query";
import axiosAdmin from "../../lib/axiosAdmin";

const fetchAdmins = async () => {
  const { data } = await axiosAdmin.get("/admins");
  return data.admins;
};

const Manageadmin = () => {
  const { data: admins, isLoading, isError } = useQuery({
    queryKey: ["admins"],
    queryFn: fetchAdmins,
  });

  if (isLoading) return <p>Loading admins...</p>;
  if (isError) return <p>Error fetching admins</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Admins</h1>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Contact</th>
              <th className="p-3">Role</th>
            </tr>
          </thead>
          <tbody>
            {admins?.map((admin) => (
              <tr key={admin._id} className="border-b hover:bg-gray-50">
                <td className="p-3">{admin.fullname}</td>
                <td className="p-3">{admin.email}</td>
                <td className="p-3">{admin.contactNumber}</td>
                <td className="p-3 text-blue-600 font-semibold">
                  {admin.role}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Manageadmin;