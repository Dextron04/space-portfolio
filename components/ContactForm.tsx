import { useState } from 'react';

export default function ContactForm() {
    const [form, setForm] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setError('');
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                setStatus('success');
                setForm({ name: '', email: '', message: '' });
            } else {
                const data = await res.json();
                setError(data.error || 'Something went wrong.');
                setStatus('error');
            }
        } catch {
            setError('Network error.');
            setStatus('error');
        }
    };

    return (
        <div className="bg-gradient-to-br from-slate-900/80 to-indigo-900/60 rounded-2xl shadow-xl p-8 w-full max-w-xl mx-auto border border-purple-800/40">
            <h4 className="text-xl font-semibold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-300 to-blue-400">Contact Me</h4>
            <p className="text-gray-400 mb-6 text-sm">Fill out the form below and I&apos;ll get back to you soon!</p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="rounded-lg px-4 py-3 bg-slate-800/80 border border-purple-800/30 focus:border-purple-500 focus:ring-2 focus:ring-purple-400/30 outline-none text-white placeholder-gray-400 transition"
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="rounded-lg px-4 py-3 bg-slate-800/80 border border-purple-800/30 focus:border-purple-500 focus:ring-2 focus:ring-purple-400/30 outline-none text-white placeholder-gray-400 transition"
                />
                <textarea
                    name="message"
                    placeholder="Your Message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="rounded-lg px-4 py-3 bg-slate-800/80 border border-purple-800/30 focus:border-purple-500 focus:ring-2 focus:ring-purple-400/30 outline-none text-white placeholder-gray-400 transition resize-none"
                />
                <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 rounded-lg shadow-md transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {status === 'loading' ? 'Sending...' : 'Send Message'}
                </button>
                {status === 'success' && <p className="text-green-400 text-center">Message sent!</p>}
                {status === 'error' && <p className="text-red-400 text-center">{error}</p>}
            </form>
        </div>
    );
} 