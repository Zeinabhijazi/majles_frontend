"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname === "/") {
      // do something, then maybe:
      router.replace("/ar");
    }
  }, [pathname, router]);

  return <html lang="ar" >
    <body>
    </body>
  </html>;
}
