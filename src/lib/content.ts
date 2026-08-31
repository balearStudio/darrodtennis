/**
 * Structured content for the routes that reuse the homepage building blocks.
 * Copy itself lives in `src/messages/*` — this file only maps slugs to message
 * keys, images and routes so pages and `generateStaticParams` stay in sync.
 */

export type ProgramKey = "junior" | "pro" | "coaching";

export type Program = {
  slug: string;
  key: ProgramKey;
  image: string;
};

export const PROGRAMS: Program[] = [
  { slug: "junior-tennis", key: "junior", image: "/images/programa-junior.jpg" },
  { slug: "tennis-pro", key: "pro", image: "/images/programa-pro.jpg" },
  {
    slug: "coaching-asesoramiento",
    key: "coaching",
    image: "/images/programa-coaching.jpg",
  },
];

export const programBySlug = (slug: string) =>
  PROGRAMS.find((p) => p.slug === slug);

export type Coach = {
  slug: string;
  image: string;
  /** Program the coach mainly works on, for the cross-link on their page. */
  programSlug?: string;
};

export const COACHES: Coach[] = [
  {
    slug: "daniel-rodriguez",
    image: "/images/coach-daniel-rodriguez.jpg",
    programSlug: "coaching-asesoramiento",
  },
  {
    slug: "daniel-gonzalez",
    image: "/images/coach-daniel-gonzalez.jpg",
    programSlug: "tennis-pro",
  },
  {
    slug: "laurent-dairiam",
    image: "/images/coach-laurent-dairiam.jpg",
    programSlug: "tennis-pro",
  },
  {
    slug: "javier-anibal",
    image: "/images/coach-javier-anibal.jpg",
    programSlug: "junior-tennis",
  },
  {
    slug: "alberto-ottchota",
    image: "/images/coach-alberto-ottchota.jpg",
  },
];

export const coachBySlug = (slug: string) => COACHES.find((c) => c.slug === slug);

export type Partner = { id: string; name: string; src: string };

/** Hotels — shown in original colour on cream, neutralised on the footer. */
export const HOTEL_PARTNERS: Partner[] = [
  { id: "gloria", name: "Gloria Thalasso & Hotels", src: "/logos/gloria.webp" },
  { id: "radisson-blu", name: "Radisson Blu", src: "/logos/radisson-blu.webp" },
  {
    id: "seaside-palm-beach",
    name: "Seaside Palm Beach",
    src: "/logos/seaside-palm-beach.webp",
  },
  {
    id: "seaside-sandy-beach",
    name: "Seaside Sandy Beach",
    src: "/logos/seaside-sandy-beach.webp",
  },
];

export const INSTITUTION_PARTNERS: Partner[] = [
  { id: "rfet", name: "Real Federación Española de Tenis", src: "/logos/rfet.webp" },
  {
    id: "federacion-gran-canaria",
    name: "Federación de Tenis de Gran Canaria",
    src: "/logos/federacion-gran-canaria.webp",
  },
  {
    id: "cabildo-gran-canaria",
    name: "Cabildo de Gran Canaria",
    src: "/logos/cabildo-gran-canaria.webp",
  },
  {
    id: "instituto-insular-deportes",
    name: "Instituto Insular de Deportes",
    src: "/logos/instituto-insular-deportes.webp",
  },
];

export const ALL_PARTNERS = [...HOTEL_PARTNERS, ...INSTITUTION_PARTNERS];
