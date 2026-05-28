import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import styles from '../shared.module.css';
import { RESULTS } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Results',
  description: 'Findings and analysis outputs — placeholder for final data.',
};

export default function ResultsPage() {
  return (
    <>
      <PageHeader
        large
        eyebrow="Analysis outputs"
        title="Findings from our toolchain"
        description={RESULTS.intro}
      />

      <section className="section">
        <div className="container">
          <div className={styles.findings}>
            {RESULTS.findings.map((f) => (
              <article key={f.title} className={`card ${styles.findingCard}`}>
                <div className={styles.findingHead}>
                  <div>
                    <p className={styles.findingMetric}>{f.metric}</p>
                    <h3>{f.title}</h3>
                  </div>
                  <span className={styles.findingMethod}>{f.method}</span>
                </div>
                <p className={styles.findingSummary}>{f.summary}</p>
                <div className={styles.chartPlaceholder} aria-hidden>
                  {[40, 62, 55, 78, 48, 65].map((h, i) => (
                    <div key={i} className={styles.bar} style={{ height: `${h}%` }} />
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
