import React from "react";
import { useDropzone } from "react-dropzone";
import { Button, Box } from "bumbag";
import { useCallback } from "react";

const readFile = (file: File): Promise<ArrayBuffer> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onabort = (event: any) => {
      resolve(event.target.result);
    };
    reader.onload = (event: any) => {
      resolve(event.target.result);
    };

    reader.onerror = (event: any) => {
      reject(event.target.error);
    };

    reader.readAsArrayBuffer(file);
  });

const useFileUpload = (onUpload: any) =>
  useCallback(
    async (acceptedFiles: File[]) => {
      const data = await Promise.all(
        (Array.from(acceptedFiles) as File[]).map(readFile),
      );
      const result = data.map((d, index) => ({
        data: d,
        fileBlob: acceptedFiles[index],
      }));
      onUpload(result);
    },
    [onUpload],
  );

export type TUploadArg = {
  data: ArrayBuffer;
  fileBlob: File;
};
type Props = {
  onUpload: (arg: TUploadArg[]) => void;
  disabled: boolean;
};
const FileUpload: React.FC<Props> = ({ onUpload, disabled }) => {
  const onDrop = useFileUpload(onUpload);
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    maxSize: 100 * 1024 * 1024, // 100 MB
  });

  return (
    <Box {...getRootProps()}>
      <input {...getInputProps()} disabled={disabled} />
      <Button
        margin="0"
        paddingX="major-3"
        paddingY="major-5"
        textAlign="center"
        palette="secondary"
        whiteSpace="normal"
        wordBreak="break-word"
        borderStyle="dashed"
        borderColor="background"
        borderWidth="2px"
        borderRadius="4"
        isLoading={disabled}
      >
        Drag 'n' drop a file here, or click to select files
      </Button>
    </Box>
  );
};

export default FileUpload;
