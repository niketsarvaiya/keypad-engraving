import { useState } from 'react';
import { MessageSquare, CheckCircle, AlertTriangle, Type, Image, Layers } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { validateLabel, formatLabel } from '../../lib/labelRules';
import { ACTION_TYPES, ICON_LIBRARY, ICON_MAP } from '../../lib/defaults';
import { FormField } from '../ui/FormField';
import type { ActionType, EngravingMode } from '../../types';

const ACTION_COLORS: Record<ActionType, string> = {
  Scene:    'text-[#6366f1]',
  Light:    'text-[#f59e0b]',
  Curtain:  'text-[#10b981]',
  AC:       'text-[#3b82f6]',
  Fan:      'text-[#8b8fa8]',
  Music:    'text-[#a855f7]',
  Security: 'text-[#ef4444]',
  Master:   'text-[#ef4444]',
  Custom:   'text-[#f0f1f3]',
  Empty:    'text-[#565a72]',
};

const MODE_OPTIONS: { id: EngravingMode; Icon: typeof Type; label: string; short: string }[] = [
  { id: 'text',      Icon: Type,   label: 'Text only',   short: 'Text' },
  { id: 'icon',      Icon: Image,  label: 'Icon only',   short: 'Icon' },
  { id: 'text+icon', Icon: Layers, label: 'Text + Icon', short: 'Both' },
];

