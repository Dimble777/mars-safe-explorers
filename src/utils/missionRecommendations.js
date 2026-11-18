
/**
 * MARS-SAFE Intelligent Mission Recommendations
 *
 * Rule-based decision support for simulated
 * Mars habitat resources and survival risks.
 */

const RESOURCE_ACTIONS = {
  Oxygen: {
    critical:
      "Activate emergency oxygen reserves, isolate leaks, and prioritize life-support systems.",
    warning:
      "Inspect oxygen recycling equipment and reduce unnecessary oxygen consumption.",
  },

  Water: {
    critical:
      "Activate emergency water reserves, inspect leaks, and prioritize drinking water.",
    warning:
      "Increase water recycling efficiency and reduce nonessential water use.",
  },

  Food: {
    critical:
      "Activate emergency food rationing and review remaining supplies.",
    warning:
      "Review food inventory, reduce waste, and plan controlled rationing.",
  },

  Power: {
    critical:
      "Switch to emergency power, shut down nonessential equipment, and protect life-support systems.",
    warning:
      "Reduce nonessential power consumption and inspect energy generation systems.",
  },
};

export function generateMissionRecommendations(
  resources,
  survival,
  temperature
) {
  const recommendations = [];

  for (const [resource, actions] of Object.entries(
    RESOURCE_ACTIONS
  )) {
    const remaining = Number(resources?.[resource]);

    if (!Number.isFinite(remaining)) {
      continue;
    }

    if (remaining <= 20) {
      recommendations.push({
        resource,
        priority: "CRITICAL",
        message: actions.critical,
      });
    } else if (remaining <= 40) {
      recommendations.push({
        resource,
        priority: "WARNING",
        message: actions.warning,
      });
    }
  }

  // Temperature emergency
  if (Number.isFinite(temperature) && temperature >= 40) {
    recommendations.push({
      resource: "Temperature",
      priority: "CRITICAL",
      message:
        "Inspect habitat thermal controls, activate backup cooling, and protect crew from overheating.",
    });
  }

  // Survival forecast warning
  if (survival?.estimatedSurvivalSols <= 5) {
    recommendations.push({
      resource: "Mission Survival",
      priority: "CRITICAL",
      message:
        "Predicted resource endurance is critically low. Prioritize recovery of the limiting resource.",
    });
  } else if (survival?.estimatedSurvivalSols <= 10) {
    recommendations.push({
      resource: "Mission Survival",
      priority: "WARNING",
      message:
        "Predicted resource endurance is low. Review consumption rates and conservation measures.",
    });
  }

  // Normal mission status
  if (recommendations.length === 0) {
    recommendations.push({
      resource: "All Systems",
      priority: "NORMAL",
      message:
        "Resources are within the configured thresholds. Continue monitoring habitat systems.",
    });
  }

  // Show critical recommendations first
  const priorityOrder = {
    CRITICAL: 0,
    WARNING: 1,
    NORMAL: 2,
  };

  recommendations.sort(
    (a, b) =>
      priorityOrder[a.priority] -
      priorityOrder[b.priority]
  );

  return recommendations;
}
