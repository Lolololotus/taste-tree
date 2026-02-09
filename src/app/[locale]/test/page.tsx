'use client';
import { useState } from 'react';

export default function TestPage() {
    const [response, setResponse] = useState('');
    const [status, setStatus] = useState('');

    const testConnection = async () => {
        setStatus('Testing connection...');
        try {
            const res = await fetch('/api/debug-chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: "Hello Garden",
                    history: [],
                    locale: "en"
                }),
            });
            const data = await res.json();
            setStatus('Success!');
            setResponse(JSON.stringify(data, null, 2));
        } catch (e: any) {
            setStatus('Error: ' + e.message);
        }
    };

    return (
        <div className="p-10 font-sans">
            <h1 className="text-2xl font-bold mb-4">API Connection Test</h1>
            <button
                onClick={testConnection}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                Test Connection (gemini-pro)
            </button>
            <div className="mt-4">
                <strong>Status:</strong> {status}
            </div>
            <pre className="mt-4 bg-gray-100 p-4 rounded whitespace-pre-wrap">
                {response}
            </pre>
        </div>
    );
}
