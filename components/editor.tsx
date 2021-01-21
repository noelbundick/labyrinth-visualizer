import MonacoEditor, {Monaco} from "@monaco-editor/react";
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import React, {useRef} from "react";
import {connect} from 'react-redux'

import {ApplicationState} from '../redux';

interface Props {
  text: string;
}

class Editor extends React.Component<Props> {
  editorRef: React.MutableRefObject<monaco.editor.IStandaloneCodeEditor>;//React.RefObject<monaco.editor.IStandaloneCodeEditor>;
  // editorRef2 = useRef(null);

  constructor(props) {
    super(props);
    this.onEditorMount = this.onEditorMount.bind(this);
    this.editorRef = React.createRef()
  }

  componentWillUnmount() {
    console.log('Editor will unmount.');
    console.log(this.editorRef.current.getValue());
    // https://github.com/microsoft/monaco-editor/issues/686
    this.editorRef.current.saveViewState();
  }

  onEditorMount(
    editor: monaco.editor.IStandaloneCodeEditor,
    monaco: Monaco,
  ) {
    console.log('Editor mounted');
    this.editorRef.current = editor; 
  }

  render() {
    return (
      <div>
        <div>Editor instructions go here</div>

        <MonacoEditor
          height="90vh"
          width="100%"
          defaultLanguage="yaml"
          defaultValue={this.props.text}
          onMount = {this.onEditorMount}
          theme="vs-dark"
        />
      </div>
    );
  }
}

function mapStateToProps({ configYamlText }: ApplicationState) {
  return { text: configYamlText };
}

export default connect(mapStateToProps)(Editor);
