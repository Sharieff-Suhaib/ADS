"use client";

import {useState, useEffect} from 'react';
import {Sidebar, SidebarContent, SidebarInset, SidebarProvider} from "@/components/ui/sidebar";
import GraphInput from "@/components/GraphInput";
import dynamic from 'next/dynamic';

// Dynamically import the MapComponent with SSR disabled for Leaflet
const MapComponent = dynamic(
  () => import('@/components/MapComponent'),
  { ssr: false }
);

export default function Home() {
  const [graphData, setGraphData] = useState({
    nodes: [
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
    ],
    edges: [
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
    ]
  });
  
  const [shortestPath, setShortestPath] = useState(null);

  const handleGraphUpdate = (newGraphData) => {
    setGraphData(newGraphData);
  };

  const handleShortestPathCalculation = (path) => {
    setShortestPath(path);
  };

  return (
    <main className="flex h-screen flex-col bg-background">
      <header className="border-b px-4 py-3">
        <h1 className="text-2xl font-bold">College of Engineering Guindy - Campus Navigator</h1>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        <SidebarProvider>
          <Sidebar defaultCollapsed={false} collapsible className="border-r">
            <SidebarContent className="w-80">
              <GraphInput
                onGraphUpdate={handleGraphUpdate}
                onShortestPathCalculation={handleShortestPathCalculation}
              />
            </SidebarContent>
          </Sidebar>
          <SidebarInset className="flex-1">
            <div className="h-full w-full">
              <MapComponent
                graphData={graphData}
                shortestPath={shortestPath}
              />
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </main>
  );
}