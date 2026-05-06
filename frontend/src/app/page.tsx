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
  Activity,
  Zap,
  ShieldAlert,
  History as HistoryIcon,
  Sun,
  Moon,
  Trash2
} from "lucide-react";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import JSZip from "jszip";
import yaml from "js-yaml";
import { Download, FileJson, FileCode } from "lucide-react";

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
  const [stage, setStage] = useState(0);
  const [history, setHistory] = useState<any[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<any>(null);
  const [codeLoading, setCodeLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const handleChat = async () => {
    if (!chatInput || !result) return;
    setChatLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/refine`, {
        config: result.data,
        instruction: chatInput
      });
      setResult({ ...result, data: response.data.data });
      setChatInput("");
    } catch (error) {
      console.error("Refinement failed", error);
    } finally {
      setChatLoading(false);
    }
  };

  const handleGenerateCode = async () => {
    if (!result) return;
    setCodeLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/generate-code`, {
        schemas: result.data
      });
      setGeneratedCode(response.data.data);
      setActiveTab("code");
    } catch (error) {
      console.error("Code generation failed", error);
    } finally {
      setCodeLoading(false);
    }
  };

  // Load history and theme
  useEffect(() => {
    const savedHistory = localStorage.getItem("appforge_history");
    if (savedHistory) setHistory(JSON.parse(savedHistory));

    const savedTheme = localStorage.getItem("appforge_theme");
    if (savedTheme === "light") {
      setIsDarkMode(false);
      document.body.classList.add("light-theme");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem("appforge_theme", newTheme ? "dark" : "light");
    if (newTheme) {
      document.body.classList.remove("light-theme");
    } else {
      document.body.classList.add("light-theme");
    }
  };

  const saveToHistory = (data: any, promptText: string) => {
    const newItem = { id: Date.now(), prompt: promptText, result: data, timestamp: new Date().toISOString() };
    const newHistory = [newItem, ...history].slice(0, 10);
    setHistory(newHistory);
    localStorage.setItem("appforge_history", JSON.stringify(newHistory));
  };

  const TEMPLATES = [
    { name: "E-commerce", prompt: "Build an e-commerce store with product catalog, cart, payments, and admin inventory management." },
    { name: "CRM", prompt: "Build a CRM with contacts, leads, and a dashboard. Only managers can see the 'Deals' page." },
    { name: "SaaS", prompt: "Build a SaaS platform with user subscription plans, project management, and team collaboration." },
    { name: "Blog", prompt: "Build a tech blog with markdown support, comments, and role-based access for editors." },
    { name: "Social App", prompt: "Build a social network with user profiles, post feed, likes, and private messaging." }
  ];

  const handleExport = (format: 'json' | 'yaml') => {
    if (!result) return;
    const content = format === 'json'
      ? JSON.stringify(result.data, null, 2)
      : yaml.dump(result.data);

    const blob = new Blob([content], { type: format === 'json' ? 'application/json' : 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `app-config.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadZip = async () => {
    if (!result) return;
    const zip = new JSZip();

    // Add schemas
    zip.file("schemas/db.json", JSON.stringify(result.data.dbSchema, null, 2));
    zip.file("schemas/api.json", JSON.stringify(result.data.apiSchema, null, 2));
    zip.file("schemas/ui.json", JSON.stringify(result.data.uiSchema, null, 2));
    zip.file("schemas/auth.json", JSON.stringify(result.data.authSchema, null, 2));

    // Add code if generated
    if (generatedCode) {
      zip.file("code/page.tsx", generatedCode.reactCode);
      zip.file("code/main.py", generatedCode.apiCode);
      zip.file("code/migration.sql", generatedCode.dbCode);
    }

    const content = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = `appforge-bundle-${Date.now()}.zip`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    setResult(null);
    setStage(1);
    console.log("DEBUG: Calling Backend at:", BACKEND_URL);

    try {
      // Simulate stage progression for UI feel
      setTimeout(() => setStage(2), 2000);
      setTimeout(() => setStage(3), 4000);

      const response = await axios.post(`${BACKEND_URL}/generate`, { prompt });

      setResult(response.data);
      saveToHistory(response.data, prompt);
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
    <main className={`container ${isDarkMode ? '' : 'light-theme'}`}>
      {/* Sidebar for History */}
      <div style={{
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        width: '300px',
        background: 'var(--sidebar)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid var(--border)',
        padding: '2rem',
        zIndex: 100,
        transform: (history.length > 0 && showHistory) ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: showHistory ? '20px 0 50px rgba(0,0,0,0.5)' : 'none'
      }}>
        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <HistoryIcon size={20} color="var(--primary)" />
          Generation History
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {history.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setResult(item.result);
                setPrompt(item.prompt);
                setStage(4);
              }}
              style={{
                textAlign: 'left',
                padding: '1rem',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.05)',
                color: 'white',
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              <div style={{ fontWeight: 'bold', marginBottom: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {item.prompt}
              </div>
              <div style={{ opacity: 0.4, fontSize: '0.7rem' }}>
                {new Date(item.timestamp).toLocaleTimeString()}
              </div>
            </button>
          ))}
          {history.length > 0 && (
            <button
              onClick={() => {
                setHistory([]);
                localStorage.removeItem("appforge_history");
              }}
              className="btn"
              style={{ marginTop: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444' }}
            >
              <Trash2 size={14} style={{ marginRight: '6px' }} />
              Clear History
            </button>
          )}
        </div>
      </div>

      <div className="bg-gradient" />
      <div className="bg-glow" style={{ top: '10%', right: '10%' }} />
      <div className="bg-glow" style={{ bottom: '10%', left: '10%', background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)' }} />

      <header className="header">
        <h1 className="title">APPFORGE.AI</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button onClick={() => setShowHistory(!showHistory)} className="btn" style={{ padding: '0.5rem', background: history.length > 0 ? 'rgba(99, 102, 241, 0.1)' : 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: showHistory ? 'var(--primary)' : 'inherit' }}>
            <HistoryIcon size={18} />
          </button>
          <button onClick={toggleTheme} className="btn" style={{ padding: '0.5rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)' }}>
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)' }} />

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
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          {TEMPLATES.map((t) => (
            <button
              key={t.name}
              className="btn"
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
              onClick={() => setPrompt(t.prompt)}
            >
              {t.name}
            </button>
          ))}
        </div>
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

            <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                {result.score !== undefined ? result.score : Math.max(0, 100 - (result.repairCount * 10) - (result.errors.length * 5))}%
              </div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem' }}>Quality Score</div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ padding: '0.25rem 0.75rem', borderRadius: '9999px', background: 'rgba(20, 184, 166, 0.1)', border: '1px solid rgba(20, 184, 166, 0.2)', color: '#2dd4bf', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Zap size={12} />
                Latency: {result.latency.toFixed(2)}s
              </div>
              {result.repairCount > 0 && (
                <div style={{ padding: '0.25rem 0.75rem', borderRadius: '9999px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', color: '#fbbf24', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldAlert size={12} />
                  Repaired: {result.repairCount} Errors
                </div>
              )}
            </div>

            <div style={{ marginTop: '2rem' }}>
              <h4 style={{ marginBottom: '1rem' }}>Validation Log</h4>

              {result.note && (
                <div style={{
                  padding: '1rem',
                  borderRadius: '8px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  color: '#ef4444',
                  fontSize: '0.85rem',
                  marginBottom: '1rem',
                  display: 'flex',
                  gap: '0.5rem',
                  alignItems: 'flex-start'
                }}>
                  <ShieldAlert size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>System Note:</strong><br />
                    {result.note}
                  </div>
                </div>
              )}

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

            <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => handleExport('json')} className="btn" style={{ flex: 1, fontSize: '0.75rem', padding: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)' }}>
                  <FileJson size={14} style={{ marginRight: '6px' }} />
                  JSON
                </button>
                <button onClick={() => handleExport('yaml')} className="btn" style={{ flex: 1, fontSize: '0.75rem', padding: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)' }}>
                  <FileCode size={14} style={{ marginRight: '6px' }} />
                  YAML
                </button>
              </div>

              <button onClick={handleGenerateCode} className="btn" style={{ fontSize: '0.85rem', padding: '0.75rem', background: 'var(--primary)' }}>
                {codeLoading ? <RefreshCw className="spin" size={16} /> : <Zap size={16} />}
                {codeLoading ? " Coding..." : " Generate Full Source Code"}
              </button>

              {generatedCode && (
                <button onClick={handleDownloadZip} className="btn" style={{ fontSize: '0.85rem', padding: '0.75rem', background: 'var(--accent)', color: 'black' }}>
                  <Download size={16} style={{ marginRight: '6px' }} />
                  Download Project Bundle (.zip)
                </button>
              )}
            </div>

            <div style={{ marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem' }}>
              <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Send size={16} color="var(--primary)" />
                Refine with Chat
              </h4>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="e.g. add payments, remove auth..."
                  style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.5rem 1rem', borderRadius: '8px', color: 'white', fontSize: '0.8rem' }}
                />
                <button onClick={handleChat} disabled={chatLoading} className="btn" style={{ padding: '0.5rem 1rem' }}>
                  {chatLoading ? <RefreshCw className="spin" size={14} /> : "Update"}
                </button>
              </div>
            </div>
          </div>

          {/* Code Viewer */}
          <div className="card">
            <div className="output-tabs">
              <button className={`tab ${activeTab === 'db' ? 'active' : ''}`} onClick={() => setActiveTab('db')}>DB</button>
              <button className={`tab ${activeTab === 'api' ? 'active' : ''}`} onClick={() => setActiveTab('api')}>API</button>
              <button className={`tab ${activeTab === 'ui' ? 'active' : ''}`} onClick={() => setActiveTab('ui')}>UI</button>
              <button className={`tab ${activeTab === 'auth' ? 'active' : ''}`} onClick={() => setActiveTab('auth')}>Auth</button>
              {generatedCode && (
                <button className={`tab ${activeTab === 'code' ? 'active' : ''}`} onClick={() => setActiveTab('code')} style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', marginLeft: '0.5rem', paddingLeft: '1rem' }}>
                  <Zap size={14} style={{ marginRight: '6px' }} />
                  Source Code
                </button>
              )}
              <div style={{ marginLeft: 'auto' }}>
                <button
                  className="btn"
                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.7rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                  onClick={() => {
                    const content = activeTab === 'code'
                      ? `${generatedCode.reactCode}\n\n${generatedCode.apiCode}\n\n${generatedCode.dbCode}`
                      : JSON.stringify(activeTab === 'db' ? result.data.dbSchema : activeTab === 'api' ? result.data.apiSchema : activeTab === 'ui' ? result.data.uiSchema : result.data.authSchema, null, 2);
                    navigator.clipboard.writeText(content);
                    alert("Copied to clipboard!");
                  }}
                >
                  Copy
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                <pre style={{ maxHeight: '600px', overflowY: 'auto' }}>
                  {activeTab === 'code' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                      <div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>// NEXT.JS COMPONENT</div>
                        {generatedCode.reactCode}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>// FASTAPI ROUTES</div>
                        {generatedCode.apiCode}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>// SQL MIGRATIONS</div>
                        {generatedCode.dbCode}
                      </div>
                    </div>
                  ) : (
                    JSON.stringify(
                      activeTab === 'db' ? result.data.dbSchema :
                        activeTab === 'api' ? result.data.apiSchema :
                          activeTab === 'ui' ? result.data.uiSchema :
                            result.data.authSchema,
                      null, 2
                    )
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
