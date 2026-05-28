import type { Metadata } from 'next';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import styles from '../shared.module.css';
import {
  BUILT_ITEMS,
  TERRASCOPE_TOOLS,
  PULSEEARTH_TOOLS,
  MODULES,
  LAUNCH_LINKS,
} from '@/lib/content';

export const metadata: Metadata = {
  title: 'Platform',
  description: 'What we built in GeoVista — portal, TerraScope, and PulseEarth.',
};

export default function PlatformPage() {
  return (
    <>
      <PageHeader
        large
        eyebrow="Deliverables"
        title="The full platform stack"
        description="GeoVista is not a landing-page template — it is the integration layer we wrote to host, document, and deploy two RS/GIS applications behind one professional URL."
      />

      <section className="section">
        <div className="container">
          <header className="section-head">
            <p className="eyebrow">GeoVista hub</p>
            <h2>This repository</h2>
          </header>
          <ul className={styles.builtList}>
            {BUILT_ITEMS.map((item) => (
              <li key={item.title} className={`card ${styles.builtItem}`}>
                <strong>{item.title}</strong>
                <p>{item.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={`section ${styles.alt}`}>
        <div className="container">
          <header className="section-head">
            <p className="eyebrow">{MODULES.terrascope.brand}</p>
            <h2>{MODULES.terrascope.tagline}</h2>
            <p>{MODULES.terrascope.desc}</p>
          </header>
          <div className={styles.toolGrid}>
            {TERRASCOPE_TOOLS.map((t) => (
              <article key={t.name} className={`card ${styles.toolCard}`}>
                <h3>{t.name}</h3>
                <p>{t.desc}</p>
                <p className={styles.why}>
                  <span>Why</span> {t.why}
                </p>
              </article>
            ))}
          </div>
          <p className={styles.launchRow}>
            <Link href={LAUNCH_LINKS.terrascope} className="btn btn-primary">
              Launch {MODULES.terrascope.brand}
            </Link>
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <header className="section-head">
            <p className="eyebrow">{MODULES.pulsearch.brand}</p>
            <h2>{MODULES.pulsearch.tagline}</h2>
            <p>{MODULES.pulsearch.desc}</p>
          </header>
          <div className={styles.toolGrid}>
            {PULSEEARTH_TOOLS.map((t) => (
              <article key={t.name} className={`card ${styles.toolCard}`}>
                <h3>{t.name}</h3>
                <p>{t.desc}</p>
                <p className={styles.why}>
                  <span>Why</span> {t.why}
                </p>
              </article>
            ))}
          </div>
          <p className={styles.launchRow}>
            <Link href={LAUNCH_LINKS.pulsearch} className="btn btn-primary">
              Launch {MODULES.pulsearch.brand}
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
