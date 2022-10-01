import { RichTextEditor } from "@mantine/rte";
import { useUncontrolled } from "@mantine/hooks";
import { FC } from "react";

interface Props {
  value: string;
  defaultValue: string;
  onChange: (value: string) => void;
}

export const TextEditor: FC<Partial<Props>> = ({
  value,
  defaultValue = "",
  onChange,
}) => {
  const [_value, handleChange] = useUncontrolled<string>({
    value,
    defaultValue,
    onChange,
  });

  return (
    <RichTextEditor
      id="rte"
      value={_value}
      onChange={handleChange}
      style={{ height: "calc(100% - 65px)" }}
    />
  );
};
