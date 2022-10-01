import { Box } from "@mantine/core";

import { SideBar } from "../components/Sidebar";
import { NoteList } from "../components/NoteList";
import { EditorSection } from "../components/EditorSection";

import { useEditor } from "../contexts/Editor";

export const Editor = () => {
  const editor = useEditor();

  return (
    <Box
      component="div"
      style={{
        display: "flex",
        width: "100%",
        height: "100vh",
      }}
    >
      <SideBar />
      <NoteList />
      {editor?.showEditor && <EditorSection />}
    </Box>
  );
};
