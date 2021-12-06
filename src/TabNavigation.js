import React, { useState } from "react";

function TabNavigation(props) {
  const [dirHandle, setDirHandle] = useState();
  const [fileHandles, setFileHandles] = useState([]);
  const fileList = fileHandles.map((handle) => (
    <li key={handle.name} onClick={() => handleListClick(handle)}>
      {handle.name}
    </li>
  ));

  function handleListClick(fileHandle) {
    props.handleLoadFile(fileHandle, dirHandle);
  }

  async function handleClick(e) {
    let _dirHandle = await window.showDirectoryPicker();
    setDirHandle(_dirHandle);
    let _fileHandles = [];
    for await (const entry of _dirHandle.values()) {
      if (entry.kind === "file") {
        _fileHandles.push(entry);
      }
    }
    setFileHandles(_fileHandles);
  }
  return (
    <div>
      <button style={{ width: "100%" }} onClick={handleClick}>
        Open File
      </button>
      <ul>{dirHandle && fileList}</ul>
    </div>
  );
}

export default TabNavigation;
