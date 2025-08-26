import { $, component$, useContext } from "@builder.io/qwik";
import { NotesContext } from "~/stores/notes-store";

// PUBLIC_INTERFACE
export default component$(() => {
  /** App header with brand, search, layout toggle, and new note button. */
  const ctx = useContext(NotesContext);
  const { state } = ctx;

  // Only use $ to read input event value; call ctx method directly in same scope
  const onSearchInput$ = $((e: Event) => {
    const v = (e.target as HTMLInputElement).value;
    // Call without capturing ctx inside another closure
    return ctx.setSearch(v);
  });

  return (
    <header class="app-header">
      <div class="brand" aria-label="Notes">
        <span class="dot" />
        <span>Notes</span>
      </div>
      <div class="header-actions">
        <label class="input" aria-label="Search notes">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            placeholder="Search notes..."
            value={state.search}
            onInput$={onSearchInput$}
          />
        </label>

        <button class="btn" onClick$={ctx.toggleLayout} title="Toggle layout">
          <svg class="icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            {state.layout === "grid" ? (
              <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
            ) : (
              <path d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z" />
            )}
          </svg>
          <span style="display:none">@</span>
        </button>

        <button class="btn primary" onClick$={ctx.openCreate}>
          <svg class="icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M11 11V4h2v7h7v2h-7v7h-2v-7H4v-2h7z" />
          </svg>
          New Note
        </button>
      </div>
    </header>
  );
});
