import "./styles.css";
import React from "react";
import FlexLayout from "flexlayout-react";
import TabEditor from "./TabEditor";
import Navigation from "./TabNavigation";
import { generator, BASE } from "flexid";
import "react-toastify/dist/ReactToastify.css";

const flexid = generator(BASE["58"]);

// TODO: Load existing storage
let json = {
  global: {},
  borders: [
    {
      type: "border",
      location: "left",
      children: [
        {
          type: "tab",
          enableClose: false,
          name: "Navigation",
          altName: "navigation",
          component: "navigation",
          icon: "images/folder.svg"
        }
      ]
    }
  ],
  layout: {
    type: "row",
    weight: 100,
    children: [
      {
        type: "tabset",
        weight: 100,
        children: []
      }
    ]
  }
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { model: FlexLayout.Model.fromJson(json), fileHandles: {} };
    // creating react refs: https://reactjs.org/docs/refs-and-the-dom.html
    this.layoutRef = React.createRef();
    // This binding is necessary to make `this` work in the callback
    // https://reactjs.org/docs/handling-events.html
    this.handleNewTabClick = this.handleNewTabClick.bind(this);
    this.handleLoadFile = this.handleLoadFile.bind(this);
  }

  handleLoadFile(fileHandle, dirHandle) {
    this.setState({
      fileHandles: {
        ...this.state.fileHandles,
        [fileHandle.name]: fileHandle
      }
    });
    this.layoutRef.current.addTabToActiveTabSet({
      type: "tab",
      component: "editor",
      name: fileHandle.name,
      config: {
        _fileHandle: fileHandle,
        _dirHandle: dirHandle
      }
    });
  }

  handleNewTabClick(node) {
    this.layoutRef.current.addTabToActiveTabSet({
      type: "tab",
      component: "editor",
      name: flexid()
    });
  }

  factory = (node) => {
    let component = node.getComponent();
    let config = node.getConfig();
    let editorName = node.getName();
    if (component === "editor") {
      if (config) {
        return (
          <TabEditor
            fileHandle={config._fileHandle}
            dirHandle={config._dirHandle}
            editorName={editorName}
            node={node}
          />
        );
      }
      return <TabEditor editorName={editorName} node={node} />;
    } else if (component === "navigation") {
      return <Navigation handleLoadFile={this.handleLoadFile} />;
    }
  };

  onRenderTabSet = (node, renderValues) => {
    renderValues.stickyButtons.push(
      <img
        src="images/add.svg"
        alt="Add"
        key="Add button"
        title="Add Tab (using onRenderTabSet callback, see Demo)"
        style={{ width: "1.1em", height: "1.1em" }}
        className="flexlayout__tab_toolbar_button"
        onClick={() => this.handleNewTabClick(node)}
      />
    );
  };

  render() {
    return (
      <div>
        <button onClick={this.handleNewTabClick}>Add</button>
        <FlexLayout.Layout
          ref={this.layoutRef}
          model={this.state.model}
          factory={this.factory}
          onRenderTabSet={this.onRenderTabSet}
        />
      </div>
    );
  }
}

export default App;
