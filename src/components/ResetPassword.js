import React, { useState } from 'react';
   import { useHistory, useLocation } from 'react-router-dom';
   import axios from 'axios';

   const ResetPassword = () => {
     const [formData, setFormData] = useState({
       password: '',
       confirmPassword: '',
     });
     const [errors, setErrors] = useState({});
     const [isLoading, setIsLoading] = useState(false);
     const [message, setMessage] = useState('');
     const history = useHistory();
     const location = useLocation();
     const token = new URLSearchParams(location.search).get('token');

     const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

     const handleChange = (e) => {
       const { name, value } = e.target;
       setFormData((prev) => ({
         ...prev,
         [name]: value,
       }));
       if (errors[name]) {
         setErrors((prev) => ({
           ...prev,
           [name]: '',
         }));
       }
     };

     const validateForm = () => {
       const newErrors = {};
       if (!formData.password) {
         newErrors.password = 'Password is required';
       } else if (formData.password.length < 6) {
         newErrors.password = 'Password must be at least 6 characters';
       }
       if (!formData.confirmPassword) {
         newErrors.confirmPassword = 'Please confirm your password';
       } else if (formData.password !== formData.confirmPassword) {
         newErrors.confirmPassword = 'Passwords do not match';
       }
       setErrors(newErrors);
       return Object.keys(newErrors).length === 0;
     };

     const handleSubmit = async (e) => {
       e.preventDefault();
       if (!validateForm()) return;
       setIsLoading(true);
       try {
         const response = await axios.post(`${API_URL}/api/auth/reset-password`, {
           token,
           password: formData.password,
           confirmPassword: formData.confirmPassword,
         });
         setMessage(response.data.message);
         setTimeout(() => history.push('/login'), 3000);
       } catch (error) {
         setErrors({
           general: error.response?.data?.error || 'Failed to reset password',
         });
       } finally {
         setIsLoading(false);
       }
     };

     return (
       <div className="min-h-screen bg-gradient-to-br from-[#f7f6fb] to-[#f0eff7] flex items-center justify-center px-4">
         <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
           <div className="text-center mb-8">
             <h2 className="text-2xl font-bold text-gray-900">Reset Password 🪄</h2>
             <p className="text-gray-600 text-sm mt-2">Enter your new password below</p>
           </div>
           <form onSubmit={handleSubmit} className="space-y-6">
             {message && (
               <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md text-sm">
                 {message}
               </div>
             )}
             {errors.general && (
               <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                 {errors.general}
               </div>
             )}

             <div>
               <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                 New Password
               </label>
               <input
                 type="password"
                 id="password"
                 name="password"
                 value={formData.password}
                 onChange={handleChange}
                 className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                   errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                 }`}
                 placeholder="Enter new password"
               />
               {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password}</p>}
             </div>

             <div>
               <label htmlFor="confirm-password" className="block text-sm font-semibold text-gray-700 mb-2">
                 Confirm Password
               </label>
               <input
                 type="password"
                 id="confirm-password"
                 name="confirmPassword"
                 value={formData.confirmPassword}
                 onChange={handleChange}
                 className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                   errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
                 }`}
                 placeholder="Confirm new password"
               />
               {errors.confirmPassword && (
                 <p className="text-red-600 text-xs mt-1">{errors.confirmPassword}</p>
               )}
             </div>

             <button
               type="submit"
               disabled={isLoading}
               className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
             >
               {isLoading ? (
                 <div className="flex items-center justify-center">
                   <i className="fas fa-spinner fa-spin mr-2"></i>
                   Resetting...
                 </div>
               ) : (
                 'Reset Password 🎉'
               )}
             </button>
           </form>
         </div>
       </div>
     );
   };

   export default ResetPassword;