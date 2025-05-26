import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import styles from './Login.module.css';
import LoginForm from './LoginForm';

export default function LoginPage() {
  return (
    <>
      <Header />
      <main className={styles.login}>
        <h2>Área do Cliente</h2>
        <LoginForm />
      </main>
      <Footer />
    </>
  );
}
