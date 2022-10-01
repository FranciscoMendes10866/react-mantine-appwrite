import { useCallback } from "react";
import { Button } from "@mantine/core";
import { IconPlus, IconX } from "@tabler/icons";

import { useEditor, useFormContext } from "../contexts/Editor";

export const Actions = () => {
  const editor = useEditor();
  const form = useFormContext();

  const handleOnClick = useCallback(() => {
    editor?.toggleEditor();
    const { title, content } = form.values;
    if (title.length && content.length) form.reset();
  }, [editor]);

  return (
    <Button
      size="lg"
      leftIcon={!editor?.showEditor ? <IconPlus /> : <IconX />}
      mx="lg"
      onClick={handleOnClick}
      color={!editor?.showEditor ? "blue" : "gray"}
    >
      {!editor?.showEditor ? "Add Note" : "Cancel"}
    </Button>
  );
};
