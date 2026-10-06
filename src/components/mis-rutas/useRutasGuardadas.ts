"use client";
import { useEffect, useState } from "react";
import { almacenLocal } from "@/lib/almacen";
import { LocalStore } from "@/lib/rutas-guardadas";

/** El almacén solo existe en el navegador: se lee después de montar. */
export function useAlmacenRutas(): LocalStore | null {
  const [store, setStore] = useState<LocalStore | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage solo existe en el cliente
    setStore(new LocalStore(almacenLocal()));
  }, []);
  return store;
}
