import Link from 'next/link';
import Logo from './Logo';
import styles from './Footer.module.css';
import { SITE, NAV_LINKS, MODULES, REPOS, LAUNCH_LINKS } from '@/lib/content';

export default function Footer() {
  const docLinks = NAV_LINKS.filter((l) => !['/', MODULES.terrascope.href, MODULES.pulsearch.href].includes(l.path));

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.main}`}>
        <div className={styles.brand}>
          <Logo />
          <p className={styles.desc}>{SITE.description}</p>
          <p className={styles.meta}>
            {SITE.programme} · {SITE.year}
          </p>
        </div>

        <div className={styles.cols}>
          <div>
            <h3 className={styles.colTitle}>Documentation</h3>
            <ul>
              {docLinks.map((l) => (
                <li key={l.path}>
                  <Link href={l.path} prefetch>
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={styles.colTitle}>Applications</h3>
            <ul>
              <li>
                <Link href={LAUNCH_LINKS.terrascope} prefetch>
                  {MODULES.terrascope.brand}
                </Link>
                <span className={styles.hint}>Map analysis</span>
              </li>
              <li>
                <Link href={LAUNCH_LINKS.pulsearch} prefetch>
                  {MODULES.pulsearch.brand}
                </Link>
                <span className={styles.hint}>Live monitor</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className={styles.colTitle}>Source code</h3>
            <ul>
              <li>
                <a href={REPOS.terrascope} target="_blank" rel="noopener noreferrer">
                  {MODULES.terrascope.codename}
                </a>
              </li>
              <li>
                <a href={REPOS.pulsearch} target="_blank" rel="noopener noreferrer">
                  {MODULES.pulsearch.codename}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className={styles.bar}>
        <div className={`container ${styles.barInner}`}>
          <span>
            © {SITE.copyrightYear} {SITE.name}
          </span>
          <span className={styles.stack}>Next.js · TypeScript</span>
        </div>
      </div>
    </footer>
  );
}
