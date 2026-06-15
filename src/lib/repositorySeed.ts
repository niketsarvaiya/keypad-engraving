/**
 * Beyond Finesse · Keypad Repository Seed
 * ─────────────────────────────────────────
 * Pre-populated keypad models sourced from the Beyond Alliance
 * keypad presentation deck. IDs are stable constants so that
 * demo projects can reference them without resolving at runtime.
 */

import type { KeypadModel } from '../types';

// ─── Stable seed IDs ──────────────────────────────────────────────────────────
// These IDs must never change — demo projects reference them directly.

export const SEED = {
  BASALTE_SENTIDO_8: {
    modelId: 'seed-basalte-sentido-8',
    colors: { almond: 'seed-bs8-almond', white: 'seed-bs8-white', black: 'seed-bs8-black' },
  },
  HORIZON_8: {
    modelId: 'seed-horizon-8',
    colors: { white: 'seed-hz-white', black: 'seed-hz-black', almond: 'seed-hz-almond' },
  },
  EELECTRON_6: {
    modelId: 'seed-eelectron-6',
    colors: { white: 'seed-ee-white', black: 'seed-ee-black' },
  },
  CRESTRON_C2NI_6: {
    modelId: 'seed-crestron-c2ni-6',
    colors: { white: 'seed-c2ni-white', black: 'seed-c2ni-black' },
  },
  CRESTRON_CBD_8: {
    modelId: 'seed-crestron-cbd-8',
    colors: { white: 'seed-cbd-white', black: 'seed-cbd-black' },
  },
  CRESTRON_CBF_6: {
    modelId: 'seed-crestron-cbf-6',
    colors: { white: 'seed-cbf-white', black: 'seed-cbf-black' },
  },
  EAE_ORIA_2: {
    modelId: 'seed-eae-oria-2',
    colors: { white: 'seed-oria2-white', champagne: 'seed-oria2-champagne', black: 'seed-oria2-black' },
  },
  EAE_ORIA_4: {
    modelId: 'seed-eae-oria-4',
    colors: { white: 'seed-oria4-white', champagne: 'seed-oria4-champagne', black: 'seed-oria4-black' },
  },
  EAE_ORIA_6: {
    modelId: 'seed-eae-oria-6',
    colors: { white: 'seed-oria6-white', champagne: 'seed-oria6-champagne', black: 'seed-oria6-black' },
  },
  EAE_ORIA_8: {
    modelId: 'seed-eae-oria-8',
    colors: { white: 'seed-oria8-white', champagne: 'seed-oria8-champagne', black: 'seed-oria8-black' },
  },
  BLACK_NOVA_ALBA8: {
    modelId: 'seed-blacknova-alba8',
    colors: { black: 'seed-alba8-black', white: 'seed-alba8-white' },
  },
  LUTRON_PICO_4: {
    modelId: 'seed-lutron-pico-4',
    colors: { sw: 'seed-pico-sw', mn: 'seed-pico-mn', bi: 'seed-pico-bi' },
  },
  I_LUXUS_4: {
    modelId: 'seed-iluxus-4',
    colors: {
      white: 'seed-ilux4-white', black: 'seed-ilux4-black',
      champagne: 'seed-ilux4-champagne', rose: 'seed-ilux4-rose',
      sage: 'seed-ilux4-sage', sky: 'seed-ilux4-sky',
    },
  },
  I_LUXUS_8: {
    modelId: 'seed-iluxus-8',
    colors: {
      white: 'seed-ilux8-white', black: 'seed-ilux8-black',
      champagne: 'seed-ilux8-champagne', rose: 'seed-ilux8-rose',
      sage: 'seed-ilux8-sage', sky: 'seed-ilux8-sky',
    },
  },
  INTERRA_6: {
    modelId: 'seed-interra-6',
    colors: { white: 'seed-int6-white', black: 'seed-int6-black' },
  },
  INTERRA_8: {
    modelId: 'seed-interra-8',
    colors: { white: 'seed-int8-white', black: 'seed-int8-black' },
  },
  LUMI_6: {
    modelId: 'seed-lumi-6',
    colors: { white: 'seed-lumi-white', black: 'seed-lumi-black' },
  },
  CITRON_8: {
    modelId: 'seed-citron-8',
    colors: { gray: 'seed-cit-gray', gold: 'seed-cit-gold' },
  },
  CJC_LOLA_4: {
    modelId: 'seed-cjc-lola-4',
    colors: { white: 'seed-lola-white', black: 'seed-lola-black', gold: 'seed-lola-gold' },
  },
  VIBROXX_4: {
    modelId: 'seed-vibroxx-4',
    colors: { white: 'seed-vib-white', black: 'seed-vib-black' },
  },
  VIBROXX_8: {
    modelId: 'seed-vibroxx-8',
    colors: { gold: 'seed-vib8-gold', white: 'seed-vib8-white', black: 'seed-vib8-black' },
  },
} as const;

