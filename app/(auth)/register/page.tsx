'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getBaseUrl } from '@/lib/utils';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic validation
    if (password.length < 6) {
      setError('Fjalëkalimi duhet të ketë të paktën 6 karaktere');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${getBaseUrl()}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      // Check if response is HTML instead of JSON (error page)
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        throw new Error('Ndodhi një gabim në server. Ju lutemi provoni përsëri më vonë.');
      }

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('JSON parsing error:', jsonError);
        throw new Error('Ndodhi një gabim gjatë përpunimit të përgjigjes nga serveri');
      }

      if (!response.ok) {
        throw new Error(data?.message || 'Ndodhi një gabim gjatë regjistrimit');
      }

      // Successful registration, redirect to login or home
      router.push('/login?registered=true');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ndodhi një gabim gjatë regjistrimit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-dvh w-screen items-center justify-center bg-background">
      <div className="w-full max-w-md overflow-hidden rounded-2xl p-8 shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold dark:text-zinc-50">Regjistrohu</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-zinc-400">
            Krijo një llogari me email dhe fjalëkalim
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Adresa e Emailit</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="perdorues@shembull.com"
              required
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Fjalëkalimi</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
            <p className="text-xs text-gray-500 dark:text-zinc-500">
              Fjalëkalimi duhet të ketë të paktën 6 karaktere
            </p>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Duke u regjistruar...' : 'Regjistrohu'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600 dark:text-zinc-400">
            Ke tashmë një llogari?{' '}
            <Link
              href="/login"
              className="font-semibold text-gray-800 hover:underline dark:text-zinc-200"
            >
              Hyr
            </Link>
            {' këtu.'}
          </p>
        </div>
      </div>
    </div>
  );
}
