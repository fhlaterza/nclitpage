import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>&copy; {new Date().getFullYear()} NCL IT LTDA. Todos os direitos reservados.</p>
    </footer>
  );
}