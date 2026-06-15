import {
  Sun, Moon, Sunset, Sunrise, Lightbulb,
  Wind, Thermometer, Snowflake,
  Tv2, Music2, Film, Volume2,
  ChevronUp, ChevronDown, ChevronLeft, ChevronRight,
  ShieldCheck, Lock, Bell,
  Sparkles, Coffee, BedDouble, BookOpen,
  Power, Home, Plus, Minus, Zap, Flame,
  type LucideIcon,
} from 'lucide-react';
import type {
  KeypadButton, ButtonCount, GlobalEngravingSettings,
  EngravingProject, SceneLibraryItem
} from '../types';

// ─── Icon Library ─────────────────────────────────────────────────────────────

export interface IconItem {
  id: string;
  label: string;
  lucide: string;
}

export const ICON_LIBRARY: IconItem[] = [
  // Lighting & Scenes
  { id: 'sun',         label: 'Sun / Lights',  lucide: 'Sun' },
  { id: 'moon',        label: 'Moon / Sleep',  lucide: 'Moon' },
  { id: 'sunset',      label: 'Sunset',        lucide: 'Sunset' },
  { id: 'sunrise',     label: 'Morning',       lucide: 'Sunrise' },
  { id: 'lightbulb',   label: 'Bulb',          lucide: 'Lightbulb' },
  { id: 'sparkles',    label: 'Party',         lucide: 'Sparkles' },
  { id: 'zap',         label: 'Flash',         lucide: 'Zap' },
  // Climate
  { id: 'wind',        label: 'Fan',           lucide: 'Wind' },
  { id: 'thermometer', label: 'AC / Temp',     lucide: 'Thermometer' },
  { id: 'snowflake',   label: 'Cool',          lucide: 'Snowflake' },
  { id: 'flame',       label: 'Heat',          lucide: 'Flame' },
  // AV / Entertainment
  { id: 'tv2',         label: 'TV',            lucide: 'Tv2' },
  { id: 'music2',      label: 'Music',         lucide: 'Music2' },
  { id: 'film',        label: 'Movie',         lucide: 'Film' },
  { id: 'volume2',     label: 'Volume',        lucide: 'Volume2' },
  // Curtains / Blinds
  { id: 'chevup',      label: 'Open',          lucide: 'ChevronUp' },
  { id: 'chevdown',    label: 'Close',         lucide: 'ChevronDown' },
  { id: 'chevleft',    label: 'Left',          lucide: 'ChevronLeft' },
  { id: 'chevright',   label: 'Right',         lucide: 'ChevronRight' },
  // Security
  { id: 'shield',      label: 'Security',      lucide: 'ShieldCheck' },
  { id: 'lock',        label: 'Lock',          lucide: 'Lock' },
  { id: 'bell',        label: 'Alarm',         lucide: 'Bell' },
  // Life Scenes
  { id: 'coffee',      label: 'Morning',       lucide: 'Coffee' },
  { id: 'bed',         label: 'Sleep',         lucide: 'BedDouble' },
  { id: 'book',        label: 'Reading',       lucide: 'BookOpen' },
  // Master / Control
  { id: 'power',       label: 'All Off',       lucide: 'Power' },
  { id: 'home',        label: 'Home',          lucide: 'Home' },
  { id: 'plus',        label: 'Plus',          lucide: 'Plus' },
  { id: 'minus',       label: 'Minus',         lucide: 'Minus' },
];

export const ICON_MAP: Record<string, LucideIcon> = {
  Sun, Moon, Sunset, Sunrise, Lightbulb,
  Wind, Thermometer, Snowflake, Flame,
  Tv2, Music2, Film, Volume2,
  ChevronUp, ChevronDown, ChevronLeft, ChevronRight,
  ShieldCheck, Lock, Bell,
  Sparkles, Coffee, BedDouble, BookOpen,
  Power, Home, Plus, Minus, Zap,
};

export function generateId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export function createDefaultButtons(count: ButtonCount): KeypadButton[] {
  return Array.from({ length: count }, (_, i) => ({
    id: generateId(),
    position: i + 1,
    label: '',
    actionType: 'Empty' as const,
    engravingMode: 'text' as const,
    icon: undefined,
    notes: '',
    comments: [],
  }));
}

export const DEFAULT_SETTINGS: GlobalEngravingSettings = {
  keypayFinish: 'Chime Brown',
  printingColor: 'White',
  fontStyle: 'Sans Serif',
  textCase: 'uppercase',
  useIcons: false,
};

