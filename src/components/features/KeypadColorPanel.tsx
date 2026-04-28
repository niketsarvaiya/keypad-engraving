import { useStore } from '../../store/useStore';
import { useRepositoryStore } from '../../store/useRepositoryStore';

export function KeypadColorPanel() {
  const { activeProjectId, activeRoomId, activeKeypadId, activeKeypad, updateKeypad } = useStore();
  const { getModel } = useRepositoryStore();

  const keypad = activeKeypad();
  const model = keypad?.modelId ? getModel(keypad.modelId) : undefined;

  if (!keypad || !activeProjectId || !activeRoomId || !activeKeypadId) {
    return (
      <div className="flex flex-col items-center justify-center h-32 px-4 text-center">
        <p className="text-[12px] text-[#565a72]">Select a keypad to configure its finish and colors.</p>
      </div>
    );
  }

  const patch = (data: Parameters<typeof updateKeypad>[3]) =>
    updateKeypad(activeProjectId, activeRoomId, activeKeypadId, data);

  return (
    <div className="flex flex-col gap-0 overflow-y-auto scrollbar-thin h-full">
      {/* Header */}
      <div className="px-3 py-3 border-b border-[rgba(255,255,255,0.06)]">
        <p className="label mb-0">{keypad.name || keypad.location || 'Keypad'}</p>
        {model && <p className="text-[11px] text-[#565a72] mt-0.5">{model.brand} · {model.modelNumber}</p>}
      </div>

      <div className="px-3 py-3 flex flex-col gap-4">
        {/* Body color */}
        {model && model.colors.length > 0 && (
          <div>
            <p className="label mb-2">Keypad Color</p>
            <div className="flex flex-wrap gap-2">
              {model.colors.map(c => (
                <button
                  key={c.id}
                  onClick={() => patch({ selectedColorId: c.id, finish: c.name })}
                  title={c.name}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-[11px] font-medium transition-all ${
                    keypad.selectedColorId === c.id
                      ? 'border-[rgba(99,102,241,0.5)] bg-[rgba(99,102,241,0.1)] text-[#f0f1f3]'
                      : 'border-[rgba(255,255,255,0.08)] text-[#8b8fa8] hover:border-[rgba(255,255,255,0.15)]'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full border border-[rgba(255,255,255,0.2)] shrink-0" style={{ backgroundColor: c.hex }} />
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Per-button colors */}
        {model?.hasButtonColors && model.buttonColors.length > 0 && (
          <div>
            <p className="label mb-2">Button Colors</p>
            <div className="flex flex-col gap-2">
              {keypad.buttons.map(btn => (
                <div key={btn.id} className="flex items-center gap-2">
                  <span className="text-[11px] text-[#565a72] w-14 shrink-0">Btn {btn.position}</span>
                  <div className="flex flex-wrap gap-1.5">
                    {model.buttonColors.map(c => {
                      const selectedHex = keypad.selectedButtonColors?.[btn.position];
                      const isSelected = selectedHex === c.hex;
                      return (
                        <button
                          key={c.id}
                          onClick={() => patch({
                            selectedButtonColors: { ...(keypad.selectedButtonColors ?? {}), [btn.position]: c.hex },
                          })}
                          title={c.name}
                          className={`w-6 h-6 rounded-full border-2 transition-all ${
                            isSelected ? 'border-[#6366f1] scale-110' : 'border-[rgba(255,255,255,0.12)] hover:border-[rgba(255,255,255,0.3)]'
                          }`}
                          style={{ backgroundColor: c.hex }}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Engraving method */}
        {model && model.engravingMethods.length > 0 && (
          <div>
            <p className="label mb-2">Engraving Method</p>
            <div className="flex flex-wrap gap-2">
              {model.engravingMethods.map(m => (
                <button
                  key={m}
                  onClick={() => patch({ selectedEngravingMethod: m })}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium border capitalize transition-all ${
                    keypad.selectedEngravingMethod === m
                      ? 'bg-[rgba(99,102,241,0.12)] border-[rgba(99,102,241,0.3)] text-[#6366f1]'
                      : 'border-[rgba(255,255,255,0.08)] text-[#565a72] hover:text-[#8b8fa8] hover:border-[rgba(255,255,255,0.15)]'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Manual finish (no model linked) */}
        {!model && (
          <div>
            <p className="label mb-2">Finish / Color</p>
            <input
              className="input-field"
              value={keypad.finish}
              onChange={e => patch({ finish: e.target.value })}
              placeholder="e.g. Chime Brown"
            />
          </div>
        )}

        {/* Quantity */}
        <div>
          <p className="label mb-2">Quantity</p>
          <div className="flex items-center gap-2">
            <button onClick={() => patch({ quantity: Math.max(1, keypad.quantity - 1) })}
              className="w-8 h-8 rounded-lg border border-[rgba(255,255,255,0.08)] text-[#8b8fa8] hover:bg-[rgba(255,255,255,0.06)] flex items-center justify-center text-lg transition-colors">−</button>
            <span className="w-10 text-center text-[14px] font-semibold text-[#f0f1f3]">{keypad.quantity}</span>
            <button onClick={() => patch({ quantity: keypad.quantity + 1 })}
              className="w-8 h-8 rounded-lg border border-[rgba(255,255,255,0.08)] text-[#8b8fa8] hover:bg-[rgba(255,255,255,0.06)] flex items-center justify-center text-lg transition-colors">+</button>
          </div>
        </div>

        {/* Notes */}
        <div>
          <p className="label mb-2">Notes</p>
          <textarea className="input-field resize-none" rows={2} value={keypad.notes}
            onChange={e => patch({ notes: e.target.value })} placeholder="Notes about this keypad..." />
        </div>
      </div>
    </div>
  );
}
