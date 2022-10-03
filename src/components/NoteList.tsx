import { ChangeEvent, useCallback, useMemo, useState } from "react";
import { Box, Input, Title, Space, ActionIcon } from "@mantine/core";
import { IconRefresh, IconSearch } from "@tabler/icons";
import { useQuery } from "@tanstack/react-query";
import { Models, Query } from "appwrite";
import { useDebounce } from "usehooks-ts"

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
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedValue = useDebounce<string>(searchTerm, 250)

  const auth = useAuth();
  const editor = useEditor();
  const form = useFormContext();

  const { data, refetch } = useQuery(["getNotes/"], async () => {
    return await appwrite.databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("userId", auth?.currentSession?.$id),
    ]);
  });

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

  const filteredNotes = useMemo(
    () =>
      data?.documents.filter((elm) => elm?.title.includes(debouncedValue)) ?? [],
    [data, debouncedValue]
  );

  const handleOnChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setSearchTerm(value);
    },
    [setSearchTerm]
  );

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
        onChange={handleOnChange}
      />
      <Space h="xl" />

      <Actions />

      <Box component="div" style={{ marginTop: 15, overflow: "auto" }}>
        {filteredNotes.map((elm, elmIndex) => (
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
