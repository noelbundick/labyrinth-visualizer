# Labyrinth Analyzer

`Labyrinth Analyzer` is a experimental tool for analyzing reachability in networks consisting of elements such as servers, subnets, routers, and firewalls.

`Labyrinth Analyzer` is a single-page [React](https://reactjs.org/) application that runs in a web browser.

The network analysis logic resides in the experimental  [labyrinth-nsg](https://www.npmjs.com/package/labyrinth-nsg) package.

## Try Labyrinth Analyzer

**TODO:** Add system requirements here. Need `npm` and `node`.

~~~
% git clone git@github.com:MikeHopcroft/labyrinth-visualizer.git
% cd labyrinth-visualizer
% npm install
% npm run dev
~~~

This will build `labyrinth-analyzer` and start a development server at [http://localhost:3000](http://localhost:3000).

The [application](http://localhost:3000) provides four tabs:
* [Welcome](http://localhost:3000/) - a mostly empty welcome page.
* [Universe](http://localhost:3000/universe) - an editor for the type system for network rules. Sample type system contains definitions for ip addresses, ports, and protocols.
* [Network](http://localhost:3000/network) - an editor for the network topology, routing rules, and filtering rules. The system provides the sample network, shown below.
* [Analyze](http://localhost:3000/analyze) - an interactive network flow visualizer. Allows one to inspect routes and cycles from and to a specified node.

![Demo](/documentation/demo.svg)
