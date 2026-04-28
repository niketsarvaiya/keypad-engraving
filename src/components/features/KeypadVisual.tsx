import { useRef, useEffect } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { clsx } from 'clsx';
import { MessageSquare, AlertTriangle, Plus, Minus, Edit3 } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useRepositoryStore } from '../../store/useRepositoryStore';
import { validateLabel, formatLabel } from '../../lib/labelRules';
import { ICON_MAP } from '../../lib/defaults';
import type { Keypad, KeypadButton, TextCase, EngravingMode } from '../../types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// ─── ButtonCell ───────────────────────────────────────────────────────────────

interface ButtonCellProps {
  button: KeypadButton;
  textCase: TextCase;
  isActive: boolean;
  onClick: () => void;
  keypadId: string;
  buttonColorHex?: string;
}

function ButtonCell({ button, textCase, isActive, onClick, keypadId, buttonColorHex }: ButtonCellProps) {
  const { setNodeRef, isOver } = useDroppable({ id: `btn-${button.id}-kp-${keypadId}` });
  const { activeProjectId, activeRoomId, updateButton } = useStore();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isActive) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [isActive]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick();
  };

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

  const baseBg = buttonColorHex
    ? hexToRgba(buttonColorHex, 0.18)
    : (ACTION_BG[button.actionType] ?? 'transparent');

  return (
    <div
      ref={setNodeRef}
      onClick={handleClick}
      className={clsx(
        'relative flex flex-col items-center justify-center cursor-pointer group/btn',
        'border border-[rgba(255,255,255,0.08)] transition-all duration-150 select-none',
        'min-h-[54px] px-2 py-1.5',
        isOver && 'ring-2 ring-[#6366f1] ring-inset',
        isActive && !isOver && 'ring-2 ring-[#6366f1] ring-inset bg-[rgba(99,102,241,0.06)]',
        !isActive && !isOver && 'hover:border-[rgba(255,255,255,0.18)]',
      )}
      style={{ backgroundColor: isActive ? undefined : (isOver ? 'rgba(99,102,241,0.15)' : baseBg) }}
    >
      {/* Inline label editor when active */}
      {isActive ? (
        <input
          ref={inputRef}
          value={button.label}
          onChange={e => handleLabelChange(e.target.value)}
          onKeyDown={e => { if (e.key === 'Escape') { e.currentTarget.blur(); } }}
          onMouseDown={e => e.stopPropagation()}
          onClick={e => e.stopPropagation()}
          maxLength={16}
          placeholder="Label…"
          className="w-full bg-transparent text-center text-[11px] font-semibold tracking-wider text-[#f0f1f3] outline-none placeholder-[#565a72] font-mono"
        />
      ) : (
        <div className="flex flex-col items-center gap-0.5 pointer-events-none">
          {/* Icon */}
          {IconComponent && (mode === 'icon' || mode === 'text+icon') && (
            <IconComponent
              size={mode === 'icon' ? 16 : 12}
              className="text-[#f0f1f3] opacity-90"
            />
          )}
          {/* Text */}
          {(mode === 'text' || mode === 'text+icon') && displayLabel ? (
            <span className="text-[10px] font-semibold tracking-wider text-center leading-tight text-[#f0f1f3]">
              {displayLabel}
            </span>
          ) : !IconComponent && (
            <span className="text-[9px] text-[#3a3d52] font-mono">{button.position}</span>
          )}
        </div>
      )}

      {/* Status indicators top-right */}
      <div className="absolute top-1 right-1 flex gap-0.5">
        {validation.error && <AlertTriangle size={8} className="text-[#ef4444]" />}
        {validation.warning && !validation.error && <AlertTriangle size={8} className="text-[#f59e0b]" />}
        {hasComments && <MessageSquare size={8} className="text-[#3b82f6]" />}
      </div>

      {/* Drop hint */}
      {isOver && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-[9px] text-[#6366f1] font-medium">Drop</span>
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
  const { activeButtonId, activeKeypadId, setActiveKeypad, setActiveButton, activeProjectId, activeRoomId, updateKeypad } = useStore();
  const { getModel } = useRepositoryStore();

  const isActiveKp = activeKeypadId === keypad.id;
  const model = keypad.modelId ? getModel(keypad.modelId) : undefined;

  // Resolve actual body color hex
  const bodyColor = model?.colors.find(c => c.id === keypad.selectedColorId);
  const bodyHex = bodyColor?.hex;

  // Resolve per-button color hexes from model's buttonColors
  const buttonColorMap: Record<number, string> = {};
  if (keypad.selectedButtonColors && model?.buttonColors) {
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

  return (
    <div
      className={clsx(
        'rounded-xl border transition-all duration-150 overflow-hidden',
        isActiveKp
          ? 'border-[rgba(99,102,241,0.4)] shadow-[0_0_0_1px_rgba(99,102,241,0.15)]'
          : 'border-[rgba(255,255,255,0.07)] hover:border-[rgba(255,255,255,0.12)]',
        boqChange === 'added' && 'border-[rgba(16,185,129,0.4)]',
        boqChange === 'removed' && 'border-[rgba(239,68,68,0.4)]',
        boqChange === 'count-changed' && 'border-[rgba(245,158,11,0.4)]',
      )}
      style={bodyHex ? { backgroundColor: hexToRgba(bodyHex, 0.04) } : { backgroundColor: 'rgba(15,17,23,1)' }}
      onClick={() => setActiveKeypad(keypad.id)}
    >
      {/* ── Header ── */}
      <div
        className="px-3 py-2.5 border-b border-[rgba(255,255,255,0.06)]"
        style={bodyHex ? { borderBottomColor: hexToRgba(bodyHex, 0.2) } : undefined}
      >
        <div className="flex items-center gap-2">
          {/* Body color swatch */}
          {bodyHex && (
            <div
              className="w-3.5 h-3.5 rounded-full border border-[rgba(255,255,255,0.2)] shrink-0"
              style={{ backgroundColor: bodyHex }}
              title={bodyColor?.name}
            />
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-[12px] font-semibold text-[#f0f1f3] truncate leading-tight">
                {keypad.name || keypad.location || 'Keypad'}
              </p>
              {boqChange === 'added' && (
                <span className="shrink-0 text-[9px] px-1 py-0.5 rounded bg-[rgba(16,185,129,0.15)] text-[#10b981] font-medium">NEW</span>
              )}
              {boqChange === 'count-changed' && (
                <span className="shrink-0 text-[9px] px-1 py-0.5 rounded bg-[rgba(245,158,11,0.15)] text-[#f59e0b] font-medium">QTY</span>
              )}
            </div>
            <p className="text-[10px] text-[#565a72] truncate leading-tight mt-0.5">
              {[keypad.location, bodyColor?.name ?? keypad.finish, keypad.brand && keypad.model ? `${keypad.brand} ${keypad.model}` : null]
                .filter(Boolean).join(' · ')}
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-[rgba(255,255,255,0.05)] text-[#565a72] font-mono">
              {keypad.buttonCount}B
            </span>
            {keypad.quantity > 1 && (
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-[rgba(99,102,241,0.1)] text-[#6366f1] font-medium">
                ×{keypad.quantity}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Button Grid ── */}
      <div className="p-2.5">
        <div
          className="grid overflow-hidden rounded-lg border border-[rgba(255,255,255,0.07)]"
          style={{
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 1fr)`,
            borderColor: bodyHex ? hexToRgba(bodyHex, 0.25) : undefined,
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
                onClick={() => {
                  setActiveKeypad(keypad.id);
                  setActiveButton(btn.id);
                }}
              />
            ))
          )}
        </div>
      </div>

      {/* ── Quick quantity control (visible on hover / when active) ── */}
      {isActiveKp && activeProjectId && activeRoomId && (
        <div
          className="px-3 pb-2.5 flex items-center justify-between gap-2"
          onClick={e => e.stopPropagation()}
        >
          <p className="text-[10px] text-[#565a72]">Qty</p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => updateKeypad(activeProjectId, activeRoomId, keypad.id, { quantity: Math.max(1, keypad.quantity - 1) })}
              className="w-5 h-5 flex items-center justify-center rounded border border-[rgba(255,255,255,0.08)] text-[#565a72] hover:text-[#f0f1f3] hover:border-[rgba(255,255,255,0.2)] transition-colors"
            >
              <Minus size={10} />
            </button>
            <span className="text-[12px] font-semibold text-[#f0f1f3] w-5 text-center">{keypad.quantity}</span>
            <button
              onClick={() => updateKeypad(activeProjectId, activeRoomId, keypad.id, { quantity: keypad.quantity + 1 })}
              className="w-5 h-5 flex items-center justify-center rounded border border-[rgba(255,255,255,0.08)] text-[#565a72] hover:text-[#f0f1f3] hover:border-[rgba(255,255,255,0.2)] transition-colors"
            >
              <Plus size={10} />
            </button>
          </div>
          <p className="text-[10px] text-[#565a72] truncate max-w-[80px]">{bodyColor?.name ?? keypad.finish}</p>
          <Edit3 size={11} className="text-[#565a72]" />
        </div>
      )}

      {keypad.notes && (
        <div className="px-3 pb-2">
          <p className="text-[10px] text-[#565a72] italic">{keypad.notes}</p>
        </div>
      )}
    </div>
  );
}
