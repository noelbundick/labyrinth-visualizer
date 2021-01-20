import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router';
import React from "react";
import Nav from 'react-bootstrap/Nav';
import Tab from 'react-bootstrap/Tab';
// import { connect } from 'react-redux'
import SplitPane from 'react-split-pane'
// import { Dispatch } from 'redux'

// import { ApplicationState, AnyAction, setSpeechSupport } from "../actions";

// import CartControl from './cart-control';
// import ChromeDetect from './chrome-detect';
// import GraphPanelControl from './graph-panel-control';
// import HamburgerControl from './hamburger-control';
// import HistoryControl from './history-control';
// import InfoControl from './info-control';
// import LanguageControl from './language-control';
// import LexiconControl from './lexicon-control';
// import LoadingControl from './loading-control';
// import MenuControl from './menu-control';
// import PostingListControl from './posting-list-control';
// import RecorderControl from './recorder-control';
// import SpeechControl from './speech-control';
// import TestsControl from './tests-control';

import styles from './controls.module.css';

interface UIStateProps {
  start?: string;
  end?: string;
  forward?: boolean;
}

export default function render() {
  console.log('Frame renders');
  const router = useRouter()
  const { start, end, forward } = router.query

  const uiState = { start, end, forward: !!forward };

  return (
    <div className={styles.frame}>
      <Head>
        <title>Labyrinth Visualizer</title>
        <link rel="icon" href="/security-24px.svg" />
      </Head>
      <Link href="/editor">
        <a>Editor</a>
      </Link>
      <Link href="/analyze">
        <a>Analyze</a>
      </Link>
      <h1>Frame</h1>
      <p>Start: {uiState.start || '(undefined)'}</p>
      <p>End: {uiState.end || '(undefined)'}</p>
      <p>Forward: {uiState.forward ? 'true' : 'false'}</p>
    </div>
  );
}
// interface Props {
//   application: ApplicationState;
//   speechSupported: (isRecording: boolean) => void;
// };

// class FrameControl extends React.Component<Props> {
//   render() {
//     if (this.props.application.bluePlateWorld) {
//       return (
//         <div className={styles.frame}>
//           <div>
//             <SplitPane split="horizontal" minSize={100} defaultSize={600}>
//               <div className={styles.frameUpperPanel}>
//                 {this.renderTabs()}
//               </div>
//               <div className={styles.frameLowerPanel}>
//                 <RecorderControl />
//                 <CartControl />
//               </div>
//             </SplitPane>
//           </div>
//           <ChromeDetect/>
//         </div>
//       );
//     } else {
//       return <LoadingControl />;
//     }
//   }

//   // DESIGN NOTE: mountOnEnter and unmountOnExit are necessary for the
//   // GraphControl layout algorithm. It turns out the getBBox() returns
//   // an empty bounding box for svg text elements that aren't currently
//   // visible.
//   //   https://stackoverflow.com/questions/21387965/getbbox-width-and-height-returns-0
//   //   https://stackoverflow.com/questions/40744176/getbbox-and-getcomputedtextlength-once-working-once-not
//   //   https://github.com/DmitryBaranovskiy/raphael/issues/760
//   //   https://stackoverflow.com/questions/28282295/getbbox-of-svg-when-hidden
//   renderTabs() {
//     return (
//       <div style={{
//         display: 'flex',
//         flexDirection: 'column',
//         width: '100%',
//         height: '100%'
//       }}>
//         <Tab.Container 
//           id="left-tabs-example"
//           defaultActiveKey="info"
//           mountOnEnter={true}
//           unmountOnExit={true}
//         >
//           <Nav variant="tabs" className="flex-row">
//             <Nav.Item>
//               <Nav.Link eventKey="info">Info</Nav.Link>
//             </Nav.Item>
//             <Nav.Item>
//               <Nav.Link eventKey="menu">Menu</Nav.Link>
//             </Nav.Item>
//             <Nav.Item>
//               <Nav.Link eventKey="lexicon">Lexicon</Nav.Link>
//             </Nav.Item>
//             <Nav.Item>
//               <Nav.Link eventKey="postings">Postings</Nav.Link>
//             </Nav.Item>
//             <Nav.Item>
//               <Nav.Link eventKey="graph">Graph</Nav.Link>
//             </Nav.Item>
//             <Nav.Item>
//               <Nav.Link eventKey="tests">Tests</Nav.Link>
//             </Nav.Item>
//             <Nav.Item>
//               <Nav.Link eventKey="history">History</Nav.Link>
//             </Nav.Item>
//             <div style={{flexGrow: 1}}>
//             </div>
//             <SpeechControl/>
//             <LanguageControl/>
//             <HamburgerControl/>
//           </Nav>
//           <div style={{flexGrow: 1, overflow: 'hidden'}}>
//             <Tab.Content className={styles.frameTab}>
//               <Tab.Pane eventKey="info" style={{height: '100%'}}>
//                 <InfoControl />
//               </Tab.Pane>
//               <Tab.Pane eventKey="menu" style={{height: '100%'}}>
//                 <MenuControl />
//               </Tab.Pane>
//               <Tab.Pane eventKey="lexicon" style={{height: '100%', overflow: 'auto'}}>
//                 <LexiconControl />
//               </Tab.Pane>
//               <Tab.Pane eventKey="postings" style={{height: '100%', overflow: 'auto'}}>
//                 <PostingListControl />
//               </Tab.Pane>
//               <Tab.Pane eventKey="graph" style={{height: '100%', overflow: 'auto'}}>
//                 <GraphPanelControl />
//               </Tab.Pane>
//               <Tab.Pane eventKey="history" style={{height: '100%', overflow: 'auto'}}>
//                 <HistoryControl history={this.props.application.history}/>
//               </Tab.Pane>
//               <Tab.Pane eventKey="tests" style={{height: '100%', overflow: 'auto'}}>
//                 <TestsControl/>
//               </Tab.Pane>
//             </Tab.Content>
//           </div>
//         </Tab.Container>
//       </div>
//     );
//   }
// }

// function mapStateToProps(application: ApplicationState) {
//   return { application };
// }

// function mapDispatchToProps(dispatch: Dispatch<AnyAction>) {
//   return {
//     speechSupported: (speechSupport: boolean) => {
//       dispatch(setSpeechSupport(speechSupport));
//     },
//   };
// }

// export default connect(mapStateToProps, mapDispatchToProps)(FrameControl);
