"use client";

import {useEffect, useRef} from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {useToast} from "@/hooks/use-toast";

interface LeafletMapProps {
  graphData: { 
    nodes: Array<{id: string, label: string, lat: number, lng: number}>, 
    edges: Array<{source: string, target: string, distance: number}> 
  };
  shortestPath: {
    path: string[],
    totalDistance: number
  } | null;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({graphData, shortestPath}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const {toast} = useToast();
  const markersRef = useRef<L.Marker[]>([]);
  const edgeLinesRef = useRef<L.Polyline[]>([]);
  const pathLinesRef = useRef<L.Polyline[]>([]);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) return;

    // CEG coordinates
    const cegCenter = [13.0130, 80.2340];
    
    mapInstance.current = L.map(mapRef.current).setView(cegCenter as L.LatLngExpression, 17);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapInstance.current);

    return () => {
      mapInstance.current?.remove();
      mapInstance.current = null;
    };
  }, []);

  // Update map with graph data and shortest path
  useEffect(() => {
    if (!mapInstance.current || !graphData.nodes.length) return;

    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapInstance.current?.removeLayer(marker);
    });
    markersRef.current = [];

    // Clear existing edge lines
    edgeLinesRef.current.forEach(line => {
      mapInstance.current?.removeLayer(line);
    });
    edgeLinesRef.current = [];

    // Clear existing path lines
    pathLinesRef.current.forEach(line => {
      mapInstance.current?.removeLayer(line);
    });
    pathLinesRef.current = [];

    // Custom node icon
    const nodeIcon = L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="background-color: #3b82f6; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });

    // Add nodes (locations)
    graphData.nodes.forEach((node) => {
      if (typeof node.lat === 'number' && typeof node.lng === 'number') {
        const marker = L.marker([node.lat, node.lng], {
          icon: nodeIcon
        })
        .addTo(mapInstance.current!)
        .bindPopup(`<strong>${node.label}</strong><br>ID: ${node.id}`);
        
        markersRef.current.push(marker);
      }
    });

    // Create a node lookup for efficient edge drawing
    const nodeMap = graphData.nodes.reduce((acc, node) => {
      acc[node.id] = node;
      return acc;
    }, {} as Record<string, typeof graphData.nodes[0]>);

    // Draw all edges (roads) as gray lines
    graphData.edges.forEach((edge) => {
      const sourceNode = nodeMap[edge.source];
      const targetNode = nodeMap[edge.target];

      if (sourceNode && targetNode && 
          typeof sourceNode.lat === 'number' && typeof sourceNode.lng === 'number' &&
          typeof targetNode.lat === 'number' && typeof targetNode.lng === 'number') {
        
        const line = L.polyline(
          [
            [sourceNode.lat, sourceNode.lng],
            [targetNode.lat, targetNode.lng],
          ],
          {
            color: '#9ca3af', // Gray
            weight: 3,
            opacity: 0.7,
            dashArray: '5, 5',
          }
        )
        .addTo(mapInstance.current!)
        .bindTooltip(`${edge.distance}m`);
        
        edgeLinesRef.current.push(line);
      }
    });

    // Draw shortest path if available
    if (shortestPath && shortestPath.path.length > 1) {
      const pathCoordinates: L.LatLngExpression[] = [];
      
      // Convert path node IDs to coordinates
      shortestPath.path.forEach(nodeId => {
        const node = nodeMap[nodeId];
        if (node && typeof node.lat === 'number' && typeof node.lng === 'number') {
          pathCoordinates.push([node.lat, node.lng]);
        }
      });
      
      if (pathCoordinates.length > 1) {
        // Create path polyline
        const pathLine = L.polyline(
          pathCoordinates,
          {
            color: '#ef4444', // Red
            weight: 5,
            opacity: 0.8,
          }
        )
        .addTo(mapInstance.current!)
        .bindTooltip(`Shortest path: ${shortestPath.totalDistance}m`);
        
        pathLinesRef.current.push(pathLine);
        
        // Fit map to show the path
        mapInstance.current.fitBounds(pathLine.getBounds(), {
          padding: [50, 50],
          maxZoom: 18,
        });
      }
    }
  }, [graphData, shortestPath]);

  return <div ref={mapRef} className="h-full w-full"/>;
};

export default LeafletMap;