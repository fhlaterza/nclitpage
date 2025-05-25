import Image from 'next/image';
import styles from './About.module.css';

export default function About() {
  return (
    <section id="about" className={styles.about}>
      <div className={styles.aboutImage}>
        <Image
          src="/images/newtech.jpg"
          alt="Sobre Nós"
          fill
          className='object-cover'
        />
      </div>
      <h2>Sobre Nós</h2>
      <p>
        Somos especialistas em desenvolvimento de software, integrações, APIs, gerenciamento de infraestrutura, Cloud,
        Helpdesk, gestão de projetos e transformação digital. Nossa missão é transformar desafios em oportunidades com
        tecnologia.
      </p>
    </section>
  );
}