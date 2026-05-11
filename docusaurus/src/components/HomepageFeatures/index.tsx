import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  href: string;
  eyebrow: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Resumen',
    href: '/docs/phase-3/intro',
    eyebrow: '01',
    description: (
      <>
        Contexto, objetivos y alcance de la fase 3 en una sola pagina de entrada.
      </>
    ),
  },
  {
    title: 'Arquitectura',
    href: '/docs/phase-3/architecture',
    eyebrow: '02',
    description: (
      <>
        Vista de componentes, flujos entre canales y responsabilidades del backend.
      </>
    ),
  },
  {
    title: 'Configuracion',
    href: '/docs/phase-3/setup',
    eyebrow: '03',
    description: (
      <>
        Configuracion, variables de entorno y arranque local del proyecto.
      </>
    ),
  },
];

function Feature({title, href, eyebrow, description}: FeatureItem) {
  return (
    <Link className={styles.card} to={href}>
      <span className={styles.eyebrow}>{eyebrow}</span>
      <Heading as="h3">{title}</Heading>
      <p>{description}</p>
      <span className={styles.cardLink}>Abrir documentacion</span>
    </Link>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className={styles.grid}>
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
