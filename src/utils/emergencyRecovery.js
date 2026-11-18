
/**
 * MARS-SAFE Emergency Recovery Engine
 *
 * Simulates corrective actions taken by a Mars crew.
 * This is a demonstration model, not real
 * spacecraft recovery software.
 */

export const RECOVERY_ACTIONS = {
  backupPower: {
    title: "Activate Backup Power",
    description:
      "Restore simulated power using emergency reserves.",
    resource: "Power",
    recovery: 25,
  },

  oxygenRepair: {
    title: "Repair Oxygen Leak",
    description:
      "Repair the simulated oxygen system and recover reserves.",
    resource: "Oxygen",
    recovery: 20,
  },

  waterRecycling: {
    title: "Activate Water Recycling",
    description:
      "Recover water through simulated recycling.",
    resource: "Water",
    recovery: 20,
  },

  foodSupply: {
    title: "Access Emergency Food Supplies",
    description:
      "Replenish food from simulated emergency storage.",
    resource: "Food",
    recovery: 15,
  },

  cooling: {
    title: "Activate Emergency Cooling",
    description:
      "Lower the simulated habitat temperature.",
    temperatureReduction: 15,
  },
};

export function applyRecovery(mission, actionType) {
  const action = RECOVERY_ACTIONS[actionType];

  if (!action) {
    return mission;
  }

  const updatedMission = {
    ...mission,
    resources: {
      ...mission.resources,
    },
  };

  if (action.resource) {
    const currentValue =
      Number(updatedMission.resources[action.resource]) || 0;

    updatedMission.resources[action.resource] = Math.min(
      100,
      Math.max(0, currentValue + action.recovery)
    );
  }

  if (action.temperatureReduction) {
    updatedMission.temperature = Math.max(
      18,
      updatedMission.temperature -
        action.temperatureReduction
    );
  }

  return updatedMission;
}
