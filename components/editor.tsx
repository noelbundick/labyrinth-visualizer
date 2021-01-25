import MonacoEditor, {Monaco} from "@monaco-editor/react";
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import React from "react";
import Button from 'react-bootstrap/Button';
import {connect} from 'react-redux';
import { withResizeDetector } from 'react-resize-detector';
import { ComponentsProps } from 'react-resize-detector/build/ResizeDetector';
import {RouteComponentProps, withRouter} from "react-router";
import {Dispatch} from 'redux';

import { AnyAction, ApplicationState, analyzeAction } from '../redux';

interface Props extends RouteComponentProps<any> {
  width: number;
  height: number;
  text: string;
  error?: Error;
  analyze: (configYamlText: string) => void;
}

interface State {
  analysisIsCurrent: boolean;
  navigate: boolean;
}

class Editor extends React.Component<Props, State> {
  editorRef: React.MutableRefObject<monaco.editor.IStandaloneCodeEditor | null>;

  constructor(props: Props) {
    super(props);
    this.onAnalyze = this.onAnalyze.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onEditorMount = this.onEditorMount.bind(this);

    this.editorRef = React.createRef();

    console.log('constructor: this.setState({analysisIsCurrent: false})');
    this.state = {
      analysisIsCurrent: false,
      navigate: false
    };
  }

  componentDidUpdate(prevProps: Props) {
    console.log('componentDidUpdate');
    const { width, height } = this.props;

    if (width !== prevProps.width || height != prevProps.height) {
      if (this.editorRef.current) {
        console.log('  this.editorRef.current.layout()');
        this.editorRef.current.layout();
      }
    }

    if (this.state.navigate && !this.props.error) {
      console.log(`  this.state.navigate: ${this.state.navigate}`);
      console.log(`  this.props.error: ${this.props.error}`);
      this.props.history.push('/analyze');
      this.setState({
        ...this.state,
        analysisIsCurrent: true,
        navigate: false
      });
    }
  }

  componentWillUnmount() {
    console.log('Editor will unmount.');

    if (this.editorRef.current) {
      console.log(this.editorRef.current!.getValue());
      // https://github.com/microsoft/monaco-editor/issues/686
      const x = this.editorRef.current!.saveViewState();
      console.log(JSON.stringify(x, null, 2));
    }
  }

  onChange(
    value: string | undefined,
    ev: monaco.editor.IModelContentChangedEvent,
  ) {
    console.log('onChange: this.setState({analysisIsCurrent: false})');
    this.setState({ analysisIsCurrent: false });
  }

  onEditorMount(
    editor: monaco.editor.IStandaloneCodeEditor,
    monaco: Monaco,
  ) {
    console.log('Editor mounted');
    this.editorRef.current = editor;
    editor.focus();
  }

  onAnalyze() {
    const yamlText = this.editorRef.current!.getValue();
    this.props.analyze(yamlText);
    console.log('onAnalyze: this.setState({analysisIsCurrent: true})');
    this.setState({
      // analysisIsCurrent: true,
      navigate: true
    });

    // TODO: only navigate if there isn't an error.
    // this.props.history.push('/analyze');
  }

  render() {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%'
      }}>
        <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
          <div style={{ flexGrow: 1 }}>
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

        <div style={{ flexGrow: 1, overflow: 'hidden' }}>
          <MonacoEditor
            defaultLanguage="yaml"
            defaultValue={this.props.text}
            onMount={this.onEditorMount}
            onChange={this.onChange}
            theme="vs-dark"
          />
        </div>

        {renderError(this.props.error)}
      </div>
    );
  }
}

function renderError(error?: Error) {
  if (error) {
    console.log('rendering error');
    return (
      <div>
        {error.message}
      </div>
    );
  } else {
    console.log('rendering ok');
    return null;
  }
}

function mapStateToProps({ configYamlText, error }: ApplicationState) {
  return { text: configYamlText, error };
}

function mapDispatchToProps(dispatch: Dispatch<AnyAction>) {
  return {
    analyze: (configYamlText: string) => {
      dispatch(analyzeAction(configYamlText));
    },
  };
}

const EditorWithRouter = withRouter(Editor);
const EditorConnected = connect(mapStateToProps, mapDispatchToProps)(EditorWithRouter);
const EditorWithResize = withResizeDetector<Props>(
  EditorConnected,
  {handleWidth: true, handleHeight: true} as ComponentsProps
);
export default EditorWithResize;
