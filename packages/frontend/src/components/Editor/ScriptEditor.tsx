import { useCallback, useId } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Underline from '@tiptap/extension-underline';
import { usePrompterStore } from '../../store/prompterStore';
import type { ScriptSegment } from '../../types';
import './ScriptEditor.css';

interface ScriptEditorProps {
  segment: ScriptSegment;
  isFirst: boolean;
  isLast: boolean;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

const TIPTAP_EXTENSIONS = [
  StarterKit,
  TextStyle,
  Color,
  Underline,
];

/**
 * ScriptEditor
 *
 * Rich-text editor for a single script segment.
 * - Left-to-right (LTR) Latin scripts only
 * - Changes are written back to the Zustand store
 * - The store update does NOT interrupt the PrompterDisplay scroll
 *   (separate rendering tree) — satisfying the "hot-update while scrolling"
 *   requirement of the Professional tier
 */
export function ScriptEditor({ segment, isFirst, isLast, onDelete, onMoveUp, onMoveDown }: ScriptEditorProps) {
  const updateSegment = usePrompterStore((s) => s.updateSegment);
  const labelId = useId();

  const editor = useEditor(
    {
      extensions: TIPTAP_EXTENSIONS,
      content: segment.html,
      onUpdate: ({ editor: ed }: { editor: { getHTML: () => string } }) => {
        // Debounce is NOT needed: Zustand writes are O(1) and the prompter
        // canvas only reads the store on next animation frame
        updateSegment(segment.id, { html: ed.getHTML() });
      },
      editorProps: {
        attributes: {
          class: 'script-editor-content',
          'aria-labelledby': labelId,
          'data-segment-id': segment.id,
          dir: segment.direction,
          spellcheck: 'true',
        },
      },
    },
    [segment.id], // recreate editor when switching segments
  );

  const toggleCloaked = useCallback(() => {
    updateSegment(segment.id, { isCloaked: !segment.isCloaked });
  }, [segment.id, segment.isCloaked, updateSegment]);

  const toggleDirectorsNote = useCallback(() => {
    updateSegment(segment.id, {
      isDirectorsNote: !segment.isDirectorsNote,
    });
  }, [segment.id, segment.isDirectorsNote, updateSegment]);

  if (!editor) return null;

  return (
    <div
      className={[
        'script-editor',
        segment.isCloaked ? 'script-editor--cloaked' : '',
        segment.isDirectorsNote ? 'script-editor--directors-note' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* ─── Toolbar ─────────────────────────────────────────────────────── */}
      <div className="script-editor-toolbar" role="toolbar" aria-label="Text formatting">
        {/* Bold */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'active' : ''}
          aria-label="Bold"
          title="Bold (Ctrl+B)"
        >
          <strong>B</strong>
        </button>

        {/* Italic */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'active' : ''}
          aria-label="Italic"
          title="Italic (Ctrl+I)"
        >
          <em>I</em>
        </button>

        {/* Underline */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editor.isActive('underline') ? 'active' : ''}
          aria-label="Underline"
          title="Underline (Ctrl+U)"
        >
          <span style={{ textDecoration: 'underline' }}>U</span>
        </button>

        <div className="toolbar-separator" aria-hidden="true" />

        {/* Segment order & delete */}
        <button
          type="button"
          onClick={onMoveUp}
          disabled={isFirst}
          aria-label="Move segment up"
          title="Move up"
          className="move-btn"
        >
          ▲
        </button>

        <button
          type="button"
          onClick={onMoveDown}
          disabled={isLast}
          aria-label="Move segment down"
          title="Move down"
          className="move-btn"
        >
          ▼
        </button>

        <button
          type="button"
          onClick={onDelete}
          aria-label="Delete segment"
          title="Delete segment"
          className="delete-btn"
        >
          🗑
        </button>

        <div className="toolbar-separator" aria-hidden="true" />

        {/* Professional tier features */}
        <button
          type="button"
          onClick={toggleCloaked}
          className={['cloak-btn', segment.isCloaked ? 'active' : '']
            .filter(Boolean)
            .join(' ')}
          aria-label={segment.isCloaked ? 'Show text' : 'Cloak (hide from presenter)'}
          title="Cloak text (Professional)"
        >
          {segment.isCloaked ? '👁' : '🚫👁'}
        </button>

        <button
          type="button"
          onClick={toggleDirectorsNote}
          className={['dir-note-btn', segment.isDirectorsNote ? 'active' : '']
            .filter(Boolean)
            .join(' ')}
          aria-label="Mark as director's note (ASR will skip)"
          title="Director's note (Expert)"
        >
          📝
        </button>
      </div>

      {/* ─── Editor area ─────────────────────────────────────────────────── */}
      <EditorContent
        editor={editor}
        id={labelId}
      />

      {segment.isCloaked && (
        <div className="cloaked-badge" aria-label="Cloaked segment">
          CLOAKED — not visible to presenter
        </div>
      )}
    </div>
  );
}
