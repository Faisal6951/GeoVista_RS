import Link from 'next/link';
import { ArrowRight, Map, Activity, Layers, Zap } from 'lucide-react';
import styles from './home.module.css';
import { SITE, MODULES, LAUNCH_LINKS, BUILT_ITEMS } from '@/lib/content';

export default function HomePage() {
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroGrid} aria-hidden />
        <div className={styles.heroGlow} aria-hidden />
        <div className={`container ${styles.heroLayout}`}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>
              <span className={styles.dot} />
              {SITE.programme} · {SITE.year}
            </p>
            <h1 className={styles.headline}>
              <span>{SITE.heroLine1}</span>
              <span className={styles.headlineAccent}>{SITE.heroLine2}</span>
            </h1>
            <p className={styles.subline}>{SITE.description}</p>
            <div className={styles.heroActions}>
              <Link href={LAUNCH_LINKS.terrascope} className='btn btn-primary'>
                Launch {MODULES.terrascope.brand}
                <ArrowRight size={16} />
              </Link>
              <Link href='/platform' className='btn btn-secondary'>
                Explore platform
              </Link>
            </div>
          </div>

          <aside className={styles.heroPanel} aria-label='Platform overview'>
            <div className={styles.panelHeader}>
              <span className={styles.panelLabel}>Live stack</span>
              <span className={styles.panelStatus}>Production ready</span>
            </div>
            <ul className={styles.panelList}>
              <li>
                <Map size={16} />
                <div>
                  <strong>{MODULES.terrascope.brand}</strong>
                  <span>MapLibre · Turf.js · Indices</span>
                </div>
              </li>
              <li>
                <Activity size={16} />
                <div>
                  <strong>{MODULES.pulsearch.brand}</strong>
                  <span>FIRMS · OpenAQ · NDVI</span>
                </div>
              </li>
              <li>
                <Layers size={16} />
                <div>
                  <strong>GeoVista portal</strong>
                  <span>Next.js 15 · SSR docs</span>
                </div>
              </li>
            </ul>
            <p className={styles.panelFoot}>
              <Zap size={12} /> Optimized for supervisor demos &amp; deployment
            </p>
          </aside>
        </div>
      </section>

      <section className='section'>
        <div className='container'>
          <header className='section-head'>
            <p className='eyebrow'>Integrated modules</p>
            <h2>Two applications. One degree submission.</h2>
            <p>
              Each module runs from its original codebase — GeoVista adds
              documentation, routing, and a consistent presentation layer.
            </p>
          </header>
          <div className={styles.modules}>
            {[MODULES.terrascope, MODULES.pulsearch].map((m) => (
              <article key={m.brand} className={`card ${styles.moduleCard}`}>
                <div className={styles.moduleTop}>
                  <span
                    className={styles.moduleBadge}
                    style={{ background: m.color }}
                  >
                    {m.brand.charAt(0)}
                  </span>
                  <div>
                    <h3>{m.brand}</h3>
                    <p>{m.tagline}</p>
                  </div>
                </div>
                <p className={styles.moduleDesc}>{m.desc}</p>
                <div className={styles.moduleLinks}>
                  <Link href={m.href}>Why we built it</Link>
                  <Link href={m.launch} className={styles.moduleGo}>
                    Open <ArrowRight size={14} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`section ${styles.deliver}`}>
        <div className='container'>
          <header className='section-head'>
            <p className='eyebrow'>Deliverables</p>
            <h2>What ships in this repository</h2>
          </header>
          <div className={styles.deliverGrid}>
            {BUILT_ITEMS.map((item, i) => (
              <div key={item.title} className={styles.deliverItem}>
                <span className={styles.deliverNum}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.demo}>
        <div className={styles.demoGrid} aria-hidden />
        <div className='container'>
          <div className={styles.demoHead}>
            <div>
              <p className={styles.demoEyebrow}>Presentation mode</p>
              <h2 className={styles.demoTitle}>Run the live demo</h2>
              <p className={styles.demoSub}>
                Open both environments in separate tabs — maps load on demand so
                documentation pages stay fast.
              </p>
            </div>
            <span className={styles.demoBadge}>Viva ready</span>
          </div>

          <div className={styles.demoCards}>
            <Link href={LAUNCH_LINKS.terrascope} className={styles.demoCard}>
              <span
                className={styles.demoIcon}
                style={{ color: MODULES.terrascope.color }}
              >
                <Map size={22} />
              </span>
              <div className={styles.demoCardBody}>
                <h3>{MODULES.terrascope.brand}</h3>
                <p>Spatial layers, spectral indices, measure &amp; AOI tools</p>
              </div>
              <span className={styles.demoArrow}>
                Launch <ArrowRight size={16} />
              </span>
            </Link>

            <Link href={LAUNCH_LINKS.pulsearch} className={styles.demoCard}>
              <span
                className={styles.demoIcon}
                style={{ color: MODULES.pulsearch.color }}
              >
                <Activity size={22} />
              </span>
              <div className={styles.demoCardBody}>
                <h3>{MODULES.pulsearch.brand}</h3>
                <p>Fires, air quality, NDVI, click-to-weather over Pakistan</p>
              </div>
              <span className={styles.demoArrow}>
                Launch <ArrowRight size={16} />
              </span>
            </Link>
          </div>

          <p className={styles.demoNote}>
            Stable <code className={styles.code}>network access</code> is{' '}
            <code className={styles.code}>required</code> to power these{' '}
            <code className={styles.code}>live applications</code> and tools.
          </p>
        </div>
      </section>
    </>
  );
}