export const ROOM_TYPES = [
  'Living Room', 'Dining', 'Master Bedroom', 'Bedroom',
  'Guest Bedroom', 'Kids Bedroom', 'Theatre', 'Lounge',
  'Kitchen', 'Passage', 'Outdoor', 'Study', 'Bathroom', 'Other',
] as const;

export const ACTION_TYPES = [
  'Scene', 'Light', 'Curtain', 'AC', 'Fan',
  'Music', 'Security', 'Master', 'Custom', 'Empty',
] as const;

export const BUTTON_COUNTS: ButtonCount[] = [2, 4, 6, 8];

export const KEYPAD_LOCATIONS = [
  'Entry', 'Exit', 'Bedside Left', 'Bedside Right',
  'Main Wall', 'Near Door', 'Lounge Wall', 'Feature Wall',
  'Near TV', 'Near Curtain', 'Bathroom', 'Other',
];

export const SCENE_LIBRARY: SceneLibraryItem[] = [
  // Scenes
  { id: 's1',  label: 'LIGHTS',    category: 'Scenes', actionType: 'Light' },
  { id: 's2',  label: 'BRIGHT',    category: 'Scenes', actionType: 'Scene' },
  { id: 's3',  label: 'AMBIENT',   category: 'Scenes', actionType: 'Scene' },
  { id: 's4',  label: 'RELAX',     category: 'Scenes', actionType: 'Scene' },
  { id: 's5',  label: 'LOUNGE',    category: 'Scenes', actionType: 'Scene' },
  { id: 's6',  label: 'PARTY',     category: 'Scenes', actionType: 'Scene' },
  { id: 's7',  label: 'DECOR',     category: 'Scenes', actionType: 'Scene' },
  { id: 's8',  label: 'SLEEP',     category: 'Scenes', actionType: 'Scene' },
  { id: 's9',  label: 'NIGHT',     category: 'Scenes', actionType: 'Scene' },
  { id: 's10', label: 'MOVIE',     category: 'Scenes', actionType: 'Scene' },
  { id: 's11', label: 'FAVOURITE', category: 'Scenes', actionType: 'Scene' },
  { id: 's12', label: 'MORNING',   category: 'Scenes', actionType: 'Scene' },
  { id: 's13', label: 'EVENING',   category: 'Scenes', actionType: 'Scene' },
  { id: 's14', label: 'READING',   category: 'Scenes', actionType: 'Light' },
  { id: 's15', label: 'STUDY',     category: 'Scenes', actionType: 'Scene' },
  { id: 's16', label: 'DINNER',    category: 'Scenes', actionType: 'Scene' },
  { id: 's17', label: 'WELCOME',   category: 'Scenes', actionType: 'Scene' },
  { id: 's18', label: 'ROMANTIC',  category: 'Scenes', actionType: 'Scene' },
  { id: 's19', label: 'YOGA',      category: 'Scenes', actionType: 'Scene' },
  { id: 's20', label: 'POOLSIDE',  category: 'Scenes', actionType: 'Scene' },
  // Actions
  { id: 'a1',  label: 'ALL OFF',    category: 'Actions', actionType: 'Master' },
  { id: 'a2',  label: 'MASTER OFF', category: 'Actions', actionType: 'Master' },
  { id: 'a3',  label: 'CURTAINS',   category: 'Actions', actionType: 'Curtain' },
  { id: 'a4',  label: 'SHEER',      category: 'Actions', actionType: 'Curtain' },
  { id: 'a5',  label: 'BLACKOUT',   category: 'Actions', actionType: 'Curtain' },
  { id: 'a6',  label: 'AC',         category: 'Actions', actionType: 'AC' },
  { id: 'a7',  label: 'FAN',        category: 'Actions', actionType: 'Fan' },
  { id: 'a8',  label: 'FAN +',      category: 'Actions', actionType: 'Fan' },
  { id: 'a9',  label: 'FAN -',      category: 'Actions', actionType: 'Fan' },
  { id: 'a10', label: 'MUSIC',      category: 'Actions', actionType: 'Music' },
  { id: 'a11', label: 'TV',         category: 'Actions', actionType: 'Custom' },
  { id: 'a12', label: 'PROJECTOR',  category: 'Actions', actionType: 'Custom' },
  { id: 'a13', label: 'SECURITY',   category: 'Actions', actionType: 'Security' },
  { id: 'a14', label: 'INTERCOM',   category: 'Actions', actionType: 'Security' },
  { id: 'a15', label: 'GATE',       category: 'Actions', actionType: 'Security' },
  // Lighting
  { id: 'l1', label: 'COVE',      category: 'Lighting', actionType: 'Light' },
  { id: 'l2', label: 'SPOTS',     category: 'Lighting', actionType: 'Light' },
  { id: 'l3', label: 'CHANDELIER',category: 'Lighting', actionType: 'Light' },
  { id: 'l4', label: 'WALL WASH', category: 'Lighting', actionType: 'Light' },
  { id: 'l5', label: 'STRIP',     category: 'Lighting', actionType: 'Light' },
  { id: 'l6', label: 'FOCUS',     category: 'Lighting', actionType: 'Light' },
  { id: 'l7', label: 'PROFILE',   category: 'Lighting', actionType: 'Light' },
  { id: 'l8', label: 'PENDANT',   category: 'Lighting', actionType: 'Light' },
  { id: 'l9', label: 'ACCENT',    category: 'Lighting', actionType: 'Light' },
];

