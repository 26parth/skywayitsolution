import React, { useEffect, useState } from "react";
import axiosAdmin from "../../lib/axiosAdmin";
import { toast } from "react-hot-toast";

const ShowUser = () => {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);

  const fetchUsers = async () => {
  try {
    const res = await axiosAdmin.get("/users");
    setUsers(res.data || []);
  } catch (error) {
    toast.error("Users load nahi ho paye");
  }
};

  const deleteUser = async (id) => {
    if (!confirm("Kya aap sach me is user ko delete karna chahte hain?")) return;
    try {
      await axiosAdmin.delete(`/delete-user/${id}`);
      toast.success("User delete ho gaya");
      fetchUsers();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const handleUpdate = async () => {
    try {
      const { _id, fullname, email, contactNumber, role } = editUser;
      await axiosAdmin.put(`/update-user/${_id}`, { fullname, email, contactNumber   });
      toast.success("User details update ho gayi");
      setEditUser(null);
      fetchUsers();
    } catch (error) {
      toast.error("Update failed");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">All Registered Users</h2>
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
          Total: {users.length}
        </span>
      </div>

      {/* Edit Modal */}
      {editUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md space-y-4">
            <h2 className="text-xl font-bold border-b pb-2">Edit User Profile</h2>
            <div className="space-y-3">
              <input type="text" className="w-full border p-2 rounded-lg" placeholder="Full Name" value={editUser.fullname} onChange={(e) => setEditUser({ ...editUser, fullname: e.target.value })} />
              <input type="email" className="w-full border p-2 rounded-lg" placeholder="Email" value={editUser.email} onChange={(e) => setEditUser({ ...editUser, email: e.target.value })} />
              <input type="text" className="w-full border p-2 rounded-lg" placeholder="Contact" value={editUser.contactNumber} onChange={(e) => setEditUser({ ...editUser, contactNumber: e.target.value })} />
              {/* <select className="w-full border p-2 rounded-lg" value={editUser.role} onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select> */}
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button onClick={() => setEditUser(null)} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition">Cancel</button>
              <button onClick={handleUpdate} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-4 font-semibold text-gray-700">Name</th>
              <th className="p-4 font-semibold text-gray-700">Email</th>
              <th className="p-4 font-semibold text-gray-700">Contact</th>
              <th className="p-4 font-semibold text-gray-700">Role</th>
              <th className="p-4 font-semibold text-gray-700 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b hover:bg-gray-50 transition">
                <td className="p-4">{user.fullname}</td>
                <td className="p-4 text-gray-600">{user.email}</td>
                <td className="p-4">{user.contactNumber}</td>
                <td className="p-4"><span className={`px-2 py-1 rounded text-xs font-bold uppercase ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>{user.role}</span></td>
                <td className="p-4 flex justify-center gap-3">
                  <button onClick={() => setEditUser(user)} className="text-blue-600 hover:text-blue-800 font-medium">Edit</button>
                  <button onClick={() => deleteUser(user._id)} className="text-red-600 hover:text-red-800 font-medium">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && <p className="text-center p-10 text-gray-500">Koi users nahi mile.</p>}
      </div>
    </div>
  );
};

export default ShowUser;