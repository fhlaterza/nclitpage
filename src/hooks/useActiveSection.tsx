import { useEffect, useState } from "react";

export function useActiveSection(sectionIds: string[]) {
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const offsetTop = el.offsetTop - 100; // margem antes de entrar na tela
          const offsetBottom = offsetTop + el.offsetHeight;

          if (scrollY >= offsetTop && scrollY < offsetBottom) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    handleScroll(); // detecta logo ao carregar

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sectionIds]);

  return activeSection;
}
