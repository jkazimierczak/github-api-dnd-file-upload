import { useCallback } from "react";
import { DropEvent, FileRejection, useDropzone } from "react-dropzone";

function App() {
  const onDrop = useCallback(
    (
      acceptedFiles: File[],
      fileRejections: FileRejection[],
      event: DropEvent,
    ) => {
      console.log(acceptedFiles);

      acceptedFiles.forEach((file) => {
        console.log(file.name);
      });
    },
    [],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      className="h-96 w-96 rounded bg-zinc-900 text-center text-zinc-300 shadow"
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag 'n' drop some files here, or click to select files</p>
      )}
    </div>
  );
}

export default App;