export function ButtonProperties() {
  const {
    activeProjectId, activeRoomId, activeKeypadId, activeButtonId,
    activeProject, activeButton, updateButton, addComment,
  } = useStore();

  const project = activeProject();
  const button = activeButton();
  const [commentText, setCommentText] = useState('');
  const [suggestedChange, setSuggestedChange] = useState('');
  const [showCommentForm, setShowCommentForm] = useState(false);

  if (!button || !activeProjectId || !activeRoomId || !activeKeypadId || !activeButtonId) {
    return (
      <div className="flex flex-col items-center justify-center h-40 px-4 text-center gap-2">
        <div className="w-8 h-8 rounded-full border border-[rgba(255,255,255,0.08)] flex items-center justify-center">
          <Type size={14} className="text-[#565a72]" />
        </div>
        <p className="text-[12px] text-[#565a72]">Click any button on a keypad to edit it inline or configure here.</p>
      </div>
    );
  }

  const validation = validateLabel(button.label);
  const textCase = project?.settings.textCase ?? 'uppercase';
  const mode: EngravingMode = button.engravingMode ?? 'text';

  const patch = (data: Parameters<typeof updateButton>[4]) =>
    updateButton(activeProjectId, activeRoomId, activeKeypadId, activeButtonId, data);

  const handleLabelChange = (raw: string) => {
    patch({ label: formatLabel(raw, textCase) });
  };

  const submitComment = () => {
    if (!commentText.trim()) return;
    addComment(activeProjectId, activeRoomId, activeKeypadId, activeButtonId, {
      text: commentText.trim(),
      suggestedChange: suggestedChange.trim() || undefined,
      resolved: false,
      author: project?.preparedBy || 'Team',
    });
    setCommentText('');
    setSuggestedChange('');
    setShowCommentForm(false);
  };

  const unresolvedComments = button.comments.filter(c => !c.resolved);
  const resolvedComments = button.comments.filter(c => c.resolved);

  return (
    <div className="flex flex-col gap-0 overflow-y-auto scrollbar-thin h-full">
      {/* Header */}
      <div className="px-3 py-2.5 border-b border-[rgba(255,255,255,0.06)]">
        <p className="text-[11px] font-semibold text-[#f0f1f3]">Button {button.position}</p>
        <p className="text-[10px] text-[#565a72] mt-0.5 font-mono">
          {button.label || '—'}{button.icon ? ` · ${button.icon}` : ''}
        </p>
      </div>

      <div className="px-3 py-3 flex flex-col gap-3.5">

        {/* ── Engraving Mode ── */}
        <div>
          <p className="label mb-1.5">Engraving Type</p>
          <div className="flex gap-1.5">
            {MODE_OPTIONS.map(({ id, Icon, label, short }) => (
              <button
                key={id}
                onClick={() => patch({ engravingMode: id })}
                title={label}
                className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-lg border text-[10px] font-medium transition-all ${
                  mode === id
                    ? 'bg-[rgba(99,102,241,0.15)] border-[rgba(99,102,241,0.4)] text-[#6366f1]'
                    : 'border-[rgba(255,255,255,0.07)] text-[#565a72] hover:text-[#8b8fa8] hover:border-[rgba(255,255,255,0.12)]'
                }`}
              >
                <Icon size={13} />
                {short}
              </button>
            ))}
          </div>
        </div>

        {/* ── Label (shown for text + text+icon modes) ── */}
        {(mode === 'text' || mode === 'text+icon') && (
          <FormField label="Engraving Label">
            <input
              className="input-field font-mono tracking-wider"
              value={button.label}
              onChange={e => handleLabelChange(e.target.value)}
              placeholder="e.g. LIGHTS"
              maxLength={16}
              autoFocus
            />
            {validation.error && (
              <p className="flex items-center gap-1 text-[10px] text-[#ef4444] mt-1">
                <AlertTriangle size={9} /> {validation.error}
              </p>
            )}
            {validation.warning && !validation.error && (
              <p className="flex items-center gap-1 text-[10px] text-[#f59e0b] mt-1">
                <AlertTriangle size={9} /> {validation.warning}
              </p>
            )}
            {button.label && !validation.error && !validation.warning && (
              <p className="text-[10px] text-[#10b981] mt-1">✓ Engraving safe</p>
            )}
          </FormField>
        )}

        {/* ── Icon Picker (shown for icon + text+icon modes) ── */}
        {(mode === 'icon' || mode === 'text+icon') && (
          <div>
            <p className="label mb-1.5">Icon</p>
            <div className="grid grid-cols-6 gap-1">
              {ICON_LIBRARY.map(item => {
                const IconComp = ICON_MAP[item.lucide];
                if (!IconComp) return null;
                const isSelected = button.icon === item.lucide;
                return (
                  <button
                    key={item.id}
                    onClick={() => patch({ icon: isSelected ? undefined : item.lucide })}
                    title={item.label}
                    className={`flex items-center justify-center w-full aspect-square rounded-lg border transition-all ${
                      isSelected
                        ? 'bg-[rgba(99,102,241,0.2)] border-[rgba(99,102,241,0.5)] text-[#6366f1]'
                        : 'border-[rgba(255,255,255,0.07)] text-[#565a72] hover:border-[rgba(255,255,255,0.15)] hover:text-[#8b8fa8]'
                    }`}
                  >
                    <IconComp size={13} />
                  </button>
                );
              })}
            </div>
            {button.icon && (
              <p className="text-[10px] text-[#565a72] mt-1.5">
                Selected: {ICON_LIBRARY.find(i => i.lucide === button.icon)?.label ?? button.icon}
              </p>
            )}
          </div>
        )}

        {/* ── Action Type ── */}
        <FormField label="Action Type">
          <div className="flex flex-wrap gap-1">
            {ACTION_TYPES.filter(t => t !== 'Empty').map(type => (
              <button
                key={type}
                onClick={() => patch({ actionType: type as ActionType })}
                className={`px-2 py-1 rounded text-[10px] font-medium border transition-all ${
                  button.actionType === type
                    ? `border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.07)] ${ACTION_COLORS[type as ActionType]}`
                    : 'border-[rgba(255,255,255,0.06)] text-[#565a72] hover:border-[rgba(255,255,255,0.1)] hover:text-[#8b8fa8]'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </FormField>

        {/* ── Notes ── */}
        <FormField label="Internal Notes">
          <textarea
            className="input-field resize-none"
            rows={2}
            value={button.notes}
            onChange={e => patch({ notes: e.target.value })}
            placeholder="Internal note..."
          />
        </FormField>
      </div>

      {/* ── Comments ── */}
      <div className="border-t border-[rgba(255,255,255,0.06)] px-3 py-3">
        <div className="flex items-center justify-between mb-2">
          <p className="label mb-0">Comments</p>
          <button
            onClick={() => setShowCommentForm(!showCommentForm)}
            className="text-[10px] text-[#6366f1] hover:underline"
          >
            + Add
          </button>
        </div>

        {showCommentForm && (
          <div className="mb-3 flex flex-col gap-2 p-2 rounded-lg bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)]">
            <textarea
              className="input-field resize-none"
              rows={2}
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              placeholder="Comment..."
              autoFocus
            />
            <input
              className="input-field"
              value={suggestedChange}
              onChange={e => setSuggestedChange(e.target.value)}
              placeholder="Suggested label change (optional)"
            />
            <div className="flex gap-2">
              <button
                onClick={submitComment}
                className="flex-1 py-1.5 rounded bg-[#6366f1] hover:bg-[#4f52e0] text-white text-[10px] font-medium transition-colors"
              >
                Post
              </button>
              <button
                onClick={() => setShowCommentForm(false)}
                className="px-2 py-1.5 rounded hover:bg-[rgba(255,255,255,0.06)] text-[#565a72] text-[10px] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {unresolvedComments.map(c => (
          <CommentItem
            key={c.id}
            comment={c}
            onResolve={() => {
              const { resolveComment } = useStore.getState();
              resolveComment(activeProjectId, activeRoomId, activeKeypadId, activeButtonId, c.id);
            }}
          />
        ))}

        {resolvedComments.length > 0 && (
          <p className="text-[10px] text-[#565a72] mt-1.5">
            {resolvedComments.length} resolved
          </p>
        )}

        {button.comments.length === 0 && !showCommentForm && (
          <p className="text-[10px] text-[#565a72]">No comments.</p>
        )}
      </div>
    </div>
  );
}

function CommentItem({
  comment,
  onResolve,
}: {
  comment: { id: string; text: string; suggestedChange?: string; resolved: boolean; author: string; createdAt: string };
  onResolve: () => void;
}) {
  return (
    <div className="mb-2 p-2 rounded-lg bg-[rgba(59,130,246,0.06)] border border-[rgba(59,130,246,0.12)]">
      <div className="flex items-start justify-between gap-1">
        <div className="flex items-center gap-1 mb-1">
          <MessageSquare size={9} className="text-[#3b82f6] shrink-0" />
          <span className="text-[9px] text-[#8b8fa8]">{comment.author}</span>
        </div>
        <button onClick={onResolve} className="text-[#10b981] hover:opacity-80" title="Resolve">
          <CheckCircle size={12} />
        </button>
      </div>
      <p className="text-[11px] text-[#f0f1f3]">{comment.text}</p>
      {comment.suggestedChange && (
        <p className="text-[10px] text-[#f59e0b] mt-0.5">→ {comment.suggestedChange}</p>
      )}
    </div>
  );
}
