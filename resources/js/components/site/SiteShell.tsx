"use client";

import Footer from "@/components/site/Footer";
import Navbar from "@/components/site/Navbar";
import SeoHead from "@/components/site/SeoHead";
import { usePathname } from "@/components/site/usePathname";
import type { ReactNode } from "react";

type SiteShellProps = {
  children: ReactNode;
};

export default function SiteShell({ children }: SiteShellProps) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <SeoHead path={pathname} />
      <Navbar />
      <main className="flex-1 overflow-x-hidden">{children}</main>
      <Footer />
    </>
  );
}
