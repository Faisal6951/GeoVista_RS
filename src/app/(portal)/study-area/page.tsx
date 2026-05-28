import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import styles from '../shared.module.css';
import { STUDY_AREA } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Study Area',
  description: 'Pakistan and Punjab — geographic scope and rationale.',
};

export default function StudyAreaPage() {
  return (
    <>
      <PageHeader
        large
        eyebrow="Geographic scope"
        title="Pakistan at scale. Punjab in focus."
        description={STUDY_AREA.intro}
      />

      <section className="section">
        <div className="container">
          <header className="section-head">
            <p className="eyebrow">Zones</p>
            <h2>Where our data applies</h2>
          </header>
          <div className={styles.zoneGrid}>
            {STUDY_AREA.zones.map((z) => (
              <article key={z.name} className={`card ${styles.zoneCard}`}>
                <h3>{z.name}</h3>
                <p className={styles.zoneCoords}>{z.coords}</p>
                <p>{z.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`section ${styles.alt}`}>
        <div className="container">
          <header className="section-head">
            <p className="eyebrow">Rationale</p>
            <h2>Why this geography</h2>
          </header>
          <p className={styles.rationale}>{STUDY_AREA.whyHere}</p>
          <div className={styles.mapPlaceholder}>
            <span>Study area map</span>
            <p>Insert your official boundary figure or screenshot from TerraScope before defense.</p>
          </div>
        </div>
      </section>
    </>
  );
}
