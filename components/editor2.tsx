import MonacoEditor, {Monaco} from "@monaco-editor/react";
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import React from "react";
import Button from 'react-bootstrap/Button';
import {connect} from 'react-redux';
import ReactResizeDetector from 'react-resize-detector';
import {RouteComponentProps, withRouter} from "react-router";
import {Dispatch} from 'redux';
import { AnyAction, ApplicationState, analyzeAction } from '../redux';

interface Props extends RouteComponentProps<any> {
  path: string,
  universeYamlText: string,
  configYamlText: string;
  error?: Error;
  analyze: (universeYamlText: string, configYamlText: string) => void;
}

interface State {
  analysisIsCurrent: boolean;
  navigate: boolean;
}

class Editor extends React.Component<Props, State> {
  editorRef: React.MutableRefObject<monaco.editor.IStandaloneCodeEditor | null>;
  monacoRef: React.MutableRefObject<Monaco | null>;

  constructor(props: Props) {
    super(props);
    this.onAnalyze = this.onAnalyze.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onEditorMount = this.onEditorMount.bind(this);
    this.onResize = this.onResize.bind(this);

    this.editorRef = React.createRef();
    this.monacoRef = React.createRef();

    console.log('constructor: this.setState({analysisIsCurrent: false})');
    this.state = {
      analysisIsCurrent: false,
      navigate: false
    };
  }

  componentDidUpdate(prevProps: Props) {
    console.log('componentDidUpdate');

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
    this.monacoRef.current = monaco;

    initializeModel(monaco, 'universe.yaml', this.props.universeYamlText);
    initializeModel(monaco, 'config.yaml', this.props.configYamlText);
    editor.focus();
  }

  onAnalyze() {
    if (this.monacoRef.current) {
      const universeYamlText = getValue(this.monacoRef.current, 'universe.yaml');
      const configYamlText = getValue(this.monacoRef.current, 'config.yaml');
      this.props.analyze(universeYamlText, configYamlText);
      console.log('onAnalyze: this.setState({analysisIsCurrent: true})');
      this.setState({
        navigate: true
      });
    }
  }

  // TODO: REVIEW: how is Monaco resizing, given that this method
  // does nothing? Why no this.editorRef.current.layout()?
  onResize(width: number, height: number) {
    console.log(`onResize(${width}, ${height})`);
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

        {/* DESIGN NOTE: use ReactResizeDetector here instead of 
          * withResizeDetector() in order to expose path property */}
        <ReactResizeDetector handleWidth handleHeight onResize={this.onResize}>
          <div style={{ flexGrow: 1, overflow: 'hidden' }}>
            <MonacoEditor
              onMount={this.onEditorMount}
              onChange={this.onChange}
              theme="vs-dark"
              path={this.props.path}
            />
          </div>
        </ReactResizeDetector>

        {renderError(this.props.error)}
      </div>
    );
  }
}

function getValue(monaco: Monaco, path: string): string {
  const model = monaco.editor.getModel(monaco.Uri.parse(path))!;
  return model.getValue();
}

function initializeModel(monaco: Monaco, path: string, value: string) {
  const model = monaco.editor.getModel(monaco.Uri.parse(path));

  if (model) {
    model.setValue(value);
  } else {
    monaco.editor.createModel(value, 'yaml', monaco.Uri.parse(path))
  }
}

function renderError(error?: Error) {
  if (error) {
    console.log('rendering error');
    return (
      <div style={{maxHeight: '30vh', overflow: 'scroll'}}>
        {error.message}
      </div>
    );
  } else {
    console.log('rendering ok');
    return null;
  }
}

function mapStateToProps({ universeYamlText, configYamlText, error }: ApplicationState) {
  return {
    universeYamlText, 
    configYamlText,
    error
  };
}

function mapDispatchToProps(dispatch: Dispatch<AnyAction>) {
  return {
    analyze: (universeYamlText: string, configYamlText: string) => {
      dispatch(analyzeAction(universeYamlText, configYamlText));
    },
  };
}

// Works
const EditorWithRouter = withRouter(Editor);
const EditorConnected = connect(
  mapStateToProps,
  mapDispatchToProps
)(EditorWithRouter);
export default EditorConnected;
