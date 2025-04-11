
"use client";

import {useState} from 'react';
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";

interface GraphInputProps {
  onGraphUpdate: (graphData: any) => void;
  onShortestPathCalculation: (path: any) => void;
}

const GraphInput: React.FC<GraphInputProps> = ({
  onGraphUpdate,
  onShortestPathCalculation,
}) => {
  const [nodes, setNodes] = useState([{id: "A"}, {id: "B"}]);
  const [edges, setEdges] = useState([{source: "A", target: "B", distance: 10}]);
  const [startNode, setStartNode] = useState("A");
  const [endNode, setEndNode] = useState("B");

  const handleCalculateShortestPath = async () => {
    // Placeholder for Bellman-Ford wasm execution
    console.log("Calculating shortest path from", startNode, "to", endNode);
    const shortestPath = {
      path: ["A", "B"],
      totalDistance: 10,
    }; // Simulate result

    onShortestPathCalculation(shortestPath);
  };

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Graph Input</CardTitle>
        <CardDescription>Define your graph and find the shortest path.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="start-node">Start Node</Label>
          <Input
            id="start-node"
            value={startNode}
            onChange={(e) => setStartNode(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="end-node">End Node</Label>
          <Input
            id="end-node"
            value={endNode}
            onChange={(e) => setEndNode(e.target.value)}
          />
        </div>
        <Button onClick={handleCalculateShortestPath}>Calculate Shortest Path</Button>
      </CardContent>
    </Card>
  );
};

export default GraphInput;
