"use client";

import {useState, useEffect} from 'react';
import {Sidebar, SidebarContent, SidebarInset, SidebarProvider} from "@/components/ui/sidebar";
import GraphInput from "@/components/GraphInput";
import MapComponent from "@/components/MapComponent";

export default function Home() {
  const [graphData, setGraphData] = useState({nodes: [], edges: []});
  const [shortestPath, setShortestPath] = useState(null);

  useEffect(() => {
    // Example data for Anna University, Chennai, Guindy
    const initialGraphData = {
      nodes: [
        {id: "A", label: "Main Building Entrance", lat: 13.0065, lng: 80.2405},
        {id: "B", label: "Tagore Auditorium Entrance", lat: 13.0087, lng: 80.2391},
        {id: "C", label: "Road Junction 1", lat: 13.0075, lng: 80.2398},
      ],
      edges: [
        {source: "A", target: "C", distance: 50},
        {source: "C", target: "B", distance: 60},
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

