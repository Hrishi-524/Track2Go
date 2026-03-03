'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { login } from '@/lib/auth.api';
import { useToast } from '@/hooks/useToast';
import { Copy, Check } from 'lucide-react';

const CLI_STEPS = [
  'git clone https://github.com/Hrishi-524/t2g-cli',
  'cd t2g-cli',
  'npm install',
  'npm link',
  'track2go init',
];

function StepBadge({ number }: { number: number }) {
  return (
    <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-semibold text-white bg-blue-600 rounded-full">
      {number}
    </span>
  );
}

function CodeBlock({ step, index }: { step: string; index: number }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(step);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-3 p-4 mb-3 bg-gray-900 rounded-lg border border-gray-800 hover:border-gray-700 transition">
      <StepBadge number={index + 1} />
      <code className="flex-1 font-mono text-sm text-gray-200 break-all">{step}</code>
      <button
        onClick={handleCopy}
        className="flex-shrink-0 p-1.5 text-gray-400 hover:text-gray-200 transition"
        aria-label="Copy command"
      >
        {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
      </button>
    </div>
  );
}

function DemoLoginCard() {
  const router = useRouter();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
<<<<<<< HEAD
      await login('demo@gmail.com', 'demo@123');
=======
      await login('sp3567208@gmail.com', 'Hrishi@524');
>>>>>>> 4c2525e7c98827da1d2a5b4e9a1fe50d0e545734
      router.push('/dashboard');
    } catch (error: any) {
      addToast('Demo login failed, try again', 'error');
      console.error('Demo login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-900 border border-gray-800 rounded-lg">
      <h3 className="text-lg font-semibold text-white mb-2">Inject Demo & Login</h3>
      <p className="text-gray-400 text-sm mb-4">
        Loads sample repositories and commits so you can explore Track2Go instantly.
      </p>

      <div className="space-y-2 mb-6 p-4 bg-gray-800/50 rounded border border-gray-700">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Username:</span>
          <span className="font-mono text-gray-200">demouser</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Email:</span>
          <span className="font-mono text-gray-200">demo@gmail.com</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Password:</span>
          <span className="font-mono text-gray-200">demo@123</span>
        </div>
      </div>

      <button
        onClick={handleDemoLogin}
        disabled={loading}
        className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white font-medium rounded-lg transition"
      >
        {loading ? 'Loading…' : 'Launch Demo'}
      </button>
    </div>
  );
}

function ToastContainer({ toasts, onRemove }: { toasts: any[]; onRemove: (id: string) => void }) {
  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`p-4 rounded-lg text-sm font-medium ${
            toast.type === 'error' ? 'bg-red-900 text-red-100' : 'bg-green-900 text-green-100'
          }`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}

export default function HomePage() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="min-h-screen bg-gray-950 text-gray-50">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold text-white mb-2">Track2Go</h1>
            <p className="text-lg text-gray-400">
              A Git-inspired version control system. Own your workflow.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/login"
              className="px-4 py-2 border border-gray-700 hover:border-gray-500 text-gray-200 rounded-lg transition"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 border border-gray-700 hover:border-gray-500 text-gray-200 rounded-lg transition"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - CLI Setup */}
          <div>
            <h2 className="text-2xl font-semibold text-white mb-6">Install & Setup</h2>
            <div>
              {CLI_STEPS.map((step, index) => (
                <CodeBlock key={index} step={step} index={index} />
              ))}
            </div>
          </div>

          {/* Right Column - Demo Login */}
          <div className="flex flex-col justify-center">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-white mb-4">Try Demo</h2>
            </div>
            <DemoLoginCard />
          </div>
        </div>
      </main>

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
