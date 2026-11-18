
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3001;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "MARS-SAFE AI Backend is running",
  });
});

// Shared Ollama request function
async function askOllama(messages) {
  const response = await fetch("http://127.0.0.1:11434/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama3.2:latest",
      stream: false,
      messages,
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama returned status ${response.status}`);
  }

  const data = await response.json();

  if (typeof data.message?.content !== "string") {
    throw new Error("Invalid Ollama response");
  }

  return data.message.content;
}

// AI simulation rules
const AI_SYSTEM_PROMPT = `
You are the AI Mission Advisor for MARS-SAFE,
a simulated Mars habitat.

Analyze mission resource data using these rules.

RESOURCE LEVELS:
- 0 to 10%: CRITICAL
- Above 10% to 20%: LOW
- Above 20%: NOT CRITICAL
- 100% means full capacity, not a minimum safe threshold.
- Never subtract resource percentages from 100 to determine risk.
- 64% power and 72% water are not low or critical.

TEMPERATURE:
- 18 to 30 degrees Celsius: NORMAL
- Above 30 and below 40 degrees Celsius: ELEVATED
- 40 degrees Celsius or above: DANGEROUS

AVAILABLE EMERGENCY ACTIONS:
- Activate Backup Power
- Repair Oxygen Leak
- Activate Water Recycling
- Access Emergency Food Supplies
- Activate Emergency Cooling

RECOMMENDATION RULES:
- Recommend Backup Power only when power is 20% or below.
- Recommend Oxygen Leak Repair only when oxygen is 20% or below.
- Recommend Water Recycling only when water is 20% or below.
- Recommend Emergency Food Supplies only when food is 20% or below.
- Recommend Emergency Cooling only when temperature is 40 degrees
  Celsius or above.
- Prioritize critical oxygen shortages.
- If all resources are above 20% and temperature is normal,
  report that no immediate emergency action is necessary.
- Do not invent equipment, thresholds, or emergencies.
- Base your assessment on the supplied numbers.
- Keep the response concise and practical.
`;

function getAllowedRecoveryActions(mission) {
  const actions = [];

  if (mission.oxygen <= 20) {
    actions.push("Repair Oxygen Leak");
  }

  if (mission.power <= 20) {
    actions.push("Activate Backup Power");
  }

  if (mission.water <= 20) {
    actions.push("Activate Water Recycling");
  }

  if (mission.food <= 20) {
    actions.push("Access Emergency Food Supplies");
  }

  if (mission.temperature >= 40) {
    actions.push("Activate Emergency Cooling");
  }

  return actions;
}


// Analyze live mission data
app.post("/api/ai/analyze", async (req, res) => {
  try {
    const {
      oxygen,
      power,
      water,
      food,
      temperature,
      sol,
    } = req.body || {};

    const resources = { oxygen, power, water, food };

    const validResources = Object.values(resources).every(
      (value) =>
        typeof value === "number" &&
        Number.isFinite(value) &&
        value >= 0 &&
        value <= 100
    );

    if (
      !validResources ||
      typeof temperature !== "number" ||
      !Number.isFinite(temperature) ||
      typeof sol !== "number" ||
      !Number.isFinite(sol)
    ) {
      return res.status(400).json({
        success: false,
        error: "Invalid mission resource data",
      });
    }

    const missionData = {
      sol,
      oxygen,
      power,
      water,
      food,
      temperature,
    };

    // Calculate resource status using JavaScript rules
    const getResourceStatus = (value) => {
      if (value <= 10) return "CRITICAL";
      if (value <= 20) return "LOW";
      return "NOT CRITICAL";
    };

    const temperatureStatus =
      temperature >= 40
        ? "DANGEROUS"
        : temperature > 30
        ? "ELEVATED"
        : temperature >= 18
        ? "NORMAL"
        : "BELOW NORMAL";

    const resourceStatus = {
      oxygen: getResourceStatus(oxygen),
      power: getResourceStatus(power),
      water: getResourceStatus(water),
      food: getResourceStatus(food),
      temperature: temperatureStatus,
    };
const allowedRecoveryActions = getAllowedRecoveryActions(missionData);
    const messages = [
      {
        role: "system",
        content: AI_SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: `
Analyze this simulated Mars habitat mission.

MISSION DATA:
${JSON.stringify(missionData, null, 2)}

PRECALCULATED RESOURCE STATUS:
${JSON.stringify(resourceStatus, null, 2)}

PREVALIDATED RECOVERY ACTIONS:

${JSON.stringify(allowedRecoveryActions, null, 2)}

IMPORTANT INSTRUCTIONS:

1. Use the precalculated resource status values.
2. Do not change resource classifications.
3. The recovery actions above were validated by the backend.
4. Do not contradict the validated recovery actions.
5. If the list is empty, explain that no emergency recovery action is required.
6. If the list contains actions, explain why each action is recommended.
7. Do not invent additional recovery actions.
8. Clearly distinguish LOW from CRITICAL resource conditions.
`,
      },
    ];

  const analysis = await askOllama(messages);


const validatedRecommendation =
  allowedRecoveryActions.length === 0
    ? "No emergency actions required. Mission resources are within the emergency thresholds."
    : `Recommended emergency actions: ${allowedRecoveryActions.join(", ")}.`;


    res.json({
  success: true,
  mission: missionData,
  resourceStatus,
  allowedRecoveryActions,
  validatedRecommendation,
  analysis,
});
  } catch (error) {
    console.error("AI analysis error:", error.message);

    res.status(503).json({
      success: false,
      error: "AI analysis is temporarily unavailable",
    });
  }
});

// AI Preventive Recommendations

app.post("/api/ai/preventive", async (req, res) => {
  try {
    const {
      sol,
      oxygen,
      water,
      food,
      power,
      temperature,
    } = req.body || {};

    const resources = { oxygen, water, food, power };

    const validResources = Object.values(resources).every(
      (value) =>
        typeof value === "number" &&
        Number.isFinite(value) &&
        value >= 0 &&
        value <= 100
    );

    const validTemperature =
      typeof temperature === "number" &&
      Number.isFinite(temperature) &&
      temperature >= -100 &&
      temperature <= 150;

    if (
      !validResources ||
      !validTemperature ||
      !Number.isInteger(sol) ||
      sol < 0
    ) {
      return res.status(400).json({
        success: false,
        error: "Invalid mission data",
      });
    }

    const consumptionRates = {
      oxygen: 2,
      water: 3,
      food: 2,
      power: 4,
    };

    const predictions = Object.entries(resources)
      .map(([resource, level]) => {
        const rate = consumptionRates[resource];

        const lowIn =
          level <= 20
            ? 0
            : Math.ceil((level - 20) / rate);

        const criticalIn =
          level <= 10
            ? 0
            : Math.ceil((level - 10) / rate);

        return {
          resource,
          currentLevel: level,
          lowIn,
          criticalIn,
          lowSol: sol + lowIn,
          criticalSol: sol + criticalIn,
        };
      })
      .sort((a, b) => a.lowIn - b.lowIn);

    const earliestShortage = predictions[0];

    const emergencyActions = {
      oxygen: "Repair Oxygen Leak",
      water: "Activate Water Recycling",
      power: "Activate Backup Power",
      food: "Access Emergency Food Supplies",
    };

    const requiredEmergencyActions = predictions
      .filter((item) => item.currentLevel <= 20)
      .map((item) => emergencyActions[item.resource]);

    // Temperature emergency detection
    const temperatureEmergency = temperature >= 40;

    if (temperatureEmergency) {
      requiredEmergencyActions.push(
        "Activate Emergency Cooling"
      );
    }

    const temperatureStatus = temperatureEmergency
      ? "CRITICAL"
      : "NORMAL";

    let validatedPreventiveRecommendation;

    if (requiredEmergencyActions.length > 0) {
      const emergencyDetails = [];

      const criticalResources = predictions.filter(
        (item) => item.currentLevel <= 20
      );

      if (criticalResources.length > 0) {
        emergencyDetails.push(
          criticalResources
            .map(
              (item) =>
                `${item.resource.toUpperCase()} is at ${item.currentLevel}%`
            )
            .join("; ")
        );
      }

      if (temperatureEmergency) {
        emergencyDetails.push(
          `HABITAT TEMPERATURE is ${temperature}°C (critical threshold: 40°C)`
        );
      }

      validatedPreventiveRecommendation =
        `CURRENT EMERGENCY: ${emergencyDetails.join("; ")}. ` +
        `Required recovery actions: ${requiredEmergencyActions.join(", ")}. ` +
        `Follow the emergency recovery procedure before preventive planning.`;
    } else {
      validatedPreventiveRecommendation =
        `PREVENTIVE PRIORITY: ${earliestShortage.resource.toUpperCase()} ` +
        `is at ${earliestShortage.currentLevel}%. ` +
        `It is predicted to reach the LOW threshold of 20% ` +
        `in ${earliestShortage.lowIn} SOLs, ` +
        `at SOL ${earliestShortage.lowSol}. ` +
        `Current habitat temperature: ${temperature}°C (NORMAL). ` +
        `Review resource conservation and backup readiness.`;
    }

    const messages = [
      {
        role: "system",
        content: `
You are the MARS-SAFE Preventive Mission Advisor.

You provide preventive recommendations for a simulated
Mars habitat.

Rules:

1. Use only the validated mission data and predictions.

2. Resource levels are percentages from 0 to 100.

3. Resource LOW threshold is 20%.
   Resource CRITICAL threshold is 10%.

4. Habitat temperature is measured in Celsius.

5. Temperature at or above 40°C is a simulated
   critical temperature emergency.

6. If temperature is critical, recommend the exact
   action "Activate Emergency Cooling".

7. If resources are at or below 20%, recommend the
   corresponding validated recovery actions.

8. If multiple emergencies exist, acknowledge all of them.

9. Never confuse SOL counts with resource percentages.

10. Never invent numerical conservation targets,
    resource values, or shortage dates.

11. Do not claim that recovery has occurred unless
    the updated mission data confirms it.

12. If an emergency exists, prioritize immediate
    recovery before preventive planning.

13. Give three concise, practical recommendations.

14. These thresholds are simulation rules,
    not official NASA safety standards.

15. Do not use Markdown formatting.
    Use plain text only.
        `,
      },
      {
        role: "user",
        content: `
CURRENT SOL: ${sol}

HABITAT TEMPERATURE: ${temperature}°C
TEMPERATURE STATUS: ${temperatureStatus}

VALIDATED RESOURCE PREDICTIONS:
${JSON.stringify(predictions, null, 2)}

EARLIEST PREDICTED SHORTAGE:
${JSON.stringify(earliestShortage, null, 2)}

VALIDATED EMERGENCY RECOVERY ACTIONS:
${JSON.stringify(requiredEmergencyActions)}

VALIDATED MISSION RECOMMENDATION:
${validatedPreventiveRecommendation}

If emergency recovery actions are listed, mention
those exact actions first.

Do not invent additional recovery systems.
Do not recommend rationing oxygen or reducing
life-support requirements.

Provide three concise recommendations.
        `,
      },
    ];

    const analysis = await askOllama(messages);

    res.json({
      success: true,
      predictions,
      earliestShortage,
      temperature,
      temperatureStatus,
      requiredEmergencyActions,
      validatedPreventiveRecommendation,
      analysis,
    });
  } catch (error) {
    console.error("Preventive AI error:", error.message);

    res.status(503).json({
      success: false,
      error: "Preventive AI is temporarily unavailable",
    });
  }
});


// Test Ollama connection
app.get("/api/ai/test", async (req, res) => {
  try {
    const aiResponse = await askOllama([
      {
        role: "system",
        content: AI_SYSTEM_PROMPT,
      },
      {
        role: "user",
        content:
          "Mars habitat: Oxygen 15%, Power 20%, Water 40%, Food 75%, Temperature 24°C. Identify the biggest risk and recommend one immediate action.",
      },
    ]);

    res.json({
      success: true,
      aiResponse,
    });
  } catch (error) {
    console.error("AI test error:", error.message);

    res.status(503).json({
      success: false,
      error: "AI test is temporarily unavailable",
    });
  }
});



let latestMission = {
  sol: 42,
  oxygen: 85,
  water: 72,
  food: 90,
  power: 64,
  temperature: 24,
  status: "NORMAL",
};

// Receive live data from MARS-SAFE dashboard
app.post("/api/esp32/mission", (req, res) => {
  const { sol, oxygen, water, food, power, temperature } = req.body || {};

  if (
    ![oxygen, water, food, power, temperature].every(
      (value) => typeof value === "number" && Number.isFinite(value)
    )
  ) {
    return res.status(400).json({ error: "Invalid mission data" });
  }

  latestMission = {
    sol: Number.isFinite(sol) ? sol : latestMission.sol,
    oxygen,
    water,
    food,
    power,
    temperature,
    status:
      Math.min(oxygen, water, food, power) < 20 ||
      temperature >= 40
        ? "CRITICAL"
        : "NORMAL",
  };

  res.json({ success: true, mission: latestMission });
});

// Send latest mission data to ESP32
app.get("/api/esp32/mission", (req, res) => {
  res.json(latestMission);
});


// Start backend
app.listen(PORT, () => {
  console.log(`MARS-SAFE AI Backend running on port ${PORT}`);
});
