'use client';
import { motion } from 'framer-motion';
import styles from './StatsCounter.module.css';

export default function StatsCounter({ stats }: { stats: Array<{value: string, label: string, icon: React.ReactNode}> }) {
  return (
    <div className={styles.statsContainer}>
      {stats.map((stat, index) => (
        <motion.div 
          key={index} 
          className={styles.statItem}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          <div className={styles.icon}>{stat.icon}</div>
          <div className={styles.value}>{stat.value}</div>
          <div className={styles.label}>{stat.label}</div>
        </motion.div>
      ))}
    </div>
  );
}
