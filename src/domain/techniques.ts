import type { CountMode, Technique } from './part';

export interface TechniqueInfo {
  id: Technique;
  label: string;
  description: string;
  mode: CountMode;
  doing: string;
  start: string;
  projectExample: string;
  tapHint: string;
  askStitchTarget: boolean;
  usesPalette: boolean;
  namePresets: readonly string[];
  partNameExample: string;
  singlePiece: string | null;
  quantityHint: string | null;
  part: {
    tab: string;
    one: string;
    many: string;
    add: string;
    edit: string;
    remove: string;
    empty: string;
    emptyHint: string;
    pick: string;
    addHint: string;
    inUse: string;
  };
  row: { one: string; many: string; finish: string; oneCapital: string } | null;
}

const PIECE = {
  tab: 'Piezas',
  one: 'pieza',
  many: 'piezas',
  add: 'Añadir una pieza',
  edit: 'Editar pieza',
  remove: 'Borrar esta pieza',
  empty: 'Aún no hay piezas',
  emptyHint: 'Añade la primera pieza que vas a tejer.',
  pick: '¿Qué pieza vas a tejer?',
  addHint: '¿Qué pieza vas a tejer?',
  inUse: 'En uso',
};

export const TECHNIQUES: Record<Technique, TechniqueInfo> = {
  embroidery: {
    id: 'embroidery',
    label: 'Bordado',
    description: 'Punto de cruz y bordado',
    mode: 'stitches',
    doing: 'Estás bordando',
    start: 'Empezar a bordar',
    projectExample: 'Ej. Mantel de flores',
    tapHint: 'Toca aquí por cada punto',
    askStitchTarget: true,
    usesPalette: true,
    namePresets: [],
    partNameExample: '',
    singlePiece: null,
    quantityHint: null,
    part: {
      tab: 'Colores',
      one: 'color',
      many: 'colores',
      add: 'Añadir un color',
      edit: 'Editar color',
      remove: 'Borrar este color',
      empty: 'Aún no hay colores',
      emptyHint: 'Añade el primer color que vas a usar.',
      pick: '¿Qué color vas a usar?',
      addHint: 'Toca el color que más se parece a tu hilo.',
      inUse: 'En uso',
    },
    row: null,
  },
  crochet: {
    id: 'crochet',
    label: 'Ganchillo',
    description: 'Muñecos, mantas y prendas',
    mode: 'rows',
    doing: 'Estás tejiendo',
    start: 'Empezar a tejer',
    projectExample: 'Ej. Muñeco osito',
    tapHint: 'Toca aquí por cada punto',
    askStitchTarget: false,
    usesPalette: false,
    namePresets: ['Cabeza', 'Cuerpo', 'Brazo', 'Pierna', 'Oreja', 'Cola'],
    partNameExample: 'Ej. Cabeza',
    singlePiece: 'Todo es una pieza',
    quantityHint: 'Por ejemplo, 2 si son dos brazos.',
    part: PIECE,
    row: { one: 'vuelta', many: 'vueltas', finish: 'Terminé la vuelta', oneCapital: 'Vuelta' },
  },
  knitting: {
    id: 'knitting',
    label: 'Punto',
    description: 'Con dos agujas',
    mode: 'rows',
    doing: 'Estás tejiendo',
    start: 'Empezar a tejer',
    projectExample: 'Ej. Bufanda roja',
    tapHint: 'Toca aquí por cada punto',
    askStitchTarget: false,
    usesPalette: false,
    namePresets: ['Delantero', 'Espalda', 'Manga', 'Cuello', 'Bolsillo'],
    partNameExample: 'Ej. Delantero',
    singlePiece: 'Todo es una pieza',
    quantityHint: 'Por ejemplo, 2 si son dos mangas.',
    part: PIECE,
    row: { one: 'fila', many: 'filas', finish: 'Terminé la fila', oneCapital: 'Fila' },
  },
  other: {
    id: 'other',
    label: 'Otra cosa',
    description: 'Un contador sencillo',
    mode: 'stitches',
    doing: 'Estás contando',
    start: 'Empezar a contar',
    projectExample: 'Ej. Pulsera de macramé',
    tapHint: 'Toca aquí para sumar uno',
    askStitchTarget: true,
    usesPalette: false,
    namePresets: [],
    partNameExample: 'Ej. Nudos de la pulsera',
    singlePiece: null,
    quantityHint: null,
    part: {
      tab: 'Contadores',
      one: 'contador',
      many: 'contadores',
      add: 'Añadir un contador',
      edit: 'Editar contador',
      remove: 'Borrar este contador',
      empty: 'Aún no hay contadores',
      emptyHint: 'Añade un contador para empezar.',
      pick: '¿Qué contador vas a usar?',
      addHint: 'Ponle un nombre para reconocerlo.',
      inUse: 'En uso',
    },
    row: null,
  },
};

export const TECHNIQUE_ORDER: readonly Technique[] = ['embroidery', 'crochet', 'knitting', 'other'];

export const DEFAULT_COUNTER_NAME = 'Contador';

export function techniqueOf(id: Technique): TechniqueInfo {
  return TECHNIQUES[id];
}
