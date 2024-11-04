import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function Auth() {
  const [phone, setPhone] = useState('');
  const [token, setToken] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const { signInWithPhone, verifyOTP, loading, error } = useAuthStore();

  const formatPhoneNumber = (input: string) => {
    // Remove all non-digit characters
    const digits = input.replace(/\D/g, '');
    
    // Add + prefix if not present
    return digits.startsWith('1') ? `+${digits}` : `+1${digits}`;
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formattedPhone = formatPhoneNumber(phone);
      await signInWithPhone(formattedPhone);
      setShowOTP(true);
    } catch (error) {
      console.error('Phone auth error:', error);
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formattedPhone = formatPhoneNumber(phone);
      await verifyOTP(formattedPhone, token);
    } catch (error) {
      console.error('OTP verification error:', error);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    // Only allow digits, +, and spaces
    const sanitized = input.replace(/[^\d\s+]/g, '');
    setPhone(sanitized);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm p-8 w-full max-w-md">
        <div className="flex items-center gap-3 mb-8">
          <img 
            src="https://stackblitz.com/storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBNEdLRXc9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--c05c4c62a7da7593d173dfa985de2eee30b998e9/logo.png" 
            alt="Spend Simple Logo" 
            className="h-12 w-12 object-contain"
          />
          <div>
            <h1 className="text-2xl font-bold text-indigo-900">Spend Simple</h1>
          </div>
        </div>

        {!showOTP ? (
          <form onSubmit={handlePhoneSubmit} className="space-y-4">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="+1 (902) 880-6288"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                US/Canada numbers only (+1)
              </p>
            </div>

            {error && (
              <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !phone}
              className="w-full bg-[#141414] text-white rounded-lg py-3 px-4 hover:bg-[#141414]/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending Code...
                </>
              ) : (
                'Send Code'
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleOTPSubmit} className="space-y-4">
            <div>
              <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-1">
                Verification Code
              </label>
              <input
                type="text"
                id="token"
                value={token}
                onChange={(e) => setToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit code"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                pattern="\d{6}"
                inputMode="numeric"
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowOTP(false)}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading || token.length !== 6}
                className="flex-1 bg-[#141414] text-white rounded-lg py-3 px-4 hover:bg-[#141414]/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify Code'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}