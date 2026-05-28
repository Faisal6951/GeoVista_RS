import type { Metadata } from 'next';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import styles from '../shared.module.css';
import { MODULES, PULSEEARTH_TOOLS, LAUNCH_LINKS, REPOS } from '@/lib/content';

const m = MODULES.pulsearch;

export const metadata: Metadata = {
  title: m.brand,
  description: m.desc,
};

export default function PulseEarthPage() {
  return (
    <>
      <PageHeader large eyebrow={`Source: ${m.codename}`} title={m.brand} description={m.desc}>
        <Link href={LAUNCH_LINKS.pulsearch} className="btn btn-primary">
          Open live app
        </Link>
        <a href={REPOS.pulsearch} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
          GitHub
        </a>
      </PageHeader>

      <section className="section">
        <div className="container">
          <div className={styles.whyBlock}>
            <p className="eyebrow eyebrow-accent">Why we built it</p>
            <p className={styles.whyText}>{m.whyBuilt}</p>
          </div>
        </div>
      </section>

      <section className={`section ${styles.alt}`}>
        <div className="container">
          <header className="section-head">
            <p className="eyebrow">Data layers</p>
            <h2>Live environmental feeds</h2>
          </header>
          <div className={styles.toolGrid}>
            {PULSEEARTH_TOOLS.map((t) => (
              <article key={t.name} className={`card ${styles.toolCard}`}>
                <h3>{t.name}</h3>
                <p>{t.desc}</p>
                <p className={styles.why}>
                  <span>Purpose</span> {t.why}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
