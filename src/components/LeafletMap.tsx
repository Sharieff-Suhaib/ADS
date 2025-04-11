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

  useEffect(() => {
    if (!mapRef.current) return;

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

    mapInstance.current.eachLayer((layer) => {
      if (layer instanceof L.Marker || (LRM && LRM.Routing && layer instanceof LRM.Routing.Control)) {
        mapInstance.current?.removeLayer(layer);
      }
    });

    graphData.nodes.forEach((node) => {
      if (node.lat && node.lng) {
        L.marker([node.lat, node.lng]).addTo(mapInstance.current!).bindPopup(node.label);
      }
    });

    if (shortestPath && shortestPath.path.length > 0) {
      const waypoints = shortestPath.path.map((nodeId) => {
        const node = graphData.nodes.find((node) => node.id === nodeId);
        if (!node || !node.lat || !node.lng) {
          toast({
            title: "Error",
            description: `Could not find coordinates for node ${nodeId}.`,
            variant: "destructive",
          });
          return null;
        }
        return L.latLng(node.lat, node.lng);
      }).filter(node => node !== null);

      if (waypoints.length < 2) {
        toast({
          title: "Error",
          description: "At least two valid nodes are required to draw a route.",
          variant: "destructive",
        });
        return;
      }

      if (routingControl.current && mapInstance.current) {
        mapInstance.current.removeControl(routingControl.current);
      }

      try {
        if (LRM && LRM.Routing && mapInstance.current) {
          routingControl.current = LRM.Routing.control({
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
      } catch (error: any) {
        toast({
          title: "Routing Error",
          description: `Failed to calculate route: ${error.message}`,
          variant: "destructive",
        });
        console.error("Routing error:", error);
      }
    }
  }, [graphData, shortestPath, toast]);

  return <div ref={mapRef} className="h-full w-full"/>;
};
