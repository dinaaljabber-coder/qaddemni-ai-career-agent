import Image from "next/image";

/** Uses the supplied Qaddemni career document artwork as the shared brand mark. */
export function BrandLogo({ className = "brand-mark", priority = false }: { className?: string; priority?: boolean }) {
  return <Image
    className={className}
    src="/qaddemni-cv-artwork.jpg"
    alt=""
    aria-hidden="true"
    width={128}
    height={128}
    priority={priority}
  />;
}
