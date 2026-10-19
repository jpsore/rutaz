// Créditos de las fotos de /public/img (Wikimedia Commons, licencias libres).
// Las licencias CC BY y CC BY-SA piden nombrar al autor y la licencia: se muestran en cada ficha y en /creditos.
// Si cambias una foto, actualiza su crédito aquí.

export type Credito = { autor: string; licencia: string; licenciaUrl: string | null; fuente: string };

export const CREDITOS_FOTOS: Record<string, Credito> = {
  "/img/marcahuasi.jpg": {
    "autor": "Martintoy",
    "licencia": "CC BY 3.0",
    "licenciaUrl": "https://creativecommons.org/licenses/by/3.0",
    "fuente": "https://commons.wikimedia.org/wiki/File:Marcahuasi_1.jpg"
  },
  "/img/fiesta-agua.jpg": {
    "autor": "Jonathan Marco Corredor Obispo",
    "licencia": "CC BY-SA 4.0",
    "licenciaUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "fuente": "https://commons.wikimedia.org/wiki/File:Pueblo_San_Pedro_de_Casta.jpg"
  },
  "/img/centro-lima.jpg": {
    "autor": "Pitxiquin",
    "licencia": "CC BY-SA 4.0",
    "licenciaUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "fuente": "https://commons.wikimedia.org/wiki/File:Plaza_mayor_de_Lima_amb_la_catedral_al_fons.jpg"
  },
  "/img/senor-milagros.jpg": {
    "autor": "Emile Saico",
    "licencia": "CC BY-SA 4.0",
    "licenciaUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "fuente": "https://commons.wikimedia.org/wiki/File:Sahumadoras_en_la_procesi%C3%B3n_del_Se%C3%B1or_de_los_Milagros.jpg"
  },
  "/img/barranco.jpg": {
    "autor": "Ibrehaut (Ivan Brehaut L.)",
    "licencia": "CC BY-SA 4.0",
    "licenciaUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "fuente": "https://commons.wikimedia.org/wiki/File:Puente_de_los_Suspiros,_Barranco.jpg"
  },
  "/img/criolla.jpg": {
    "autor": "Alejandrovilbort",
    "licencia": "CC BY-SA 4.0",
    "licenciaUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "fuente": "https://commons.wikimedia.org/wiki/File:Parque_municipal_de_Barranco_ii.jpg"
  },
  "/img/lachay.jpg": {
    "autor": "Correliebre",
    "licencia": "CC BY-SA 4.0",
    "licenciaUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "fuente": "https://commons.wikimedia.org/wiki/File:Lomas_de_Lachay_2021.jpg"
  },
  "/img/lima-criolla.jpg": {
    "autor": "Herwarth Morales",
    "licencia": "CC BY-SA 4.0",
    "licenciaUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "fuente": "https://commons.wikimedia.org/wiki/File:Iglesia_y_monasterio_de_las_Nazarenas_de_Lima.jpg"
  },
  "/img/lunahuana.jpg": {
    "autor": "Kevo287",
    "licencia": "CC BY-SA 4.0",
    "licenciaUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "fuente": "https://commons.wikimedia.org/wiki/File:Puente_Colgante_Lunahuan%C3%A1_3.jpg"
  },
  "/img/antioquia.jpg": {
    "autor": "Arturo Wesley Millones Pinto",
    "licencia": "CC BY-SA 4.0",
    "licenciaUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "fuente": "https://commons.wikimedia.org/wiki/File:FACHADAS_DE_CASAS_EN_ANTIOQUIA_HUAROCHIRI_1.jpg"
  },
  "/img/caral.jpg": {
    "autor": "Juanmeneses7",
    "licencia": "CC BY-SA 4.0",
    "licenciaUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "fuente": "https://commons.wikimedia.org/wiki/File:Pir%C3%A1mide_Caral_2_pisos.jpg"
  },
  "/img/huaros.jpg": {
    "autor": "Guillermo Arévalo Aucahuasi",
    "licencia": "CC BY-SA 3.0",
    "licenciaUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "fuente": "https://commons.wikimedia.org/wiki/File:Bird%27s-eye_view_of_Canta,_Peru.jpg"
  },
  "/img/fiesta-agua-huaros.jpg": {
    "autor": "Fatima Flores Vivar",
    "licencia": "CC BY-SA 4.0",
    "licenciaUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "fuente": "https://commons.wikimedia.org/wiki/File:Plaza_de_armas_de_Canta._Lima.jpg"
  },
  "/img/valle-lurin.jpg": {
    "autor": "Arlette Rodriguez",
    "licencia": "CC BY-SA 4.0",
    "licenciaUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "fuente": "https://commons.wikimedia.org/wiki/File:Templo_del_sol,_Pachacamac.jpg"
  }
};

export function creditoDe(imagen: string): Credito | null {
  return CREDITOS_FOTOS[imagen] ?? null;
}
