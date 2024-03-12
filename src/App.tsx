import { useCallback } from "react";
import { DropEvent, FileRejection, useDropzone } from "react-dropzone";
import { Octokit } from "octokit";

const octokit = new Octokit({ auth: import.meta.env.VITE_GITHUB_TOKEN });

function arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function App() {
  const onDrop = useCallback(
    (
      acceptedFiles: File[],
      fileRejections: FileRejection[],
      event: DropEvent,
    ) => {
      // setFiles(acceptedFiles);

      acceptedFiles.forEach(async (file) => {
        const reader = new FileReader();

        reader.onabort = () => console.warn("file reading was aborted");
        reader.onerror = () => console.error("file reading has failed");
        reader.onload = () => {
          const binaryStr = reader.result;
          const base64 = arrayBufferToBase64(binaryStr as ArrayBuffer);

          octokit.rest.repos.createOrUpdateFileContents({
            owner: import.meta.env.VITE_GITHUB_OWNER,
            repo: import.meta.env.VITE_GITHUB_REPO,
            path: file.name,
            message: "feat: add file",
            content: base64,
          });
        };

        reader.readAsArrayBuffer(file);
      });
    },
    [],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  // const [files, setFiles] = useState<File[]>([]);

  // const handleUploadFiles = (evt: MouseEvent) => {
  //   files.forEach((file) => {
  //   });
  // };

  return (
    <div>
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
      {/*<button onClick={handleUploadFiles}>Upload files</button>*/}
    </div>
  );
}

export default App;
