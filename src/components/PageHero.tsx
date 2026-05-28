'use client';

import { motion } from 'framer-motion';
import styles from './PageHero.module.css';

type PageHeroProps = {
  label?: string;
  title: string;
  highlight?: string;
  description: string;
  children?: React.ReactNode;
};

export default function PageHero({ label, title, highlight, description, children }: PageHeroProps) {
  return (
    <section className={styles.hero}>
      <div className={styles.bg} />
      <motion.div
        className={`container ${styles.content}`}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {label && <span className="section-label">{label}</span>}
        <h1 className={styles.title}>
          {title}
          {highlight && (
            <>
              <br />
              <span className="gradient-text">{highlight}</span>
            </>
          )}
        </h1>
        <p className={styles.desc}>{description}</p>
        {children && <div className={styles.actions}>{children}</div>}
      </motion.div>
    </section>
  );
}
