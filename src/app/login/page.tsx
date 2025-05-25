import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import styles from './Login.module.css';

export default function LoginPage() {
  return (
    <>
      <Header />
      <main className={styles.login}>
        <h2>Área do Cliente</h2>
        <form className={styles.loginForm}>
          <input type="email" placeholder="E-mail" required />
          <input type="password" placeholder="Senha" required />
          <button type="submit">Entrar</button>
        </form>
      </main>
      <Footer />
    </>
  );
}
