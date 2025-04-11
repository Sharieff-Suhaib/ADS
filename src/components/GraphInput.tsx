"use client";

import {useState, useCallback} from 'react';
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {useToast} from "@/hooks/use-toast";

interface GraphInputProps {
  onGraphUpdate: (graphData: any) => void;
  onShortestPathCalculation: (path: any) => void;
}

interface Node {
  id: string;
  label: string;
  lat: number;
  lng: number;
}

interface Edge {
  source: string;
  target: string;
  distance: number;
}

const GraphInput: React.FC<GraphInputProps> = ({
  onGraphUpdate,
  onShortestPathCalculation,
}) => {
  const [nodes, setNodes] = useState<Node[]>([{ id: "A", label: "Main Building Entrance", lat: 13.0065, lng: 80.2405 }, { id: "B", label: "Tagore Auditorium Entrance", lat: 13.0087, lng: 80.2391 }, {id: "C", label: "Road Junction 1", lat: 13.0075, lng: 80.2398}]);
  const [edges, setEdges] = useState<Edge[]>([{source: "A", target: "C", distance: 50}, {source: "C", target: "B", distance: 60}]);
  const [startNode, setStartNode] = useState("A");
  const [endNode, setEndNode] = useState("B");
  const {toast} = useToast();

  const validateGraphData = useCallback(() => {
    if (!nodes.every(node => node.id && typeof node.lat === 'number' && typeof node.lng === 'number')) {
      toast({
        title: "Error",
        description: "All nodes must have an ID, latitude, and longitude.",
        variant: "destructive",
      });
      return false;
    }

    if (!edges.every(edge => edge.source && edge.target && typeof edge.distance === 'number' && nodes.some(node => node.id === edge.source) && nodes.some(node => node.id === edge.target))) {
      toast({
        title: "Error",
        description: "All edges must have a source, target, and distance. Source and target nodes must exist.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  }, [nodes, edges, toast]);

  const bellmanFord = (graph: any) => {
    const { nodes, edges, start_node, end_node } = graph;
    const distances: { [key: string]: number } = {};
    const predecessors: { [key: string]: string | null } = {};

    // Initialize distances
    nodes.forEach((node: any) => {
        distances[node.id] = Infinity;
        predecessors[node.id] = null;
    });
    distances[start_node] = 0;

    // Relax edges repeatedly
    for (let i = 0; i < nodes.length - 1; i++) {
        edges.forEach((edge: any) => {
            if (distances[edge.source] !== Infinity && distances[edge.source] + edge.weight < distances[edge.target]) {
                distances[edge.target] = distances[edge.source] + edge.weight;
                predecessors[edge.target] = edge.source;
            }
        });
    }

    // Check for negative-weight cycles
    for (let edge of edges) {
        if (distances[edge.source] !== Infinity && distances[edge.source] + edge.weight < distances[edge.target]) {
            return { error: "Graph contains a negative-weight cycle" };
        }
    }

    // Reconstruct path
    const path = [];
    let currentNode: string | null = end_node;
    while (currentNode) {
        path.unshift(currentNode);
        currentNode = predecessors[currentNode];
    }

    if (path[0] !== start_node) {
        return { error: "No path found" };
    }

    return {
        path: path,
        distance: distances[end_node]
    };
};

  const handleCalculateShortestPath = async () => {
    if (!validateGraphData()) return;

    try {
      const graphData = {
        nodes: nodes.map(node => ({ id: node.id })),
        edges: edges.map(edge => ({ source: edge.source, target: edge.target, weight: edge.distance })),
        start_node: startNode,
        end_node: endNode,
      };

      const result = bellmanFord(graphData);

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
        return;
      }

      const shortestPath = {
        path: result.path,
        totalDistance: result.distance,
      };

      onShortestPathCalculation(shortestPath);
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Error calculating shortest path: ${error.message}`,
        variant: "destructive",
      });
      console.error("Error calculating shortest path:", error);
    }
  };

  const handleGraphUpdate = () => {
    if (!validateGraphData()) return;
    onGraphUpdate({ nodes, edges });
  };

  const handleNodeChange = (index: number, field: string, value: any) => {
    const newNodes = [...nodes];
    newNodes[index][field] = value;
    setNodes(newNodes);
  };

  const handleEdgeChange = (index: number, field: string, value: any) => {
    const newEdges = [...edges];
    newEdges[index][field] = value;
    setEdges(newEdges);
  };

  const addNode = () => {
    setNodes([...nodes, { id: `Node ${nodes.length + 1}`, label: `Node ${nodes.length + 1}`, lat: 0, lng: 0 }]);
  };

  const addEdge = () => {
    setEdges([...edges, { source: nodes[0]?.id || "", target: nodes[1]?.id || "", distance: 0 }]);
  };

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Graph Input</CardTitle>
        <CardDescription>Define your graph and find the shortest path.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div>
          <h3 className="text-lg font-semibold">Nodes</h3>
          {nodes.map((node, index) => (
            <div key={index} className="grid gap-2 mb-2">
              <Label htmlFor={`node-${index}-id`}>Node {index + 1} ID</Label>
              <Input
                type="text"
                id={`node-${index}-id`}
                value={node.id}
                onChange={(e) => handleNodeChange(index, 'id', e.target.value)}
              />
              <Label htmlFor={`node-${index}-label`}>Node {index + 1} Label</Label>
              <Input
                type="text"
                id={`node-${index}-label`}
                value={node.label}
                onChange={(e) => handleNodeChange(index, 'label', e.target.value)}
              />
              <Label htmlFor={`node-${index}-lat`}>Node {index + 1} Latitude</Label>
              <Input
                type="number"
                id={`node-${index}-lat`}
                value={node.lat}
                onChange={(e) => handleNodeChange(index, 'lat', parseFloat(e.target.value))}
              />
              <Label htmlFor={`node-${index}-lng`}>Node {index + 1} Longitude</Label>
              <Input
                type="number"
                id={`node-${index}-lng`}
                value={node.lng}
                onChange={(e) => handleNodeChange(index, 'lng', parseFloat(e.target.value))}
              />
            </div>
          ))}
          <Button type="button" variant="secondary" onClick={addNode}>Add Node</Button>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Edges</h3>
          {edges.map((edge, index) => (
            <div key={index} className="grid gap-2 mb-2">
              <Label htmlFor={`edge-${index}-source`}>Edge {index + 1} Source</Label>
              <Input
                type="text"
                id={`edge-${index}-source`}
                value={edge.source}
                onChange={(e) => handleEdgeChange(index, 'source', e.target.value)}
              />
              <Label htmlFor={`edge-${index}-target`}>Edge {index + 1} Target</Label>
              <Input
                type="text"
                id={`edge-${index}-target`}
                value={edge.target}
                onChange={(e) => handleEdgeChange(index, 'target', e.target.value)}
              />
              <Label htmlFor={`edge-${index}-distance`}>Edge {index + 1} Distance</Label>
              <Input
                type="number"
                id={`edge-${index}-distance`}
                value={edge.distance}
                onChange={(e) => handleEdgeChange(index, 'distance', parseFloat(e.target.value))}
              />
            </div>
          ))}
          <Button type="button" variant="secondary" onClick={addEdge}>Add Edge</Button>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="start-node">Start Node</Label>
          <Input
            type="text"
            id="start-node"
            value={startNode}
            onChange={(e) => setStartNode(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="end-node">End Node</Label>
          <Input
            type="text"
            id="end-node"
            value={endNode}
            onChange={(e) => setEndNode(e.target.value)}
          />
        </div>
        <Button type="button" onClick={handleGraphUpdate}>Update Graph</Button>
        <Button type="button" onClick={handleCalculateShortestPath}>Calculate Shortest Path</Button>
      </CardContent>
    </Card>
  );
};

export default GraphInput;
