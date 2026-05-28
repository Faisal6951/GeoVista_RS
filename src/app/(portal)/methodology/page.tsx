import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import styles from '../shared.module.css';
import { METHODOLOGY } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Methodology',
  description: 'Workflow, spectral indices, and how our tools apply them.',
};

export default function MethodologyPage() {
  return (
    <>
      <PageHeader
        large
        eyebrow="Technical workflow"
        title="From raw feeds to map insight"
        description={METHODOLOGY.intro}
      />

      <section className="section">
        <div className="container">
          <header className="section-head">
            <p className="eyebrow">Pipeline</p>
            <h2>Step-by-step process</h2>
            <p>Each step ties to TerraScope, PulseEarth, or both — no duplicate generic copy.</p>
          </header>
          <ol className={styles.steps}>
            {METHODOLOGY.steps.map((s) => (
              <li key={s.step} className={`card ${styles.stepCard}`}>
                <span className={styles.stepNum}>{s.step}</span>
                <div>
                  <div className={styles.stepMeta}>
                    <h3>{s.title}</h3>
                    <span className={styles.stepTool}>{s.tool}</span>
                  </div>
                  <p>{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={`section ${styles.alt}`}>
        <div className="container">
          <header className="section-head">
            <p className="eyebrow">Spectral indices</p>
            <h2>What NDVI and its siblings actually measure</h2>
            <p>Reference theory used in TerraScope panels and PulseEarth NDVI layer interpretation.</p>
          </header>
          <div className={styles.indexGrid}>
            {METHODOLOGY.indices.map((idx) => (
              <article key={idx.id} className={`card ${styles.indexCard}`}>
                <header className={styles.indexHead}>
                  <span className={styles.indexId}>{idx.id}</span>
                  <h3>{idx.name}</h3>
                </header>
                <dl className={styles.indexDl}>
                  <div>
                    <dt>Formula</dt>
                    <dd><code>{idx.formula}</code></dd>
                  </div>
                  <div>
                    <dt>Bands</dt>
                    <dd>{idx.bands}</dd>
                  </div>
                </dl>
                <p className={styles.indexDoes}>
                  <strong>What it does:</strong> {idx.does}
                </p>
                <p className={styles.indexUse}>
                  <strong>How we use it:</strong> {idx.weUse}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
