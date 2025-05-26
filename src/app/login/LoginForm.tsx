'use client';

import { useState } from 'react';
import styles from './Login.module.css';
import type { UserType } from '@/models/User';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [user, setUser] = useState<UserType | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErro('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: senha }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erro ao fazer login');
      }

      const { token } = await res.json();
      localStorage.setItem('token', token);

      const me = await fetch('/api/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!me.ok) {
        throw new Error('Erro ao buscar usuário autenticado');
      }

      const data = await me.json();
      setUser(data.user);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErro(err.message);
      } else {
        setErro('Erro inesperado');
      }
    }
  }

  return (
    <form className={styles.loginForm} onSubmit={handleLogin}>
      <input
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        required
      />
      <button type="submit">Entrar</button>

      {erro && <p className={styles.error}>{erro}</p>}

      {user && (
        <div className={styles.resultado}>
          <p>Login realizado com sucesso!</p>
          <pre>{JSON.stringify(user, null, 2)}</pre>
        </div>
      )}
    </form>
  );
}
