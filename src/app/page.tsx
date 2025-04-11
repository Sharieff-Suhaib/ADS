"use client";

import {useState, useEffect} from 'react';
import {Sidebar, SidebarContent, SidebarInset, SidebarProvider} from "@/components/ui/sidebar";
import GraphInput from "@/components/GraphInput";
import MapComponent from "@/components/MapComponent";

export default function Home() {
  const [graphData, setGraphData] = useState({nodes: [], edges: []});
  const [shortestPath, setShortestPath] = useState(null);

  useEffect(() => {
    // Example data for testing:
    const initialGraphData = {
      nodes: [
        {id: "A", label: "Node A", lat: 37.7749, lng: -122.4194},
        {id: "B", label: "Node B", lat: 34.0522, lng: -118.2437},
        {id: "C", label: "Node C", lat: 40.7128, lng: -74.0060},
      ],
      edges: [
        {source: "A", target: "B", distance: 10},
        {source: "B", target: "C", distance: 15},
        {source: "A", target: "C", distance: 20},
      ],
    };
    setGraphData(initialGraphData);
  }, []);

  const handleGraphUpdate = (newGraphData) => {
    setGraphData(newGraphData);
  };

  const handleShortestPathCalculation = (path) => {
    setShortestPath(path);
  };

  return (
    <div className="flex h-screen bg-secondary">
      <SidebarProvider>
        <Sidebar collapsible="icon">
          <SidebarContent>
            <GraphInput
              onGraphUpdate={handleGraphUpdate}
              onShortestPathCalculation={handleShortestPathCalculation}
            />
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <MapComponent
            graphData={graphData}
            shortestPath={shortestPath}
          />
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

    