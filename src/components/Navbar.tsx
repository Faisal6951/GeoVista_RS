'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Menu, X, Sun, Moon, ChevronDown } from 'lucide-react';
import Logo from './Logo';
import styles from './Navbar.module.css';
import { useTheme } from './ThemeProvider';
import { NAV_LINKS, MODULES, LAUNCH_LINKS } from '@/lib/content';

const PRIMARY_NAV = NAV_LINKS.filter((l) =>
  ['/', '/about', '/platform'].includes(l.path)
);

const MORE_NAV = NAV_LINKS.filter((l) =>
  ['/methodology', '/study-area', '/results'].includes(l.path)
);

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const scrollYRef = useRef(0);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    fn();
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setMoreOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    scrollYRef.current = window.scrollY;
    const { style } = document.body;
    style.position = 'fixed';
    style.top = `-${scrollYRef.current}px`;
    style.left = '0';
    style.right = '0';
    style.width = '100%';
    style.overflow = 'hidden';

    return () => {
      style.position = '';
      style.top = '';
      style.left = '';
      style.right = '';
      style.width = '';
      style.overflow = '';
      window.scrollTo(0, scrollYRef.current);
    };
  }, [menuOpen]);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.bar}`}>
        <Link href="/" className={styles.logo}>
          <Logo />
        </Link>

        <nav className={styles.desktop} aria-label="Primary">
          {PRIMARY_NAV.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              prefetch
              className={pathname === link.path ? styles.linkActive : styles.link}
            >
              {link.name}
            </Link>
          ))}

          <div className={styles.dropdown}>
            <button
              type="button"
              className={styles.link}
              onClick={() => setMoreOpen((v) => !v)}
              aria-expanded={moreOpen}
            >
              More <ChevronDown size={14} className={moreOpen ? styles.chevronUp : ''} />
            </button>
            {moreOpen && (
              <>
                <div className={styles.backdrop} onClick={() => setMoreOpen(false)} aria-hidden />
                <div className={styles.menu}>
                  {MORE_NAV.map((link) => (
                    <Link key={link.path} href={link.path} prefetch className={styles.menuItem}>
                      {link.name}
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>

          <span className={styles.divider} aria-hidden />

          <Link
            href={MODULES.terrascope.href}
            prefetch
            className={pathname.startsWith('/terrascope') ? styles.linkActive : styles.link}
          >
            {MODULES.terrascope.brand}
          </Link>
          <Link
            href={MODULES.pulsearch.href}
            prefetch
            className={pathname.startsWith('/pulsearch') ? styles.linkActive : styles.link}
          >
            {MODULES.pulsearch.brand}
          </Link>
        </nav>

        <div className={styles.actions}>
          <div className={styles.appBtns}>
            <Link href={LAUNCH_LINKS.terrascope} prefetch className={styles.appBtn}>
              Open {MODULES.terrascope.brand}
            </Link>
          </div>
          <button type="button" className={styles.iconBtn} onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {mounted &&
        menuOpen &&
        createPortal(
          <div
            className={styles.mobileOverlay}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
            onClick={() => setMenuOpen(false)}
          >
            <div className={styles.mobilePanel} onClick={(e) => e.stopPropagation()}>
              <div className={styles.mobileTop}>
                <Logo compact />
                <button
                  type="button"
                  className={styles.iconBtn}
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>
              <nav className={styles.mobileNav}>
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.path}
                    href={link.path}
                    prefetch
                    className={pathname === link.path ? styles.mobileActive : styles.mobileLink}
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
              <div className={styles.mobileApps}>
                <Link
                  href={LAUNCH_LINKS.terrascope}
                  prefetch
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                  onClick={() => setMenuOpen(false)}
                >
                  {MODULES.terrascope.brand}
                </Link>
                <Link
                  href={LAUNCH_LINKS.pulsearch}
                  prefetch
                  className="btn btn-secondary"
                  style={{ width: '100%' }}
                  onClick={() => setMenuOpen(false)}
                >
                  {MODULES.pulsearch.brand}
                </Link>
              </div>
            </div>
          </div>,
          document.body
        )}
    </header>
  );
}
