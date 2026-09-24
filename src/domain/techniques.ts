import type { CountMode, Technique } from './part';

export interface TechniqueInfo {
  id: Technique;
  label: string;
  description: string;
  mode: CountMode;
  doing: string;
  askStitchTarget: boolean;
  usesPalette: boolean;
  namePresets: readonly string[];
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
  inUse: 'En uso',
};

export const TECHNIQUES: Record<Technique, TechniqueInfo> = {
  embroidery: {
    id: 'embroidery',
    label: 'Bordado',
    description: 'Punto de cruz y bordado',
    mode: 'stitches',
    doing: 'Estás bordando',
    askStitchTarget: true,
    usesPalette: true,
    namePresets: [],
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
    askStitchTarget: false,
    usesPalette: false,
    namePresets: ['Cabeza', 'Cuerpo', 'Brazo', 'Pierna', 'Oreja', 'Cola'],
    part: PIECE,
    row: { one: 'vuelta', many: 'vueltas', finish: 'Terminé la vuelta', oneCapital: 'Vuelta' },
  },
  knitting: {
    id: 'knitting',
    label: 'Punto',
    description: 'Con dos agujas',
    mode: 'rows',
    doing: 'Estás tejiendo',
    askStitchTarget: false,
    usesPalette: false,
    namePresets: ['Delantero', 'Espalda', 'Manga', 'Cuello', 'Bolsillo'],
    part: PIECE,
    row: { one: 'fila', many: 'filas', finish: 'Terminé la fila', oneCapital: 'Fila' },
  },
  other: {
    id: 'other',
    label: 'Otra cosa',
    description: 'Un contador sencillo',
    mode: 'stitches',
    doing: 'Estás con',
    askStitchTarget: true,
    usesPalette: false,
    namePresets: [],
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