export const ROOM_SUGGESTIONS: Record<string, string[]> = {
  'Living Room': ['LIGHTS', 'BRIGHT', 'AMBIENT', 'PARTY', 'CURTAINS', 'TV', 'MUSIC', 'ALL OFF'],
  'Dining': ['LIGHTS', 'BRIGHT', 'AMBIENT', 'RELAX', 'CURTAINS', 'ALL OFF'],
  'Master Bedroom': ['LIGHTS', 'SLEEP', 'NIGHT', 'READING', 'CURTAINS', 'AC', 'ALL OFF'],
  'Bedroom': ['LIGHTS', 'SLEEP', 'NIGHT', 'READING', 'CURTAINS', 'AC', 'ALL OFF'],
  'Guest Bedroom': ['LIGHTS', 'SLEEP', 'NIGHT', 'READING', 'CURTAINS', 'AC', 'ALL OFF'],
  'Kids Bedroom': ['LIGHTS', 'STUDY', 'SLEEP', 'NIGHT', 'CURTAINS', 'ALL OFF'],
  'Theatre': ['MOVIE', 'AMBIENT', 'PROJECTOR', 'TV', 'CURTAINS', 'MUSIC', 'ALL OFF'],
  'Lounge': ['LIGHTS', 'LOUNGE', 'PARTY', 'AMBIENT', 'CURTAINS', 'TV', 'ALL OFF'],
  'Kitchen': ['LIGHTS', 'BRIGHT', 'AMBIENT', 'COVE', 'SPOTS', 'ALL OFF'],
  'Passage': ['LIGHTS', 'NIGHT', 'MOTION', 'ALL OFF'],
  'Outdoor': ['LIGHTS', 'AMBIENT', 'PARTY', 'DECOR', 'SECURITY', 'ALL OFF'],
  'Study': ['LIGHTS', 'BRIGHT', 'READING', 'FOCUS', 'AC', 'ALL OFF'],
  'Bathroom': ['LIGHTS', 'NIGHT', 'BRIGHT', 'ALL OFF'],
  'Other': ['LIGHTS', 'AMBIENT', 'ALL OFF'],
};

