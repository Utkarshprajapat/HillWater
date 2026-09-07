import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet'
import { Link } from 'react-router-dom'
import { Mountain, Gauge, Droplets, ArrowRight, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { NAINITAL_ZONES_CONFIG } from '../../utils/riskEngine'

// Nainital Center Coordinates (Demonstration Network)
const NAINITAL_CENTER = [29.3919, 79.4542]

function MapController({ center, zoom }) {
  const map = useMap()
  useEffect(() => {
    if (center) {
      map.setView(center, zoom, { animate: true })
    }
  }, [center, zoom, map])
  return null
}

const CityMap = ({ zones = [], selectedZone = null, onZoneSelect }) => {
  const [mapCenter, setMapCenter] = useState(NAINITAL_CENTER)
  const [mapZoom, setMapZoom] = useState(13)

  useEffect(() => {
    if (selectedZone && selectedZone.lat && selectedZone.lng) {
      setMapCenter([selectedZone.lat, selectedZone.lng])
      setMapZoom(14)
    }
  }, [selectedZone])

  const getMarkerColor = (zone) => {
    if (zone.riskLevel === 'CRITICAL' || zone.riskScore >= 75) return '#EF4444' // red
    if (zone.riskLevel === 'HIGH' || zone.riskScore >= 55) return '#F97316' // orange
    if (zone.riskLevel === 'MEDIUM' || zone.riskScore >= 35) return '#F59E0B' // amber
    return '#10B981' // green normal
  }

  return (
    <div className="relative w-full h-[420px] rounded-xl overflow-hidden border border-slate-200 shadow-sm">
      {/* Permanent Overlay Badge */}
      <div className="absolute top-3 left-3 z-[1000] bg-slate-900/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs shadow-md border border-slate-700 flex items-center gap-2">
        <Mountain className="w-4 h-4 text-sky-400" />
        <div>
          <span className="font-bold block leading-none">Nainital Demonstration Network</span>
          <span className="text-[10px] text-slate-300">12 Topographic Zones (1,500m–2,260m)</span>
        </div>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-3 right-3 z-[1000] bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg text-[11px] shadow-md border border-slate-200 space-y-1">
        <span className="font-bold text-slate-700 block text-[10px] uppercase tracking-wider mb-1">Zone Risk Status</span>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span className="text-slate-600">Normal (0–34)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <span className="text-slate-600">Medium (35–54)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
          <span className="text-slate-600">High / Critical (55+)</span>
        </div>
      </div>

      <MapContainer
        center={NAINITAL_CENTER}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <MapController center={mapCenter} zoom={mapZoom} />

        {/* Public OpenStreetMap Base Layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {zones.map((zone) => {
          const lat = zone.lat || 29.3919
          const lng = zone.lng || 79.4542
          const color = getMarkerColor(zone)
          const isSelected = selectedZone && (selectedZone.id === zone.id || selectedZone.name === zone.name)

          return (
            <CircleMarker
              key={zone.id}
              center={[lat, lng]}
              radius={isSelected ? 16 : 12}
              pathOptions={{
                color: isSelected ? '#0F172A' : color,
                weight: isSelected ? 3 : 2,
                fillColor: color,
                fillOpacity: 0.85,
              }}
              eventHandlers={{
                click: () => onZoneSelect && onZoneSelect(zone),
              }}
            >
              <Popup className="custom-leaflet-popup">
                <div className="p-1 text-slate-900 max-w-[220px]">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-1.5 mb-2">
                    <span className="font-extrabold text-sm text-slate-900">{zone.name}</span>
                    <span className="text-[10px] font-mono bg-sky-100 text-sky-800 font-bold px-1.5 py-0.5 rounded">
                      {zone.elevation}m
                    </span>
                  </div>

                  <p className="text-[10px] text-slate-500 mb-2">{zone.terrain || 'Hill Slope Zone'}</p>

                  <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                    <div className="bg-slate-50 p-1.5 rounded border border-slate-100">
                      <span className="text-[9px] text-slate-400 block uppercase">Pressure</span>
                      <span className="font-bold font-mono text-slate-800">{zone.pressure} bar</span>
                    </div>
                    <div className="bg-slate-50 p-1.5 rounded border border-slate-100">
                      <span className="text-[9px] text-slate-400 block uppercase">Risk Score</span>
                      <span className="font-bold font-mono" style={{ color }}>{zone.riskScore} / 100</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                    <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                      zone.riskLevel === 'CRITICAL' ? 'bg-rose-100 text-rose-800' :
                      zone.riskLevel === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                      zone.riskLevel === 'MEDIUM' ? 'bg-amber-100 text-amber-800' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      {zone.riskLevel} Risk
                    </span>
                    <Link
                      to={`/zone/${zone.id}`}
                      className="text-[11px] text-sky-600 font-bold hover:underline flex items-center gap-0.5"
                    >
                      Details <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          )
        })}
      </MapContainer>
    </div>
  )
}

export default CityMap
