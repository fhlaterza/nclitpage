"use client";
import { useActiveSection } from "@/hooks/useActiveSection";
import NavLink from "../NavLink/NavLink";
import Link from 'next/link';
import Image from 'next/legacy/image';
import styles from './Header.module.css';

export default function Header() {
  const active = useActiveSection(["about", "services", "contact"]);

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Image
          src="/images/logo.jpeg"
          alt="Logo NCL IT"
          width={50}
          height={50}
          priority
        />
      </div>
          <Link href="https://nclit.com.br" passHref>
            <h1 className={styles.companyName}>NCL IT LTDA</h1>
          </Link>
      <nav className={styles.nav}>
        <NavLink href="/#about" 
          sectionId="about"
          activeSection={active}
          className={styles.navlink}
          activeClassName={styles.active}> Sobre Nós</NavLink>
        <NavLink href="/#services" 
          sectionId="services"
          activeSection={active}
          className={styles.navlink}
          activeClassName={styles.active}>Serviços</NavLink>
        <NavLink href="/#contact" 
          sectionId="contact"
          activeSection={active}
          className={styles.navlink}
          activeClassName={styles.active}>Contato</NavLink>
        <NavLink href="/login" 
          className={styles.navlink}
          activeClassName={styles.active}>Login</NavLink>
      </nav>
    </header>
  );
}