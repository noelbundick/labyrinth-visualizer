# TODO List

* Top
  * svg network diagram for demo
  * labyrinth-nsg
    * consider making NodeSpec.name default to NodeSpec.key
    * x loaders
    * x validators
    * x utiltities/validate
    * x utilities/yaml_validation_error
  * x Editor buffer persistance across navigation
  * Filters
  * Bug: editor analyze button enabled on startup - should be disabled
  * Reduce console spew
  * Rename editor2.tsx
  * Rename config/edit to network
  * Rename config.yaml and /config to network.yaml and /network
  * Errors
    * Better error descriptions
    * Errors should indicate filename
    * x Editor update succeeds or errors are reported on editor page
    * Analysis page does not show build errors - it just shows last correct state or url errors.
      * State initialize needs to create empty graph
  * x server -> subnet2 -> server should filter out loopback
  * x Ability to edit UniverseSpec

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
* Review everywhere the ! operator appears
* Run linter
* Figure out unit test strategy for Next.js app.
  * Is it possible to use mocha with Next.js build system?
* Host on github pages
* Firewalls
* Better sample network
* Importing ARM templates
  * https://blog.geuer-pollmann.de/blog/2019/10/14/locally-evaluating-azure-arm-templates/
* Error handling strategy
  * Add errors to ApplicationState?
  * Error decoding/rendering function.
  * Error base class?
* Frame
  * x favicon
  * Route not found
* NavBar
  * x BUG: Analyze tab always rendered as active
* Editor
  * NOTE on hosting monaco editor in Next.js
    * // https://stackoverflow.com/questions/59773190/monaco-editor-with-nextjs
  * x Figure out typing for this.editorRef
    * x https://dev.to/dinhhuyams/introduction-to-useref-hook-3m7n#:~:text=Well%2C%20the%20difference%20is%20that,full%20lifetime%20of%20the%20component.
  * x Layout/sizing
    * x Editor is too tall for its div
    * x PROMISING: https://github.com/react-monaco-editor/react-monaco-editor/issues/53
    * x https://stackoverflow.com/questions/59963794/monaco-editor-force-resize-editor
    * x Resize Monaco editor when window resizes
      * x https://dev.to/tepythai/why-100vw-causes-horizontal-scrollbar-4nlm
      * x https://stackoverflow.com/questions/45654579/height-of-the-monaco-editor
      * x automaticLayout: true
      * x https://stackoverflow.com/questions/47017753/monaco-editor-dynamically-resizable
      * x window.onresize = function (){
          editor.layout();
        };
  * Button to revert buffer to analyzed text
  * Load text
  * Save text
  * x Save and restore editor text and state across navigation
    * x componentWillUnmount()
    * x ALTERNATE APPROACH: https://stackoverflow.com/questions/50777333/react-hide-a-component-on-a-specific-route
  * x Save/Update/Analyze button
    * x Dirty buffer detection
    * x Router navigate to analyze on success
    * x Only navigate on success.
  * Error panel
    * Addition of splitter will make editor resizing more important
  * Help pane
    * Addition of splitter will make editor resizing more important
    * Instructions to user. Should these be markdown?
  * Load examples and accompanying text
  * x Tab rename to 'Configure'
  * x Dark mode
  * x Wrap Editor inside of another component that does Redux dispatch
  * x YAML syntax highlighting
* AnalyzeMode
  * x Warning: Each child in a list should have a unique "key" prop.
    * x http://localhost:3000/analyze/from/server/subnet2
  * x Remove nodes from application state - graph property has same info
  * Sort nodes by key
  * Nodes shouldn't report paths to themselves
    * not necessarily
    * server -> subnet2 -> server should filter out loopback
  * Consider using sagas to compute flows in the background
  * Cache graph, flows, cycles
  * . Cascading selectors: upstream change resets downstream selectors
  * Cascading selectors instead of select/master/detail
  * Scrollbars on selectors (or master list)
  * . Render routes
  * . Render paths
  * Render cycles
  * Filter by route
  * Filter by route components
  * Bad paths
    * Bad mode
      * /foobar
    * Redirect to add defaults
      * /analyze
      * /analyze/to
      * /analyze/from
      * /analyze/to/x
      * /analyze/from/x
    * Bad direction
      * /analyze/foo
    * Unknown start
      * /analyze/to/foobar
      * /analyze/from/foobar
      * /analyze/to/foobar/subnet1
      * /analyze/from/foobar/subnet1
    * Unknown end
      * /analyze/to/internet/foobar
      * /analyze/from/internet/foobar
    * Trailing slash
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