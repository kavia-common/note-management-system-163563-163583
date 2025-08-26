export type Note = {
  id?: string;
  title: string;
  content: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
};

export type NoteQuery = {
  search?: string;
  tag?: string;
  folder?: string;
};

const DEFAULT_BASE =
  (import.meta.env.PUBLIC_NOTES_API as string) ||
  (globalThis as any)?.process?.env?.PUBLIC_NOTES_API ||
  "/api"; // Fallback to relative '/api' path. Configure via env at deploy time.

// PUBLIC_INTERFACE
export function getApiBase(): string {
  /** Get the API base URL for the notes backend from env (PUBLIC_NOTES_API). */
  return DEFAULT_BASE;
}

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const base = getApiBase();
  const url = `${base}${path}`;
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${res.status} ${res.statusText}: ${text}`);
  }
  if (res.status === 204) return undefined as unknown as T;
  return (await res.json()) as T;
}

// PUBLIC_INTERFACE
export async function listNotes(query?: NoteQuery): Promise<Note[]> {
  /** List notes with optional query: search, tag, folder. */
  const params = new URLSearchParams();
  if (query?.search) params.set("search", query.search);
  if (query?.tag) params.set("tag", query.tag);
  if (query?.folder) params.set("folder", query.folder);
  const q = params.toString();
  return http<Note[]>(`/notes${q ? `?${q}` : ""}`);
}

// PUBLIC_INTERFACE
export async function getNote(id: string): Promise<Note> {
  /** Fetch a single note by id. */
  return http<Note>(`/notes/${encodeURIComponent(id)}`);
}

// PUBLIC_INTERFACE
export async function createNote(note: Note): Promise<Note> {
  /** Create a new note. */
  return http<Note>("/notes", { method: "POST", body: JSON.stringify(note) });
}

// PUBLIC_INTERFACE
export async function updateNote(id: string, note: Note): Promise<Note> {
  /** Update an existing note. */
  return http<Note>(`/notes/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(note),
  });
}

// PUBLIC_INTERFACE
export async function deleteNote(id: string): Promise<void> {
  /** Delete a note by id. */
  await http<void>(`/notes/${encodeURIComponent(id)}`, { method: "DELETE" });
}
