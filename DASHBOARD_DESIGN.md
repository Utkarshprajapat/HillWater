# Main Dashboard UI Design Documentation

## UI Layout Explanation (Linked to Problem Statement)

### Problem → Solution Mapping

#### 1. **TOP BAR (Authority & Context)**
**Problem Addressed:** Need for clear system identification and real-time status awareness

**Solution:**
- **Logo/Text:** "Solapur Municipal Corporation" - Establishes authority
- **Project Title:** "Smart Water Pressure Management System" - Clear system identification
- **Live System Status Indicator:** Green/Red dot with "System Live/Offline" - Immediate connection status
- **Current Date & Time:** Real-time clock updating every second - Temporal context for operators

**User Benefit:** Operators instantly know system status and current time for logging/decision-making

---

#### 2. **CITY OVERVIEW PANEL (At-a-glance insights)**
**Problem Addressed:** "No real-time visibility or analytics for decision-makers"

**Solution:**
- **Total Distribution Zones:** Quick count of system coverage
- **Zones with Low Pressure:** Immediate identification of problem areas (highlighted if > 0)
- **Active Leak Alerts:** Real-time leak detection count (critical for non-revenue water)
- **Estimated Non-Revenue Water (%):** Key efficiency metric (color-coded: <30% green, 30-35% amber, >35% red)

**User Benefit:** Decision-makers can assess entire system health in < 5 seconds

---

#### 3. **INTERACTIVE CITY MAP (CORE FEATURE)**
**Problem Addressed:** "Uneven water pressure (especially tail-end & elevated areas)" + "No real-time visibility"

**Solution:**
- **Leaflet-based Map:** Geographic visualization of Solapur city
- **Zones Plotted Geographically:** Each zone marked at its actual location
- **Color Coding:**
  - 🟢 Green → Normal pressure (≥ minimum threshold)
  - 🟡 Yellow/Amber → Warning (below minimum but close)
  - 🔴 Red → Critical (significantly below minimum)
- **Clickable Zones:** Click to see popup with zone details, navigate to full details

**User Benefit:** Engineers can visually identify geographic patterns (e.g., "all tail-end zones are red") instantly

---

#### 4. **ZONE STATUS GRID**
**Problem Addressed:** "Highlights inequity in water distribution clearly" + "Irregular water supply schedules"

**Solution:**
Each zone card displays:
- **Zone Name & Area:** Clear identification
- **Pressure Bar:** Visual progress bar showing current pressure vs. min/max range
  - Color-coded: Green (normal), Amber (warning), Red (critical)
  - Shows actual PSI value
  - Displays min/max thresholds
- **Flow (L/min):** Water flow rate for each zone
- **Status Badge:** Icon + text (Normal/Warning/Critical)
- **Last Updated Timestamp:** "Updated 2 minutes ago" format

**User Benefit:** Operators can quickly scan all zones, identify which need attention, and see when data was last updated

---

#### 5. **ANALYTICS & TRENDS PANEL**
**Problem Addressed:** "Supports planning, forecasting, and delayed fault detection problems"

**Solution:**
- **Line Chart: Pressure vs Time:** Shows average city-wide pressure trends
  - Reference line for minimum threshold
  - Highlights abnormal drops
- **Line Chart: Flow vs Time:** Shows average flow trends across zones
- **Time Filters:** 1h / 6h / 24h buttons to adjust time range
- **Abnormal Drop Detection:** Alert banner when pressure drops below thresholds detected

**User Benefit:** 
- Engineers can identify trends (e.g., "pressure drops every evening")
- Detect delayed faults (gradual pressure decline)
- Plan maintenance based on patterns

---

#### 6. **ALERTS & ACTION PANEL**
**Problem Addressed:** "Reduces response delay and manual inefficiencies"

**Solution:**
- **Active Alerts List:** Shows unacknowledged alerts (max 5 visible, scrollable)
- **Severity Indicators:** Color-coded badges (Critical/Warning/Info)
- **Clear Messages:** Non-technical language (e.g., "Low Pressure Detected - Central Zone")
- **Resolve/Acknowledge Button:** One-click to mark alert as handled

**User Benefit:** 
- Operators never miss critical issues
- Quick acknowledgment reduces manual tracking
- Clear messages reduce interpretation time

---

## Component Tree

