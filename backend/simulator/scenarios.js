const scenarios = {
  NORMAL: {
    name: "NORMAL",
    description: "Stable normal operating conditions",
    loop: true,
    steps: [
      { pressure: 13.8, flow: 84, tankLevel: 70 },
      { pressure: 13.7, flow: 85, tankLevel: 71 },
      { pressure: 13.8, flow: 84, tankLevel: 70 },
      { pressure: 13.9, flow: 83, tankLevel: 69 },
      { pressure: 14.0, flow: 84, tankLevel: 70 }
    ]
  },
  GRADUAL_PRESSURE_DETERIORATION: {
    name: "GRADUAL_PRESSURE_DETERIORATION",
    description: "Pressure slowly falling, pushing risk from low to moderate/high",
    loop: false,
    steps: [
      { pressure: 13.8, flow: 85, tankLevel: 70 },
      { pressure: 13.4, flow: 83, tankLevel: 68 },
      { pressure: 13.0, flow: 80, tankLevel: 66 },
      { pressure: 12.5, flow: 77, tankLevel: 63 },
      { pressure: 11.9, flow: 73, tankLevel: 60 },
      { pressure: 11.3, flow: 69, tankLevel: 56 },
      { pressure: 11.0, flow: 68, tankLevel: 55 }
    ]
  },
  RAPID_PRESSURE_DETERIORATION: {
    name: "RAPID_PRESSURE_DETERIORATION",
    description: "Rapid pressure drop triggering explicit deterioration alert",
    loop: false,
    steps: [
      { pressure: 13.8, flow: 84, tankLevel: 70 },
      { pressure: 13.5, flow: 82, tankLevel: 69 },
      { pressure: 13.0, flow: 80, tankLevel: 68 },
      { pressure: 12.0, flow: 78, tankLevel: 68 },
      { pressure: 10.5, flow: 76, tankLevel: 67 },
      { pressure: 9.5,  flow: 75, tankLevel: 67 }
    ]
  },
  UPSTREAM_SUPPLY_RESTRICTION: {
    name: "UPSTREAM_SUPPLY_RESTRICTION",
    description: "Simultaneous drop in pressure, flow, and tank indicating missing upstream supply",
    loop: false,
    steps: [
      { pressure: 13.5, flow: 85, tankLevel: 70 },
      { pressure: 11.0, flow: 65, tankLevel: 55 },
      { pressure: 8.5,  flow: 45, tankLevel: 35 },
      { pressure: 6.5,  flow: 30, tankLevel: 18 },
      { pressure: 6.0,  flow: 25, tankLevel: 15 }
    ]
  },
  POSSIBLE_DISTRIBUTION_LOSS: {
    name: "POSSIBLE_DISTRIBUTION_LOSS",
    description: "Pressure remains okay but flow increases drastically suggesting pipe loss",
    loop: false,
    steps: [
      { pressure: 13.5, flow: 84, tankLevel: 70 },
      { pressure: 13.4, flow: 100, tankLevel: 68 },
      { pressure: 13.3, flow: 130, tankLevel: 66 },
      { pressure: 13.2, flow: 150, tankLevel: 63 }
    ]
  },
  SYSTEM_RECOVERY: {
    name: "SYSTEM_RECOVERY",
    description: "Progressive recovery of all signals back to baseline",
    loop: false,
    steps: [
      { pressure: 10.5, flow: 45, tankLevel: 25 },
      { pressure: 11.2, flow: 55, tankLevel: 35 },
      { pressure: 12.0, flow: 65, tankLevel: 45 },
      { pressure: 12.8, flow: 74, tankLevel: 55 },
      { pressure: 13.4, flow: 82, tankLevel: 63 },
      { pressure: 13.8, flow: 85, tankLevel: 70 }
    ]
  }
};

module.exports = scenarios;
