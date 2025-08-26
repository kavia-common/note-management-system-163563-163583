import { $, useComputed$, useContextProvider, useStore, createContextId } from "@builder.io/qwik";
import type { Note, NoteQuery } from "~/services/api";
import { listNotes, createNote, updateNote, deleteNote } from "~/services/api";

export type NotesState = {
  notes: Note[];
  loading: boolean;
  error?: string;
  search: string;
  selectedTag?: string;
  selectedFolder?: string;

  // UI state
  showEditor: boolean;
  editing?: Note | null;
  layout: "grid" | "list";
};

export const NotesContext = createContextId<{
  state: NotesState;
  // PUBLIC_INTERFACE
  refresh: () => Promise<void>;
  // PUBLIC_INTERFACE
  openCreate: () => void;
  // PUBLIC_INTERFACE
  openEdit: (n: Note) => void;
  // PUBLIC_INTERFACE
  closeEditor: () => void;
  // PUBLIC_INTERFACE
  saveNote: (data: Note) => Promise<void>;
  // PUBLIC_INTERFACE
  removeNote: (n: Note) => Promise<void>;
  // PUBLIC_INTERFACE
  setSearch: (q: string) => Promise<void>;
  // PUBLIC_INTERFACE
  setTag: (t?: string) => Promise<void>;
  // PUBLIC_INTERFACE
  setFolder: (f?: string) => Promise<void>;
  // PUBLIC_INTERFACE
  toggleLayout: () => void;
}>("notes.context");

export function useNotesProvider() {
  const state = useStore<NotesState>({
    notes: [],
    loading: false,
    error: undefined,
    search: "",
    selectedTag: undefined,
    selectedFolder: undefined,
    showEditor: false,
    editing: null,
    layout: "grid",
  });

  const buildQuery = useComputed$<NoteQuery>(() => ({
    search: state.search || undefined,
    tag: state.selectedTag || undefined,
    folder: state.selectedFolder || undefined,
  }));

  const refresh = $(async () => {
    state.loading = true;
    state.error = undefined;
    try {
      const notes = await listNotes(buildQuery.value);
      state.notes = notes;
    } catch (e: any) {
      state.error = e?.message || "Failed to load notes";
    } finally {
      state.loading = false;
    }
  });

  const openCreate = $(() => {
    state.editing = { title: "", content: "", tags: [] };
    state.showEditor = true;
  });

  const openEdit = $((n: Note) => {
    state.editing = { ...n };
    state.showEditor = true;
  });

  const closeEditor = $(() => {
    state.editing = null;
    state.showEditor = false;
  });

  const saveNote = $(async (data: Note) => {
    state.loading = true;
    try {
      if (data.id) {
        await updateNote(data.id, data);
      } else {
        await createNote(data);
      }
      await refresh();
      state.showEditor = false;
      state.editing = null;
    } catch (e: any) {
      state.error = e?.message || "Failed to save note";
    } finally {
      state.loading = false;
    }
  });

  const removeNote = $(async (n: Note) => {
    if (!n.id) return;
    const ok = typeof window !== "undefined" ? window.confirm("Delete this note?") : true;
    if (!ok) return;
    state.loading = true;
    try {
      await deleteNote(n.id);
      await refresh();
    } catch (e: any) {
      state.error = e?.message || "Failed to delete note";
    } finally {
      state.loading = false;
    }
  });

  const setSearch = $(async (q: string) => {
    state.search = q;
    await refresh();
  });

  const setTag = $(async (t?: string) => {
    state.selectedTag = t;
    await refresh();
  });

  const setFolder = $(async (f?: string) => {
    state.selectedFolder = f;
    await refresh();
  });

  const toggleLayout = $(() => {
    state.layout = state.layout === "grid" ? "list" : "grid";
  });

  useContextProvider(NotesContext, {
    state,
    refresh,
    openCreate,
    openEdit,
    closeEditor,
    saveNote,
    removeNote,
    setSearch,
    setTag,
    setFolder,
    toggleLayout,
  });

  return { state, refresh };
}
