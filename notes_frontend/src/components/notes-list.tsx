import { $, component$, useContext } from "@builder.io/qwik";
import { NotesContext } from "~/stores/notes-store";
import type { Note } from "~/services/api";

// PUBLIC_INTERFACE
export default component$(() => {
  /** Notes collection view with toolbar and layout switching. */
  const ctx = useContext(NotesContext);
  const { state } = ctx;

  const items = state.notes;

  const onRefresh$ = ctx.refresh;

  return (
    <section>
      <div class="notes-toolbar">
        <button class="btn" onClick$={onRefresh$}>
          <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.65 6.35A7.95 7.95 0 0012 4V1L7 6l5 5V7c2.76 0 5 2.24 5 5a5 5 0 01-5 5 5 5 0 01-4.9-4H5a7 7 0 006.65 6.95A7 7 0 0019 12c0-1.93-.78-3.68-2.05-4.95z" />
          </svg>
          Refresh
        </button>
        {state.selectedTag && (
          <span class="chip" title="Active tag filter">
            Tag: {state.selectedTag}
          </span>
        )}
        {state.search && (
          <span class="chip" title="Active search">
            Search: “{state.search}”
          </span>
        )}
      </div>

      {state.loading ? (
        <div class="empty">Loading notes…</div>
      ) : items.length === 0 ? (
        <div class="empty">No notes found. Create your first note!</div>
      ) : state.layout === "grid" ? (
        <div class="note-grid">
          {items.map((n) => (
            <NoteCard key={n.id || n.title} note={n} />
          ))}
        </div>
      ) : (
        <div style="display:grid; gap:.5rem;">
          {items.map((n) => (
            <NoteRow key={n.id || n.title} note={n} />
          ))}
        </div>
      )}
    </section>
  );
});

export const NoteCard = component$<{ note: Note }>(({ note }) => {
  const ctx = useContext(NotesContext);

  const onEdit$ = $((n: Note) => ctx.openEdit(n));
  const onDelete$ = $((n: Note) => ctx.removeNote(n));

  const onEdit$ = $(() => ctx.openEdit(note));
  const onDelete$ = $(() => ctx.removeNote(note));

  return (
    <article class="note-card" aria-label={`Note ${note.title}`}>
      <div class="note-title">{note.title || "Untitled"}</div>
      <div class="note-content">
        {note.content ? note.content.slice(0, 280) : "No content"}
        {note.content && note.content.length > 280 ? "…" : ""}
      </div>
      <div class="note-footer">
        <div class="note-tags">
          {(note.tags || []).slice(0, 3).map((t) => (
            <span key={t} class="tag">
              {t}
            </span>
          ))}
        </div>
        <div class="note-actions">
          <button class="btn" onClick$={onEdit$}>Edit</button>
          <button class="btn" onClick$={onDelete$}>Delete</button>
        </div>
      </div>
    </article>
  );
});

export const NoteRow = component$<{ note: Note }>(({ note }) => {
  const ctx = useContext(NotesContext);

  const openEdit$ = $((n: Note) => ctx.openEdit(n));
  const removeNote$ = $((n: Note) => ctx.removeNote(n));

  const onEdit$ = $(() => openEdit$(note));
  const onDelete$ = $(() => removeNote$(note));

  const onEdit$ = $(() => ctx.openEdit(note));
  const onDelete$ = $(() => ctx.removeNote(note));

  return (
    <article
      class="note-card"
      style="display:grid; grid-template-columns: 2fr 5fr auto; align-items:center; gap:.9rem; min-height:auto;"
    >
      <div class="note-title">{note.title || "Untitled"}</div>
      <div class="note-content" style="color:#475569; font-size:.95rem; max-height:3.6em; overflow:hidden;">
        {note.content || "No content"}
      </div>
      <div class="note-actions" style="justify-self:end;">
        <button class="btn" onClick$={onEdit$}>Edit</button>
        <button class="btn" onClick$={onDelete$}>Delete</button>
      </div>
    </article>
  );
});
