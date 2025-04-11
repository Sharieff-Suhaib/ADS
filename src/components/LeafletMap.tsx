"use client";

import {useEffect, useRef} from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

interface LeafletMapProps {
  graphData: { nodes: any[], edges: any[] };
  shortestPath: any;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({graphData, shortestPath}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const routingControl = useRef<L.Routing.Control | null>(null);

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

    // Clear existing markers and routes
    mapInstance.current.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Routing.Control) {
        mapInstance.current?.removeLayer(layer);
      }
    });

    // Add nodes as markers
    graphData.nodes.forEach((node) => {
      if (node.lat && node.lng) {
        L.marker([node.lat, node.lng]).addTo(mapInstance.current!).bindPopup(node.label);
      }
    });

    // Display shortest path using Leaflet Routing Machine
    if (shortestPath && shortestPath.path.length > 0) {
      const waypoints = shortestPath.path.map((nodeId) => {
        const node = graphData.nodes.find((node) => node.id === nodeId);
        return L.latLng(node.lat, node.lng);
      });

      if (routingControl.current) {
        mapInstance.current.removeControl(routingControl.current);
      }

      routingControl.current = L.Routing.control({
        waypoints: waypoints,
        lineOptions: {
          styles: [{color: 'orange', opacity: 1, weight: 5}]
        },
        createMarker: function() { return null; },
        show: false,
        addWaypoints: false,
        routeWhileDragging: false,
        draggableWaypoints: false,
        useZoomParameter: false,
      }).addTo(mapInstance.current);
    }
  }, [graphData, shortestPath]);

  return <div ref={mapRef} className="h-full w-full"/>;
};
