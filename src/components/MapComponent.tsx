"use client";

import {useEffect, useRef} from 'react';
import 'leaflet/dist/leaflet.css';
import dynamic from 'next/dynamic';
import L from 'leaflet';

interface MapComponentProps {
  graphData: { nodes: any[], edges: any[] };
  shortestPath: any;
}

const LeafletMap = dynamic(
  () => import('./LeafletMap').then((mod) => mod.LeafletMap),
  {ssr: false}
);

const MapComponent: React.FC<MapComponentProps> = ({graphData, shortestPath}) => {
  return <LeafletMap graphData={graphData} shortestPath={shortestPath} />;
};

export default MapComponent;
