// import Header from "@components/Header/Header";
// import Footer from "@components/Footer/Footer";
// import Hero from "@components/Sections/Hero/Hero";
// import About from "@components/Sections/About/About";
// import Services from "@components/Sections/Services/Services";
// import Contact from "@components/Sections/Contact/Contact";
// import Login from "@components/Sections/Login/Login";

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Hero from "./components/Sections/Hero/Hero";
import About from "./components/Sections/About/About";
import Services from "./components/Sections/Services/Services";
import Contact from "./components/Sections/Contact/Contact";


export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Services />
        <Contact />
      </main>
      <Footer />
    </>
  );
}