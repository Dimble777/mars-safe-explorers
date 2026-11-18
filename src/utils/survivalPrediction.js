
/**
 * MARS-SAFE Survival Prediction Engine
 *
 * Predicts how many complete Martian days (SOLs)
 * the habitat can operate before a resource runs out.
 *
 * All resource values and consumption rates are simulated.
 */

export const DAILY_CONSUMPTION = {
  Oxygen: 2,
  Water: 3,
  Food: 2,
  Power: 4,
};

export function predictSurvival(resources) {
  const predictions = Object.entries(
    DAILY_CONSUMPTION
  ).map(([resource, dailyUse]) => {
    const remaining = Math.max(
      0,
      Number(resources?.[resource]) || 0
    );

    const solsRemaining = Math.floor(
      remaining / dailyUse
    );

    return {
      resource,
      remaining,
      dailyUse,
      solsRemaining,
    };
  });

  const limitingResource = predictions.reduce(
    (lowest, current) =>
      current.solsRemaining < lowest.solsRemaining
        ? current
        : lowest
  );

  const estimatedSurvivalSols =
    limitingResource.solsRemaining;

  let riskLevel = "LOW";

  if (estimatedSurvivalSols <= 5) {
    riskLevel = "CRITICAL";
  } else if (estimatedSurvivalSols <= 10) {
    riskLevel = "HIGH";
  } else if (estimatedSurvivalSols <= 20) {
    riskLevel = "MODERATE";
  }

  return {
    predictions,
    estimatedSurvivalSols,
    limitingResource: limitingResource.resource,
    riskLevel,
  };
}
