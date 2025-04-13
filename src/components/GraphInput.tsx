"use client";

import {useState, useCallback} from 'react';
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {useToast} from "@/hooks/use-toast";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

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
  const [nodes, setNodes] = useState<Node[]>([
    { id: "A", label: "Main Gate", lat: 13.008312, lng: 80.235063 },
    { id: "B", label: "Main Gate Right Road", lat: 13.008130, lng: 80.235991 },
    { id: "C", label: "Main Gate Left Road", lat: 13.008509, lng: 80.233938 },
    { id: "D", label: "Anna Statue", lat: 13.010092, lng: 80.235325 },
    { id: "E", label: "Anna Statue Right Road", lat: 13.010083, lng: 80.235495 },
    { id: "F", label: "Anna Statue Left Road", lat: 13.010144, lng: 80.235135 },
    { id: "G", label: "Red Building", lat: 13.010731, lng: 80.235428 },
    { id: "H", label: "Red Building Right Road", lat: 13.010698, lng: 80.235663 },
    { id: "I", label: "Red Building Left Road", lat: 13.010752, lng: 80.235215 },
    { id: "J", label: "CEG Square", lat: 13.010603, lng: 80.236340 },
    { id: "K", label: "Globe Statue", lat: 13.010744, lng: 80.236421 },
    { id: "L", label: "RCC", lat: 13.010728, lng: 80.237192 },
    { id: "M", label: "Library", lat: 13.010756, lng: 80.237808 },
    { id: "N", label: "Vivek Audi", lat: 13.011439, lng: 80.236522 },
    { id: "O", label: "Maths Dept", lat: 13.011554, lng: 80.235464 },
    { id: "P", label: "Swimming Pool", lat: 13.011665, lng: 80.234682 },
    { id: "Q", label: "Hostel Road", lat: 13.012179, lng: 80.236642 },
    { id: "R", label: "Science and Humanities", lat: 13.012304, lng: 80.235673 },
    { id: "S", label: "CSE Dept", lat: 13.012631, lng: 80.235722 },
    { id: "T", label: "IT Dept", lat: 13.013089, lng: 80.235801 },
    { id: "U", label: "Knowledge Park", lat: 13.013355, lng: 80.235865 },
    { id: "V", label: "ECE Dept", lat: 13.012383, lng: 80.235175 },
    { id: "W", label: "NCC", lat: 13.012438, lng: 80.234818 },
    { id: "X", label: "Manufacturing Dept", lat: 13.011971, lng: 80.234716 },
    { id: "Y", label: "Printing Dept", lat: 13.013215, lng: 80.235166 },
    { id: "Z", label: "Coffee Hut", lat: 13.013239, lng: 80.234976 },
    { id: "AA", label: "EEE Dept", lat: 13.011452, lng: 80.234621 },
    { id: "AB", label: "Civil Road", lat: 13.010354, lng: 80.234369 },
    { id: "AC", label: "Civil Dept", lat: 13.010448, lng: 80.233683 },
    { id: "AD", label: "Industrial Dept", lat: 13.009803, lng: 80.234235 },
    { id: "AE", label: "Mech Dept", lat: 13.011112, lng: 80.232783 },
    { id: "AF", label: "Mech Road", lat: 13.011062, lng: 80.233109 },
    { id: "AG", label: "Tag Audi", lat: 13.011418, lng: 80.233174 },
    { id: "AH", label: "Structural Eng Dept", lat: 13.010973, lng: 80.233734 },
    { id: "AI", label: "Transportation Eng/Soil Mechanics", lat: 13.010912, lng: 80.234128 },
    { id: "AJ", label: "High Voltage Lab", lat: 13.010842, lng: 80.234500 },
    { id: "AK", label: "Ocean Management", lat: 13.012324, lng: 80.233901 },
    { id: "AL", label: "Mining Dept", lat: 13.013051, lng: 80.233982 },
    { id: "AM", label: "Power System Engineering", lat: 13.012898, lng: 80.234904 }
  ]);
  
  // Updated edges to use proper node IDs
  const [edges, setEdges] = useState<Edge[]>([
    { source: "A", target: "C", distance: 100 },  // Main Gate to Main Gate Left
    { source: "A", target: "B", distance: 130 },  // Main Gate to Main Gate Right Road
    { source: "B", target: "J", distance: 280 },  // Main Gate Right Road to CEG Square
    { source: "C", target: "AD", distance: 150 }, // Main Gate Left to Industrial Dept
    { source: "AD", target: "AB", distance: 63 }, // Industrial Dept to Civil Road
    { source: "AB", target: "AC", distance: 80 }, // Civil Road to Civil Dept
    { source: "AB", target: "AJ", distance: 56 }, // Civil Road to High Voltage Lab
    { source: "I", target: "AJ", distance: 80 },  // Red Building Left Road to High Voltage Lab
    { source: "I", target: "G", distance: 25 },   // Red Building Left Road to Red Building
    { source: "G", target: "H", distance: 25 },   // Red Building to Red Building Right Road
    { source: "A", target: "D", distance: 200 },  // Main Gate to Anna Statue
    { source: "D", target: "F", distance: 20 },   // Anna Statue to Anna Statue Left Road
    { source: "F", target: "I", distance: 70 },   // Anna Statue Left Road to Red Building Left Road
    { source: "D", target: "E", distance: 20 },   // Anna Statue to Anna Statue Right Road
    { source: "E", target: "H", distance: 70 },   // Anna Statue Right Road to Red Building Right Road
    { source: "H", target: "J", distance: 75 },   // Red Building Right Road to CEG Square
    { source: "J", target: "K", distance: 16 },   // CEG Square to Globe Statue
    { source: "K", target: "L", distance: 88 },   // Globe Statue to RCC
    { source: "L", target: "M", distance: 58 },   // RCC to Library
    { source: "K", target: "N", distance: 80 },   // Globe Statue to Vivek Audi
    { source: "N", target: "O", distance: 110 },  // Vivek Audi to Maths Dept
    { source: "O", target: "P", distance: 92 },   // Maths Dept to Swimming Pool
    { source: "P", target: "AA", distance: 18 },  // Swimming Pool to EEE Dept
    { source: "AA", target: "AJ", distance: 73 }, // EEE Dept to High Voltage Lab
    { source: "N", target: "Q", distance: 83 },   // Vivek Audi to Hostel Road
    { source: "Q", target: "R", distance: 110 },  // Hostel Road to Science and Humanities
    { source: "R", target: "S", distance: 38 },   // Science and Humanities to CSE Dept
    { source: "S", target: "T", distance: 50 },   // CSE Dept to IT Dept
    { source: "T", target: "Y", distance: 70 },   // IT Dept to Printing Dept
    { source: "T", target: "U", distance: 30 },   // IT Dept to Knowledge Park
    { source: "R", target: "V", distance: 48 },   // Science and Humanities to ECE Dept
    { source: "V", target: "W", distance: 43 },   // ECE Dept to NCC
    { source: "W", target: "Z", distance: 92 },   // NCC to Coffee Hut
    { source: "Z", target: "Y", distance: 18 },   // Coffee Hut to Printing Dept
    { source: "W", target: "X", distance: 47 },   // NCC to Manufacturing Dept
    { source: "P", target: "X", distance: 40 },   // Swimming Pool to Manufacturing Dept
    { source: "AJ", target: "AI", distance: 46 }, // High Voltage Lab to Transportation Eng/Soil Mechanics
    { source: "AH", target: "AK", distance: 150 },// Structural Eng Dept to Ocean Management
    { source: "AI", target: "AH", distance: 37 }, // Transportation Eng/Soil Mechanics to Structural Eng Dept
    { source: "AH", target: "AF", distance: 70 }, // Structural Eng Dept to Mech Road
    { source: "AF", target: "AE", distance: 54 }, // Mech Road to Mech Dept
    { source: "AF", target: "AG", distance: 45 }, // Mech Road to Tag Audi
    { source: "AK", target: "AL", distance: 82 }, // Ocean Management to Mining Dept
    { source: "AL", target: "AM", distance: 100 },// Mining Dept to Power System Engineering
    { source: "AM", target: "Z", distance: 38 }   // Power System Engineering to Coffee Hut
  ]);
  
  const [startNode, setStartNode] = useState("A");
  const [endNode, setEndNode] = useState("H");
  const [showAdvanced, setShowAdvanced] = useState(false);
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

    if (!edges.every(edge => {
      const sourceExists = nodes.some(node => node.id === edge.source);
      const targetExists = nodes.some(node => node.id === edge.target);
      
      if (!sourceExists || !targetExists) {
        toast({
          title: "Edge Validation Error",
          description: `Edge ${edge.source} → ${edge.target}: One or both nodes don't exist.`,
          variant: "destructive",
        });
        return false;
      }
      
      return edge.source && edge.target && typeof edge.distance === 'number';
    })) {
      return false;
    }
    
    return true;
  }, [nodes, edges, toast]);

  const bellmanFord = (graph: any) => {
    const { nodes, edges, start_node, end_node } = graph;
    
    // Validate inputs
    if (!start_node || !end_node) {
      return { error: "Start or end node is missing" };
    }
    
    // Create a map of node IDs for quick access
    const nodeMap = new Set(nodes.map((node: any) => node.id));
    
    // Check if start and end nodes exist
    if (!nodeMap.has(start_node)) {
      return { error: `Start node "${start_node}" not found in graph` };
    }
    if (!nodeMap.has(end_node)) {
      return { error: `End node "${end_node}" not found in graph` };
    }
    
    // Initialize distances and previous nodes
    const distances: { [key: string]: number } = {};
    const previous: { [key: string]: string | null } = {};
    
    // Set all distances to Infinity initially
    nodes.forEach((node: any) => {
      distances[node.id] = Infinity;
      previous[node.id] = null;
    });
    
    // Set distance to start node to 0
    distances[start_node] = 0;
    
    // Create a list of all edges for iteration
    const allEdges: {source: string, target: string, weight: number}[] = [];
    
    edges.forEach((edge: any) => {
      // Skip invalid edges
      if (!nodeMap.has(edge.source) || !nodeMap.has(edge.target)) {
        console.warn(`Skipping invalid edge: ${edge.source} → ${edge.target}`);
        return;
      }
      
      // Add edge in both directions for undirected graph
      allEdges.push({ source: edge.source, target: edge.target, weight: edge.weight });
      allEdges.push({ source: edge.target, target: edge.source, weight: edge.weight });
    });
    
    // Relax edges |V| - 1 times
    const numNodes = nodes.length;
    
    for (let i = 0; i < numNodes - 1; i++) {
      let hasChange = false;
      
      for (const edge of allEdges) {
        const { source, target, weight } = edge;
        
        if (distances[source] !== Infinity && distances[source] + weight < distances[target]) {
          distances[target] = distances[source] + weight;
          previous[target] = source;
          hasChange = true;
        }
      }
      
      // If no changes were made in this iteration, we can stop early
      if (!hasChange) break;
    }
    
    // Check for negative cycles (not usually needed for a physical map with positive distances)
    for (const edge of allEdges) {
      const { source, target, weight } = edge;
      
      if (distances[source] !== Infinity && distances[source] + weight < distances[target]) {
        return { error: "Graph contains a negative weight cycle" };
      }
    }
    
    // No path found
    if (distances[end_node] === Infinity) {
      return { error: "No path found between these locations" };
    }
    
    // Reconstruct path
    const path = [];
    let currentNode = end_node;
    
    while (currentNode) {
      path.unshift(currentNode);
      currentNode = previous[currentNode];
    }
    
    return {
      path: path,
      distance: distances[end_node]
    };
  };

  const handleCalculateShortestPath = async () => {
    if (!validateGraphData()) return;

    try {
      // Prepare data for Bellman-Ford algorithm
      const graphData = {
        nodes: nodes.map(node => ({ id: node.id })),
        edges: edges.map(edge => ({ 
          source: edge.source, 
          target: edge.target, 
          weight: edge.distance 
        })),
        start_node: startNode,
        end_node: endNode,
      };

      const result = bellmanFord(graphData);

      if (result.error) {
        toast({
          title: "Path Finding Error",
          description: result.error,
          variant: "destructive",
        });
        return;
      }

      // Format the path with location names for better readability
      const pathWithLabels = result.path.map(nodeId => {
        const node = nodes.find(n => n.id === nodeId);
        return node ? node.label : nodeId;
      });

      const shortestPath = {
        path: result.path,
        totalDistance: result.distance,
        pathWithLabels: pathWithLabels
      };

      onShortestPathCalculation(shortestPath);
      
      toast({
        title: "Success",
        description: `Shortest path found: ${result.path.join(" → ")} (${result.distance}m)`,
      });
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
    setNodes([...nodes, { id: `${String.fromCharCode(65 + nodes.length % 26)}${nodes.length >= 26 ? nodes.length - 25 : ''}`, label: `Location ${nodes.length + 1}`, lat: 13.0125, lng: 80.2340 }]);
  };

  const addEdge = () => {
    setEdges([...edges, { source: nodes[0]?.id || "", target: nodes[1]?.id || "", distance: 100 }]);
  };

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>CEG Campus Navigation</CardTitle>
        <CardDescription>Find the shortest path between campus locations</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="start-node">Start Location</Label>
            <Select value={startNode} onValueChange={setStartNode}>
              <SelectTrigger id="start-node">
                <SelectValue placeholder="Select start location" />
              </SelectTrigger>
              <SelectContent>
                {nodes.map((node) => (
                  <SelectItem key={node.id} value={node.id}>
                    {node.label} ({node.id})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="end-node">Destination</Label>
            <Select value={endNode} onValueChange={setEndNode}>
              <SelectTrigger id="end-node">
                <SelectValue placeholder="Select destination" />
              </SelectTrigger>
              <SelectContent>
                {nodes.map((node) => (
                  <SelectItem key={node.id} value={node.id}>
                    {node.label} ({node.id})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Button type="button" onClick={handleCalculateShortestPath} className="w-full">Find Shortest Path</Button>
        
        <div className="pt-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setShowAdvanced(!showAdvanced)} 
            className="w-full"
          >
            {showAdvanced ? "Hide Advanced Settings" : "Show Advanced Settings"}
          </Button>
        </div>
        
        {showAdvanced && (
          <>
            <div>
              <h3 className="text-lg font-semibold">Campus Locations</h3>
              {nodes.map((node, index) => (
                <div key={index} className="grid gap-2 mb-4 border-b pb-4">
                  <Label htmlFor={`node-${index}-id`}>Location ID</Label>
                  <Input
                    type="text"
                    id={`node-${index}-id`}
                    value={node.id}
                    onChange={(e) => handleNodeChange(index, 'id', e.target.value)}
                  />
                  <Label htmlFor={`node-${index}-label`}>Location Name</Label>
                  <Input
                    type="text"
                    id={`node-${index}-label`}
                    value={node.label}
                    onChange={(e) => handleNodeChange(index, 'label', e.target.value)}
                  />
                  <Label htmlFor={`node-${index}-lat`}>Latitude</Label>
                  <Input
                    type="number"
                    id={`node-${index}-lat`}
                    value={node.lat}
                    onChange={(e) => handleNodeChange(index, 'lat', parseFloat(e.target.value))}
                    step="0.0001"
                  />
                  <Label htmlFor={`node-${index}-lng`}>Longitude</Label>
                  <Input
                    type="number"
                    id={`node-${index}-lng`}
                    value={node.lng}
                    onChange={(e) => handleNodeChange(index, 'lng', parseFloat(e.target.value))}
                    step="0.0001"
                  />
                </div>
              ))}
              <Button type="button" variant="secondary" onClick={addNode}>Add Location</Button>
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-semibold">Road Connections</h3>
              {edges.map((edge, index) => (
                <div key={index} className="grid gap-2 mb-4 border-b pb-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor={`edge-${index}-source`}>From</Label>
                      <Select 
                        value={edge.source} 
                        onValueChange={(value) => handleEdgeChange(index, 'source', value)}
                      >
                        <SelectTrigger id={`edge-${index}-source`}>
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          {nodes.map((node) => (
                            <SelectItem key={node.id} value={node.id}>
                              {node.label} ({node.id})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor={`edge-${index}-target`}>To</Label>
                      <Select 
                        value={edge.target} 
                        onValueChange={(value) => handleEdgeChange(index, 'target', value)}
                      >
                        <SelectTrigger id={`edge-${index}-target`}>
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          {nodes.map((node) => (
                            <SelectItem key={node.id} value={node.id}>
                              {node.label} ({node.id})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Label htmlFor={`edge-${index}-distance`}>Distance (meters)</Label>
                  <Input
                    type="number"
                    id={`edge-${index}-distance`}
                    value={edge.distance}
                    onChange={(e) => handleEdgeChange(index, 'distance', parseFloat(e.target.value))}
                  />
                </div>
              ))}
              <Button type="button" variant="secondary" onClick={addEdge} className="mb-2">Add Road Connection</Button>
              <Button type="button" onClick={handleGraphUpdate} className="w-full mt-2">Update Map</Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default GraphInput;