import Image from 'next/image'; // Importação adicionada aqui
import styles from './Contact.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhoneVolume } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false; 




export default function Contact() {
  return (
    <section id="contact" className={styles.contact}>
      <div className={styles.contactImage}>
        <Image
          src="/images/contact.jpg"
          alt="Contate-nos"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>
      <h2>Entre em Contato</h2>
      <div className={styles.contactInfo}>
        <p>Estamos prontos para ajudar sua empresa a crescer com tecnologia!</p>
        <p>
           <strong>
             <FontAwesomeIcon icon={faEnvelope} className="fa-icon" aria-hidden="true"  />  Email:
           </strong>{' '} 
             <a href="mailto:ncl_it@nclit.com.br" aria-label="Enviar email para NCL IT">
                ncl_it@nclit.com.br
             </a>
         </p>
         <p>
           <strong>
             <FontAwesomeIcon icon={faPhoneVolume} className="fa-icon" aria-hidden="true" />  Telefone:
           </strong>{' '}
           <a href="tel:+5511966113531">
             +55 11 96611-3531
           </a>
         </p>
         <p>
           <strong>
             <FontAwesomeIcon icon={faWhatsapp} className="fa-icon" aria-hidden="true" />  Whatsapp:
           </strong>{' '}
           <a href="https://wa.me/5511966113531" target="_blank" rel="noopener noreferrer">
              +55 11 96611-3531
           </a>
         </p>
      </div>
    </section>
  );
}