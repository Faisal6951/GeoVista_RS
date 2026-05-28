import styles from './PageHeader.module.css';

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
  children?: React.ReactNode;
  large?: boolean;
};

export default function PageHeader({ eyebrow, title, description, children, large }: PageHeaderProps) {
  return (
    <header className={`${styles.header} ${large ? styles.large : ''}`}>
      <div className={styles.grid} aria-hidden />
      <div className="container">
        <div className={styles.inner}>
          {eyebrow && <p className="eyebrow eyebrow-accent">{eyebrow}</p>}
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.desc}>{description}</p>
          {children && <div className={styles.actions}>{children}</div>}
        </div>
      </div>
    </header>
  );
}
