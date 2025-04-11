"use client";

import {useEffect, useRef} from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

interface LeafletMapProps {
  graphData: { nodes: any[], edges: any[] };
  shortestPath: any;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({graphData, shortestPath}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    mapInstance.current = L.map(mapRef.current).setView([37.7749, -122.4194], 5);

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

    // Clear existing markers and polylines
    mapInstance.current.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        mapInstance.current?.removeLayer(layer);
      }
    });

    // Add nodes as markers
    graphData.nodes.forEach((node) => {
      L.marker([node.lat, node.lng]).addTo(mapInstance.current!).bindPopup(node.label);
    });

    // Add edges as polylines
    graphData.edges.forEach((edge) => {
      const sourceNode = graphData.nodes.find((node) => node.id === edge.source);
      const targetNode = graphData.nodes.find((node) => node.id === edge.target);

      if (sourceNode && targetNode) {
        const polyline = L.polyline(
          [[sourceNode.lat, sourceNode.lng], [targetNode.lat, targetNode.lng]],
          {color: 'blue'}
        ).addTo(mapInstance.current!);
      }
    });

    // Highlight the shortest path
    if (shortestPath) {
      const latlngs = shortestPath.path.map((nodeId) => {
        const node = graphData.nodes.find((node) => node.id === nodeId);
        return [node.lat, node.lng];
      });
      const polyline = L.polyline(latlngs, {color: 'orange', weight: 5}).addTo(mapInstance.current!);
    }
  }, [graphData, shortestPath]);

  return <div ref={mapRef} className="h-full w-full"/>;
};
