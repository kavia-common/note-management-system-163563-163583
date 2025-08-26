import { $, component$, useContext, useSignal } from "@builder.io/qwik";
import { NotesContext } from "~/stores/notes-store";
import type { Note } from "~/services/api";

// PUBLIC_INTERFACE
export default component$(() => {
  /** Modal for creating or editing a note. */
  const ctx = useContext(NotesContext);
  const { state } = ctx;

  const title = useSignal(state.editing?.title || "");
  const content = useSignal(state.editing?.content || "");
  const tagsInput = useSignal((state.editing?.tags || []).join(", "));

  if (!state.showEditor) return null;

  const isEdit = !!state.editing?.id;

  const buildPayload$ = $((): Note => {
    return {
      ...(state.editing || {}),
      title: title.value.trim(),
      content: content.value,
      tags: tagsInput.value
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };
  });

  return (
    <div class="modal-backdrop" role="dialog" aria-modal="true">
      <div class="modal">
        <div class="modal-header">
          <strong>{isEdit ? "Edit Note" : "New Note"}</strong>
          <button class="btn" onClick$={ctx.closeEditor}>Close</button>
        </div>
        <div class="modal-body">
          <div class="field">
            <label html-for="title">Title</label>
            <input
              id="title"
              placeholder="Note title"
              value={title.value}
              onInput$={(e) => (title.value = (e.target as HTMLInputElement).value)}
            />
          </div>
          <div class="field">
            <label html-for="content">Content</label>
            <textarea
              id="content"
              placeholder="Write your note..."
              value={content.value}
              onInput$={(e) => (content.value = (e.target as HTMLTextAreaElement).value)}
            />
          </div>
          <div class="field">
            <label html-for="tags">Tags (comma-separated)</label>
            <input
              id="tags"
              placeholder="e.g. work, personal"
              value={tagsInput.value}
              onInput$={(e) => (tagsInput.value = (e.target as HTMLInputElement).value)}
            />
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn" onClick$={ctx.closeEditor}>Cancel</button>
          <button
            class="btn primary"
            onClick$={$(() => buildPayload$().then((payload) => ctx.saveNote(payload)))}
          >
            {isEdit ? "Save Changes" : "Create Note"}
          </button>
        </div>
      </div>
    </div>
  );
});
