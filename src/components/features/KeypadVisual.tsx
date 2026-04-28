import { useRef, useEffect } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { clsx } from 'clsx';
import { MessageSquare, AlertTriangle, Plus, Minus } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useRepositoryStore } from '../../store/useRepositoryStore';
import { validateLabel, formatLabel } from '../../lib/labelRules';
import { ICON_MAP } from '../../lib/defaults';
import type { Keypad, KeypadButton, TextCase, EngravingMode } from '../../types';

// ─── Color Utilities ──────────────────────────────────────────────────────────

function getLuminance(hex: string): number {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16) / 255;
  const g = parseInt(h.substring(2, 4), 16) / 255;
  const b = parseInt(h.substring(4, 6), 16) / 255;
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

function isDark(hex: string): boolean {
  return getLuminance(hex) < 0.45;
}

function shiftBrightness(hex: string, amount: number): string {
  const h = hex.replace('#', '');
  const r = Math.min(255, Math.max(0, parseInt(h.substring(0, 2), 16) + amount));
  const g = Math.min(255, Math.max(0, parseInt(h.substring(2, 4), 16) + amount));
  const b = Math.min(255, Math.max(0, parseInt(h.substring(4, 6), 16) + amount));
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}

function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// When no body color is set, use action-type colors for visual context
const ACTION_BG: Record<string, string> = {
  Scene:    'rgba(99,102,241,0.18)',
  Light:    'rgba(245,158,11,0.14)',
  Curtain:  'rgba(16,185,129,0.14)',
  AC:       'rgba(59,130,246,0.14)',
  Fan:      'rgba(139,143,168,0.1)',
  Music:    'rgba(168,85,247,0.14)',
  Security: 'rgba(239,68,68,0.14)',
  Master:   'rgba(239,68,68,0.18)',
  Custom:   'rgba(255,255,255,0.07)',
  Empty:    'transparent',
};

// ─── ButtonCell ───────────────────────────────────────────────────────────────

interface ButtonCellProps {
  button: KeypadButton;
  textCase: TextCase;
  isActive: boolean;
  onClick: () => void;
  keypadId: string;
  /** Individual override hex for this button's color */
  buttonColorHex?: string;
  /** The keypad body color — drives button shade + text contrast */
  bodyHex?: string;
  /** Printing/engraving color (pre-computed contrast color) */
  printColor: string;
}

function ButtonCell({
  button, textCase, isActive, onClick, keypadId,
  buttonColorHex, bodyHex, printColor,
}: ButtonCellProps) {
  const { setNodeRef, isOver } = useDroppable({ id: `btn-${button.id}-kp-${keypadId}` });
  const { activeProjectId, activeRoomId, updateButton } = useStore();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isActive) requestAnimationFrame(() => inputRef.current?.focus());
  }, [isActive]);

  const handleClick = (e: React.MouseEvent) => { e.stopPropagation(); onClick(); };

  const handleLabelChange = (raw: string) => {
    if (!activeProjectId || !activeRoomId) return;
    updateButton(activeProjectId, activeRoomId, keypadId, button.id, {
      label: formatLabel(raw, textCase),
    });
  };

  const validation = validateLabel(button.label);
  const displayLabel = textCase === 'uppercase' ? button.label.toUpperCase() : button.label;
  const hasComments = button.comments.some(c => !c.resolved);
  const mode: EngravingMode = button.engravingMode ?? 'text';
  const IconComponent = button.icon ? ICON_MAP[button.icon] : null;

  // ── Compute button cell appearance ──
  let cellBg: string;
  let cellBorder: string;
  let activeBorder: string;

  if (bodyHex) {
    // Physical keypad mode: buttons are slightly raised/inset shade of body color
    const btnBase = buttonColorHex ?? (isDark(bodyHex)
      ? shiftBrightness(bodyHex, 28)   // lighter on dark body
      : shiftBrightness(bodyHex, -22)  // darker on light body
    );
    cellBg = btnBase;
    cellBorder = isDark(bodyHex) ? hexToRgba('#ffffff', 0.12) : hexToRgba('#000000', 0.18);
    activeBorder = isDark(bodyHex) ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.7)';
  } else {
    // Dark-theme mode: action-type color tints
    cellBg = buttonColorHex
      ? hexToRgba(buttonColorHex, 0.18)
      : (ACTION_BG[button.actionType] ?? 'transparent');
    cellBorder = 'rgba(255,255,255,0.08)';
    activeBorder = '#6366f1';
  }

  const textColor = bodyHex ? printColor : '#f0f1f3';
  return (
    <div
      ref={setNodeRef}
      onClick={handleClick}
      className={clsx(
        'relative flex flex-col items-center justify-center cursor-pointer select-none',
        'transition-all duration-100',
        'min-h-[54px] px-2 py-1.5',
      )}
      style={{
        backgroundColor: isOver ? (bodyHex ? hexToRgba(shiftBrightness(bodyHex, isDark(bodyHex) ? 50 : -40), 0.9) : 'rgba(99,102,241,0.25)') : cellBg,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: isActive ? activeBorder : (isOver ? 'transparent' : cellBorder),
        outline: isActive ? `2px solid ${activeBorder}` : 'none',
        outlineOffset: isActive ? '-2px' : '0',
      }}
    >
      {/* Inline label editor when active */}
      {isActive ? (
        <input
          ref={inputRef}
          value={button.label}
          onChange={e => handleLabelChange(e.target.value)}
          onKeyDown={e => { if (e.key === 'Escape') e.currentTarget.blur(); }}
          onMouseDown={e => e.stopPropagation()}
          onClick={e => e.stopPropagation()}
          maxLength={16}
          placeholder="Label…"
          className="w-full bg-transparent text-center text-[11px] font-semibold tracking-wider outline-none font-mono"
          style={{ color: textColor, caretColor: textColor }}
        />
      ) : (
        <div className="flex flex-col items-center gap-0.5 pointer-events-none">
          {IconComponent && (mode === 'icon' || mode === 'text+icon') && (
            <IconComponent
              size={mode === 'icon' ? 16 : 11}
              style={{ color: textColor, opacity: 0.9 }}
            />
          )}
          {(mode === 'text' || mode === 'text+icon') && displayLabel ? (
            <span
              className="text-[10px] font-semibold tracking-wider text-center leading-tight"
              style={{ color: textColor }}
            >
              {displayLabel}
            </span>
          ) : !IconComponent && (
            <span
              className="text-[9px] font-mono"
              style={{ color: bodyHex ? hexToRgba(printColor, 0.2) : '#3a3d52' }}
            >
              {button.position}
            </span>
          )}
        </div>
      )}

      {/* Status indicators */}
      <div className="absolute top-0.5 right-0.5 flex gap-0.5">
        {validation.error && <AlertTriangle size={8} className="text-[#ef4444]" />}
        {validation.warning && !validation.error && <AlertTriangle size={8} className="text-[#f59e0b]" />}
        {hasComments && <MessageSquare size={8} className="text-[#3b82f6]" />}
      </div>

      {isOver && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-[9px] font-bold" style={{ color: textColor }}>DROP</span>
        </div>
      )}
    </div>
  );
}

