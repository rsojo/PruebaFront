"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
    const initial = saved || 'dark';
    setTheme(initial);
    document.documentElement.setAttribute('data-theme', initial === 'light' ? 'light' : 'dark');
  }, []);

  const toggle = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next === 'light' ? 'light' : 'dark');
    try { localStorage.setItem('theme', next); } catch {}
  };

  return (
    <button type="button" className="button btn-ghost" onClick={toggle} aria-label="toggle-tema">
      {theme === 'light' ? 'Modo oscuro' : 'Modo claro'}
    </button>
  );
}
