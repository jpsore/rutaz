// Acceso seguro a localStorage/sessionStorage: en modo privado o webviews raros pueden fallar.

export function almacenLocal(): Storage | null {
  try {
    if (typeof window === "undefined") return null;
    const s = window.localStorage;
    const k = "rutaz.__prueba";
    s.setItem(k, "1");
    s.removeItem(k);
    return s;
  } catch {
    return null;
  }
}

export function almacenSesion(): Storage | null {
  try {
    if (typeof window === "undefined") return null;
    return window.sessionStorage;
  } catch {
    return null;
  }
}

export function leerJSON<T>(s: Storage | null, clave: string): T | null {
  if (!s) return null;
  try {
    const v = s.getItem(clave);
    return v ? (JSON.parse(v) as T) : null;
  } catch {
    return null;
  }
}

export function escribirJSON(s: Storage | null, clave: string, valor: unknown): boolean {
  if (!s) return false;
  try {
    s.setItem(clave, JSON.stringify(valor));
    return true;
  } catch {
    return false;
  }
}

export function nuevoId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  // Respaldo para navegadores viejos
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (ch) => {
    const r = (Math.random() * 16) | 0;
    return (ch === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}