// ─── KeypadVisual ─────────────────────────────────────────────────────────────

interface KeypadVisualProps {
  keypad: Keypad;
  textCase: TextCase;
}

export function KeypadVisual({ keypad, textCase }: KeypadVisualProps) {
  const {
    activeButtonId, activeKeypadId, setActiveKeypad, setActiveButton,
    activeProjectId, activeRoomId, updateKeypad,
  } = useStore();
  const { getModel } = useRepositoryStore();

  const isActiveKp = activeKeypadId === keypad.id;
  const model = keypad.modelId ? getModel(keypad.modelId) : undefined;

  // Resolve body color
  const bodyColor = model?.colors.find(c => c.id === keypad.selectedColorId);
  const bodyHex = bodyColor?.hex ?? undefined;

  // Auto-compute print color: white on dark bodies, dark on light bodies
  const printColor = bodyHex
    ? (isDark(bodyHex) ? '#FFFFFF' : '#1a1a1a')
    : '#f0f1f3';

  // Per-button color overrides
  const buttonColorMap: Record<number, string> = {};
  if (keypad.selectedButtonColors) {
    for (const [pos, hex] of Object.entries(keypad.selectedButtonColors)) {
      buttonColorMap[Number(pos)] = hex;
    }
  }

  const cols = keypad.buttonLayout?.cols ?? 2;
  const rows = Math.ceil(keypad.buttonCount / cols);
  const grid = Array.from({ length: rows }, (_, r) =>
    keypad.buttons.slice(r * cols, r * cols + cols)
  );

  const boqChange = keypad.boqChange;

  // Card appearance driven by body color
  const cardBg = bodyHex ?? '#0f1117';
  const headerBg = bodyHex
    ? shiftBrightness(bodyHex, isDark(bodyHex) ? -18 : 18)
    : '#0f1117';
  const headerText = bodyHex ? printColor : '#f0f1f3';
  const headerSubtext = bodyHex
    ? hexToRgba(printColor, 0.45)
    : '#565a72';
  const cardBorder = isActiveKp
    ? (bodyHex ? hexToRgba(shiftBrightness(bodyHex, isDark(bodyHex) ? 80 : -80), 0.9) : 'rgba(99,102,241,0.5)')
    : boqChange === 'added'    ? 'rgba(16,185,129,0.5)'
    : boqChange === 'removed'  ? 'rgba(239,68,68,0.5)'
    : boqChange === 'count-changed' ? 'rgba(245,158,11,0.5)'
    : bodyHex
      ? hexToRgba(shiftBrightness(bodyHex, isDark(bodyHex) ? 40 : -40), 0.5)
      : 'rgba(255,255,255,0.07)';

  // Divider between header and grid
  const dividerColor = bodyHex
    ? hexToRgba(isDark(bodyHex) ? '#ffffff' : '#000000', 0.12)
    : 'rgba(255,255,255,0.06)';

  return (
    <div
      className="rounded-xl overflow-hidden transition-all duration-150 cursor-pointer"
      style={{ backgroundColor: cardBg, border: `1.5px solid ${cardBorder}` }}
      onClick={() => setActiveKeypad(keypad.id)}
    >
      {/* ── Header info strip ── */}
      <div
        className="px-3 py-2.5"
        style={{ backgroundColor: headerBg, borderBottom: `1px solid ${dividerColor}` }}
      >
        <div className="flex items-center gap-2">
          {/* Color swatch if no full-color render */}
          {!bodyHex && keypad.finish && (
            <div className="w-3 h-3 rounded-full border border-[rgba(255,255,255,0.2)] shrink-0 bg-[rgba(255,255,255,0.15)]" />
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <p className="text-[12px] font-semibold truncate leading-tight" style={{ color: headerText }}>
                {keypad.name || keypad.location || 'Keypad'}
              </p>
              {boqChange === 'added' && (
                <span className="shrink-0 text-[9px] px-1 py-0.5 rounded bg-[rgba(16,185,129,0.2)] text-[#10b981] font-medium">NEW</span>
              )}
              {boqChange === 'count-changed' && (
                <span className="shrink-0 text-[9px] px-1 py-0.5 rounded bg-[rgba(245,158,11,0.2)] text-[#f59e0b] font-medium">QTY</span>
              )}
            </div>
            <p className="text-[10px] truncate leading-tight mt-0.5" style={{ color: headerSubtext }}>
              {[
                keypad.location,
                bodyColor?.name ?? (keypad.finish || null),
                (keypad.brand && keypad.model) ? `${keypad.brand} ${keypad.model}` : null,
              ].filter(Boolean).join(' · ')}
            </p>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <span
              className="text-[9px] px-1.5 py-0.5 rounded font-mono"
              style={{
                backgroundColor: bodyHex ? hexToRgba(isDark(bodyHex) ? '#ffffff' : '#000000', 0.12) : 'rgba(255,255,255,0.06)',
                color: headerSubtext,
              }}
            >
              {keypad.buttonCount}B
            </span>
            {keypad.quantity > 1 && (
              <span
                className="text-[9px] px-1.5 py-0.5 rounded font-semibold"
                style={{
                  backgroundColor: bodyHex ? hexToRgba(isDark(bodyHex) ? '#ffffff' : '#000000', 0.15) : 'rgba(99,102,241,0.15)',
                  color: bodyHex ? headerText : '#6366f1',
                }}
              >
                ×{keypad.quantity}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Physical button grid ── */}
      <div className="p-3" style={{ backgroundColor: cardBg }}>
        <div
          className="grid overflow-hidden"
          style={{
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            borderRadius: 8,
            gap: bodyHex ? 2 : 0,
            padding: bodyHex ? 0 : 0,
            outline: bodyHex ? `2px solid ${hexToRgba(isDark(bodyHex) ? '#ffffff' : '#000000', 0.1)}` : undefined,
          }}
        >
          {grid.map(row =>
            row.map(btn => (
              <ButtonCell
                key={btn.id}
                button={btn}
                textCase={textCase}
                isActive={activeButtonId === btn.id && isActiveKp}
                keypadId={keypad.id}
                buttonColorHex={buttonColorMap[btn.position]}
                bodyHex={bodyHex}
                printColor={printColor}
                onClick={() => {
                  setActiveKeypad(keypad.id);
                  setActiveButton(btn.id);
                }}
              />
            ))
          )}
        </div>
      </div>

      {/* ── Quick controls strip (active keypad only) ── */}
      {isActiveKp && activeProjectId && activeRoomId && (
        <div
          className="px-3 pb-2.5 pt-0 flex items-center gap-2"
          style={{ backgroundColor: headerBg }}
          onClick={e => e.stopPropagation()}
        >
          <p className="text-[10px] mr-auto" style={{ color: headerSubtext }}>Qty</p>
          <button
            onClick={() => updateKeypad(activeProjectId, activeRoomId, keypad.id, { quantity: Math.max(1, keypad.quantity - 1) })}
            className="w-5 h-5 flex items-center justify-center rounded transition-colors"
            style={{
              border: `1px solid ${dividerColor}`,
              color: headerSubtext,
            }}
          >
            <Minus size={9} />
          </button>
          <span className="text-[12px] font-bold w-5 text-center" style={{ color: headerText }}>
            {keypad.quantity}
          </span>
          <button
            onClick={() => updateKeypad(activeProjectId, activeRoomId, keypad.id, { quantity: keypad.quantity + 1 })}
            className="w-5 h-5 flex items-center justify-center rounded transition-colors"
            style={{
              border: `1px solid ${dividerColor}`,
              color: headerSubtext,
            }}
          >
            <Plus size={9} />
          </button>
        </div>
      )}

      {keypad.notes && (
        <div className="px-3 pb-2" style={{ backgroundColor: headerBg }}>
          <p className="text-[10px] italic" style={{ color: headerSubtext }}>{keypad.notes}</p>
        </div>
      )}
    </div>
  );
}
