'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { Clapperboard, Search, Menu, X } from 'lucide-react';

export default function Header() {
  const [q, setQ] = useState('');
  const [openMenu, setOpenMenu] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  function onSearch(e: FormEvent) {
    e.preventDefault();
    if (!q.trim()) return;
    setOpenSearch(false);
    router.push(`/search?q=${encodeURIComponent(q.trim())}`);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 transition-all
        ${scrolled ? 'backdrop-blur-md bg-black/30' : 'bg-transparent'}`}
      />

      <div className="container-page relative">
        <div className="mt-6 rounded-2xl">
          <div className="flex items-center gap-6 px-5 py-3.5">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <div className="h-7 w-7 rounded-md grid place-items-center">
                <Clapperboard className="h-4 w-4" />
              </div>
              <span className="text-lg">Movie</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-sm text-white/90">
              <Link href="/" className="hover:text-white">Home</Link>
              <Link href="/favorites" className="hover:text-white">Favorites</Link>
            </nav>

            <div className="ml-auto" />

            <form onSubmit={onSearch} className="hidden md:block w-60 md:w-96">
              <label className="relative block">
                <span className="absolute inset-y-0 left-3 flex items-center">
                  <Search className="h-4 w-4 text-white/60" />
                </span>
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search Movie"
                  className="w-full rounded-2xl bg-white/10 pl-10 pr-3 py-2.5 placeholder-white/70 text-sm outline-none border border-white/10/0 focus:border-white/30/0"
                />
              </label>
            </form>

            <div className="flex md:hidden items-center gap-2">
              <button onClick={() => setOpenSearch((v) => !v)} className="rounded-lg p-2 hover:bg-white/10" aria-label="Search">
                <Search className="h-5 w-5" />
              </button>
              <button onClick={() => setOpenMenu(true)} className="rounded-lg p-2 hover:bg-white/10" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>

          {openSearch && (
            <div className="md:hidden px-5 pb-4">
              <form onSubmit={onSearch}>
                <label className="relative block">
                  <span className="absolute inset-y-0 left-3 flex items-center">
                    <Search className="h-4 w-4 text-white/60" />
                  </span>
                  <input
                    autoFocus
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search Movie"
                    className="w-full rounded-xl bg-white/10 pl-10 pr-3 py-2.5 placeholder-white/70 text-sm outline-none"
                  />
                </label>
              </form>
            </div>
          )}
        </div>
      </div>

      {openMenu && (
        <>
          <div className="fixed inset-0 z-[60] bg-black/60" onClick={() => setOpenMenu(false)} />
          <div className="fixed right-0 top-0 z-[70] h-dvh w-full bg-[#0b0f19]/95 backdrop-blur p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-semibold">
                <div className="h-7 w-7 rounded-md bg-white/20 grid place-items-center">
                  <Clapperboard className="h-4 w-4" />
                </div>
                <span className="text-lg">Movie</span>
              </div>
              <button onClick={() => setOpenMenu(false)} className="rounded-lg p-2 hover:bg-white/10" aria-label="Close menu">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="mt-6 flex flex-col gap-2 text-white/90">
              <Link href="/" onClick={() => setOpenMenu(false)} className="rounded-lg px-3 py-2 hover:bg-white/10">Home</Link>
              <Link href="/favorites" onClick={() => setOpenMenu(false)} className="rounded-lg px-3 py-2 hover:bg-white/10">Favorites</Link>
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
