import React, { useRef, useEffect, useState } from "react";
import axiosAdmin from "../../lib/axiosAdmin";
import axios from "axios";

import { toast } from "react-toastify";
// import { useRef } from "react";

const ShowAdmission = () => {
    const [admissions, setAdmissions] = useState([]);
    const [loading, setLoading] = useState(true);

    // Payment modal states
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedAdmissionId, setSelectedAdmissionId] = useState(null);
    const [editingPayment, setEditingPayment] = useState(null); // { paymentId, amount, date }
    const [paymentAmount, setPaymentAmount] = useState("");
    const [paymentDate, setPaymentDate] = useState("");

    // ===== Certificate states =====
    const [certAdmission, setCertAdmission] = useState(null);
    const [certFile, setCertFile] = useState(null);
    const fileRef = useRef(null);

    // ===== Certificate handlers =====
    const openCertificate = (admission) => {
        setCertAdmission(admission);
        setCertFile(null);
        fileRef.current?.click();
    };

    // ===== admin Edit user  =====
    const [editAdmission, setEditAdmission] = useState(null);
    const [showEditAdmissionModal, setShowEditAdmissionModal] = useState(false);

    const openEditAdmission = (admission) => {
        setEditAdmission({
            ...admission,
            dob: admission.dob?.slice(0, 10),
            joiningDate: admission.joiningDate?.slice(0, 10),
        });

        setShowEditAdmissionModal(true);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;

        setEditAdmission((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const submitEditAdmission = async () => {
        try {

            const formData = new FormData();

            Object.keys(editAdmission).forEach((key) => {
                formData.append(key, editAdmission[key]);
            });

            const { data } = await axiosAdmin.put(
                `/admission/${editAdmission._id}`,
                formData
            );

            toast.success("Admission updated");

            setAdmissions((prev) =>
                prev.map((a) =>
                    a._id === data.admission._id ? data.admission : a
                )
            );

            setShowEditAdmissionModal(false);

        } catch (err) {
            console.error(err);
            toast.error("Update failed");
        }
    };
   


const sendCertificate = async () => {
    if (!certAdmission) return;
    if (!certFile) return toast.error("Please select certificate PDF");

    const fd = new FormData();
    fd.append("certificate", certFile);
    fd.append("admissionId", certAdmission._id);

    try {
        await axiosAdmin.post("/certificate/send", fd);
        toast.success("Certificate sent successfully");
        setCertAdmission(null);
        setCertFile(null);
    } catch (err) {
        console.error(err);
        toast.error("Certificate sending failed");
    }
};



const fetchData = async () => {
    try {
        const { data } = await axiosAdmin.get("/admission");
        setAdmissions(data.admissions || []);
    } catch (err) {
        console.error(err);
        toast.error("Failed to fetch data");
    } finally {
        setLoading(false);
    }
};


useEffect(() => {
    fetchData();
}, []);

const handleDelete = async (id) => {
    if (!window.confirm("Delete this record?")) return;
    try {
        await axiosAdmin.delete(`/admission/${id}`);

        setAdmissions(admissions.filter((item) => item._id !== id));
        toast.success("Deleted successfully");
    } catch (err) {
        console.error(err);
        toast.error("Delete failed");
    }
};

// ===== Add payment =====
const openAddPayment = (admissionId) => {
    setSelectedAdmissionId(admissionId);
    setPaymentAmount("");
    setPaymentDate(""); // default today if left empty
    setShowAddModal(true);
};

const submitAddPayment = async () => {
    if (!paymentAmount) return toast.error("Enter amount");
    try {
        const payload = {
            amount: Number(paymentAmount),
            date: paymentDate || new Date().toISOString(),
        };
        const { data } = await axiosAdmin.post(
            `/admission/${selectedAdmissionId}/payment`,
            payload
        );


        toast.success("Payment added");
        setShowAddModal(false);
        setPaymentAmount("");
        setPaymentDate("");
        setSelectedAdmissionId(null);
        // update local state with returned admission
        setAdmissions((prev) => prev.map((a) => (a._id === data.admission._id ? data.admission : a)));
    } catch (err) {
        console.error(err);
        toast.error("Failed to add payment");
    }
};

// ===== Edit payment =====
const openEditPayment = (admissionId, payment) => {
    setSelectedAdmissionId(admissionId);
    setEditingPayment({ paymentId: payment._id, amount: payment.amount, date: payment.date });
    setPaymentAmount(payment.amount);
    // format date to yyyy-mm-dd for input
    const d = payment.date ? new Date(payment.date) : new Date();
    setPaymentDate(d.toISOString().slice(0, 10));
    setShowEditModal(true);
};

const submitEditPayment = async () => {
    if (!editingPayment) return;
    if (!paymentAmount) return toast.error("Enter amount");
    try {
        const payload = {
            amount: Number(paymentAmount),
            date: paymentDate || new Date().toISOString(),
        };
        const { data } = await axiosAdmin.put(
            `/admission/${selectedAdmissionId}/payment/${editingPayment.paymentId}`,
            payload
        );
        toast.success("Payment updated");
        setShowEditModal(false);
        setEditingPayment(null);
        setPaymentAmount("");
        setPaymentDate("");
        setSelectedAdmissionId(null);
        setAdmissions((prev) => prev.map((a) => (a._id === data.admission._id ? data.admission : a)));
    } catch (err) {
        console.error(err);
        toast.error("Failed to update payment");
    }
};

// ===== Delete payment =====
const handleDeletePayment = async (admissionId, paymentId) => {
    if (!window.confirm("Delete this payment entry?")) return;
    try {
        const { data } = await axiosAdmin.delete(`/admission/${admissionId}/payment/${paymentId}`);
        toast.success("Payment deleted");
        setAdmissions((prev) => prev.map((a) => (a._id === data.admission._id ? data.admission : a)));
    } catch (err) {
        console.error(err);
        toast.error("Failed to delete payment");
    }
};

return (
    <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">All Admissions</h2>

        {loading ? (
            <p>Loading...</p>
        ) : admissions.length === 0 ? (
            <p>No records found.</p>
        ) : (
            <table className="w-full border text-sm">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="p-2 border">Intern Name</th>
                        <th className="p-2 border">Address</th>
                        <th className="p-2 border">DOB</th>
                        <th className="p-2 border">Contact No</th>
                        <th className="p-2 border">Joining Date</th>
                        <th className="p-2 border">Course Duration</th>
                        <th className="p-2 border">Project Name</th>
                        <th className="p-2 border">Education</th>
                        <th className="p-2 border">Total Fees</th>
                        <th className="p-2 border">Photo</th>
                        <th className="p-2 border">Signature</th>
                        <th className="p-2 border">Payments</th>
                        <th className="p-2 border">Actions</th>
                        <th className="p-2 border">Certificate</th>

                    </tr>
                </thead>

                <tbody>
                    {admissions.map((item) => {
                        const totalPaid = item.paymentDetails?.reduce((s, p) => s + (p.amount || 0), 0) || 0;
                        return (
                            <tr key={item._id} className="text-center align-top">
                                <td className="p-2 border">{item.internName}</td>
                                <td className="p-2 border">{item.address}</td>
                                <td className="p-2 border">{new Date(item.dob).toLocaleDateString()}</td>
                                <td className="p-2 border">{item.contactNo}</td>
                                <td className="p-2 border">{new Date(item.joiningDate).toLocaleDateString()}</td>
                                <td className="p-2 border">{item.courseDuration}</td>
                                <td className="p-2 border">{item.courseProjectName}</td>
                                <td className="p-2 border">{item.educationDetails}</td>
                                <td className="p-2 border">{item.totalFees}</td>

                                <td className="p-2 border">
                                    <img
                                        src={`http://localhost:5000/uploads/admission/${item.photo}`}
                                        alt="photo"
                                        className="w-12 h-12 object-cover mx-auto"
                                    />
                                </td>

                                <td className="p-2 border">
                                    <img
                                        src={`http://localhost:5000/uploads/admission/${item.signature}`}
                                        alt="signature"
                                        className="w-12 h-12 object-cover mx-auto"
                                    />
                                </td>

                                <td className="p-2 border text-left">
                                    <div>
                                        {item.paymentDetails && item.paymentDetails.length > 0 ? (
                                            item.paymentDetails.map((p) => (
                                                <div key={p._id} className="flex items-center justify-between gap-2 mb-1">
                                                    <div>
                                                        <div>₹{p.amount}</div>
                                                        <div className="text-xs text-gray-600">{new Date(p.date).toLocaleDateString()}</div>
                                                    </div>

                                                    <div className="flex gap-1">
                                                        <button
                                                            className="text-sm px-2 py-1 bg-yellow-400 rounded"
                                                            onClick={() => openEditPayment(item._id, p)}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            className="text-sm px-2 py-1 bg-red-500 text-white rounded"
                                                            onClick={() => handleDeletePayment(item._id, p._id)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-sm text-gray-500">No payments yet</div>
                                        )}

                                        <div className="mt-2 font-semibold">Total: ₹{totalPaid}</div>

                                        <button
                                            onClick={() => openAddPayment(item._id)}
                                            className="mt-2 bg-green-500 text-white px-2 py-1 rounded"
                                        >
                                            Add Payment
                                        </button>
                                    </div>
                                </td>

                                <td className="p-2 border">
                                    <button
                                        onClick={() => openEditAdmission(item)}
                                        className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item._id)}
                                        className="bg-red-500 text-white px-2 py-1 rounded"
                                    >
                                        Delete
                                    </button>
                                </td>

                                <td className="p-2 border">
                                    <button
                                        onClick={() => openCertificate(item)}
                                        className="bg-indigo-600 text-white px-2 py-1 rounded"
                                    >
                                        Add Certificate
                                    </button>


                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        )}

        {showEditAdmissionModal && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">

                <div className="bg-white p-6 rounded w-[500px]">

                    <h2 className="text-lg font-semibold mb-4">Edit Admission</h2>

                    <input
                        name="internName"
                        value={editAdmission.internName}
                        onChange={handleEditChange}
                        placeholder="Intern Name"
                        className="w-full border p-2 mb-2"
                    />

                    <input
                        name="address"
                        value={editAdmission.address}
                        onChange={handleEditChange}
                        placeholder="Address"
                        className="w-full border p-2 mb-2"
                    />

                    <input
                        type="date"
                        name="dob"
                        value={editAdmission.dob}
                        onChange={handleEditChange}
                        className="w-full border p-2 mb-2"
                    />

                    <input
                        name="contactNo"
                        value={editAdmission.contactNo}
                        onChange={handleEditChange}
                        placeholder="Contact Number"
                        className="w-full border p-2 mb-2"
                    />

                    <input
                        type="date"
                        name="joiningDate"
                        value={editAdmission.joiningDate}
                        onChange={handleEditChange}
                        className="w-full border p-2 mb-2"
                    />

                    <input
                        name="courseDuration"
                        value={editAdmission.courseDuration}
                        onChange={handleEditChange}
                        placeholder="Course Duration"
                        className="w-full border p-2 mb-2"
                    />

                    <input
                        name="courseProjectName"
                        value={editAdmission.courseProjectName}
                        onChange={handleEditChange}
                        placeholder="Project Name"
                        className="w-full border p-2 mb-2"
                    />

                    <input
                        name="educationDetails"
                        value={editAdmission.educationDetails}
                        onChange={handleEditChange}
                        placeholder="Education"
                        className="w-full border p-2 mb-2"
                    />

                    <input
                        type="number"
                        name="totalFees"
                        value={editAdmission.totalFees}
                        onChange={handleEditChange}
                        placeholder="Total Fees"
                        className="w-full border p-2 mb-2"
                    />

                    <div className="flex justify-end gap-2 mt-3">

                        <button
                            className="bg-gray-400 px-3 py-1 rounded"
                            onClick={() => setShowEditAdmissionModal(false)}
                        >
                            Cancel
                        </button>

                        <button
                            className="bg-blue-600 text-white px-3 py-1 rounded"
                            onClick={submitEditAdmission}
                        >
                            Update
                        </button>

                    </div>

                </div>
            </div>
        )}

        {/* certificate choose section  */}
        <input
            ref={fileRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => setCertFile(e.target.files?.[0] || null)}
        />

        {certAdmission && certFile && (
            <div className="fixed bottom-4 right-4 bg-white border shadow p-4 rounded flex gap-3 items-center z-50">
                <div className="text-sm">
                    Certificate ready for <b>{certAdmission.internName}</b>
                </div>

                <button
                    onClick={sendCertificate}
                    className="bg-green-600 text-white px-3 py-1 rounded"
                >
                    Send Certificate
                </button>

                <button
                    onClick={() => {
                        setCertAdmission(null);
                        setCertFile(null);
                    }}
                    className="bg-gray-300 px-3 py-1 rounded"
                >
                    Cancel
                </button>
            </div>
        )}


        {/* ADD PAYMENT MODAL */}
        {showAddModal && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                <div className="bg-white p-4 rounded shadow w-80">
                    <h2 className="text-lg font-semibold mb-3">Add Payment</h2>

                    <input
                        type="number"
                        placeholder="Amount"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        className="w-full border p-2 mb-3"
                    />

                    <input
                        type="date"
                        value={paymentDate}
                        onChange={(e) => setPaymentDate(e.target.value)}
                        className="w-full border p-2 mb-3"
                    />

                    <div className="flex justify-end gap-2">
                        <button className="px-3 py-1 bg-gray-400 text-white rounded" onClick={() => setShowAddModal(false)}>
                            Cancel
                        </button>
                        <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={submitAddPayment}>
                            Add
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* EDIT PAYMENT MODAL */}
        {showEditModal && editingPayment && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                <div className="bg-white p-4 rounded shadow w-80">
                    <h2 className="text-lg font-semibold mb-3">Edit Payment</h2>

                    <input
                        type="number"
                        placeholder="Amount"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        className="w-full border p-2 mb-3"
                    />

                    <input
                        type="date"
                        value={paymentDate}
                        onChange={(e) => setPaymentDate(e.target.value)}
                        className="w-full border p-2 mb-3"
                    />

                    <div className="flex justify-end gap-2">
                        <button className="px-3 py-1 bg-gray-400 text-white rounded" onClick={() => setShowEditModal(false)}>
                            Cancel
                        </button>
                        <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={submitEditPayment}>
                            Save
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
);
};

export default ShowAdmission;
