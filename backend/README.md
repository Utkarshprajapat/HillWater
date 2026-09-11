# HillWater Backend

This is the foundational backend for the HillWater predictive water-service reliability system for hill towns.

Core concept: "Monitoring is the input. Decision is the product."

## Future Architecture

The system will ingest data from multiple sources seamlessly via a unified data contract. The ingestion endpoint `POST /api/sensors/readings` is the most important interface.

### Simulator Flow
SIMULATOR
    ↓
POST /api/sensors/readings
    ↓
SENSOR STORE
    ↓
RISK ENGINE
    ↓
ALERT ENGINE
    ↓
REACT DASHBOARD

### Hardware Flow
ESP32
    ↓
Wi-Fi
    ↓
POST /api/sensors/readings
    ↓
SAME SENSOR STORE
    ↓
SAME RISK ENGINE
    ↓
SAME DASHBOARD

The backend does not need to know whether the data came from a simulator, an ESP32, or physical sensors. That distinction belongs at the data-source layer.

## Future Hardware Contract

The ESP32 will eventually send a POST request to `/api/sensors/readings` with the following structure:

```json
{
  "deviceId": "HW-001",
  "zoneId": "mallital",
  "pressure": 12.6,
  "flow": 84.3,
  "tankLevel": 68.2,
  "timestamp": "2026-09-10T18:30:00.000Z"
}
```

## Running the Backend

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```

Start for production:
```bash
npm start
```

## Risk Engine

The prototype uses deterministic, configurable engineering heuristics rather than a trained ML model. This provides explainability and predictable behavior during the prototype stage.

### Input signals:
- pressure
- pressure trend
- flow
- tank level
- demand
- elevation

### Output:
- risk score (0-100)
- risk level (LOW, MODERATE, HIGH, CRITICAL)
- contributing factors (sorted by weight)
- likely cause (generated explanation based on heuristic patterns)
- recommendation (operational advice)

## Root-Cause Explainability

1. Risk score is calculated by the Deterministic RiskEngine.
2. The ExplanationEngine interprets signal combinations to identify the primary cause.
3. Hypotheses are deterministic and evaluate explicit evidence thresholds.
4. Evidence strength is an explicit rule-based calculation, NOT ML probability.
5. Identified causes are likely hypotheses, not guaranteed diagnoses.
6. Field validation would be required in real deployment.

Example Hypotheses:
- DEMAND_STRESS
- SUPPLY_RESTRICTION
- POSSIBLE_DISTRIBUTION_LOSS
- LOW_RESERVOIR_LEVEL
- RAPID_PRESSURE_DETERIORATION
- MULTI_SIGNAL_INSTABILITY
- NORMAL_OPERATION
- INSUFFICIENT_DATA

## Predictive Alerts

The Alert Engine transforms static risk scores into event-driven insights:
- **Early Warning**: "Risk is currently MODERATE, but deterioration suggests increasing instability."
- **Risk Escalation**: Detects when risk bands are crossed (e.g., MODERATE -> HIGH).
- **Rapid Deterioration**: Flags sudden pressure drops regardless of total risk score.
- **Critical Alerts**: Issued when risk reaches 81+.
- **Recovery**: Logs return to stability.
- **Data Quality**: Detects stale or impossible readings without inventing water-network failure diagnoses.
- **Duplicate Suppression**: Prevents identical sequential alerts to prevent alert fatigue.

*Note: The prototype does not claim to predict an exact failure time. It detects deteriorating conditions and increasing risk using deterministic rules over current and historical signals.*

## Phase 5: Deterministic Sensor Simulator

The simulator acts as a virtual physical device (ESP32) allowing dynamic operational demonstration without modifying existing business intelligence. 

**Conceptual Architecture:**
\\\	ext
Virtual Sensor Simulator
        ?
POST /api/sensors/readings
        ?
HillWater Backend
        ?
Risk Engine  ->  Explanation Engine  ->  Alert Engine
\\\

**Usage:**
- Start via CLI: \
pm run simulator -- --scenario DETERIORATION\
- Start via API: \POST /api/simulator/start\
- Switch Scenarios: \POST /api/simulator/scenario\
- The API accepts 6 deterministic scenarios: \NORMAL\, \GRADUAL_DETERIORATION\, \RAPID_PRESSURE_DETERIORATION\, \SUPPLY_RESTRICTION\, \POSSIBLE_DISTRIBUTION_LOSS\, \RECOVERY\.
