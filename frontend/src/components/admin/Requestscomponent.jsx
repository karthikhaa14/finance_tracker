import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Requestscomponent = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await axios.get('http://localhost:5000/api/requests/');
            setRequests(res.data);
        } catch (error) {
            console.error('Error fetching requests:', error);
            setError('Failed to load requests. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async (id,user_id) => {
        try {
            await axios.put(`http://localhost:5000/api/requests/${id}`, {
                request_status: 'approved'
            });
           const ans= await axios.put(`http://localhost:5000/api/permissions/${user_id}`, {
                chatbot_access: true
            });
            console.log(ans);            
            setRequests(requests.map(request => 
                request.id === id ? { ...request, request_status: 'approved' } : request
            ));
        } catch (error) {
            console.error('Error approving request:', error);
            setError('Failed to approve request.');
        }
    };

    const handleReject = async (id) => {
        try {
            await axios.put(`http://localhost:5000/api/requests/${id}`, {
                request_status: 'rejected'
            });
            setRequests(requests.map(request => 
                request.id === id ? { ...request, request_status: 'rejected' } : request
            ));
        } catch (error) {
            console.error('Error rejecting request:', error);
            setError('Failed to reject request.');
        }
    };

    if (loading) return <div className="p-6 text-center text-lg font-medium">Loading requests...</div>;
    if (error) return <div className="p-6 text-center text-red-600 font-medium">{error}</div>;
    if (requests.length === 0) return <div className="p-6 text-center text-gray-500">No pending requests found.</div>;

    return (
        <div className="p-6 bg-white rounded-2xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Pending Requests</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                        <tr>
                            <th className="px-6 py-3">Username</th>
                            <th className="px-6 py-3">Request Type</th>
                            <th className="px-6 py-3">Role</th>
                            <th className="px-6 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {requests.map((request) => (
                            <tr key={request.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-800">{request.username}</td>
                                <td className="px-6 py-4">{request.request_type}</td>
                                <td className="px-6 py-4 capitalize">{request.role}</td>
                                <td className="px-6 py-4 text-center space-x-2">
                                    {request.request_status === 'pending' ? (
                                        <>
                                            <button
                                                onClick={() => handleAccept(request.id,request.user_id)}
                                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded-lg text-sm"
                                            >
                                                Accept
                                            </button>
                                            <button
                                                onClick={() => handleReject(request.id)}
                                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm"
                                            >
                                                Reject
                                            </button>
                                        </>
                                    ) : (
                                        <span className="text-gray-500 italic">Action completed</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Requestscomponent;
