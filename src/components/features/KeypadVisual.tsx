import { useDroppable } from '@dnd-kit/core';
import { clsx } from 'clsx';
import { MessageSquare, AlertTriangle } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { validateLabel } from '../../lib/labelRules';
import type { Keypad, KeypadButton, TextCase } from '../../types';

interface ButtonCellProps {
  button: KeypadButton;
  textCase: TextCase;
  isActive: boolean;
  onClick: () => void;
  keypadId: string;
}

function ButtonCell({ button, textCase, isActive, onClick, keypadId }: ButtonCellProps) {
  const { setNodeRef, isOver } = useDroppable({ id: `btn-${button.id}-kp-${keypadId}` });
  const handleClick = (e: React.MouseEvent) => { e.stopPropagation(); onClick(); };
  const validation = validateLabel(button.label);
  const displayLabel = textCase === 'uppercase' ? button.label.toUpperCase() : button.label;
  const hasComments = button.comments.some(c => !c.resolved);

  const ACTION_COLORS: Record<string, string> = {
    Scene:    'rgba(99,102,241,0.15)',
    Light:    'rgba(245,158,11,0.12)',
    Curtain:  'rgba(16,185,129,0.12)',
    AC:       'rgba(59,130,246,0.12)',
    Fan:      'rgba(139,143,168,0.08)',
    Music:    'rgba(168,85,247,0.12)',
    Security: 'rgba(239,68,68,0.12)',
    Master:   'rgba(239,68,68,0.15)',
    Custom:   'rgba(255,255,255,0.06)',
    Empty:    'transparent',
  };

  const bgColor = ACTION_COLORS[button.actionType] ?? 'transparent';

  return (
    <div
      ref={setNodeRef}
      onClick={handleClick}
      className={clsx(
        'relative flex items-center justify-center cursor-pointer',
        'border border-[rgba(255,255,255,0.1)] transition-all duration-150 select-none',
        'min-h-[52px] px-2',
        isOver && 'ring-2 ring-[#6366f1] ring-inset bg-[rgba(99,102,241,0.2)]',
        isActive && !isOver && 'ring-2 ring-[#6366f1] ring-inset',
        !isActive && !isOver && 'hover:border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.04)]',
      )}
      style={{ backgroundColor: isOver ? undefined : bgColor }}
    >
      {displayLabel ? (
        <span className="text-[11px] font-semibold tracking-wider text-center leading-tight text-[#f0f1f3]">
          {displayLabel}
        </span>
      ) : (
        <span className="text-[10px] text-[#565a72] font-mono">{button.position}</span>
      )}

      {/* Indicators */}
      <div className="absolute top-1 right-1 flex gap-0.5">
        {validation.error && (
          <AlertTriangle size={9} className="text-[#ef4444]" />
        )}
        {validation.warning && !validation.error && (
          <AlertTriangle size={9} className="text-[#f59e0b]" />
        )}
        {hasComments && (
          <MessageSquare size={9} className="text-[#3b82f6]" />
        )}
      </div>

      {/* Drop hint */}
      {isOver && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[10px] text-[#6366f1] font-medium">Drop here</span>
        </div>
      )}
    </div>
  );
}

interface KeypadVisualProps {
  keypad: Keypad;
  textCase: TextCase;
}

export function KeypadVisual({ keypad, textCase }: KeypadVisualProps) {
  const { activeButtonId, setActiveButton, activeKeypadId, setActiveKeypad } = useStore();
  const isActiveKp = activeKeypadId === keypad.id;

  const rows = keypad.buttonCount / 2;
  const grid = Array.from({ length: rows }, (_, r) =>
    keypad.buttons.slice(r * 2, r * 2 + 2)
  );

  return (
    <div
      className={clsx(
        'card transition-all duration-150',
        isActiveKp ? 'border-[rgba(99,102,241,0.3)]' : 'hover:border-[rgba(255,255,255,0.1)]',
      )}
      onClick={() => setActiveKeypad(keypad.id)}
    >
      {/* Keypad header */}
      <div className="px-4 py-3 border-b border-[rgba(255,255,255,0.06)]">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-[#f0f1f3] truncate">
              {keypad.name || keypad.location || 'Keypad'}
            </p>
            <p className="text-[11px] text-[#565a72] mt-0.5">
              {[keypad.location, keypad.brand, keypad.model].filter(Boolean).join(' · ')}
            </p>
          </div>
          <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded bg-[rgba(255,255,255,0.06)] text-[#8b8fa8] font-mono">
            {keypad.buttonCount}B
          </span>
        </div>
      </div>

      {/* Button grid */}
      <div className="p-3">
        <div
          className="grid overflow-hidden rounded-lg border border-[rgba(255,255,255,0.08)]"
          style={{ gridTemplateColumns: '1fr 1fr', gridTemplateRows: `repeat(${rows}, 1fr)` }}
        >
          {grid.map(row =>
            row.map(btn => (
              <ButtonCell
                key={btn.id}
                button={btn}
                textCase={textCase}
                isActive={activeButtonId === btn.id && isActiveKp}
                keypadId={keypad.id}
                onClick={() => {
                  setActiveKeypad(keypad.id);
                  setActiveButton(btn.id);
                }}
              />
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      {keypad.notes && (
        <div className="px-4 pb-3">
          <p className="text-[11px] text-[#565a72] italic">{keypad.notes}</p>
        </div>
      )}

      {keypad.quantity > 1 && (
        <div className="px-4 pb-3 -mt-1">
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[rgba(255,255,255,0.06)] text-[#565a72]">
            Qty: {keypad.quantity}
          </span>
        </div>
      )}
    </div>
  );
}
