
export const INITIAL_MISSION = {
  sol: 42,
  temperature: 24,
  resources: {
    Oxygen: 85,
    Water: 72,
    Food: 90,
    Power: 64,
  },
};

export const CONSUMPTION_RATES = {
  Oxygen: 2,
  Water: 3,
  Food: 2,
  Power: 4,
};

// Simulate one Martian day of resource consumption.
export function advanceOneSol(mission) {
  const updatedResources = {};

  for (const [resource, value] of Object.entries(
    mission.resources
  )) {
    const consumption = CONSUMPTION_RATES[resource] ?? 0;

    updatedResources[resource] = Math.max(
      0,
      value - consumption
    );
  }

  return {
    ...mission,
    sol: mission.sol + 1,
    resources: updatedResources,
  };
}

export function applyEmergency(mission, type) {
  // Apply a simulated emergency to the current mission.

const changes = {
  oxygen: { resource: "Oxygen", value: 15 },
  water: { resource: "Water", value: 15 },
  food: { resource: "Food", value: 15 },
  power: { resource: "Power", value: 15 },
  temperature: { temperature: 45 },
};


  const change = changes[type];

  if (!change) return mission;

  if (change.resource) {
    return {
      ...mission,
      resources: {
        ...mission.resources,
        [change.resource]: Math.min(
          mission.resources[change.resource],
          change.value
        ),
      },
    };
  }

  return {
    ...mission,
    temperature: change.temperature,
  };
}

// Check whether any resource is critically low.
export function getCriticalResources(resources) {
  return Object.entries(resources)
    .filter(([, value]) => value <= 20)
    .map(([name]) => name);
}
