// ─── Enums / Literals ─────────────────────────────────────────────────────────

export type ProjectStatus =
  | 'draft'
  | 'shared-with-client'
  | 'changes-requested'
  | 'approved'
  | 'sent-for-engraving';

export type RoomType =
  | 'Living Room' | 'Dining' | 'Master Bedroom' | 'Bedroom'
  | 'Guest Bedroom' | 'Kids Bedroom' | 'Theatre' | 'Lounge'
  | 'Kitchen' | 'Passage' | 'Outdoor' | 'Study' | 'Bathroom' | 'Other';

export type ActionType =
  | 'Scene' | 'Light' | 'Curtain' | 'AC' | 'Fan'
  | 'Music' | 'Security' | 'Master' | 'Custom' | 'Empty';

export type ButtonCount = 2 | 4 | 6 | 8;
export type TextCase = 'uppercase' | 'titlecase';
export type AppView = 'projects' | 'editor' | 'client-view' | 'repository';
export type MobilePanel = 'rooms' | 'editor' | 'library' | 'properties';

// ─── Keypad Repository ────────────────────────────────────────────────────────

export interface KeypadColor {
  id: string;
  name: string;
  hex: string;
}

export interface ButtonLayout {
  rows: number;
  cols: number;
}

export type IndicatorType = 'backlit' | 'side-led' | 'none';
export type EngravingMethod = 'print' | 'laser' | 'pad-print' | 'other';
export type KeypadMaterial = 'metal' | 'plastic' | 'glass' | 'other';

export interface KeypadLayoutFile {
  fileName: string;
  fileType: 'pdf' | 'image' | 'dwg' | 'other';
  dataUrl?: string;
}

export interface KeypadModel {
  id: string;
  brand: string;
  modelNumber: string;
  name: string;
  buttonCount: ButtonCount;
  buttonLayout: ButtonLayout;
  colors: KeypadColor[];
  hasButtonColors: boolean;
  buttonColors: KeypadColor[];
  layoutFile?: KeypadLayoutFile;
  indicator: IndicatorType;
  engravingMethods: EngravingMethod[];
  material: KeypadMaterial;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

// ─── BOQ Change Tracking ──────────────────────────────────────────────────────

export type BOQChangeType = 'added' | 'removed' | 'count-changed' | 'unchanged';

export interface BOQChange {
  type: BOQChangeType;
  entity: 'room' | 'keypad';
  roomId: string;
  roomName: string;
  keypadName?: string;
  boqQty?: number;
  projectQty?: number;
}

export interface BOQRoomSnapshot {
  id: string;
  name: string;
  keypads: Array<{ name: string; qty: number; modelNumber?: string }>;
}

export interface BOQSnapshot {
  snapshotDate: string;
  rooms: BOQRoomSnapshot[];
}

// ─── Settings ─────────────────────────────────────────────────────────────────

export interface GlobalEngravingSettings {
  keypayFinish: string;
  printingColor: string;
  fontStyle: string;
  textCase: TextCase;
  useIcons: boolean;
}

// ─── Button ───────────────────────────────────────────────────────────────────

export interface ButtonComment {
  id: string;
  text: string;
  suggestedChange?: string;
  resolved: boolean;
  author: string;
  createdAt: string;
}

export interface KeypadButton {
  id: string;
  position: number;
  label: string;
  actionType: ActionType;
  icon?: string;
  notes: string;
  comments: ButtonComment[];
}

// ─── Keypad ───────────────────────────────────────────────────────────────────

export interface Keypad {
  id: string;
  name: string;
  location: string;
  buttonCount: ButtonCount;
  buttonLayout?: ButtonLayout;
  brand: string;
  model: string;
  modelId?: string;
  selectedColorId?: string;
  selectedButtonColors?: Record<number, string>;
  selectedEngravingMethod?: EngravingMethod;
  finish: string;
  quantity: number;
  notes: string;
  buttons: KeypadButton[];
  // BOQ change state
  boqChange?: BOQChangeType;
}

// ─── Room ─────────────────────────────────────────────────────────────────────

export interface EngravingRoom {
  id: string;
  name: string;
  type: RoomType;
  notes: string;
  keypads: Keypad[];
  order: number;
  boqChange?: BOQChangeType;
}

// ─── Project ──────────────────────────────────────────────────────────────────

export interface EngravingProject {
  id: string;
  name: string;
  client: string;
  projectCode: string;
  preparedBy: string;
  date: string;
  revision: number;
  globalNotes: string;
  settings: GlobalEngravingSettings;
  rooms: EngravingRoom[];
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
  boqProjectId?: string;
  boqSnapshot?: BOQSnapshot;
}

// ─── Scene Library ────────────────────────────────────────────────────────────

export type SceneCategory = 'Scenes' | 'Actions' | 'Lighting';

export interface SceneLibraryItem {
  id: string;
  label: string;
  category: SceneCategory;
  actionType: ActionType;
}

// ─── BOQ Import Types ─────────────────────────────────────────────────────────

export interface BOQRoom {
  id: string;
  name: string;
  order: number;
}

export interface BOQLineItem {
  id: string;
  scope: string;
  product: string;
  brand: string;
  modelNumber: string;
  specs: string;
  notes: string;
  canonicalKey?: string;
  included: boolean;
  isCustom?: boolean;
  roomAllocations: Array<{ roomId: string; qty: number }>;
}

export interface BOQProject {
  id: string;
  name: string;
  client: string;
  location: string;
  projectCode: string;
  rooms: BOQRoom[];
  lineItems: BOQLineItem[];
}
