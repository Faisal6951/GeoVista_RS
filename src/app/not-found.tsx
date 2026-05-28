import Link from 'next/link';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <div className={styles.page}>
      <div className={styles.grid} aria-hidden />
      <div className={styles.glow} aria-hidden />

      <main className={styles.card}>
        <p className={styles.code}>404</p>
        <div className={styles.icon} aria-hidden>
          <svg viewBox="0 0 64 64" fill="none">
            <ellipse cx="32" cy="32" rx="22" ry="9" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
            <path
              d="M14 32c0-9.9 8.1-18 18-18 2.7 0 5.2.6 7.5 1.7M50 32c0 9.9-8.1 18-18 18-2.7 0-5.2-.6-7.5-1.7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="32" cy="32" r="4" fill="currentColor" />
            <path d="M28 48h8M32 44v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
          </svg>
        </div>
        <h1 className={styles.title}>This coordinate is off the map</h1>
        <p className={styles.text}>
          The page you requested does not exist or may have been moved. Return to GeoVista to
          continue exploring TerraScope and PulseEarth.
        </p>
        <div className={styles.actions}>
          <Link href="/" className="btn btn-primary">
            Back to home
          </Link>
          <Link href="/explorer" className="btn btn-secondary">
            TerraScope
          </Link>
          <Link href="/monitor" className="btn btn-secondary">
            PulseEarth
          </Link>
        </div>
      </main>
    </div>
  );
}
