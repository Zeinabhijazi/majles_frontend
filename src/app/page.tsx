"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname === "/") {
      // do something, then maybe:
      router.replace("/en");
    }
  }, [pathname, router]);

  return <html lang="en" >
    <body>
    </body>
  </html>;
}
