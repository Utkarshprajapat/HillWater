/**
 * HILLWATER - System Hierarchy Mapping
 * Hill Town Demonstration Network (Nainital, Uttarakhand)
 * 
 * Level: Demonstration Zone -> DMA Node -> Sector / Pressure Sub-Area
 */

import { NAINITAL_ZONES_CONFIG } from './riskEngine'

export const NAINITAL_DEMO_ZONES = [
  'Mallital',
  'Tallital',
  'Sukhatal',
  'Ayarpatta',
  'Sher Ka Danda',
  'Bara Bazaar',
  'Mall Road',
  'Bhotia Parao',
  'Hospital Road',
  'Talli Bamouri',
  'Chhoti Kaimalta',
  'Ratighat'
];

/**
 * Returns full metadata and hierarchy for a given zone ID or name
 */
export const getHierarchy = (idOrName) => {
  if (!idOrName) {
    const defaultZone = NAINITAL_ZONES_CONFIG[0];
    return {
      zoneId: defaultZone.id,
      zoneName: defaultZone.name,
      elevation: defaultZone.elevation,
      terrain: defaultZone.terrain,
      dma: 'DMA-01',
      area: 'Upper Feeder Node',
      fullPath: `Nainital Demonstration Network → ${defaultZone.name} (${defaultZone.elevation}m) → DMA-01`,
      isDemonstration: true,
    };
  }

  // Find in config by ID (e.g. "MAL", "MAL-1-1") or by Name (e.g. "Mallital")
  const idStr = String(idOrName).toUpperCase();
  const zoneConfig = NAINITAL_ZONES_CONFIG.find(
    z => z.id === idStr || 
         idStr.startsWith(z.id) || 
         z.name.toUpperCase() === idStr || 
         idStr.includes(z.name.toUpperCase())
  ) || NAINITAL_ZONES_CONFIG[0];

  // Extract DMA suffix if present
  let dmaNum = 1;
  const parts = String(idOrName).split('-');
  if (parts.length >= 3) {
    dmaNum = parseInt(parts[2]) || 1;
  }

  return {
    zoneId: zoneConfig.id,
    zoneName: zoneConfig.name,
    elevation: zoneConfig.elevation,
    terrain: zoneConfig.terrain,
    dma: `DMA-0${dmaNum}`,
    area: `${zoneConfig.name} Sector ${dmaNum}`,
    fullPath: `Nainital Demonstration Network → ${zoneConfig.name} (${zoneConfig.elevation}m) → DMA-0${dmaNum}`,
    isDemonstration: true,
    targetPressure: zoneConfig.targetPressure,
    minPressure: zoneConfig.minPressure,
    maxPressure: zoneConfig.maxPressure,
  };
};

export const getTalukas = () => NAINITAL_DEMO_ZONES;
export const getDemonstrationZones = () => NAINITAL_ZONES_CONFIG;
