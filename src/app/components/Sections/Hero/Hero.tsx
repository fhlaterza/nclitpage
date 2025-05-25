import Image from 'next/image';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section id="hero" className={styles.hero}>
      <div className={styles.heroImage}>
        <Image
          src="/images/hero.jpeg"
          alt="Bem-vindo à NCL IT"
          fill
          priority
          className='objet-cover'
        />
      </div>
      <h2>Bem-vindo à NCL IT</h2>
      <p>Oferecemos soluções tecnológicas sob medida para o sucesso do seu negócio.</p>
      <a className={styles.btn} href="#services">Saiba Mais</a>
    </section>
  );
}