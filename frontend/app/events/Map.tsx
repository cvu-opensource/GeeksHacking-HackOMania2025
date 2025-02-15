"use client"

import { useState, useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Custom pin icon
const customIcon = new L.Icon({
  iconUrl: "/custom-pin.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
})

export default function Map({ events, hoveredEvent, setSelectedEvent }) {
  const [map, setMap] = useState(null)

  useEffect(() => {
    if (map && hoveredEvent) {
      map.setView(hoveredEvent.coordinates, 15)
    }
  }, [map, hoveredEvent])

  return (
    <MapContainer
      center={[1.3521, 103.8198]} // Singapore coordinates
      zoom={11}
      style={{ height: "100%", width: "100%", borderRadius: "0.5rem", overflow: "hidden" }}
      whenCreated={setMap}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
      {events.map((event) => (
        <Marker
          key={event.id}
          position={event.coordinates}
          icon={customIcon}
          eventHandlers={{
            mouseover: () => setSelectedEvent(event),
            mouseout: () => setSelectedEvent(null),
            click: () => setSelectedEvent(event),
          }}
        >
          <Popup>
            <div className="text-center">
              <h3 className="font-semibold">{event.title}</h3>
              <p className="text-sm">
                {event.date} at {event.time}
              </p>
              <p className="text-sm">{event.location}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

