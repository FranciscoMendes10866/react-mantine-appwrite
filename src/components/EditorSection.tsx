import { useCallback, MouseEventHandler } from "react";
import { ActionIcon, Box, Input, Space } from "@mantine/core";
import { IconDeviceFloppy, IconTrash } from "@tabler/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { TextEditor } from "../components/TextEditor";
import { useAuth } from "../contexts/Auth";
import {
  ICreateNote,
  IUpdateNote,
  useEditor,
  useFormContext,
} from "../contexts/Editor";

export const EditorSection = () => {
  const editor = useEditor();
  const form = useFormContext();
  const auth = useAuth();
  const queryClient = useQueryClient();

  const { mutateAsync: createMutation } = useMutation(
    async (data: ICreateNote) => {
      return await editor?.createNote(data);
    }
  );

  const { mutateAsync: updateMutation } = useMutation(
    async (data: IUpdateNote) => {
      return await editor?.updateNote(data);
    }
  );

  const { mutateAsync: deleteMutation } = useMutation(
    async (noteId: string) => {
      return await editor?.deleteNote(noteId);
    }
  );

  const handleOnSubmit: MouseEventHandler<HTMLButtonElement> = useCallback(
    async (e) => {
      e.preventDefault();
      if (!editor?.selectedNote) {
        await createMutation({
          ...form.values,
          userId: auth?.currentSession?.$id as string,
        });
        form.reset();
        editor?.toggleEditor();
        queryClient.invalidateQueries(["getNotes/"]);
        return;
      }

      const { title, content } = form.values;
      const { $id, userId } = editor?.selectedNote;
      await updateMutation({
        $id,
        title,
        content,
        userId,
      });
      editor?.handleSelectNote(undefined);
      form.reset();
      editor?.toggleEditor();
      queryClient.invalidateQueries(["getNotes/"]);
    },
    [editor, form, createMutation, updateMutation, queryClient]
  );

  const handleOnDelete: MouseEventHandler<HTMLButtonElement> = useCallback(
    async (e) => {
      e.preventDefault();
      if (editor?.selectedNote) {
        await deleteMutation(editor.selectedNote.$id);
        form.reset();
        editor?.toggleEditor();
        queryClient.invalidateQueries(["getNotes/"]);
        editor?.handleSelectNote(undefined);
      }
    },
    [editor, form, deleteMutation, queryClient]
  );

  return (
    <Box component="form" style={{ width: "calc(100% - 400px)", padding: 20 }}>
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
