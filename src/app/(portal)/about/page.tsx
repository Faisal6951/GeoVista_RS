import type { Metadata } from 'next';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import TeamMember from '@/components/TeamMember';
import styles from '../shared.module.css';
import { SITE, TEAM, MODULES, REPOS } from '@/lib/content';

export const metadata: Metadata = {
  title: 'About',
  description: 'Final year RS & GIS project team and objectives.',
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        large
        eyebrow={`${SITE.programme} · ${SITE.university}`}
        title='Built for evaluation. Designed for impact.'
        description='GeoVista is our capstone: a production-grade web platform that presents two RS/GIS applications with the clarity expected in industry technical reviews — not a slideshow of screenshots.'
      />

      <section className='section'>
        <div className='container'>
          <header className='section-head'>
            <p className='eyebrow'>Mission</p>
            <h2>Why this project exists</h2>
          </header>
          <div className={styles.proseGrid}>
            <div className={styles.proseCard}>
              <h3>Gap</h3>
              <p>
                Strong RS/GIS work often lives in disconnected repos and desktop
                projects — hard to demo in a 15-minute viva.
              </p>
            </div>
            <div className={styles.proseCard}>
              <h3>Response</h3>
              <p>
                One portal, two live apps, documented methodology — supervisors
                open a URL and see real tools, not static PDFs.
              </p>
            </div>
            <div className={styles.proseCard}>
              <h3>Standard</h3>
              <p>
                We aimed for deployable engineering: Next.js SSR, typed APIs,
                and reproducible open-data pipelines.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={`section ${styles.alt}`}>
        <div className='container'>
          <header className='section-head'>
            <p className='eyebrow'>People</p>
            <h2>Project team</h2>
            <p>
              Designed and{' '}
              <code className={styles.inlineCode}>developed by our team</code>{' '}
              with the support and guidance of{' '}
              <code className={styles.inlineCode}>our supervisor.</code>
            </p>
          </header>
          <div className={styles.teamStack}>
            <TeamMember variant='lead' {...TEAM.lead} />
            <TeamMember variant='member' {...TEAM.teammate} />
            <TeamMember variant='supervisor' {...TEAM.supervisor} />
          </div>
        </div>
      </section>

      <section className='section'>
        <div className='container'>
          <header className='section-head'>
            <p className='eyebrow'>Codebase</p>
            <h2>Original repositories</h2>
          </header>
          <div className={styles.repoRow}>
            <a
              href={REPOS.terrascope}
              target='_blank'
              rel='noopener noreferrer'
              className={styles.repoCard}
            >
              <strong>{MODULES.terrascope.codename}</strong>
              <span>→ {MODULES.terrascope.brand}</span>
            </a>
            <a
              href={REPOS.pulsearch}
              target='_blank'
              rel='noopener noreferrer'
              className={styles.repoCard}
            >
              <strong>{MODULES.pulsearch.codename}</strong>
              <span>→ {MODULES.pulsearch.brand}</span>
            </a>
          </div>
          <p className={styles.note}>
            <Link href='/platform'>Platform breakdown →</Link>
          </p>
        </div>
      </section>
    </>
  );
}
