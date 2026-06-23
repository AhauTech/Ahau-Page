import { CookieBannerClient } from "./CookieBannerClient";

// Server Component — renderiza el shell estático
// El cliente solo maneja el estado de visibilidad
export function CookieBanner() {
  return <CookieBannerClient />;
}