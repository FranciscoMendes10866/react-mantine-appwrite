import { useCallback, MouseEventHandler } from "react";
import { ActionIcon, Box, Input, Space } from "@mantine/core";
import { IconDeviceFloppy, IconTrash } from "@tabler/icons";

import { TextEditor } from "../components/TextEditor";
import { useAuth } from "../contexts/Auth";
import { useEditor, useFormContext } from "../contexts/Editor";

export const EditorSection = () => {
  const editor = useEditor();
  const form = useFormContext();
  const auth = useAuth();

  const handleOnSubmit: MouseEventHandler<HTMLButtonElement> = useCallback(
    async (e) => {
      e.preventDefault();
      if (!editor?.selectedNote) {
        await editor?.createNote({
          ...form.values,
          userId: auth?.currentSession?.$id as string,
        });
        form.reset();
        return;
      }

      const { $id, userId } = editor?.selectedNote;
      const { title, content } = form.values;
      await editor?.updateNote({
        $id,
        title,
        content,
        userId: userId as string,
      });
      editor?.handleSelectNote(undefined);
      form.reset();
      editor?.toggleEditor();
    },
    [editor, form]
  );

  const handleOnDelete: MouseEventHandler<HTMLButtonElement> = useCallback(
    async (e) => {
      e.preventDefault();
      if (editor?.selectedNote) {
        await editor.deleteNote(editor?.selectedNote?.$id);
        form.reset();
        editor?.toggleEditor();
      }
    },
    [editor, form]
  );

  return (
    <Box component="div" style={{ width: "calc(100% - 400px)", padding: 20 }}>
      <Box
        component="div"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Input
          variant="unstyled"
          placeholder="Write the title of the note here..."
          size="xl"
          {...form.getInputProps("title")}
        />

        <Box component="div" style={{ display: "flex", alignItems: "center" }}>
          <ActionIcon onClick={handleOnSubmit}>
            <IconDeviceFloppy size={30} />
          </ActionIcon>

          <Space w="sm" />

          <ActionIcon onClick={handleOnDelete}>
            <IconTrash size={30} />
          </ActionIcon>
        </Box>
      </Box>

      <TextEditor {...form.getInputProps("content")} />
    </Box>
  );
};
