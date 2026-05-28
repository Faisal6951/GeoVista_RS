import styles from './Logo.module.css';

type LogoProps = {
  compact?: boolean;
};

export default function Logo({ compact = false }: LogoProps) {
  return (
    <span className={`${styles.root} ${compact ? styles.compact : ''}`} aria-label="GeoVista">
      <svg className={styles.mark} viewBox="0 0 32 32" fill="none" aria-hidden>
        <rect width="32" height="32" rx="8" className={styles.markBg} />
        <path
          d="M8 16c0-4.4 3.6-8 8-8 1.2 0 2.3.3 3.3.8M24 16c0 4.4-3.6 8-8 8-1.2 0-2.3-.3-3.3-.8"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <ellipse cx="16" cy="16" rx="10" ry="4" stroke="currentColor" strokeWidth="1.25" opacity="0.5" />
        <circle cx="16" cy="16" r="2.5" fill="currentColor" />
      </svg>
      {!compact && <span className={styles.name}>GeoVista</span>}
    </span>
  );
}
