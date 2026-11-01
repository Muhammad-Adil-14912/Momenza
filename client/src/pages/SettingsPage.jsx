import {
    CheckCircle2,
    Database,
    ExternalLink,
    HelpCircle,
    Info,
    Key,
    Lock,
    Save,
    Server,
    Shield,
    Sparkles,
    User
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const SettingsPage = () => {
  const { user } = useAuth();
  const [configStatus, setConfigStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await api.get('/config/status');
        if (res.data?.success) {
          setConfigStatus(res.data);
        }
      } catch (err) {
        console.error('Error fetching config status:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, []);

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto w-full space-y-8">
      {/* Top Header */}
      <div className="border-b border-[#EAE8E2] pb-6">
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#85847F]">
          System & Account
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#252522] mt-1 font-normal">
          Settings & Integrations
        </h1>
        <p className="text-sm text-[#85847F] mt-1 font-light">
          Monitor your database persistence, Gemini GenAI credentials, and host profile.
        </p>
      </div>

      {/* Live System Architecture Status */}
      <div className="bg-white rounded-3xl border border-[#EAE8E2] p-6 lg:p-8 space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-[#C47B62]/10 flex items-center justify-center text-[#C47B62]">
            <Server className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-medium text-[#252522]">Live Platform Architecture</h3>
            <p className="text-xs text-[#85847F]">Status of backend services, AI models, and database</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Database Card */}
          <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#EAE8E2] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#252522] flex items-center space-x-1.5">
                <Database className="w-3.5 h-3.5 text-[#C47B62]" />
                <span>Database Engine</span>
              </span>
              <span className="text-[10px] font-medium bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                Online & Persisted
              </span>
            </div>
            <p className="text-xs text-[#85847F] font-light">
              Mode: <strong className="text-[#252522]">{configStatus?.type || 'Local Resilient Storage'}</strong>
            </p>
            <p className="text-[11px] text-[#85847F] font-light">
              All events, tasks, expenses, and guests are saved continuously to disk. To switch to cloud MongoDB Atlas, configure <code className="text-[#C47B62] font-mono">MONGODB_URI</code> in <code className="font-mono">server/.env</code>.
            </p>
          </div>

          {/* Gemini AI Card */}
          <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#EAE8E2] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#252522] flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#C47B62]" />
                <span>Google Gemini Engine</span>
              </span>
              <span
                className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                  configStatus?.geminiKeyConfigured
                    ? 'bg-green-100 text-green-700'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {configStatus?.geminiKeyConfigured ? 'Live Gemini 1.5/2.0 API' : 'Domain Heuristics Active'}
              </span>
            </div>
            <p className="text-xs text-[#85847F] font-light">
              Status: <strong className="text-[#252522]">{configStatus?.geminiKeyConfigured ? 'API Connected' : 'High-Fidelity Offline Engine'}</strong>
            </p>
            <p className="text-[11px] text-[#85847F] font-light">
              Generates deep bespoke event plans for any city and budget. To connect live Google Gemini API, add your key to <code className="text-[#C47B62] font-mono">GEMINI_API_KEY</code> in <code className="font-mono">server/.env</code>.
            </p>
          </div>
        </div>
      </div>

      {/* Host Profile Info */}
      <div className="bg-white rounded-3xl border border-[#EAE8E2] p-6 lg:p-8 space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-[#FAF9F6] border border-[#EAE8E2] flex items-center justify-center text-[#252522]">
            <User className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-medium text-[#252522]">Host Profile</h3>
            <p className="text-xs text-[#85847F]">Your identity across event plans and vendor communications</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#85847F] mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              readOnly
              value={user?.name || 'Aria Sharma'}
              className="w-full bg-[#FAF9F6] border border-[#EAE8E2] rounded-xl px-3.5 py-2.5 text-xs text-[#252522] cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#85847F] mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              readOnly
              value={user?.email || 'demo@momenza.art'}
              className="w-full bg-[#FAF9F6] border border-[#EAE8E2] rounded-xl px-3.5 py-2.5 text-xs text-[#252522] cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* Environment Setup Guide */}
      <div className="bg-[#FAF9F6] rounded-3xl border border-[#EAE8E2] p-6 space-y-3">
        <div className="flex items-center space-x-2 text-xs font-semibold text-[#252522]">
          <Info className="w-4 h-4 text-[#C47B62]" />
          <span>Server Configuration File (`server/.env`)</span>
        </div>
        <pre className="p-4 rounded-2xl bg-white border border-[#EAE8E2] text-xs font-mono text-[#252522] overflow-x-auto">
{`PORT=5000
JWT_SECRET=momenza_luxury_event_secret_key_2026_jwt_token
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/momenza
GEMINI_API_KEY=AIzaSy...`}
        </pre>
        <p className="text-xs text-[#85847F] font-light leading-relaxed">
          Both MongoDB Atlas and Gemini API keys are fully supported and seamlessly handled with automatic fallbacks so that the platform never breaks.
        </p>
      </div>
    </div>
  );
};

export default SettingsPage;
