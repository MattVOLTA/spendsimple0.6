import React, { useState } from 'react';
import { testOpenAIResponse } from '../lib/testOpenAI';
import { Loader2 } from 'lucide-react';

interface APILog {
  request: {
    input: string;
    systemPrompt: string;
  };
  response: any;
}

export default function TestOpenAI() {
  const [input, setInput] = useState('');
  const [apiLog, setApiLog] = useState<APILog | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setApiLog(null);

    try {
      const result = await testOpenAIResponse(input);
      setApiLog(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Test OpenAI Response</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter expense (e.g., coffee 4.99 at starbucks)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !input.trim()}
          className={`bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 ${
            loading ? 'opacity-50' : 'hover:bg-blue-700'
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : (
            'Test OpenAI'
          )}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      {apiLog && (
        <div className="mt-8 space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Request:</h3>
            <div className="bg-gray-100 p-4 rounded-lg space-y-4">
              <div>
                <h4 className="font-medium text-sm text-gray-600">System Prompt:</h4>
                <pre className="mt-1 text-sm whitespace-pre-wrap">{apiLog.request.systemPrompt}</pre>
              </div>
              <div>
                <h4 className="font-medium text-sm text-gray-600">User Input:</h4>
                <pre className="mt-1 text-sm">{apiLog.request.input}</pre>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Response:</h3>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
              {JSON.stringify(apiLog.response, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}