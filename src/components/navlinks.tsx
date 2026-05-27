"use client";

// Use this once a company logo has been created
// import {} from "@heroicons/react/24/outline";
import Link from "next/link";
// import { usePathname } from "next/navigation";
// import clsx from "clsx";

// Map of links to display in the navigation.
const links = [
  { name: "Products", href: "/products" /*icon: DocumentDuplicateIcon*/ },
  { name: "Account", href: "/account" /*icon: UserGroupIcon*/ },
  { name: "About", href: "/about" /*icon: UserGroupIcon*/ },
  { name: "Contact", href: "/contact" /*icon: UserGroupIcon*/ },
];

export default function NavLinks() {
  // const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        // const LinkIcon = link.icon;
        return (
          <Link key={link.name} href={link.href} className="nav-link">
            {/* <LinkIcon className="w-6" /> */}
            <p className="nav-link-text">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
