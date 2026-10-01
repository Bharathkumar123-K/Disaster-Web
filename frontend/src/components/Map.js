'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { indiaStatesGeoJSON } from '../data/indiaStatesGeoJSON';

// Fix Leaflet's default icon issue in Next.js
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const getSeverityColor = (severity) => {
  switch (severity) {
    case 'critical': return '#f43f5e';
    case 'high': return '#f59e0b';
    case 'medium': return '#38bdf8';
    case 'low': return '#10b981';
    default: return '#94a3b8';
  }
};

const createCustomIcon = (severity) => {
  const color = getSeverityColor(severity);
  const markerHtmlStyles = `
    background-color: ${color};
    width: 18px;
    height: 18px;
    display: block;
    left: -9px;
    top: -9px;
    position: relative;
    border-radius: 50%;
    border: 2px solid #0f172a;
    box-shadow: 0 0 12px ${color}, 0 0 4px ${color};
  `;
  return L.divIcon({
    className: 'custom-pin',
    iconAnchor: [0, 0],
    html: `<span style="${markerHtmlStyles}"></span>`,
  });
};

// Click handler component for Leaflet map pick mode
function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click: (e) => {
      if (onMapClick) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    }
  });
  return null;
}

export default function DisasterMap({ events, selectedLocation, onMapClick }) {
  // Center on India (Latitude 22.9734, Longitude 78.6569)
  const indiaCenter = [22.9734, 78.6569];
  const indiaBounds = [
    [6.0, 68.0],  // Southwest coordinates
    [37.5, 97.5]  // Northeast coordinates
  ];

  // State Boundary Style
  const stateStyle = {
    fillColor: '#06b6d4',
    weight: 1.5,
    opacity: 0.6,
    color: '#06b6d4',
    dashArray: '3',
    fillOpacity: 0.05
  };

  const onEachState = (feature, layer) => {
    if (feature.properties && feature.properties.name) {
      layer.bindTooltip(`<b>${feature.properties.name}</b>`, {
        permanent: false,
        direction: 'center',
        className: 'font-mono'
      });

      layer.on({
        mouseover: (e) => {
          const l = e.target;
          l.setStyle({ fillOpacity: 0.2, weight: 2.5, color: '#10b981' });
        },
        mouseout: (e) => {
          const l = e.target;
          l.setStyle(stateStyle);
        }
      });
    }
  };

  return (
    <div style={{ height: '100%', width: '100%', minHeight: '320px', borderRadius: '0 0 16px 16px', overflow: 'hidden', position: 'relative', zIndex: 1 }}>
      
      {/* Dark Tactical Map Legend Overlay */}
      <div style={{
        position: 'absolute',
        bottom: '16px',
        right: '16px',
        zIndex: 1000,
        background: 'rgba(15, 23, 42, 0.92)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '10px',
        padding: '0.65rem 0.85rem',
        fontSize: '0.72rem',
        color: '#ffffff',
        boxShadow: '0 10px 25px rgba(0,0,0,0.6)'
      }}>
        <div style={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px', color: '#38bdf8' }}>
          🇮🇳 India Tactical Map Grid
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f43f5e', boxShadow: '0 0 6px #f43f5e' }} />
            <span>Critical</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 6px #f59e0b' }} />
            <span>High</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#38bdf8', boxShadow: '0 0 6px #38bdf8' }} />
            <span>Medium</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
            <span>Low</span>
          </div>
        </div>
      </div>

      <MapContainer 
        center={selectedLocation ? [selectedLocation.lat, selectedLocation.lng] : indiaCenter} 
        zoom={selectedLocation ? 8 : 5} 
        maxBounds={indiaBounds}
        maxBoundsViscosity={0.8}
        style={{ height: '100%', width: '100%', minHeight: '320px', zIndex: 1, background: '#0b0f19' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.esri.com/">Esri</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
          maxZoom={16}
        />

        {/* India State Boundaries GeoJSON Overlay */}
        <GeoJSON 
          data={indiaStatesGeoJSON} 
          style={stateStyle} 
          onEachFeature={onEachState} 
        />

        {/* Map Click Listener */}
        {onMapClick && <MapClickHandler onMapClick={onMapClick} />}

        {/* Active Selected Location Pin (if picking) */}
        {selectedLocation && (
          <Marker 
            position={[selectedLocation.lat, selectedLocation.lng]} 
            icon={createCustomIcon('critical')}
          >
            <Popup>
              <div style={{ color: '#0f172a', fontWeight: 700 }}>
                📍 Selected Location<br />
                <span>{selectedLocation.city || 'Custom Pin'}</span><br />
                <span style={{ fontSize: '0.75rem', color: '#475569' }}>
                  {selectedLocation.lat.toFixed(4)}° N, {selectedLocation.lng.toFixed(4)}° E
                </span>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Incident Events Pins */}
        {events && events.map((evt) => {
          if (!evt.location || !evt.location.coordinates) return null;
          // MongoDB stores [lng, lat], Leaflet expects [lat, lng]
          const position = [evt.location.coordinates[1], evt.location.coordinates[0]];
          
          return (
            <Marker 
              key={evt._id} 
              position={position}
              icon={createCustomIcon(evt.severity)}
            >
              <Popup>
                <div style={{ color: '#0f172a', padding: '4px' }}>
                  <strong style={{ textTransform: 'uppercase', fontSize: '0.85rem' }}>{evt.category}</strong> - <span style={{ textTransform: 'capitalize', color: getSeverityColor(evt.severity), fontWeight: 700 }}>{evt.severity}</span><br />
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e293b' }}>{evt.locationName}</span><br />
                  <span style={{ fontSize: '0.75rem', color: '#475569' }}>{evt.text?.substring(0, 90)}...</span><br />
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#047857' }}>Confidence: {evt.confidenceScore}%</span>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
