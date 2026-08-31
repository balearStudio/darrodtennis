import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Locale-aware navigation helpers. `Link` keeps the active locale prefix, and
// `usePathname` returns the pathname *without* it — which is exactly what the
// language toggle needs to swap `/es/...` <-> `/en/...`.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
