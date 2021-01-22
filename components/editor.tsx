import MonacoEditor, {Monaco} from "@monaco-editor/react";
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import React from "react";
import Button from 'react-bootstrap/Button';
import {connect} from 'react-redux'
import {RouteComponentProps, withRouter} from "react-router";
import {Dispatch} from 'redux';

import {AnyAction, ApplicationState, analyzeAction} from '../redux';

interface Props extends RouteComponentProps<any> {
  text: string;
  analyze: (configYamlText: string) => void;
}

interface State {
  analysisIsCurrent: boolean;
}

class Editor extends React.Component<Props, State> {
  editorRef: React.MutableRefObject<monaco.editor.IStandaloneCodeEditor>;//React.RefObject<monaco.editor.IStandaloneCodeEditor>;
  // editorRef2 = useRef(null);

  constructor(props: Props) {
    super(props);
    this.onAnalyze = this.onAnalyze.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onEditorMount = this.onEditorMount.bind(this);

    // TODO: sort out Typescript error on the following line.
    this.editorRef = React.createRef();

    console.log('constructor: this.setState({analysisIsCurrent: false})');
    this.state = { analysisIsCurrent: false };
  }

  componentWillUnmount() {
    console.log('Editor will unmount.');
    console.log(this.editorRef.current!.getValue());
    // https://github.com/microsoft/monaco-editor/issues/686
    const x = this.editorRef.current!.saveViewState();
    console.log(JSON.stringify(x, null, 2));
  }

  onChange(
    value: string | undefined,
    ev: monaco.editor.IModelContentChangedEvent,  
  ) {
    console.log('onChange: this.setState({analysisIsCurrent: false})');
    this.setState({analysisIsCurrent: false});
  }

  onEditorMount(
    editor: monaco.editor.IStandaloneCodeEditor,
    monaco: Monaco,
  ) {
    console.log('Editor mounted');
    this.editorRef.current = editor; 
  }

  onAnalyze() {
    // Test code for editor resizing.
    // this.editorRef.current.layout();

    const yamlText = this.editorRef.current!.getValue();
    this.props.analyze(yamlText);
    console.log('onAnalyze: this.setState({analysisIsCurrent: true})');
    this.setState({analysisIsCurrent: true});
    this.props.history.push('/analyze');
    // TODO: Navigate to Analysis pane?
  }

  render() {
    return (
      <div style={{display: 'flex', flexDirection: 'column', width: '100%', height: '100%'}}>
        <div style={{display: 'flex', flexDirection: 'row', width: '100%'}}>
          <div style={{flexGrow: 1}}>
            <p>Editor instructions go here</p>
            <p>Second line</p>
          </div>
          <div>
            <Button
              className="btn btn-success btn-sm"
              disabled={this.state.analysisIsCurrent}
              onClick={this.onAnalyze}
              title="Analyze"
            >
              Analyze
            </Button>
          </div>
        </div>

        <div style = {{flexGrow: 1, overflow: 'hidden'}}>
          <MonacoEditor
            options = {{automaticLayout: true}}
            defaultLanguage="yaml"
            defaultValue={this.props.text}
            onMount = {this.onEditorMount}
            onChange = {this.onChange}
            theme="vs-dark"
          />
        </div>
      </div>
    );
  }
}

function mapStateToProps({ configYamlText }: ApplicationState) {
  return { text: configYamlText };
}

// export default connect(mapStateToProps)(Editor);
function mapDispatchToProps(dispatch: Dispatch<AnyAction>) {
  return {
    analyze: (configYamlText: string) => {
      dispatch(analyzeAction(configYamlText));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Editor));
