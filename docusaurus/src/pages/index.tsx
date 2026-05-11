import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>Documentacion de la fase 3</p>
          <Heading as="h1" className={styles.heroTitle}>
            Telegram, web UI y asistente compartido
          </Heading>
          <p className={styles.heroSubtitle}>
            Una guia practica para entender como funciona el bot, la API REST,
            la interfaz web y el parser LLM dentro de una sola aplicacion.
          </p>
          <div className={styles.buttons}>
            <Link className="button button--secondary button--lg" to="/docs/phase-3/intro">
              Empezar con la fase 3
            </Link>
            <Link className="button button--outline button--lg" to="/docs/phase-3/architecture">
              Ver arquitectura
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout
      title="Telegram Agent UI Fase 3"
      description="Documentacion del sistema multicanal que combina Telegram, UI web y asistente compartido.">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
