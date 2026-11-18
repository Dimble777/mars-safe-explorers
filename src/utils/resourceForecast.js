import { CONSUMPTION_RATES } from "./missionSimulation.js";

const DAILY_CONSUMPTION = CONSUMPTION_RATES;

export function forecastResources(mission, days = 10) {
  const forecast = [];

  for (let day = 0; day <= days; day++) {
    const resources = {};

    for (const [name, consumption] of Object.entries(
      DAILY_CONSUMPTION
    )) {
      const currentValue = mission.resources[name] ?? 0;

      resources[name.toLowerCase()] = Math.max(
        0,
        currentValue - consumption * day
      );
    }

    forecast.push({
      sol: mission.sol + day,
      ...resources,
    });
  }

  return forecast;
}

export function detectResourceShortages(forecast, threshold = 20) {
  const warnings = [];

  const resources = ["oxygen", "water", "food", "power"];

  for (const resource of resources) {
    const criticalDay = forecast.find(
      (day) => day[resource] <= threshold
    );


const criticalSol = forecast.find(
  (day) => day[resource] <= 10
);

const depletionDay = forecast.find(
  (day) => day[resource] <= 0
);




const finalDay = forecast[forecast.length - 1];

const severity =
  finalDay[resource] <= 10 ? "CRITICAL" : "WARNING";


    if (criticalDay) {
      warnings.push({
        resource,
        severity,
criticalSol: criticalSol ? criticalSol.sol : null,
depletionSol: depletionDay ? depletionDay.sol : null,

        sol: criticalDay.sol,
        predictedLevel: criticalDay[resource],
        
message: `${resource.toUpperCase()} may reach the 20% warning threshold by SOL ${criticalDay.sol}.`,

      });
    }
  }

  return warnings;
}

// Predict when each resource reaches shortage thresholds.
export function predictResourceShortages(mission) {
  const predictions = [];

  for (const [resource, consumption] of Object.entries(
    DAILY_CONSUMPTION
  )) {
    const currentLevel = mission.resources[resource] ?? 0;

    const solsUntil = (threshold) => {
      if (currentLevel <= threshold) return 0;
      if (consumption <= 0) return null;

      return Math.ceil(
        (currentLevel - threshold) / consumption
      );
    };

    const lowIn = solsUntil(20);
    const criticalIn = solsUntil(10);
    const depletedIn = solsUntil(0);

    predictions.push({
      resource,
      currentLevel,
      consumptionPerSol: consumption,
      lowIn,
      criticalIn,
      depletedIn,
      lowSol: lowIn === null ? null : mission.sol + lowIn,
      criticalSol:
        criticalIn === null ? null : mission.sol + criticalIn,
      depletedSol:
        depletedIn === null ? null : mission.sol + depletedIn,
    });
  }

  return predictions.sort(
    (a, b) => (a.lowIn ?? Infinity) - (b.lowIn ?? Infinity)
  );
}