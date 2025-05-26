"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  activeSection?: string;
  sectionId?: string;
  className?: string;
  activeClassName?: string;
}

export default function NavLink({
  href,
  children,
  activeSection,
  sectionId,
  className = "",
  activeClassName = "",
}: NavLinkProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isActive =
    (isHome && sectionId && activeSection === sectionId) || pathname === href;

  return (
    <Link
      href={href}
      className={`${className} ${isActive ? activeClassName : ""}`}
    >
      {children}
    </Link>
  );
}
