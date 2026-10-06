export type Nivel = "economico" | "estandar" | "comodo";
export type Categoria = "transporte" | "comida" | "hospedaje" | "actividad";
export type Presupuesto = 150 | 300 | 500;
export type Dias = 1 | 2 | 3;

export const NIVELES: Nivel[] = ["economico", "estandar", "comodo"];
export const CATEGORIAS: Categoria[] = ["transporte", "comida", "hospedaje", "actividad"];
export const PRESUPUESTOS: Presupuesto[] = [150, 300, 500];
export const DIAS: Dias[] = [1, 2, 3];

export type Parada = {
  id: string;
  dia: number;
  orden: number;
  hora: string; // "06:00"
  actividad: string;
  detalle: string | null;
  categoria: Categoria;
  costos: Record<Nivel, number>;
  opcional: boolean;
  verificado_el: string | null; // "AAAA-MM-DD"
};

export type Plantilla = {
  id: string;
  dias: number;
  paradas: Parada[];
};

export type ParadaItinerario = Omit<Parada, "costos"> & { costo: number };

export type DiaItinerario = {
  dia: number;
  paradas: ParadaItinerario[];
};

export type Sugerencia =
  | { tipo: "menos_dias"; dias: number; total: number }
  | { tipo: "quitar_parada"; paradaId: string; actividad: string; ahorro: number };

export type Resultado = {
  nivel: Nivel;
  dias: DiaItinerario[];
  total: number;
  desglose: Record<Categoria, number>;
  alcanza: boolean;
  diferencia: number; // sobra (+) o falta (-)
  sugerencias: Sugerencia[];
};

export type EntradaPlanificador = {
  plantillas: Plantilla[];
  dias: Dias;
  presupuesto: Presupuesto;
  paradasQuitadas?: string[];
};
