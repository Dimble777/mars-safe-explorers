
/**
 * MARS-SAFE Mission History Engine
 *
 * Records simulated habitat conditions
 * for charts and mission trend analysis.
 */

export function createMissionSnapshot(mission) {
  return {
    sol: mission.sol,
    oxygen: mission.resources.Oxygen,
    water: mission.resources.Water,
    food: mission.resources.Food,
    power: mission.resources.Power,
    temperature: mission.temperature,
  };
}

export function addMissionSnapshot(history, mission) {
  const snapshot = createMissionSnapshot(mission);

  // Keep only the latest reading for each SOL.
  // A recovery or emergency can change values
  // without advancing the mission day.
  const updatedHistory = history.filter(
    (entry) => entry.sol !== snapshot.sol
  );

  return [...updatedHistory, snapshot].sort(
    (a, b) => a.sol - b.sol
  );
}

export function getResourceTrends(history) {
  if (history.length < 2) {
    return {
      oxygen: 0,
      water: 0,
      food: 0,
      power: 0,
      temperature: 0,
    };
  }

  const previous = history[history.length - 2];
  const latest = history[history.length - 1];

  return {
    oxygen: latest.oxygen - previous.oxygen,
    water: latest.water - previous.water,
    food: latest.food - previous.food,
    power: latest.power - previous.power,
    temperature: latest.temperature - previous.temperature,
  };
}
