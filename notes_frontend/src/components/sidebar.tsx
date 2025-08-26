import { $, component$, useContext } from "@builder.io/qwik";
import { NotesContext } from "~/stores/notes-store";

// PUBLIC_INTERFACE
export default component$(() => {
  /** Sidebar with filters (all notes, favorites placeholder), tags and folders. */
  const ctx = useContext(NotesContext);
  const { state } = ctx;

  // Parameterized setters
  const setTag$ = $((t?: string) => ctx.setTag(t));
  const setFolder$ = $((f?: string) => ctx.setFolder(f));

  // In a real app, tags/folders would be fetched. Here we infer from notes.
  const tagSet = new Set<string>();
  const folderSet = new Set<string>(); // Placeholder for future folder support

  state.notes.forEach((n) => {
    (n.tags || []).forEach((t) => tagSet.add(t));
  });

  const tags = Array.from(tagSet).sort();
  const folders = Array.from(folderSet).sort();

  return (
    <aside class="sidebar">
      <div class="section-title">Browse</div>
      <ul class="nav-list">
        <li>
          <a
            href="#"
            class={`nav-item ${!state.selectedTag && !state.selectedFolder ? "active" : ""}`}
            onClick$={$((e: Event) => {
              e.preventDefault();
              return setTag$(undefined).then(() => setFolder$(undefined));
            })}
          >
            <svg class="icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M3 5h18v2H3V5zm0 6h18v2H3v-2zm0 6h18v2H3v-2z" />
            </svg>
            All notes
          </a>
        </li>
      </ul>

      <div class="section-title">Tags</div>
      <div style="display:flex; gap:.4rem; flex-wrap:wrap; padding:.25rem;">
        {tags.length === 0 ? (
          <span class="muted" style="color:var(--muted); font-size:.9rem;">No tags yet</span>
        ) : (
          tags.map((t) => {
            const active = state.selectedTag === t;
            return (
              <button
                key={t}
                class="chip"
                onClick$={$(() => setTag$(active ? undefined : t))}
                style={active ? "border-color:#cbd5e1; background:#eef2ff;" : ""}
              >
                <svg class="icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M20.59 13.41l-7-7A2 2 0 0012.17 6H5v7.17a2 2 0 00.59 1.41l7 7a2 2 0 002.82 0l5.18-5.18a2 2 0 000-2.82zM7 8h4v2H7V8z" />
                </svg>
                {t}
              </button>
            );
          })
        )}
      </div>

      <div class="section-title">Folders</div>
      <ul class="nav-list">
        {folders.length === 0 ? (
          <li style="padding:.25rem .6rem; color:var(--muted); font-size:.9rem;">No folders</li>
        ) : (
          folders.map((f) => {
            const active = state.selectedFolder === f;
            return (
              <li key={f}>
                <a
                  href="#"
                  class={`nav-item ${active ? "active" : ""}`}
                  onClick$={$((e: Event) => {
                    e.preventDefault();
                    return setFolder$(active ? undefined : f);
                  })}
                >
                  <svg class="icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M10 4l2 2h8a2 2 0 012 2v1H2V6a2 2 0 012-2h6zm12 6v8a2 2 0 01-2 2H4a2 2 0 01-2-2v-8h20z" />
                  </svg>
                  {f}
                </a>
              </li>
            );
          })
        )}
      </ul>
    </aside>
  );
});
