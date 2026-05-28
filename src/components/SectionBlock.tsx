'use client';

import { motion } from 'framer-motion';
import styles from './SectionBlock.module.css';

type SectionBlockProps = {
  label?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  id?: string;
};

export default function SectionBlock({ label, title, subtitle, children, id }: SectionBlockProps) {
  return (
    <section className={styles.section} id={id}>
      <div className="container">
        <motion.header
          className={styles.header}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {label && <span className="section-label">{label}</span>}
          <h2 className={styles.title}>{title}</h2>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </motion.header>
        {children}
      </div>
    </section>
  );
}
