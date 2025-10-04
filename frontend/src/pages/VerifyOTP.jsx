
import axios from 'axios';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { serverURL } from '../App';

function VerifyOTP() {
    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${serverURL}/api/auth/verify-otp`, { email, otp });
            navigate('/reset-password', { state: { email } });
        } catch (error) {
            setMessage(error.response.data);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-4 sm:p-8 space-y-6 bg-white rounded-lg shadow-md mx-4">
                <h2 className="text-2xl font-bold text-center text-gray-900">Verify OTP</h2>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label
                            htmlFor="otp"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Enter OTP
                        </label>
                        <input
                            id="otp"
                            name="otp"
                            type="text"
                            required
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            onChange={(e) => setOtp(e.target.value)}
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Verify
                        </button>
                    </div>
                </form>
                {message && <p className="text-sm text-center text-gray-600">{message}</p>}
            </div>
        </div>
    );
}

export default VerifyOTP;
