'use client';

import { useState } from 'react';
import styles from './TeamMember.module.css';

type TeamMemberProps = {
  name: string;
  id: string;
  titles: readonly string[];
  bio: string;
  email?: string;
  portfolio?: string;
  image?: string;
  variant: 'lead' | 'member' | 'supervisor';
};

export default function TeamMember({
  name,
  id,
  titles,
  bio,
  email,
  image,
  variant,
  portfolio,
}: TeamMemberProps) {
  const [imgError, setImgError] = useState(false);
  const showPhoto = Boolean(image) && !imgError;
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2);

  return (
    <article className={`card ${styles.card} ${styles[variant]}`}>
      <div
        className={`${styles.photo} ${showPhoto ? styles.photoWithImage : ''}`}
        aria-hidden={!showPhoto}
      >
        {showPhoto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt=''
            className={styles.photoImg}
            onError={() => setImgError(true)}
          />
        ) : (
          <>
            <span className={styles.initials}>{initials}</span>
            <span className={styles.photoHint}>Photo</span>
          </>
        )}
      </div>
      <div className={styles.body}>
        <p className={styles.roleLabel}>
          {variant === 'lead'
            ? 'Lead student'
            : variant === 'supervisor'
              ? 'Supervisor'
              : 'Team member'}
        </p>
        <h3 className={styles.name}>{name}</h3>
        <p className={styles.id}>{id}</p>
        <ul className={styles.titles}>
          {titles.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <p className={styles.bio}>{bio}</p>
        <div className={styles.contact}>
          {email && (
            <a
              href={`mailto:${email}`}
              className={styles.email}
              target='_blank'
              rel='noopener noreferrer'
            >
              {email}
            </a>
          )}
          {portfolio && (
            <a
              href={`https://${portfolio}`}
              className={styles.email}
              target='_blank'
              rel='noopener noreferrer'
            >
              {portfolio}
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
