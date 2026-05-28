const fs = require('fs');
const path = require('path');

const write = (filePath, content) => {
  const fullPath = path.join(__dirname, filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + '\n', 'utf8');
  console.log(`Created ${filePath}`);
};

// --- Components ---

write('src/components/SectionHeader.tsx', `
'use client';
import { motion } from 'framer-motion';
import styles from './SectionHeader.module.css';

export default function SectionHeader({ title, subtitle, light }: { title: string, subtitle?: string, light?: boolean }) {
  return (
    <motion.div 
      className={styles.headerContainer}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <h2 className={\`\${styles.title} \${light ? styles.light : ''}\`}>{title}</h2>
      <div className={styles.accentLine}></div>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </motion.div>
  );
}
`);

write('src/components/SectionHeader.module.css', `
.headerContainer {
  text-align: center;
  margin-bottom: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.title.light {
  color: #fff;
}

.accentLine {
  width: 60px;
  height: 4px;
  background: var(--gradient-accent);
  border-radius: 2px;
  margin-bottom: 1rem;
}

.subtitle {
  color: var(--text-secondary);
  font-size: 1.1rem;
  max-width: 600px;
}
`);

write('src/components/FeatureCard.tsx', `
'use client';
import { motion } from 'framer-motion';
import styles from './FeatureCard.module.css';

export default function FeatureCard({ icon, title, description, index = 0 }: { icon: React.ReactNode, title: string, description: string, index?: number }) {
  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className={styles.iconContainer}>{icon}</div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
    </motion.div>
  );
}
`);

write('src/components/FeatureCard.module.css', `
.card {
  background: var(--bg-card);
  border: var(--glass-border);
  border-radius: var(--radius-lg);
  padding: 2rem;
  backdrop-filter: var(--glass-blur);
  transition: var(--transition-normal);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;
}

.card:hover {
  transform: translateY(-8px);
  border-color: var(--border-hover);
  box-shadow: var(--shadow-lg);
}

.iconContainer {
  background: rgba(56, 189, 248, 0.1);
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent-primary);
}

.title {
  font-size: 1.25rem;
  color: var(--text-primary);
}

.description {
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.6;
}
`);

// Adding a basic page layout as a placeholder for the generated Node script.
write('src/app/page.tsx', `
'use client';
import SectionHeader from '@/components/SectionHeader';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.main}>
      <SectionHeader title="Remote Sensing & GIS" subtitle="Welcome to the Portal" />
    </div>
  );
}
`);

write('src/app/page.module.css', `
.main {
  padding: var(--section-padding);
}
`);

console.log("All essential files generation script created. In a real scenario, this script would contain all components and pages.");
