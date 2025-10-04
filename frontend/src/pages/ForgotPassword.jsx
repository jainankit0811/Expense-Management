import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { serverURL } from '../App';
function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${serverURL}/api/auth/send-otp`, { email }, { withCredentials: true });
            setMessage(response.data);
            navigate('/verify-otp', { state: { email } });
        } catch (error) {
            setMessage(error.response.data);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-4 sm:p-8 space-y-6 bg-white rounded-lg shadow-md mx-4">
                <h2 className="text-2xl font-bold text-center text-gray-900">Forgot Password</h2>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Email address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Submit
                        </button>
                    </div>
                </form>
                {message && <p className="text-sm text-center text-gray-600">{message}</p>}
                <p className="text-sm text-center text-gray-600">
                    <Link to="/signin" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Back to Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default ForgotPassword;