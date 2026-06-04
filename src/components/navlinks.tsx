"use client";

import Link from "next/link";

// Map of links to display in the navigation.
const links = [
  { name: "Account", href: "/account"},
  { name: "About", href: "/about"},
  { name: "Contact", href: "/contact"},
];

export default function NavLinks() {
  return (
    <>
      {links.map((link) => {
        return (
          <Link key={link.name} href={link.href} className="nav-link">
            <p className="nav-link-text">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
