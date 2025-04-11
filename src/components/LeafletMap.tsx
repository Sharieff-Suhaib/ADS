"use client";

import {useEffect, useRef} from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import * as LRM from 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import {useToast} from "@/hooks/use-toast";

interface LeafletMapProps {
  graphData: { nodes: any[], edges: any[] };
  shortestPath: any;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({graphData, shortestPath}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const routingControl = useRef<LRM.Routing.Control | null>(null);
  const {toast} = useToast();
  const shortestPathLines = useRef<L.Polyline[]>([]);

  useEffect(() => {
    if (!mapRef.current) return;

    mapInstance.current = L.map(mapRef.current).setView([13.0075, 80.2398], 16); // Set view to Anna University

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapInstance.current);

    return () => {
      mapInstance.current?.remove();
      mapInstance.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapInstance.current) return;

    // Clear existing markers, routes and shortest path lines
    mapInstance.current.eachLayer((layer) => {
      if (layer instanceof L.Marker || (LRM && LRM.Routing && layer instanceof LRM.Routing.Control) || layer instanceof L.Polyline) {
        mapInstance.current?.removeLayer(layer);
      }
    });

    // Clear shortest path lines array
    shortestPathLines.current.forEach(line => {
        mapInstance.current?.removeLayer(line);
    });
    shortestPathLines.current = [];

    graphData.nodes.forEach((node) => {
      if (node.lat && node.lng) {
        L.marker([node.lat, node.lng]).addTo(mapInstance.current!).bindPopup(node.label);
      }
    });

      if (shortestPath && shortestPath.path.length > 0) {
          // Find the edges that are part of the shortest path
          const shortestPathEdges = [];
          for (let i = 0; i < shortestPath.path.length - 1; i++) {
              const sourceNodeId = shortestPath.path[i];
              const targetNodeId = shortestPath.path[i + 1];
              const edge = graphData.edges.find(
                  (edge) => edge.source === sourceNodeId && edge.target === targetNodeId
              );
              if (edge) {
                  shortestPathEdges.push(edge);
              }
          }

          // Draw polylines for the shortest path edges
          shortestPathEdges.forEach((edge) => {
              const sourceNode = graphData.nodes.find((node) => node.id === edge.source);
              const targetNode = graphData.nodes.find((node) => node.id === edge.target);

              if (sourceNode && targetNode && sourceNode.lat && sourceNode.lng && targetNode.lat && targetNode.lng) {
                  const polyline = L.polyline(
                      [
                          [sourceNode.lat, sourceNode.lng],
                          [targetNode.lat, targetNode.lng],
                      ],
                      {
                          color: 'orange', // Highlight color
                          weight: 5,       // Make the line thicker
                          opacity: 0.7,
                      }
                  ).addTo(mapInstance.current!);
                  shortestPathLines.current.push(polyline);
              }
          });
      }
  }, [graphData, shortestPath, toast]);

  return <div ref={mapRef} className="h-full w-full"/>;
};
