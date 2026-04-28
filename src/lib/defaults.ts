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
  { id: 's1', label: 'LIGHTS', category: 'Scenes', actionType: 'Light' },
  { id: 's2', label: 'BRIGHT', category: 'Scenes', actionType: 'Scene' },
  { id: 's3', label: 'AMBIENT', category: 'Scenes', actionType: 'Scene' },
  { id: 's4', label: 'RELAX', category: 'Scenes', actionType: 'Scene' },
  { id: 's5', label: 'LOUNGE', category: 'Scenes', actionType: 'Scene' },
  { id: 's6', label: 'PARTY', category: 'Scenes', actionType: 'Scene' },
  { id: 's7', label: 'DECOR', category: 'Scenes', actionType: 'Scene' },
  { id: 's8', label: 'SLEEP', category: 'Scenes', actionType: 'Scene' },
  { id: 's9', label: 'NIGHT', category: 'Scenes', actionType: 'Scene' },
  { id: 's10', label: 'MOVIE', category: 'Scenes', actionType: 'Scene' },
  { id: 's11', label: 'FAVOURITE', category: 'Scenes', actionType: 'Scene' },
  { id: 's12', label: 'MORNING', category: 'Scenes', actionType: 'Scene' },
  { id: 's13', label: 'EVENING', category: 'Scenes', actionType: 'Scene' },
  { id: 's14', label: 'READING', category: 'Scenes', actionType: 'Light' },
  { id: 's15', label: 'STUDY', category: 'Scenes', actionType: 'Scene' },
  // Actions
  { id: 'a1', label: 'ALL OFF', category: 'Actions', actionType: 'Master' },
  { id: 'a2', label: 'MASTER OFF', category: 'Actions', actionType: 'Master' },
  { id: 'a3', label: 'CURTAINS', category: 'Actions', actionType: 'Curtain' },
  { id: 'a4', label: 'SHEER', category: 'Actions', actionType: 'Curtain' },
  { id: 'a5', label: 'AC', category: 'Actions', actionType: 'AC' },
  { id: 'a6', label: 'FAN', category: 'Actions', actionType: 'Fan' },
  { id: 'a7', label: 'FAN +', category: 'Actions', actionType: 'Fan' },
  { id: 'a8', label: 'FAN -', category: 'Actions', actionType: 'Fan' },
  { id: 'a9', label: 'MUSIC', category: 'Actions', actionType: 'Music' },
  { id: 'a10', label: 'TV', category: 'Actions', actionType: 'Custom' },
  { id: 'a11', label: 'PROJECTOR', category: 'Actions', actionType: 'Custom' },
  { id: 'a12', label: 'SECURITY', category: 'Actions', actionType: 'Security' },
  // Lighting
  { id: 'l1', label: 'COVE', category: 'Lighting', actionType: 'Light' },
  { id: 'l2', label: 'SPOTS', category: 'Lighting', actionType: 'Light' },
  { id: 'l3', label: 'CHANDELIER', category: 'Lighting', actionType: 'Light' },
  { id: 'l4', label: 'WALL WASH', category: 'Lighting', actionType: 'Light' },
  { id: 'l5', label: 'STRIP', category: 'Lighting', actionType: 'Light' },
  { id: 'l6', label: 'FOCUS', category: 'Lighting', actionType: 'Light' },
  { id: 'l7', label: 'PROFILE', category: 'Lighting', actionType: 'Light' },
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
  return {
    id: generateId(),
    name: 'Villa Serenova',
    client: 'Mr. & Mrs. Mehta',
    projectCode: 'BYA-2025-014',
    preparedBy: 'Niket Sarvaiya',
    date: now.slice(0, 10),
    revision: 1,
    globalNotes: 'All keypads color Chime Brown & Printing White Color',
    settings: { ...DEFAULT_SETTINGS },
    status: 'draft',
    createdAt: now,
    updatedAt: now,
    rooms: [
      {
        id: generateId(),
        name: 'Living Room',
        type: 'Living Room',
        notes: '',
        order: 0,
        keypads: [
          {
            id: generateId(),
            name: 'Main Keypad',
            location: 'Entry',
            buttonCount: 8,
            brand: 'Basalte',
            model: 'Sentido',
            finish: 'Chime Brown',
            quantity: 1,
            notes: '',
            buttons: [
              { id: generateId(), position: 1, label: 'LIGHTS', actionType: 'Light', notes: '', comments: [] },
              { id: generateId(), position: 2, label: 'BRIGHT', actionType: 'Scene', notes: '', comments: [] },
              { id: generateId(), position: 3, label: 'AMBIENT', actionType: 'Scene', notes: '', comments: [] },
              { id: generateId(), position: 4, label: 'PARTY', actionType: 'Scene', notes: '', comments: [] },
              { id: generateId(), position: 5, label: 'CURTAINS', actionType: 'Curtain', notes: '', comments: [] },
              { id: generateId(), position: 6, label: 'TV', actionType: 'Custom', notes: '', comments: [] },
              { id: generateId(), position: 7, label: 'MUSIC', actionType: 'Music', notes: '', comments: [] },
              { id: generateId(), position: 8, label: 'ALL OFF', actionType: 'Master', notes: '', comments: [] },
            ],
          },
        ],
      },
      {
        id: generateId(),
        name: 'Master Bedroom',
        type: 'Master Bedroom',
        notes: '',
        order: 1,
        keypads: [
          {
            id: generateId(),
            name: 'Entry Keypad',
            location: 'Entry',
            buttonCount: 4,
            brand: 'Basalte',
            model: 'Sentido',
            finish: 'Chime Brown',
            quantity: 1,
            notes: '',
            buttons: [
              { id: generateId(), position: 1, label: 'LIGHTS', actionType: 'Light', notes: '', comments: [] },
              { id: generateId(), position: 2, label: 'AMBIENT', actionType: 'Scene', notes: '', comments: [] },
              { id: generateId(), position: 3, label: 'CURTAINS', actionType: 'Curtain', notes: '', comments: [] },
              { id: generateId(), position: 4, label: 'ALL OFF', actionType: 'Master', notes: '', comments: [] },
            ],
          },
          {
            id: generateId(),
            name: 'Bedside Keypad',
            location: 'Bedside Left',
            buttonCount: 8,
            brand: 'Basalte',
            model: 'Sentido',
            finish: 'Chime Brown',
            quantity: 1,
            notes: '',
            buttons: [
              { id: generateId(), position: 1, label: 'RELAX', actionType: 'Scene', notes: '', comments: [] },
              { id: generateId(), position: 2, label: 'SLEEP', actionType: 'Scene', notes: '', comments: [] },
              { id: generateId(), position: 3, label: 'READING', actionType: 'Light', notes: '', comments: [] },
              { id: generateId(), position: 4, label: 'NIGHT', actionType: 'Scene', notes: '', comments: [] },
              { id: generateId(), position: 5, label: 'CURTAINS', actionType: 'Curtain', notes: '', comments: [] },
              { id: generateId(), position: 6, label: 'AC', actionType: 'AC', notes: '', comments: [] },
              { id: generateId(), position: 7, label: 'SHEER', actionType: 'Curtain', notes: '', comments: [] },
              { id: generateId(), position: 8, label: 'ALL OFF', actionType: 'Master', notes: '', comments: [] },
            ],
          },
        ],
      },
    ],
  };
}
