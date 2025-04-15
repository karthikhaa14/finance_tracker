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

    const handleAccept = async (id) => {
        try {
            await axios.put(`http://localhost:5000/api/requests/${id}`, {
                request_status: 'approved'
            });
            // Update local state instead of refetching all requests
            setRequests(requests.map(request => 
                request.id === id ? {...request, request_status: 'approved'} : request
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
            // Update local state instead of refetching all requests
            setRequests(requests.map(request => 
                request.id === id ? {...request, request_status: 'rejected'} : request
            ));
        } catch (error) {
            console.error('Error rejecting request:', error);
            setError('Failed to reject request.');
        }
    };

    if (loading) return <div className="p-4 text-center">Loading requests...</div>;
    if (error) return <div className="p-4 text-center text-red-500">{error}</div>;
    if (requests.length === 0) return <div className="p-4 text-center">No requests found</div>;

    return (
        <table className="min-w-full bg-white border rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
                <tr>
                    <th className="px-4 py-2 border-b">Username</th>
                    <th className="px-4 py-2 border-b">Request Type</th>
                    <th className="px-4 py-2 border-b">Role</th>
                    <th className="px-4 py-2 border-b">Status</th>
                    <th className="px-4 py-2 border-b">Actions</th>
                </tr>
            </thead>
            <tbody>
                {requests.map(request => (
                    <tr key={request.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 border-b">{request.username}</td>
                        <td className="px-4 py-2 border-b">{request.request_type}</td>
                        <td className="px-4 py-2 border-b capitalize">{request.role}</td>
                        <td className="px-4 py-2 border-b capitalize">{request.request_status}</td>
                        <td className="px-4 py-2 border-b text-center space-x-2">
                            {request.request_status === 'pending' && (
                                <>
                                    <button
                                        onClick={() => handleAccept(request.id)}
                                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                                    >
                                        Accept
                                    </button>
                                    <button
                                        onClick={() => handleReject(request.id)}
                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                                    >
                                        Reject
                                    </button>
                                </>
                            )}
                            {request.request_status !== 'pending' && (
                                <span className="text-gray-500">Action completed</span>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default Requestscomponent;