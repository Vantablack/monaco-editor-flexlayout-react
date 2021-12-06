import React, { useRef } from "react";
import Editor from "@monaco-editor/react";
import { ToastContainer, toast } from "react-toastify";

const divStyle = {
  height: "100%"
};

const editorOptions = {
  renderWhitespace: "all",
  rulers: [80, 120]
};

function showToast(text) {
  toast.info(text, {
    position: "bottom-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined
  });
}

/**
 * Writes text content to FileSystemFileHandle
 * https://wicg.github.io/file-system-access/#api-filesystemfilehandle
 * https://web.dev/file-system-access/
 * @param {*} fileHandle
 * @param {*} content
 */
async function writeContentToFile(fileHandle, content) {
  // Create a FileSystemWritableFileStream to write to.
  const writable = await fileHandle.createWritable();
  // Write the contents of the file to the stream.
  await writable.write(content);
  // Close the file and write the contents to disk.
  await writable.close();
  showToast("Saved");
}

/**
 * Wrapper for Monaco Editor
 * props available are
 * fileHandle
 * dirHandle
 * editorName
 * node
 * @param {*} props
 */
function TabEditor(props) {
  // https://web.dev/file-system-access/
  const editorRef = useRef(null);
  const monacoRef = useRef(null);

  async function fetchFile(fileHandle) {
    const file = await fileHandle.getFile();
    return await file.text();
  }

  async function nodeCloseEventHandler(e) {
    console.info(props.editorName + " closed");
    // TODO, how to prevent close
    if (editorRef.current.getModel().getValue() !== "") {
    }
  }

  async function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
    monacoRef.current = monaco;
    // if fileHandle exists, try to load the contents from disk
    if (props.fileHandle) {
      console.log(props.fileHandle);
      const contents = await fetchFile(props.fileHandle);
      editorRef.current.getModel().setValue(contents);
    } else {
      // try to load from local storage
      console.log(props.editorName);
    }
    // Add close event listener
    props.node.setEventListener("close", nodeCloseEventHandler);
  }

  function handleWordWrapOn() {
    editorRef.current.updateOptions({ wordWrap: "on" });
  }

  function handleWordWrapOff() {
    editorRef.current.updateOptions({ wordWrap: "off" });
  }

  async function saveButtonHandler() {
    if (props.fileHandle) {
      writeContentToFile(
        props.fileHandle,
        editorRef.current.getModel().getValue()
      );
    } else {
      // TODO: Save new file
      const fileHandle = await window.showSaveFilePicker({});
      writeContentToFile(fileHandle, editorRef.current.getModel().getValue());
    }
  }

  /**
   * Change Monaco editor to VB language
   */
  function setVbHandler() {
    monacoRef.current.editor.setModelLanguage(
      editorRef.current.getModel(),
      "vb"
    );
    showToast("Changed to VB");
  }

  /**
   * Change Monaco editor to SQL language
   */
  function setSqlHandler() {
    monacoRef.current.editor.setModelLanguage(
      editorRef.current.getModel(),
      "sql"
    );
    showToast("Changed to SQL");
  }

  return (
    <div style={divStyle}>
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
      />
      <button onClick={saveButtonHandler}>Save</button>
      <button onClick={setVbHandler}>Set VB Language</button>
      <button onClick={setSqlHandler}>Set SQL Language</button>
      <button onClick={handleWordWrapOn}>Wordwrap On</button>
      <button onClick={handleWordWrapOff}>Wordwrap Off</button>
      <Editor
        height="100%"
        theme="vs-dark"
        onMount={handleEditorDidMount}
        // onChange={handleEditorChange}
        options={editorOptions}
      />
    </div>
  );
}

export default TabEditor;
