import Head from 'next/head';
import Image from 'next/image';

export default function Home() {
  return (
    <>
      <Head>
        <title>NCL IT Ltda</title>
        <meta name="description" content="Consultoria de TI especializada em soluções tecnológicas." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/images/favicon.ico" />
      </Head>
      <header className="header">
        {/* Logomarca */}
        <div className="logo">
          <Image
            src="/images/logo.jpeg" // Substitua pelo caminho da sua logo
            alt="Logo NCL IT"
            width={50}
            height={50}
            priority
          />
        </div>
        {/* Nome da Empresa */}
        <h1 className="company-name">NCL IT LTDA</h1>
        {/* Navegação */}
        <nav className="nav">
          <a href="#about">Sobre Nós</a>
          <a href="#services">Serviços</a>
          <a href="#contact">Contato</a>
        </nav>
      </header>
      <main>
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-image">
            <Image
              src="/images/hero.jpeg"
              alt="Bem-vindo à NCL IT"
              layout="fill"
              objectFit="cover"
              priority
            />
          </div>
          <h1>Bem-vindo à NCL IT</h1>
          <p>Oferecemos soluções tecnológicas sob medida para o sucesso do seu negócio.</p>
          <a className="btn" href="#services">Saiba Mais</a>
        </section>

        {/* Sobre Nós */}
        <section id="about" className="section">
          <div style={{ position: 'relative', width: '100%', height: '300px' }}>
            <Image
              src="/images/newtech.jpg"
              alt="Sobre Nós"
              layout="fill"
              objectFit="cover"
              priority
            />
          </div>
          <h2>Sobre Nós</h2>
          <p>
            Somos especialistas em desenvolvimento de software, integrações, APIs, gerenciamento de infraestrutura, Cloud,
            Helpdesk, gestão de projetos e transformação digital. Nossa missão é transformar desafios em oportunidades com
            tecnologia.
          </p>
        </section>

        {/* Serviços */}
        <section id="services" className="section">
          <div style={{ position: 'relative', width: '100%', height: '300px' }}>
            <Image
              src="/images/connections.png"
              alt="Nossos Serviços"
              layout="fill"
              objectFit="cover"
              priority
            />
          </div>
          <h2>Nossos Serviços</h2>
          <p className="services-description">
            Oferecemos uma gama completa de serviços para impulsionar a transformação digital da sua empresa. De soluções
            personalizadas a suporte técnico, estamos aqui para ajudar você a alcançar o próximo nível com tecnologia.
          </p>
          <ul className="services-list">
            <li className="service-item">Desenvolvimento de Software Personalizado</li>
            <li className="service-item">Consultoria em Transformação Digital</li>
            <li className="service-item">Consultoria e Suporte TOTVS</li>
            <li className="service-item">Gestão de Infraestrutura e Cloud</li>
            <li className="service-item">Integrações de Sistemas / APIs</li>
            <li className="service-item">Suporte Técnico / Helpdesk</li>
          </ul>
        </section>

        {/* Contato */}
        <section id="contact" className="section">
          <div style={{ position: 'relative', width: '100%', height: '300px' }}>
            <Image
              src="/images/contact.jpg"
              alt="Contate-nos"
              layout="fill"
              objectFit="cover"
              priority
            />
          </div>
          <h2>Entre em Contato</h2>
          <p>Estamos prontos para ajudar sua empresa a crescer com tecnologia!</p>
          <p>
            <strong>Email:</strong> ncl_it@nclit.com.br
          </p>
          <p>
            <strong>Telefone:</strong> +55 11 96611-3531
          </p>
        </section>
      </main>
      <footer className="footer">
        <p>&copy; 2025 NCL IT LTDA. Todos os direitos reservados.</p>
      </footer>
    </>
  );
}
