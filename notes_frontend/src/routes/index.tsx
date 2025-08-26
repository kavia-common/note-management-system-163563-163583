import { component$, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { useNotesProvider } from "~/stores/notes-store";
import Header from "~/components/header";
import Sidebar from "~/components/sidebar";
import NotesList from "~/components/notes-list";
import NoteEditor from "~/components/note-editor";

// PUBLIC_INTERFACE
export default component$(() => {
  /** Main notes application route with app shell and content. */
  const { refresh } = useNotesProvider();

  useVisibleTask$(async () => {
    // Initial load on client mount
    await refresh();
  });

  return (
    <div class="app-shell">
      <Header />
      <Sidebar />
      <div class="content">
        <NotesList />
      </div>

      <NoteEditor />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Notes",
  meta: [
    {
      name: "description",
      content: "Minimalistic notes management app",
    },
  ],
};