// ─── Seed model definitions ────────────────────────────────────────────────────

const T = new Date().toISOString();

export const SEED_MODELS: KeypadModel[] = [

  // ── Basalte Sentido ──────────────────────────────────────────────────────────
  {
    id: SEED.BASALTE_SENTIDO_8.modelId,
    brand: 'Basalte',
    modelNumber: 'Sentido',
    name: 'Sentido 8-Button',
    buttonCount: 8,
    buttonLayout: { rows: 4, cols: 2 },
    colors: [
      { id: SEED.BASALTE_SENTIDO_8.colors.almond, name: 'Chime Brown',  hex: '#8d7459' },
      { id: SEED.BASALTE_SENTIDO_8.colors.white,  name: 'Polar White',  hex: '#f2f2f0' },
      { id: SEED.BASALTE_SENTIDO_8.colors.black,  name: 'Nero',         hex: '#1c1c1e' },
    ],
    hasButtonColors: false, buttonColors: [],
    indicator: 'backlit',
    engravingMethods: ['print', 'laser'],
    material: 'glass',
    notes: 'Premium Belgian glass keypad. Used in villa / luxury residential. 8-button format covers most living and bedroom scenarios.',
    createdAt: T, updatedAt: T,
  },

  // ── Horizon ──────────────────────────────────────────────────────────────────
  {
    id: SEED.HORIZON_8.modelId,
    brand: 'Horizon',
    modelNumber: 'HRZ-8',
    name: 'Horizon 8-Button',
    buttonCount: 8,
    buttonLayout: { rows: 4, cols: 2 },
    colors: [
      { id: SEED.HORIZON_8.colors.white,  name: 'Pearl White', hex: '#f2f2f0' },
      { id: SEED.HORIZON_8.colors.black,  name: 'Matte Black', hex: '#1c1c1e' },
      { id: SEED.HORIZON_8.colors.almond, name: 'Warm Almond', hex: '#d4c3a0' },
    ],
    hasButtonColors: false, buttonColors: [],
    indicator: 'backlit',
    engravingMethods: ['print', 'laser'],
    material: 'glass',
    notes: 'Available in Pearl White, Matte Black, and Warm Almond. Print and laser engraving supported.',
    createdAt: T, updatedAt: T,
  },

  // ── Eelectron Mini Pad ───────────────────────────────────────────────────────
  {
    id: SEED.EELECTRON_6.modelId,
    brand: 'Eelectron',
    modelNumber: 'CS10A01KNX',
    name: 'Mini Pad 6-Button',
    buttonCount: 6,
    buttonLayout: { rows: 3, cols: 2 },
    colors: [
      { id: SEED.EELECTRON_6.colors.white, name: 'White',        hex: '#f0f0ee' },
      { id: SEED.EELECTRON_6.colors.black, name: 'Black (NERO)', hex: '#1a1a1a' },
    ],
    hasButtonColors: false, buttonColors: [],
    indicator: 'none',
    engravingMethods: ['print'],
    material: 'glass',
    notes: 'KNX-compatible 6-button glass pad. Sticker/print engraving. White and NERO finishes.',
    createdAt: T, updatedAt: T,
  },

  // ── Crestron Cameo C2NI-CB-A-T ──────────────────────────────────────────────
  {
    id: SEED.CRESTRON_C2NI_6.modelId,
    brand: 'Crestron',
    modelNumber: 'C2NI-CB-A-T',
    name: 'Cameo Internodal 6-Button',
    buttonCount: 6,
    buttonLayout: { rows: 3, cols: 2 },
    colors: [
      { id: SEED.CRESTRON_C2NI_6.colors.white, name: 'Almond', hex: '#f5f0e8' },
      { id: SEED.CRESTRON_C2NI_6.colors.black, name: 'Black',  hex: '#1c1c1e' },
    ],
    hasButtonColors: false, buttonColors: [],
    indicator: 'side-led',
    engravingMethods: ['print', 'laser'],
    material: 'plastic',
    notes: 'Crestron Cameo internodal 6-button. Side LED status indicator. Almond and Black finishes.',
    createdAt: T, updatedAt: T,
  },

  // ── Crestron Cameo C2N-CBD-P-W-T ────────────────────────────────────────────
  {
    id: SEED.CRESTRON_CBD_8.modelId,
    brand: 'Crestron',
    modelNumber: 'C2N-CBD-P-W-T',
    name: 'Cameo Wireless 8-Button',
    buttonCount: 8,
    buttonLayout: { rows: 4, cols: 2 },
    colors: [
      { id: SEED.CRESTRON_CBD_8.colors.white, name: 'White', hex: '#f5f5f5' },
      { id: SEED.CRESTRON_CBD_8.colors.black, name: 'Black', hex: '#1c1c1e' },
    ],
    hasButtonColors: false, buttonColors: [],
    indicator: 'side-led',
    engravingMethods: ['print', 'laser'],
    material: 'plastic',
    notes: 'Crestron Cameo wireless 8-button panel. Includes FAN +/- button variants. White and Black.',
    createdAt: T, updatedAt: T,
  },

  // ── Crestron Cameo C2N-CBF-P-B-T ────────────────────────────────────────────
  {
    id: SEED.CRESTRON_CBF_6.modelId,
    brand: 'Crestron',
    modelNumber: 'C2N-CBF-P-B-T',
    name: 'Cameo Flush 6-Button',
    buttonCount: 6,
    buttonLayout: { rows: 3, cols: 2 },
    colors: [
      { id: SEED.CRESTRON_CBF_6.colors.white, name: 'White', hex: '#f5f5f5' },
      { id: SEED.CRESTRON_CBF_6.colors.black, name: 'Black', hex: '#1c1c1e' },
    ],
    hasButtonColors: false, buttonColors: [],
    indicator: 'side-led',
    engravingMethods: ['print', 'laser'],
    material: 'plastic',
    notes: 'Crestron Cameo flush-mount 6-button. White and Black finishes.',
    createdAt: T, updatedAt: T,
  },

  // ── EAE Oria 2-Button (1 Fold) ──────────────────────────────────────────────
  {
    id: SEED.EAE_ORIA_2.modelId,
    brand: 'EAE',
    modelNumber: 'Oria-1F',
    name: 'Oria 1-Fold (2 Button)',
    buttonCount: 2,
    buttonLayout: { rows: 1, cols: 2 },
    colors: [
      { id: SEED.EAE_ORIA_2.colors.white,     name: 'White',     hex: '#fafafa' },
      { id: SEED.EAE_ORIA_2.colors.champagne, name: 'Champagne', hex: '#e8dcc8' },
      { id: SEED.EAE_ORIA_2.colors.black,     name: 'Black',     hex: '#1c1c1e' },
    ],
    hasButtonColors: false, buttonColors: [],
    indicator: 'backlit',
    engravingMethods: ['print', 'laser'],
    material: 'glass',
    notes: 'EAE Oria 1-Fold. 2 buttons — ideal for entrance on/off pairs or simple scene switches.',
    createdAt: T, updatedAt: T,
  },

  // ── EAE Oria 4-Button (2 Fold) ──────────────────────────────────────────────
  {
    id: SEED.EAE_ORIA_4.modelId,
    brand: 'EAE',
    modelNumber: 'Oria-2F',
    name: 'Oria 2-Fold (4 Button)',
    buttonCount: 4,
    buttonLayout: { rows: 2, cols: 2 },
    colors: [
      { id: SEED.EAE_ORIA_4.colors.white,     name: 'White',     hex: '#fafafa' },
      { id: SEED.EAE_ORIA_4.colors.champagne, name: 'Champagne', hex: '#e8dcc8' },
      { id: SEED.EAE_ORIA_4.colors.black,     name: 'Black',     hex: '#1c1c1e' },
    ],
    hasButtonColors: false, buttonColors: [],
    indicator: 'backlit',
    engravingMethods: ['print', 'laser'],
    material: 'glass',
    notes: 'EAE Oria 2-Fold. 4 buttons in 2×2 layout. Entry and small room standard.',
    createdAt: T, updatedAt: T,
  },

  // ── EAE Oria 6-Button (3 Fold) ──────────────────────────────────────────────
  {
    id: SEED.EAE_ORIA_6.modelId,
    brand: 'EAE',
    modelNumber: 'Oria-3F',
    name: 'Oria 3-Fold (6 Button)',
    buttonCount: 6,
    buttonLayout: { rows: 3, cols: 2 },
    colors: [
      { id: SEED.EAE_ORIA_6.colors.white,     name: 'White',     hex: '#fafafa' },
      { id: SEED.EAE_ORIA_6.colors.champagne, name: 'Champagne', hex: '#e8dcc8' },
      { id: SEED.EAE_ORIA_6.colors.black,     name: 'Black',     hex: '#1c1c1e' },
    ],
    hasButtonColors: false, buttonColors: [],
    indicator: 'backlit',
    engravingMethods: ['print', 'laser'],
    material: 'glass',
    notes: 'EAE Oria 3-Fold. 6 buttons in 3×2 layout. Versatile room control.',
    createdAt: T, updatedAt: T,
  },

  // ── EAE Oria 8-Button (4 Fold) ──────────────────────────────────────────────
  {
    id: SEED.EAE_ORIA_8.modelId,
    brand: 'EAE',
    modelNumber: 'Oria-4F',
    name: 'Oria 4-Fold (8 Button)',
    buttonCount: 8,
    buttonLayout: { rows: 4, cols: 2 },
    colors: [
      { id: SEED.EAE_ORIA_8.colors.white,     name: 'White',     hex: '#fafafa' },
      { id: SEED.EAE_ORIA_8.colors.champagne, name: 'Champagne', hex: '#e8dcc8' },
      { id: SEED.EAE_ORIA_8.colors.black,     name: 'Black',     hex: '#1c1c1e' },
    ],
    hasButtonColors: false, buttonColors: [],
    indicator: 'backlit',
    engravingMethods: ['print', 'laser'],
    material: 'glass',
    notes: 'EAE Oria 4-Fold. 8 buttons — most versatile configuration for living rooms and bedrooms.',
    createdAt: T, updatedAt: T,
  },

  // ── Black Nova ALBA 8 ────────────────────────────────────────────────────────
  {
    id: SEED.BLACK_NOVA_ALBA8.modelId,
    brand: 'Black Nova',
    modelNumber: 'ALBA-8',
    name: 'ALBA 8-Button',
    buttonCount: 8,
    buttonLayout: { rows: 4, cols: 2 },
    colors: [
      { id: SEED.BLACK_NOVA_ALBA8.colors.black, name: 'Nero Black',  hex: '#1c1c1e' },
      { id: SEED.BLACK_NOVA_ALBA8.colors.white, name: 'Pearl White', hex: '#f2f2f2' },
    ],
    hasButtonColors: false, buttonColors: [],
    indicator: 'backlit',
    engravingMethods: ['laser'],
    material: 'glass',
    notes: 'Black Nova ALBA 8. Laser engraving only via the Black Nova online creator tool. Premium tempered glass.',
    createdAt: T, updatedAt: T,
  },

  // ── Lutron PICO 4-Button ─────────────────────────────────────────────────────
  {
    id: SEED.LUTRON_PICO_4.modelId,
    brand: 'Lutron',
    modelNumber: 'PICO-4B',
    name: 'Pico 4-Button',
    buttonCount: 4,
    buttonLayout: { rows: 2, cols: 2 },
    colors: [
      { id: SEED.LUTRON_PICO_4.colors.sw, name: 'Snow White', hex: '#f8f8f6' },
      { id: SEED.LUTRON_PICO_4.colors.mn, name: 'Midnight',   hex: '#1a1a2e' },
      { id: SEED.LUTRON_PICO_4.colors.bi, name: 'Biscuit',    hex: '#d4bc9a' },
    ],
    hasButtonColors: false, buttonColors: [],
    indicator: 'none',
    engravingMethods: ['print'],
    material: 'plastic',
    notes: 'Lutron Pico wireless remote. Satin finish. Available in Snow White, Midnight, and Biscuit.',
    createdAt: T, updatedAt: T,
  },

  // ── I Luxus 4-Button ─────────────────────────────────────────────────────────
  {
    id: SEED.I_LUXUS_4.modelId,
    brand: 'I Luxus',
    modelNumber: 'ILX-4',
    name: 'I Luxus 4-Button',
    buttonCount: 4,
    buttonLayout: { rows: 2, cols: 2 },
    colors: [
      { id: SEED.I_LUXUS_4.colors.white,     name: 'Classic White',     hex: '#f5f5f3' },
      { id: SEED.I_LUXUS_4.colors.black,     name: 'Classic Black',     hex: '#1a1a1a' },
      { id: SEED.I_LUXUS_4.colors.champagne, name: 'Classic Champagne', hex: '#d4bc9a' },
      { id: SEED.I_LUXUS_4.colors.rose,      name: 'Pastel Rose',       hex: '#e8c4c4' },
      { id: SEED.I_LUXUS_4.colors.sage,      name: 'Pastel Sage',       hex: '#c4d4c0' },
      { id: SEED.I_LUXUS_4.colors.sky,       name: 'Pastel Sky',        hex: '#c4d4e8' },
    ],
    hasButtonColors: false, buttonColors: [],
    indicator: 'backlit',
    engravingMethods: ['print'],
    material: 'glass',
    notes: 'I Luxus 4-button. Pastel Color Series (Rose, Sage, Sky) + Classic Color Series. Wide palette for design-forward projects.',
    createdAt: T, updatedAt: T,
  },

  // ── I Luxus 8-Button ─────────────────────────────────────────────────────────
  {
    id: SEED.I_LUXUS_8.modelId,
    brand: 'I Luxus',
    modelNumber: 'ILX-8',
    name: 'I Luxus 8-Button',
    buttonCount: 8,
    buttonLayout: { rows: 4, cols: 2 },
    colors: [
      { id: SEED.I_LUXUS_8.colors.white,     name: 'Classic White',     hex: '#f5f5f3' },
      { id: SEED.I_LUXUS_8.colors.black,     name: 'Classic Black',     hex: '#1a1a1a' },
      { id: SEED.I_LUXUS_8.colors.champagne, name: 'Classic Champagne', hex: '#d4bc9a' },
      { id: SEED.I_LUXUS_8.colors.rose,      name: 'Pastel Rose',       hex: '#e8c4c4' },
      { id: SEED.I_LUXUS_8.colors.sage,      name: 'Pastel Sage',       hex: '#c4d4c0' },
      { id: SEED.I_LUXUS_8.colors.sky,       name: 'Pastel Sky',        hex: '#c4d4e8' },
    ],
    hasButtonColors: false, buttonColors: [],
    indicator: 'backlit',
    engravingMethods: ['print'],
    material: 'glass',
    notes: 'I Luxus 8-button. Same wide palette as 4-button — ideal for principal rooms requiring full scene control.',
    createdAt: T, updatedAt: T,
  },

  // ── INTERRA 6-Button ─────────────────────────────────────────────────────────
  {
    id: SEED.INTERRA_6.modelId,
    brand: 'INTERRA',
    modelNumber: 'INT-6',
    name: 'Interra 6-Button',
    buttonCount: 6,
    buttonLayout: { rows: 3, cols: 2 },
    colors: [
      { id: SEED.INTERRA_6.colors.white, name: 'White', hex: '#f5f5f5' },
      { id: SEED.INTERRA_6.colors.black, name: 'Black', hex: '#1c1c1e' },
    ],
    hasButtonColors: false, buttonColors: [],
    indicator: 'backlit',
    engravingMethods: ['print', 'laser'],
    material: 'glass',
    notes: 'INTERRA 6-button. Engraving configured via INTERRA online creator tool.',
    createdAt: T, updatedAt: T,
  },

  // ── INTERRA 8-Button ─────────────────────────────────────────────────────────
  {
    id: SEED.INTERRA_8.modelId,
    brand: 'INTERRA',
    modelNumber: 'INT-8',
    name: 'Interra 8-Button',
    buttonCount: 8,
    buttonLayout: { rows: 4, cols: 2 },
    colors: [
      { id: SEED.INTERRA_8.colors.white, name: 'White', hex: '#f5f5f5' },
      { id: SEED.INTERRA_8.colors.black, name: 'Black', hex: '#1c1c1e' },
    ],
    hasButtonColors: false, buttonColors: [],
    indicator: 'backlit',
    engravingMethods: ['print', 'laser'],
    material: 'glass',
    notes: 'INTERRA 8-button. Engraving via online creator tool.',
    createdAt: T, updatedAt: T,
  },

  // ── LUMI 6-Button ────────────────────────────────────────────────────────────
  {
    id: SEED.LUMI_6.modelId,
    brand: 'LUMI',
    modelNumber: 'LUMI-6',
    name: 'LUMI 6-Button',
    buttonCount: 6,
    buttonLayout: { rows: 3, cols: 2 },
    colors: [
      { id: SEED.LUMI_6.colors.white, name: 'White', hex: '#f0f0f0' },
      { id: SEED.LUMI_6.colors.black, name: 'Black', hex: '#1c1c1e' },
    ],
    hasButtonColors: false, buttonColors: [],
    indicator: 'backlit',
    engravingMethods: ['laser'],
    material: 'glass',
    notes: 'LUMI 6-button. Laser engraving via LUMI creator tool. Clean minimal glass design.',
    createdAt: T, updatedAt: T,
  },

  // ── Citron Scenario Panel 8-Button ──────────────────────────────────────────
  {
    id: SEED.CITRON_8.modelId,
    brand: 'Citron',
    modelNumber: 'CSP-8',
    name: 'Scenario Panel 8-Button',
    buttonCount: 8,
    buttonLayout: { rows: 4, cols: 2 },
    colors: [
      { id: SEED.CITRON_8.colors.gray, name: 'Space Gray',   hex: '#5a5a5e' },
      { id: SEED.CITRON_8.colors.gold, name: 'Glacier Gold', hex: '#c8a96e' },
    ],
    hasButtonColors: false, buttonColors: [],
    indicator: 'backlit',
    engravingMethods: ['print'],
    material: 'glass',
    notes: 'Citron Scenario Panel 8-button. Distinctive Space Gray and Glacier Gold finishes — for statement installations.',
    createdAt: T, updatedAt: T,
  },

  // ── CJC Lola 4-Button ────────────────────────────────────────────────────────
  {
    id: SEED.CJC_LOLA_4.modelId,
    brand: 'CJC',
    modelNumber: 'Lola-4',
    name: 'Lola 4-Button',
    buttonCount: 4,
    buttonLayout: { rows: 2, cols: 2 },
    colors: [
      { id: SEED.CJC_LOLA_4.colors.white, name: 'Pearl White', hex: '#f5f5f3' },
      { id: SEED.CJC_LOLA_4.colors.black, name: 'Matte Black', hex: '#1c1c1e' },
      { id: SEED.CJC_LOLA_4.colors.gold,  name: 'Rosé Gold',   hex: '#d4a898' },
    ],
    hasButtonColors: false, buttonColors: [],
    indicator: 'none',
    engravingMethods: ['print'],
    material: 'glass',
    notes: 'CJC Lola 4-button. Elegant Rosé Gold option alongside Pearl White and Matte Black.',
    createdAt: T, updatedAt: T,
  },

  // ── Vibroxx 4-Button ─────────────────────────────────────────────────────────
  {
    id: SEED.VIBROXX_4.modelId,
    brand: 'Vibroxx',
    modelNumber: 'VBX-4',
    name: 'Vibroxx 4-Button',
    buttonCount: 4,
    buttonLayout: { rows: 2, cols: 2 },
    colors: [
      { id: SEED.VIBROXX_4.colors.white, name: 'White', hex: '#f5f5f5' },
      { id: SEED.VIBROXX_4.colors.black, name: 'Black', hex: '#1c1c1e' },
    ],
    hasButtonColors: false, buttonColors: [],
    indicator: 'none',
    engravingMethods: ['print'],
    material: 'plastic',
    notes: 'Vibroxx 4-button keypad. White and Black finish.',
    createdAt: T, updatedAt: T,
  },

  // ── Vibroxx Horizon 8-Button ─────────────────────────────────────────────────
  {
    id: SEED.VIBROXX_8.modelId,
    brand: 'Vibroxx',
    modelNumber: 'Horizon-8',
    name: 'Horizon 8-Button',
    buttonCount: 8,
    buttonLayout: { rows: 4, cols: 2 },
    colors: [
      { id: SEED.VIBROXX_8.colors.gold,  name: 'Champagne Gold', hex: '#c8a96e' },
      { id: SEED.VIBROXX_8.colors.white, name: 'Pearl White',    hex: '#f5f5f5' },
      { id: SEED.VIBROXX_8.colors.black, name: 'Matte Black',    hex: '#1c1c1e' },
    ],
    hasButtonColors: false, buttonColors: [],
    indicator: 'backlit',
    engravingMethods: ['print', 'laser'],
    material: 'glass',
    notes: 'Vibroxx Horizon 8-button. Signature Champagne Gold finish with backlit indicators. Print and laser engraving. Ideal for luxury duplex and penthouse installations.',
    createdAt: T, updatedAt: T,
  },
];

// ─── Seed helper ──────────────────────────────────────────────────────────────

const REPO_KEY = 'engraving_repository';

/**
 * Seeds the repository with default models on every load.
 * Safe: never overwrites existing user-added models — only adds any seed models
 * that are missing by ID. This means new models added to SEED_MODELS are picked
 * up automatically on the next app load.
 */
export function seedRepositoryIfEmpty(): KeypadModel[] {
  try {
    const raw = localStorage.getItem(REPO_KEY);

    if (!raw || raw === '[]') {
      // First time — seed everything
      localStorage.setItem(REPO_KEY, JSON.stringify(SEED_MODELS));
      return [...SEED_MODELS];
    }

    // Always check for any missing seed models and add them (never overwrites)
    const existing: KeypadModel[] = JSON.parse(raw);
    const existingIds = new Set(existing.map(m => m.id));
    const toAdd = SEED_MODELS.filter(m => !existingIds.has(m.id));

    if (toAdd.length > 0) {
      const merged = [...existing, ...toAdd];
      localStorage.setItem(REPO_KEY, JSON.stringify(merged));
      return merged;
    }

    return existing;
  } catch {
    return [];
  }
}
