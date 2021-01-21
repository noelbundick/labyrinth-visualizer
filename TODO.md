# TODO List

* https://stackoverflow.com/questions/42044214/how-can-i-style-active-link-in-react-router-v4
  * If you are encountering an issue where your Nav menu works except it's not updating properly when you click links and the route changes, but it works fine if you press F5, you can do this. This is probably occurring because you are using Redux which has a shouldComponentUpdate Lifecycle method on its connect function. You probably have your Nav component wrapped in connect. This is all good. shouldComponentUpdate is what is ruining your life.
* Navigation structure
  * Paths
    * /
      * Welcome page
    * /editor
    * /analyze
      * Instructs user to set start
    * /analyze/to/[start]
      * Displays list of reachable nodes
      * Instructs user to select one
    * /analyze/to/[start]/[end]
      * If no path, say so
      * Otherwise, show detail for start => end routes
    * /analyze/from/[start]/[end]
  * Query structure
    * ?forward=true
  * https://colinhacks.com/essays/building-a-spa-with-nextjs
* Frame
  * x favicon
  * Route not found
* NavBar
  * x BUG: Analyze tab always rendered as active
* Editor
  * Resize Monaco editor when window resizes
    * https://dev.to/tepythai/why-100vw-causes-horizontal-scrollbar-4nlm
    * https://stackoverflow.com/questions/45654579/height-of-the-monaco-editor
    * automaticLayout: true
    * https://stackoverflow.com/questions/47017753/monaco-editor-dynamically-resizable
    * window.onresize = function (){
        editor.layout();
      };
  * Button to revert buffer to analyzed text
  * Editor is too tall for its div
  * Save and restore editor text and state across navigation
    * . componentWillUnmount()
    * ALTERNATE APPROACH: https://stackoverflow.com/questions/50777333/react-hide-a-component-on-a-specific-route
  * x Save/Update/Analyze button
    * Dirty buffer detection
    * Router navigate to analyze on success
  * Error panel
  * Instructions to user. Should these be markdown?
  * Help pane
  * Load examples and accompanying text
  * x Tab rename to 'Configure'
  * x Dark mode
  * x Wrap Editor inside of another component that does Redux dispatch
  * x YAML syntax highlighting
* AnalyzeMode
  * After redux store
    * One or more errors in the network configuration are preventing analysis
    * Invalid start location
    * Invalid end location
    * No routes for this pair
    * . Analyze component uses redirect to add default param values
    * Default to/from, start - from redux store
  * x Sticky links
  * x Function to parse location
  * x Convert to component


  * Host monaco editor
  * Load sample text
  * Line numbers
  * Dirty buffer detection
  * Save/Update button
  * Upload/Download button
  * Splitters
  * Error panel
  * Help panel on right - displays markdown instructions
* Page component
  * Navigation tabs
  * Reachable nodes master
    * Sort by name
    * Sort by shortest path length
    * Sort by longest path length
  * Reachable nodes detail
    * Cycles
    * Paths
    * Routes
  * All driven by a property constructed from the query