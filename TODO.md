# TODO List

* Sticky links use last url params
* Analyze component uses redirect to add default param values
* Add redux store
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
* Editor
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