"use client";
import { usePathname } from "next/navigation";
import { useActiveSection } from "@/hooks/useActiveSection";
import Link from 'next/link';
import Image from 'next/legacy/image';
import styles from './Header.module.css';

export default function Header() {
  const active = useActiveSection(["about", "services", "contact"]);
  const pathname = usePathname();
  const isHome = pathname === "/";

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
        <Link href="/#about" className={isHome && active === "about" ? styles.active : ""}>Sobre Nós</Link>
        <Link href="/#services" className={isHome && active === "services" ? styles.active : ""}>Serviços</Link>
        <Link href="/#contact" className={isHome && active === "contact" ? styles.active : ""}>Contato</Link>
        <Link href="/login" className={isHome && active === "login" ? styles.active : ""}>Login</Link>
      </nav>
    </header>
  );
}