/** ¿Está dentro del navegador interno de TikTok, Instagram o Facebook? */
export function navegadorInterno(ua: string): "tiktok" | "instagram" | "facebook" | null {
  if (/musical_ly|BytedanceWebview|TikTok|trill_|aweme/i.test(ua)) return "tiktok";
  if (/Instagram/i.test(ua)) return "instagram";
  if (/FBAN|FBAV|FB_IAB|FBIOS/i.test(ua)) return "facebook";
  return null;
}

export function esWebview(ua: string): boolean {
  return navegadorInterno(ua) !== null;
}
