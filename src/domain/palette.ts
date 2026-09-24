export interface PaletteColor {
  name: string;
  hex: string;
  dmc: string;
}

export const PALETTE: readonly PaletteColor[] = [
  { name: 'Negro', hex: '#1E1B1A', dmc: '310' },
  { name: 'Blanco', hex: '#FFFFFF', dmc: 'B5200' },
  { name: 'Gris', hex: '#B9B9BB', dmc: '415' },
  { name: 'Rojo', hex: '#C72B3B', dmc: '321' },
  { name: 'Rosa', hex: '#EE9BA6', dmc: '3326' },
  { name: 'Naranja', hex: '#F07A22', dmc: '740' },
  { name: 'Amarillo', hex: '#F4D23E', dmc: '307' },
  { name: 'Verde', hex: '#1F6B3A', dmc: '699' },
  { name: 'Celeste', hex: '#8CC3E6', dmc: '3325' },
  { name: 'Azul', hex: '#1E4A9C', dmc: '797' },
  { name: 'Lila', hex: '#8A63A6', dmc: '208' },
  { name: 'Marrón', hex: '#6B4226', dmc: '433' },
];

export function findByCode(code: string): number {
  const needle = code.trim().toLowerCase();
  if (!needle) return -1;
  return PALETTE.findIndex((p) => p.dmc.toLowerCase() === needle);
}

export function findByHex(hex: string): number {
  const needle = hex.toLowerCase();
  return PALETTE.findIndex((p) => p.hex.toLowerCase() === needle);
}
