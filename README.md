# HillWater

> **Predictive Water-Service Reliability for Hill Towns**
> *"Monitoring is the input. Decision is the product."*
> *Tagline: Smart Water. Stronger Hill Towns.*

HillWater is an intelligent water-network monitoring and decision-support platform designed for hill-town water distribution, demonstrated using the **Nainital Demonstration Network** (Uttarakhand) spanning elevations from **1,500m to 2,260m**.

---

## 🏔️ Core Product Story

Water problems in steep mountain terrain begin as subtle changes in pressure, gravity head loss, storage depletion, or tourist demand surges. HillWater detects these anomalies early, predicts impending failures, explains the mathematical root causes, and allows operators to test hydraulic interventions in a What-If Simulator before enacting changes in the field.

```
REAL-TIME DATA
  → ZONE-WISE UNDERSTANDING (Elevation + Pressure + Flow + Tank Level + Demand)
  → ZONE RISK & LEVEL (0-100, LOW/MED/HIGH/CRITICAL)
  → ROOT-CAUSE EXPLANATION (Why is this zone at risk?)
  → PREDICTION & HORIZON (~35 min)
  → RECOMMENDED ACTION
  → SCENARIO SIMULATION (Before vs After)
  → BETTER DECISION
```

---

## 🏞️ 12 Demonstration Zones (Nainital)

1. **Mallital** (2,050m) — Upper Basin / Tourist Hub
2. **Tallital** (1,980m) — Lake Outlet / Lower Commercial
3. **Sukhatal** (2,100m) — High Catchment / Recharge Basin
4. **Ayarpatta** (2,260m) — High Ridge Crest (Highest Zone)
5. **Sher Ka Danda** (2,200m) — Northern Ridge Crest
6. **Bara Bazaar** (2,000m) — Dense Heritage Market
7. **Mall Road** (1,950m) — Lakeside Commercial Promenade
8. **Bhotia Parao** (1,600m) — Mid-Slope Transit Node
9. **Hospital Road** (2,020m) — Critical Institutional Sector
10. **Talli Bamouri** (1,500m) — Valley Base / Feeder Node (Lowest Zone)
11. **Chhoti Kaimalta** (1,750m) — Eastern Hill Flank
12. **Ratighat** (1,550m) — River Confluence / Gravity Outflow

*Note: SIMULATED DEMO DATA — NOT LIVE SENSOR DATA.*

---

## ⚡ Key Features

- **Terrain-Aware Risk Engine**: Elevation mathematically increases gravity head loss, demand sensitivity, and baseline pressure stress.
- **Explainable Root Cause Breakdown**: Quantifies exact percentage drivers (Demand vs Supply, Pressure Trend, Elevation Constraint, Storage Deficit).
- **What-If Scenario Simulator**: Test pump boosting (+%), valve modulations, and demand-side management with instant before/after risk recalculation.
- **Tourist Demand Surge Simulation**: One-click simulation of 45%+ demand draw on tourist corridors (Mallital, Mall Road, Bara Bazaar).
- **30-Second Guided Demo Scenario Mode**: End-to-end automated demonstration of failure detection, root-cause explanation, alert dispatch, and simulated intervention.
- **Live Alert Feed with "Why This Alert?"**: Drilldown explaining hydraulic reasons with direct "Simulate Action" and "Notify Team" workflows.
- **GIS Topographic Map**: Leaflet map centered at Nainital (29.3919° N, 79.4542° E) with real-time colored risk status beacons.

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start Vite development server
npm run dev

# Build for production
npm run build
```
