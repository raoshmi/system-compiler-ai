"use client";

import { useState } from "react";
import { 
  Send, 
  Database, 
  Cpu, 
  Layout, 
  Lock, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw,
  Activity
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

type AppConfig = {
  dbSchema: any;
  apiSchema: any;
  uiSchema: any;
  authSchema: any;
};

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("db");
  const [result, setResult] = useState<any>(null);
  const [stage, setStage] = useState(0); // 0: Idle, 1: Intent, 2: Arch, 3: Schema, 4: Done

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    setResult(null);
    setStage(1);

    try {
      // Simulate stage progression for UI feel
      setTimeout(() => setStage(2), 2000);
      setTimeout(() => setStage(3), 4000);

      const response = await axios.post(`${BACKEND_URL}/generate`, { prompt });
      
      setResult(response.data);
      setStage(4);
    } catch (error) {
      console.error("Generation failed", error);
      alert("Error generating app. Make sure the backend is running.");
      setStage(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container">
      <div className="bg-gradient" />
      <div className="bg-glow" style={{ top: '10%', right: '10%' }} />
      <div className="bg-glow" style={{ bottom: '10%', left: '10%', background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)' }} />

      <header className="header">
        <h1 className="title">APPFORGE.AI</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div className={`step ${stage >= 1 ? 'active' : ''} ${stage > 1 ? 'completed' : ''}`}>
            <Send size={18} />
          </div>
          <div className={`step ${stage >= 2 ? 'active' : ''} ${stage > 2 ? 'completed' : ''}`}>
            <Cpu size={18} />
          </div>
          <div className={`step ${stage >= 3 ? 'active' : ''} ${stage > 3 ? 'completed' : ''}`}>
            <Layout size={18} />
          </div>
          <div className={`step ${stage >= 4 ? 'active' : ''}`}>
            <CheckCircle size={18} />
          </div>
        </div>
      </header>

      <section className="prompt-section">
        <div className="card">
          <textarea 
            placeholder="e.g. Build a CRM with login, contacts, dashboard, role-based access, and premium plan with payments. Admins can see analytics."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={loading}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button 
              className="btn" 
              onClick={handleGenerate}
              disabled={loading || !prompt}
            >
              {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <RefreshCw className="spin" size={18} />
                  Compiling...
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Cpu size={18} />
                  Generate App
                </div>
              )}
            </button>
          </div>
        </div>
      </section>

      {result && (
        <motion.div 
          className="main-grid"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Sidebar / Stats */}
          <div className="card">
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity size={20} color="var(--primary)" />
              Compiler Metrics
            </h3>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-val">{(result.latency).toFixed(2)}s</div>
                <div className="stat-label">Latency</div>
              </div>
              <div className="stat-card">
                <div className="stat-val">{result.repairCount}</div>
                <div className="stat-label">Repairs</div>
              </div>
              <div className="stat-card">
                <div className="stat-val">{result.errors.length === 0 ? 'YES' : 'NO'}</div>
                <div className="stat-label">Validated</div>
              </div>
            </div>

            <div style={{ marginTop: '2rem' }}>
              <h4 style={{ marginBottom: '1rem' }}>Validation Log</h4>
              {result.errors.length === 0 ? (
                <div style={{ color: 'var(--accent)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle size={16} />
                  No logical inconsistencies found.
                </div>
              ) : (
                <ul style={{ listStyle: 'none', fontSize: '0.85rem' }}>
                  {result.errors.map((err: string, i: number) => (
                    <li key={i} style={{ color: '#ef4444', marginBottom: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                      <AlertCircle size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
                      {err}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Code Viewer */}
          <div className="card">
            <div className="output-tabs">
              <button 
                className={`tab ${activeTab === 'db' ? 'active' : ''}`}
                onClick={() => setActiveTab('db')}
              >
                <Database size={14} style={{ marginRight: '6px' }} />
                DB Schema
              </button>
              <button 
                className={`tab ${activeTab === 'api' ? 'active' : ''}`}
                onClick={() => setActiveTab('api')}
              >
                <Cpu size={14} style={{ marginRight: '6px' }} />
                API Config
              </button>
              <button 
                className={`tab ${activeTab === 'ui' ? 'active' : ''}`}
                onClick={() => setActiveTab('ui')}
              >
                <Layout size={14} style={{ marginRight: '6px' }} />
                UI Schema
              </button>
              <button 
                className={`tab ${activeTab === 'auth' ? 'active' : ''}`}
                onClick={() => setActiveTab('auth')}
              >
                <Lock size={14} style={{ marginRight: '6px' }} />
                Auth Rules
              </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <pre>
                  {JSON.stringify(
                    activeTab === 'db' ? result.data.dbSchema :
                    activeTab === 'api' ? result.data.apiSchema :
                    activeTab === 'ui' ? result.data.uiSchema :
                    result.data.authSchema, 
                    null, 2
                  )}
                </pre>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </main>
  );
}
