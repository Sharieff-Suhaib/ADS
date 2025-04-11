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
        {id: "A", label: "Main Building", lat: 13.0105, lng: 80.2359},
        {id: "B", label: "Tagore Auditorium", lat: 13.0084, lng: 80.2377},
      ],
      edges: [
        {source: "A", target: "B", distance: 100},
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
          <div className="h-full">
            <MapComponent
              graphData={graphData}
              shortestPath={shortestPath}
            />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

