'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from './SectionHeader.module.css';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  light?: boolean;
  centered?: boolean;
}

export default function SectionHeader({ title, subtitle, light = false, centered = false }: SectionHeaderProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      className={`${styles.header} ${light ? styles.light : ''}`}
      data-centered={centered}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <h2 className={styles.title}>{title}</h2>
      <motion.div
        className={styles.accent}
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
      />
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </motion.div>
  );
}
