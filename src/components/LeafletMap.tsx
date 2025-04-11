"use client";

import {useEffect, useRef} from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
// Corrected import:  Import leaflet-routing-machine as a module
import * as LRM from 'leaflet-routing-machine'; 
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

interface LeafletMapProps {
  graphData: { nodes: any[], edges: any[] };
  shortestPath: any;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({graphData, shortestPath}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const routingControl = useRef<LRM.Routing.Control | null>(null); // Use the correct type here

  useEffect(() => {
    if (!mapRef.current) return;

    // Set initial view to India
    mapInstance.current = L.map(mapRef.current).setView([20.5937, 78.9629], 5);

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
      if (layer instanceof L.Marker || (LRM && LRM.Routing && layer instanceof LRM.Routing.Control)) { // Check for LRM.Routing.Control
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

      if (routingControl.current && mapInstance.current) {
        mapInstance.current.removeControl(routingControl.current);
      }

      if (LRM && LRM.Routing && mapInstance.current) {
          routingControl.current = LRM.Routing.control({ // Use LRM.Routing here
            waypoints: waypoints,
            lineOptions: {
              styles: [{color: 'orange', opacity: 1, weight: 5}]
            },
            createMarker: function() { return null; },
            show: false,
            addWaypoints: false,
            routeWhileDragging: false,
            useZoomParameter: false,
          }).addTo(mapInstance.current);
      }
    }
  }, [graphData, shortestPath]);

  return <div ref={mapRef} className="h-full w-full"/>;
};
