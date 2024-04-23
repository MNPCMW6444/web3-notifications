import { TextField } from "@mui/material";
import { TODO, format } from "@w3notif/shared";
import { ChangeEvent, useCallback, useRef } from "react";

interface Options {
  label: string;
  multiline: boolean;
  number: boolean;
  customMinRows: number;
}

function useDebounce(callback: any, delay: any) {
  const timer: any = useRef();

  const debouncedCallback = useCallback(
    (...args: any[]) => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
      timer.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [delay, callback],
  ); // Dependencies

  return debouncedCallback;
}

export const renderTextField = <T,>(
  formState: T,
  handleChange: (
    name: keyof T | string[],
    value: string | Date | boolean,
  ) => void,
  path: string[] | keyof T,
  optionalParams: Partial<Options> = {},
) => {
  let value: string | number = formState as TODO;
  let finalKey: string;
  if ((path as TODO)[0].length !== 1) {
    (path as string[]).forEach((key) => {
      value = value && (value as TODO)[key];
    });
    finalKey = (path as TODO)[(path as TODO).length - 1];
  } else {
    value = formState[path as keyof T] as TODO;
    finalKey = path as string;
  }

  const options = {
    ...{
      label: format(finalKey),
      multiline: false,
      number: false,
      customMinRows: 2,
    },
    ...optionalParams,
  };

  const debouncedHandleChange = useDebounce((newValue: any) => {
    handleChange(path, newValue);
  }, 300); // 300 ms debounce delay

  return (
    <TextField
      multiline={options.multiline}
      fullWidth={options.multiline}
      minRows={options.multiline ? options.customMinRows : undefined}
      variant="outlined"
      label={options.label}
      value={formState ? value : ""}
      onChange={(e: ChangeEvent<HTMLInputElement>) => {
        debouncedHandleChange(e.target.value);
      }}
      name={finalKey}
      type={options.number ? "number" : undefined}
    />
  );
};
