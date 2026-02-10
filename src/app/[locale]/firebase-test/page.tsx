'use client';

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

export default function FirebaseTestPage() {
    const [status, setStatus] = useState<string>('Ready to test');
    const [lastId, setLastId] = useState<string>('');
    const [logs, setLogs] = useState<string[]>([]);

    const addLog = (msg: string) => setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);

    const handleTest = async () => {
        setStatus('Testing...');
        addLog('Attempting to write to Firestore...');

        try {
            // 1. Write Test
            const docRef = await addDoc(collection(db, "connection_test"), {
                message: "Hello Firebase!",
                timestamp: new Date()
            });
            addLog(`✅ Write Success! Doc ID: ${docRef.id}`);
            setLastId(docRef.id);

            // 2. Read Test
            addLog('Attempting to read from Firestore...');
            const querySnapshot = await getDocs(collection(db, "connection_test"));
            addLog(`✅ Read Success! Found ${querySnapshot.size} documents.`);

            setStatus('✅ Connected Successfully');

        } catch (e: any) {
            console.error(e);
            addLog(`❌ Error: ${e.message}`);
            if (e.message.includes("insufficient permissions")) {
                addLog("⚠️ Hint: Check Firestore Security Rules in Console (Set to Test Mode).");
            }
            setStatus('❌ Connection Failed');
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFFDF0] p-8 font-mono text-[#795548]">
            <h1 className="text-2xl font-bold mb-6">🔥 Firebase Connection Test</h1>

            <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg border-2 border-[#795548]">
                <div className="mb-4 text-center text-lg font-bold">
                    Status: <span className={status.includes('✅') ? 'text-green-600' : status.includes('❌') ? 'text-red-600' : 'text-gray-600'}>{status}</span>
                </div>

                <button
                    onClick={handleTest}
                    className="w-full py-3 bg-[#E0F7FA] hover:bg-[#B2EBF2] text-[#006064] font-bold rounded-lg transition-colors border-2 border-[#006064] shadow-[4px_4px_0px_#006064] active:translate-y-1 active:shadow-none"
                >
                    Test Connection
                </button>

                <div className="mt-6 bg-black text-[#00FF00] p-4 rounded-lg h-64 overflow-y-auto text-xs font-mono">
                    {logs.length === 0 && <span className="text-gray-500">// Logs will appear here...</span>}
                    {logs.map((log, i) => (
                        <div key={i}>{log}</div>
                    ))}
                </div>
            </div>

            <p className="mt-8 text-sm opacity-70 max-w-md text-center">
                * If this fails with "insufficient permissions", go to Firebase Console -&gt; Firestore -&gt; Rules and set to allow read/write for all (Test Mode).
            </p>
        </div>
    );
}
