import React, { useState, useRef } from 'react';
import { ArrowRight, Loader2, X, Camera } from 'lucide-react';
import { useBudgetStore } from '../store/budgetStore';
import { uploadReceipt } from '../lib/storage';
import { isOpenAIConfigured } from '../lib/openai';

export default function GlobalExpenseInput() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addExpenseWithAI, budgets } = useBudgetStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !uploadedImageUrl) return;
    
    if (!isOpenAIConfigured()) {
      setError('OpenAI API key is not configured');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const inputData = uploadedImageUrl ? { image: uploadedImageUrl } : input;
      const response = await addExpenseWithAI(inputData);
      
      if (response.transactions && response.transactions.length > 0) {
        const transaction = response.transactions[0];
        const budget = budgets.find(b => b.id === transaction.BudgetID);
        
        if (budget) {
          const remaining = budget.amount - transaction.Amount;
          setSuccessMessage(
            `$${transaction.Amount.toFixed(2)} was added to ${budget.name}. $${remaining.toFixed(2)} remaining.`
          );
          
          // Clear success message after 5 seconds
          setTimeout(() => setSuccessMessage(null), 5000);
        }
      }

      setInput('');
      setUploadedImageUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error: any) {
      setError(error.message || 'Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const receiptUrl = await uploadReceipt(file);
      setUploadedImageUrl(receiptUrl);
    } catch (error: any) {
      setError(error.message || 'Failed to upload image');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter expense details..."
              className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
              disabled={loading || isUploading}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading || isUploading || (!input.trim() && !uploadedImageUrl)}
            className="px-4 py-3 bg-[#38BDF8] text-white rounded-xl hover:bg-[#38BDF8]/90 disabled:opacity-50 disabled:hover:bg-[#38BDF8] transition-colors"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
          </button>

          <label className={`px-4 py-3 rounded-xl cursor-pointer transition-colors ${
            isUploading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
          } text-white`}>
            {isUploading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Camera className="w-5 h-5" />
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
              disabled={loading || isUploading}
            />
          </label>
        </div>

        {uploadedImageUrl && (
          <div className="relative inline-block">
            <img
              src={uploadedImageUrl}
              alt="Receipt"
              className="h-32 object-cover rounded-xl"
              onError={() => {
                setError('Failed to load image');
                setUploadedImageUrl(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
              }}
            />
            <button
              type="button"
              onClick={() => {
                setUploadedImageUrl(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
              }}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {successMessage && (
          <div className="text-green-600 text-sm bg-green-50 p-3 rounded-xl animate-slide-up">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="text-red-500 text-sm bg-red-50 p-3 rounded-xl">
            {error}
          </div>
        )}
      </form>
    </div>
  );
}