import Image from 'next/image';
import styles from './Services.module.css';

const services = [
  "Desenvolvimento de Software Personalizado",
  "Consultoria em Transformação Digital",
  "Consultoria e Suporte TOTVS",
  "Gestão de Infraestrutura e Cloud",
  "Integrações de Sistemas / APIs",
  "Suporte Técnico / Helpdesk"
];

export default function Services() {
  return (
    <section id="services" className={styles.services}>
      <div className={styles.servicesImage}>
        <Image
          src="/images/connections.png"
          alt="Nossos Serviços"
          fill
          className='cover'
          priority
        />
      </div>
      <h2>Nossos Serviços</h2>
      <p className={styles.servicesDescription}>
        Oferecemos uma gama completa de serviços para impulsionar a transformação digital da sua empresa. 
        De soluções personalizadas a suporte técnico, estamos aqui para ajudar você a alcançar o próximo nível com tecnologia.
      </p>
      <ul className={styles.servicesList}>
        {services.map((service, index) => (
          <li key={index} className={styles.serviceItem}>
            {service}
          </li>
        ))}
      </ul>
    </section>
  );
}