```
Overview (Main Dashboard Page)
├── CityOverviewPanel
│   ├── MetricCard (Total Zones)
│   ├── MetricCard (Low Pressure Zones)
│   ├── MetricCard (Active Leak Alerts)
│   └── MetricCard (Non-Revenue Water %)
│
├── CityMap
│   ├── MapContainer (Leaflet)
│   ├── TileLayer
│   ├── CircleMarker[] (one per zone)
│   │   └── Popup (zone details)
│   └── Legend
│
├── ZoneStatusGrid
│   └── ZoneCard[] (one per zone)
│       ├── Zone Name & Status Badge
│       ├── Pressure Bar
│       ├── Flow Display
│       └── Last Updated Timestamp
│
├── AnalyticsTrendsPanel
│   ├── TimeFilterButtons (1h/6h/24h)
│   ├── AbnormalDropAlert (conditional)
│   ├── PressureChart (LineChart)
│   └── FlowChart (LineChart)
│
└── AlertsActionPanel
    └── AlertCard[] (active alerts)
        ├── Severity Icon & Badge
        ├── Alert Message
        └── Resolve Button
```

---

## Folder Structure

```
src/
├── pages/
│   └── Overview.jsx                    # Main dashboard page
│
├── components/
│   ├── Layout/
│   │   └── Header.jsx                  # Top bar with SMC branding, status, time
│   │
│   └── Dashboard/
│       ├── CityOverviewPanel.jsx       # Section 2: City overview metrics
│       ├── CityMap.jsx                 # Section 3: Interactive map
│       ├── ZoneStatusGrid.jsx          # Section 4: Zone cards grid
│       ├── AnalyticsTrendsPanel.jsx    # Section 5: Charts with time filters
│       └── AlertsActionPanel.jsx       # Section 6: Alerts with resolve
│
├── context/
│   └── DataContext.jsx                 # Global state (zones, alerts, metrics)
│
└── services/
    ├── api.js                          # API service layer
    └── mockData.js                     # Mock data generator (includes flow, NRW)
```

---

## Styling Approach

### Color Palette
- **Primary:** Municipal Blue (`#0c82f5`) - Authority, trust
- **Neutral:** Gray scale (50-900) - Professional backgrounds
- **Status Colors:**
  - Green: Normal/Healthy
  - Amber: Warning/Marginal
  - Red: Critical/Urgent

### Typography
- **Font:** Inter (system fallback)
- **Hierarchy:**
  - Headings: `font-semibold` or `font-bold`
  - Body: `font-medium` or default
  - Labels: `text-xs` or `text-sm`

### Layout
- **Grid System:** Tailwind CSS grid (responsive: 1 col mobile, 2-4 cols desktop)
- **Spacing:** Consistent `gap-4` or `gap-6` between sections
- **Cards:** White background, `border-municipal-gray-200`, `rounded-lg`, subtle shadow on hover

### Responsive Design
- **Large Screens (Control Rooms):** Full layout with all sections visible
- **Medium Screens:** Stacked layout, collapsible sidebar
- **Mobile:** Single column, bottom navigation

---

## Data Flow

```
DataContext (Global State)
    ↓
    ├── Zones (with pressure, flow, coordinates)
    ├── System Metrics (NRW, efficiency, health)
    ├── Alerts (with severity, timestamps)
    └── Real-time Updates (Socket.io)
         ↓
    Components consume via useData() hook
         ↓
    UI updates automatically
```

---

## Key Design Decisions

1. **Single Page Dashboard:** All critical information on one screen (no navigation needed for overview)
2. **Color-Coded Status:** Immediate visual recognition (green/amber/red)
3. **Progressive Disclosure:** Overview → Map → Grid → Detail pages
4. **Real-time Updates:** Socket.io integration for live data
5. **Non-Technical Language:** Alerts use plain language for decision-makers
6. **Time Context:** Every timestamp shows relative time ("2 minutes ago")
7. **Actionable:** Every alert has a "Resolve" button

---

## User Workflows

### Workflow 1: Daily System Check
1. Operator opens dashboard
2. Sees City Overview Panel → "3 zones with low pressure"
3. Checks City Map → Sees red markers in tail-end areas
4. Reviews Zone Status Grid → Identifies specific zones
5. Checks Alerts Panel → Sees active leak alerts
6. Takes action

### Workflow 2: Investigating Pressure Drop
1. Operator notices pressure drop in Analytics chart
2. Clicks on red zone marker on map
3. Views zone details
4. Checks Analytics trends for that zone
5. Identifies pattern (e.g., drops every evening)
6. Plans maintenance

### Workflow 3: Responding to Alert
1. Alert appears in Alerts & Action Panel
2. Operator reads clear message: "Low Pressure Detected - Central Zone"
3. Clicks "Resolve" after taking action
4. Alert is acknowledged and removed from active list

---

## Technical Implementation Notes

- **Real-time Clock:** Updates every second using `setInterval`
- **Map Integration:** Leaflet with OpenStreetMap tiles
- **Chart Library:** Recharts for responsive, accessible charts
- **Time Filters:** State management for 1h/6h/24h views
- **Mock Data:** Includes flow (L/min) and NRW (%) for development
- **Error Handling:** Graceful fallback to mock data if API unavailable