export function createDemoProject(): EngravingProject {
  const now = new Date().toISOString();

  // Helper — creates a button quickly
  const btn = (
    pos: number,
    label: string,
    actionType: KeypadButton['actionType'],
    opts: { notes?: string; icon?: string; engravingMode?: KeypadButton['engravingMode']; comments?: KeypadButton['comments'] } = {},
  ): KeypadButton => ({
    id: generateId(),
    position: pos,
    label,
    actionType,
    engravingMode: opts.engravingMode ?? 'text',
    icon: opts.icon,
    notes: opts.notes ?? '',
    comments: opts.comments ?? [],
  });

  return {
    id: generateId(),
    name: 'Villa Serenova',
    client: 'Mr. & Mrs. Mehta',
    projectCode: 'BYA-2025-014',
    preparedBy: 'Niket Sarvaiya',
    date: now.slice(0, 10),
    revision: 2,
    globalNotes: 'All keypads Chime Brown finish · White engraving · Basalte Sentido series',
    settings: { ...DEFAULT_SETTINGS },
    status: 'shared-with-client',
    createdAt: now,
    updatedAt: now,
    rooms: [

      // ── Living Room ─────────────────────────────────────────────────────────
      {
        id: generateId(), name: 'Living Room', type: 'Living Room',
        notes: 'Feature wall keypad to be confirmed with interior designer.',
        order: 0,
        keypads: [
          {
            id: generateId(),
            name: 'Main Control',
            location: 'Entry',
            buttonCount: 8,
            brand: 'Basalte', model: 'Sentido', finish: 'Chime Brown', quantity: 1,
            notes: 'Primary control point near main entrance to Living Room.',
            buttons: [
              btn(1, 'LIGHTS',   'Light',   { engravingMode: 'text+icon', icon: 'Sun' }),
              btn(2, 'BRIGHT',   'Scene'),
              btn(3, 'AMBIENT',  'Scene'),
              btn(4, 'LOUNGE',   'Scene'),
              btn(5, 'PARTY',    'Scene',   { engravingMode: 'text+icon', icon: 'Sparkles' }),
              btn(6, 'CURTAINS', 'Curtain', { engravingMode: 'text+icon', icon: 'ChevronDown' }),
              btn(7, 'MUSIC',    'Music',   { engravingMode: 'text+icon', icon: 'Music2' }),
              btn(8, 'ALL OFF',  'Master',  { engravingMode: 'text+icon', icon: 'Power',
                comments: [{
                  id: generateId(),
                  author: 'Niket Sarvaiya',
                  text: 'Client confirmed ALL OFF should cut all circuits including AC.',
                  suggestedChange: undefined,
                  resolved: false,
                  createdAt: now,
                }],
              }),
            ],
          },
          {
            id: generateId(),
            name: 'AV Station',
            location: 'Near TV',
            buttonCount: 4,
            brand: 'Basalte', model: 'Sentido', finish: 'Chime Brown', quantity: 1,
            notes: 'Located on media unit wall, dedicated AV control.',
            buttons: [
              btn(1, 'TV',       'Custom',  { engravingMode: 'text+icon', icon: 'Tv2' }),
              btn(2, 'MUSIC',    'Music',   { engravingMode: 'text+icon', icon: 'Music2' }),
              btn(3, 'MOVIE',    'Scene',   { engravingMode: 'text+icon', icon: 'Film' }),
              btn(4, 'ALL OFF',  'Master',  { engravingMode: 'text+icon', icon: 'Power' }),
            ],
          },
        ],
      },

      // ── Dining Room ─────────────────────────────────────────────────────────
      {
        id: generateId(), name: 'Dining Room', type: 'Dining',
        notes: '',
        order: 1,
        keypads: [
          {
            id: generateId(),
            name: 'Dining Keypad',
            location: 'Main Wall',
            buttonCount: 6,
            brand: 'Basalte', model: 'Sentido', finish: 'Chime Brown', quantity: 1,
            notes: '',
            buttons: [
              btn(1, 'LIGHTS',    'Light'),
              btn(2, 'BRIGHT',    'Scene'),
              btn(3, 'DINNER',    'Scene',   { engravingMode: 'text+icon', icon: 'Sunrise' }),
              btn(4, 'AMBIENT',   'Scene'),
              btn(5, 'CHANDELIER','Light'),
              btn(6, 'ALL OFF',   'Master',  { engravingMode: 'text+icon', icon: 'Power' }),
            ],
          },
        ],
      },

      // ── Master Bedroom ───────────────────────────────────────────────────────
      {
        id: generateId(), name: 'Master Bedroom', type: 'Master Bedroom',
        notes: 'Bedside keypads — 1 pair (L+R). Same layout, mirrored positions.',
        order: 2,
        keypads: [
          {
            id: generateId(),
            name: 'Entry Keypad',
            location: 'Entry',
            buttonCount: 4,
            brand: 'Basalte', model: 'Sentido', finish: 'Chime Brown', quantity: 1,
            notes: '',
            buttons: [
              btn(1, 'LIGHTS',   'Light'),
              btn(2, 'RELAX',    'Scene'),
              btn(3, 'CURTAINS', 'Curtain', { engravingMode: 'text+icon', icon: 'ChevronDown' }),
              btn(4, 'ALL OFF',  'Master',  { engravingMode: 'text+icon', icon: 'Power' }),
            ],
          },
          {
            id: generateId(),
            name: 'Bedside — Left',
            location: 'Bedside Left',
            buttonCount: 8,
            brand: 'Basalte', model: 'Sentido', finish: 'Chime Brown', quantity: 1,
            notes: 'His side. Mirror image of Right bedside.',
            buttons: [
              btn(1, 'MORNING',  'Scene',   { engravingMode: 'text+icon', icon: 'Sunrise' }),
              btn(2, 'RELAX',    'Scene'),
              btn(3, 'READING',  'Light',   { engravingMode: 'text+icon', icon: 'BookOpen' }),
              btn(4, 'NIGHT',    'Scene',   { engravingMode: 'text+icon', icon: 'Moon' }),
              btn(5, 'CURTAINS', 'Curtain', { engravingMode: 'text+icon', icon: 'ChevronDown' }),
              btn(6, 'SHEER',    'Curtain'),
              btn(7, 'AC',       'AC',      { engravingMode: 'text+icon', icon: 'Thermometer' }),
              btn(8, 'ALL OFF',  'Master',  { engravingMode: 'text+icon', icon: 'Power' }),
            ],
          },
          {
            id: generateId(),
            name: 'Bedside — Right',
            location: 'Bedside Right',
            buttonCount: 8,
            brand: 'Basalte', model: 'Sentido', finish: 'Chime Brown', quantity: 1,
            notes: 'Her side.',
            buttons: [
              btn(1, 'MORNING',  'Scene',   { engravingMode: 'text+icon', icon: 'Sunrise' }),
              btn(2, 'RELAX',    'Scene'),
              btn(3, 'READING',  'Light',   { engravingMode: 'text+icon', icon: 'BookOpen' }),
              btn(4, 'SLEEP',    'Scene',   { engravingMode: 'text+icon', icon: 'Moon' }),
              btn(5, 'CURTAINS', 'Curtain', { engravingMode: 'text+icon', icon: 'ChevronDown' }),
              btn(6, 'SHEER',    'Curtain'),
              btn(7, 'AC',       'AC',      { engravingMode: 'text+icon', icon: 'Thermometer' }),
              btn(8, 'ALL OFF',  'Master',  { engravingMode: 'text+icon', icon: 'Power' }),
            ],
          },
        ],
      },

      // ── Guest Bedroom ────────────────────────────────────────────────────────
      {
        id: generateId(), name: 'Guest Bedroom', type: 'Guest Bedroom',
        notes: '',
        order: 3,
        keypads: [
          {
            id: generateId(),
            name: 'Entry Keypad',
            location: 'Entry',
            buttonCount: 4,
            brand: 'Basalte', model: 'Sentido', finish: 'Chime Brown', quantity: 1,
            notes: '',
            buttons: [
              btn(1, 'LIGHTS',   'Light'),
              btn(2, 'WELCOME',  'Scene'),
              btn(3, 'CURTAINS', 'Curtain', { engravingMode: 'text+icon', icon: 'ChevronDown' }),
              btn(4, 'ALL OFF',  'Master',  { engravingMode: 'text+icon', icon: 'Power' }),
            ],
          },
          {
            id: generateId(),
            name: 'Bedside Keypad',
            location: 'Bedside Left',
            buttonCount: 4,
            brand: 'Basalte', model: 'Sentido', finish: 'Chime Brown', quantity: 2,
            notes: 'Qty 2 — one on each side of bed.',
            buttons: [
              btn(1, 'READING', 'Light',  { engravingMode: 'text+icon', icon: 'BookOpen' }),
              btn(2, 'SLEEP',   'Scene',  { engravingMode: 'text+icon', icon: 'Moon' }),
              btn(3, 'AC',      'AC',     { engravingMode: 'text+icon', icon: 'Thermometer' }),
              btn(4, 'ALL OFF', 'Master', { engravingMode: 'text+icon', icon: 'Power' }),
            ],
          },
        ],
      },

      // ── Home Theatre ─────────────────────────────────────────────────────────
      {
        id: generateId(), name: 'Home Theatre', type: 'Theatre',
        notes: 'Blackout blinds + projector screen on single controller.',
        order: 4,
        keypads: [
          {
            id: generateId(),
            name: 'Theatre Control',
            location: 'Entry',
            buttonCount: 8,
            brand: 'Basalte', model: 'Sentido', finish: 'Chime Brown', quantity: 1,
            notes: 'Projector and screen drop wired to AV processor.',
            buttons: [
              btn(1, 'MOVIE',     'Scene',   { engravingMode: 'text+icon', icon: 'Film' }),
              btn(2, 'AMBIENT',   'Scene'),
              btn(3, 'BRIGHT',    'Scene'),
              btn(4, 'PROJECTOR', 'Custom',  { notes: 'Triggers projector + screen simultaneously.' }),
              btn(5, 'TV',        'Custom',  { engravingMode: 'text+icon', icon: 'Tv2' }),
              btn(6, 'CURTAINS',  'Curtain', { engravingMode: 'text+icon', icon: 'ChevronDown', notes: 'Blackout only — no sheer in theatre.' }),
              btn(7, 'MUSIC',     'Music',   { engravingMode: 'text+icon', icon: 'Music2' }),
              btn(8, 'ALL OFF',   'Master',  { engravingMode: 'text+icon', icon: 'Power' }),
            ],
          },
        ],
      },

      // ── Kitchen ──────────────────────────────────────────────────────────────
      {
        id: generateId(), name: 'Kitchen', type: 'Kitchen',
        notes: '',
        order: 5,
        keypads: [
          {
            id: generateId(),
            name: 'Kitchen Keypad',
            location: 'Main Wall',
            buttonCount: 6,
            brand: 'Basalte', model: 'Sentido', finish: 'Chime Brown', quantity: 1,
            notes: 'Near service entrance. IP54 rated preferred.',
            buttons: [
              btn(1, 'LIGHTS',  'Light',  { engravingMode: 'text+icon', icon: 'Sun' }),
              btn(2, 'BRIGHT',  'Scene'),
              btn(3, 'AMBIENT', 'Scene'),
              btn(4, 'COVE',    'Light'),
              btn(5, 'SPOTS',   'Light'),
              btn(6, 'ALL OFF', 'Master', { engravingMode: 'text+icon', icon: 'Power' }),
            ],
          },
        ],
      },

      // ── Study ─────────────────────────────────────────────────────────────────
      {
        id: generateId(), name: 'Study', type: 'Study',
        notes: '',
        order: 6,
        keypads: [
          {
            id: generateId(),
            name: 'Study Keypad',
            location: 'Main Wall',
            buttonCount: 4,
            brand: 'Basalte', model: 'Sentido', finish: 'Chime Brown', quantity: 1,
            notes: '',
            buttons: [
              btn(1, 'BRIGHT',  'Scene'),
              btn(2, 'READING', 'Light',  { engravingMode: 'text+icon', icon: 'BookOpen' }),
              btn(3, 'AC',      'AC',     { engravingMode: 'text+icon', icon: 'Thermometer' }),
              btn(4, 'ALL OFF', 'Master', { engravingMode: 'text+icon', icon: 'Power' }),
            ],
          },
        ],
      },

      // ── Outdoor / Terrace ────────────────────────────────────────────────────
      {
        id: generateId(), name: 'Outdoor Terrace', type: 'Outdoor',
        notes: 'All devices must be weatherproof (IP65+).',
        order: 7,
        keypads: [
          {
            id: generateId(),
            name: 'Terrace Keypad',
            location: 'Main Wall',
            buttonCount: 6,
            brand: 'Basalte', model: 'Sentido', finish: 'Chime Brown', quantity: 1,
            notes: 'Weatherproof housing required.',
            buttons: [
              btn(1, 'LIGHTS',   'Light',    { engravingMode: 'text+icon', icon: 'Sun' }),
              btn(2, 'AMBIENT',  'Scene'),
              btn(3, 'PARTY',    'Scene',    { engravingMode: 'text+icon', icon: 'Sparkles' }),
              btn(4, 'DECOR',    'Scene'),
              btn(5, 'SECURITY', 'Security', { engravingMode: 'text+icon', icon: 'ShieldCheck' }),
              btn(6, 'ALL OFF',  'Master',   { engravingMode: 'text+icon', icon: 'Power' }),
            ],
          },
        ],
      },

      // ── Passage / Foyer ──────────────────────────────────────────────────────
      {
        id: generateId(), name: 'Foyer', type: 'Passage',
        notes: 'Main entrance foyer. Motion sensor wired in parallel.',
        order: 8,
        keypads: [
          {
            id: generateId(),
            name: 'Foyer Keypad',
            location: 'Entry',
            buttonCount: 2,
            brand: 'Basalte', model: 'Sentido', finish: 'Chime Brown', quantity: 1,
            notes: '',
            buttons: [
              btn(1, 'WELCOME', 'Scene'),
              btn(2, 'ALL OFF', 'Master', { engravingMode: 'text+icon', icon: 'Power' }),
            ],
          },
        ],
      },

    ],
  };
}
