import MonacoEditor, {Monaco} from "@monaco-editor/react";
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import React from "react";
import Button from 'react-bootstrap/Button';
import {connect} from 'react-redux';
import { withResizeDetector } from 'react-resize-detector';
import ReactResizeDetector from 'react-resize-detector';
import { ComponentsProps } from 'react-resize-detector/build/ResizeDetector';
import {RouteComponentProps, withRouter} from "react-router";
import {Dispatch} from 'redux';
import { AnyAction, ApplicationState, analyzeAction } from '../redux';

interface Props extends RouteComponentProps<any> {
  path: string,
  // width: number;
  // height: number;
  universeYamlText: string,
  configYamlText: string;
  error?: Error;
  analyze: (configYamlText: string) => void;
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
    // const { width, height } = this.props;

    // if (width !== prevProps.width || height != prevProps.height) {
    //   if (this.editorRef.current) {
    //     console.log('  this.editorRef.current.layout()');
    //     this.editorRef.current.layout();
    //   }
    // }

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

  // componentWillUnmount() {
  //   console.log('Editor will unmount.');

  //   if (this.editorRef.current) {
  //     console.log(this.editorRef.current!.getValue());
  //     // https://github.com/microsoft/monaco-editor/issues/686
  //     const x = this.editorRef.current!.saveViewState();
  //     console.log(JSON.stringify(x, null, 2));
  //   }
  // }

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
    // const yamlText = this.editorRef.current!.getValue();
    // this.editorRef.current!
    if (this.monacoRef.current) {
      const yamlText = getValue(this.monacoRef.current, 'config.yaml');
      this.props.analyze(yamlText);
      console.log('onAnalyze: this.setState({analysisIsCurrent: true})');
      this.setState({
        // analysisIsCurrent: true,
        navigate: true
      });
    }

    // TODO: only navigate if there isn't an error.
    // this.props.history.push('/analyze');
  }

  onResize(width: number, height: number) {
    console.log(`onResize(${width}, ${height})`);
  }

  render() {
    console.log(`xxxxxxxxxxxxx ${this.props.path}`);
    let defaultValue = this.props.universeYamlText;
    if (this.props.path === 'config.yaml') {
      defaultValue = this.props.configYamlText;
    }
    console.log(`yyyyyyyyyyyy ${defaultValue}`);

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
              // defaultLanguage="yaml"
              // defaultValue={defaultValue}
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
// function initializeModel(
//   editor: monaco.editor.IStandaloneCodeEditor,
//   path: string, value: string
// ) {
  const model = monaco.editor.getModel(monaco.Uri.parse(path));

  if (model) {
    model.setValue(value);
  } else {
    monaco.editor.createModel(value, 'yaml', monaco.Uri.parse(path))
  }

  // monaco.editor.createModel(
  //   'this is the config',
  //   'yaml',
  //   monaco.Uri.parse('universe.yaml')
  // );
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
    analyze: (configYamlText: string) => {
      dispatch(analyzeAction(configYamlText));
    },
  };
}

// Works
const EditorWithRouter = withRouter(Editor);
const EditorConnected = connect(mapStateToProps, mapDispatchToProps)(EditorWithRouter);
export default EditorConnected;
