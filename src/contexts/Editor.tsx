import { createContext, FC, useCallback, useContext, useState } from "react";
import { Models } from "appwrite";
import shortid from "shortid";
import { useBoolean } from "usehooks-ts";
import { createFormContext, joiResolver } from "@mantine/form";
import Joi from "joi";

import { appwrite } from "../utils";

export interface ICreateNote {
  title: string;
  content: string;
  userId: string;
}

export interface IUpdateNote extends ICreateNote {
  $id: string;
}

interface IEditorContext {
  createNote: (data: ICreateNote) => Promise<Models.Document>;
  updateNote: (data: IUpdateNote) => Promise<Models.Document>;
  deleteNote: (noteId: string) => Promise<void>;
  showEditor: boolean;
  toggleEditor: () => void;
  selectedNote?: Models.Document;
  handleSelectNote: (note?: Models.Document) => void;
}

export interface IFormEditorValues {
  title: string;
  content: string;
}

const EditorContext = createContext<IEditorContext | null>(null);
const useEditor = () => useContext(EditorContext);

const [FormProvider, useFormContext, useForm] =
  createFormContext<IFormEditorValues>();

export const DATABASE_ID = "63382c204cd2171035ba";
export const COLLECTION_ID = "63382c259dcd3c03ddc9";

interface Props {
  children?: React.ReactNode;
}

const schema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
});

export const EditorProvider: FC<Props> = ({ children }) => {
  const { value: showEditor, toggle: toggleEditor } = useBoolean(false);
  const [selectedNote, setSelectedNote] = useState<Models.Document | undefined>(
    undefined
  );

  const createNote = useCallback(async (data: ICreateNote) => {
    return await appwrite.databases.createDocument(
      DATABASE_ID,
      COLLECTION_ID,
      shortid(),
      data
    );
  }, []);

  const updateNote = useCallback(async (data: IUpdateNote) => {
    const { $id, ...rest } = data;
    return await appwrite.databases.updateDocument(
      DATABASE_ID,
      COLLECTION_ID,
      $id,
      rest
    );
  }, []);

  const deleteNote = useCallback(async (noteId: string) => {
    await appwrite.databases.deleteDocument(DATABASE_ID, COLLECTION_ID, noteId);
  }, []);

  const handleSelectNote = useCallback(
    (note?: Models.Document) => {
      setSelectedNote(note);
    },
    [setSelectedNote]
  );

  const form = useForm({
    validate: joiResolver(schema),
    initialValues: {
      title: "",
      content: "",
    },
  });

  return (
    <EditorContext.Provider
      value={{
        createNote,
        deleteNote,
        updateNote,
        showEditor,
        toggleEditor,
        selectedNote,
        handleSelectNote,
      }}
    >
      <FormProvider form={form}>{children}</FormProvider>
    </EditorContext.Provider>
  );
};

export { useFormContext, useEditor };
