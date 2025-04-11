# **App Name**: Pathfinder

## Core Features:

- Interactive Map: Implement a map interface using Leaflet to display the graph and paths. Allow users to add/remove nodes and edges directly on the map.
- Graph Input: Provide a user interface to input graph data (nodes and edges) or load it from a file. The input should include distances between nodes.
- Bellman-Ford Algorithm: Implement the Bellman-Ford algorithm in C++ (compiled for web using WebAssembly) to calculate the shortest path between two selected nodes on the graph.
- Path Visualization: Display the calculated shortest path on the map, highlighting the nodes and edges involved. Show the total distance of the path.

## Style Guidelines:

- Primary color: Blue (#3498db) for a clean and professional look.
- Secondary color: Light gray (#ecf0f1) for backgrounds and subtle elements.
- Accent: Orange (#e67e22) for highlighting the shortest path and interactive elements.
- Split-screen layout with the map on one side and input/controls on the other.
- Use clear and simple icons to represent nodes, edges, and controls.
- Subtle animations for path highlighting and updates to the map.

## Original User Request:
create a web application to find the shortest paths using bellman ford algorithm 
Use react.js express.js and leaflet for map api integration 
also write the code for bellman ford algorithm in a separate C++ file
  