import { useCallback } from "react";
import { Box, Input, Title, Space, ActionIcon } from "@mantine/core";
import { IconRefresh, IconSearch } from "@tabler/icons";
import { useQuery } from "@tanstack/react-query";
import { Models, Query } from "appwrite";

import { Actions } from "./Actions";

import { useAuth } from "../contexts/Auth";
import {
  DATABASE_ID,
  COLLECTION_ID,
  useEditor,
  useFormContext,
} from "../contexts/Editor";

import { appwrite } from "../utils";

export const NoteList = () => {
  const auth = useAuth();
  const editor = useEditor();
  const form = useFormContext();

  const apiRequest = useCallback(async () => {
    return await appwrite.databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("userId", auth?.currentSession?.$id),
    ]);
  }, [auth]);

  const { data, refetch } = useQuery(["getNotes/"], apiRequest);

  const handleOnSelect = useCallback(
    (item: Models.Document) => {
      if (editor?.selectedNote?.$id === item?.$id) {
        if (editor?.showEditor) editor?.toggleEditor();
        editor?.handleSelectNote(undefined);
        form.reset();
        return;
      }
      if (!editor?.showEditor) {
        editor?.toggleEditor();
      }
      editor?.handleSelectNote(item);
      const { title, content } = item;
      form.setValues({ title, content });
    },
    [editor, form]
  );

  const handleRefetch = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return (
    <Box
      component="div"
      sx={(theme) => ({
        display: "flex",
        flexDirection: "column",
        backgroundColor: theme.colors.gray[1],
        width: 400,
        height: "100%",
      })}
    >
      <Box
        component="div"
        style={{
          display: "flex",
          alignItems: "center",
          padding: "20px 20px 0px 20px",
          justifyContent: "space-between",
        }}
      >
        <Title>Editor</Title>
        <ActionIcon onClick={handleRefetch}>
          <IconRefresh size={25} />
        </ActionIcon>
      </Box>
      <Space h="xl" />

      <Input
        size="lg"
        mx="lg"
        icon={<IconSearch size={16} />}
        placeholder="Search..."
      />
      <Space h="xl" />

      <Actions />

      <Box component="div" style={{ marginTop: 15, overflow: "auto" }}>
        {data?.documents.map((elm, elmIndex) => (
          <Box
            key={`note-item-${elmIndex}`}
            component="div"
            style={{
              padding: "15px 20px 15px 20px",
            }}
            onClick={() => handleOnSelect(elm)}
          >
            <Title order={2}>{elm?.title}</Title>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
