
import { useEffect, useState } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { getMarsImages } from "./utils/nasaService";
import { getMarsWeather } from "./utils/marsWeatherService";

import { predictSurvival } from "./utils/survivalPrediction";


import {
  forecastResources,
  detectResourceShortages,
  predictResourceShortages,
} from "./utils/resourceForecast";



import {
  createMissionSnapshot,
  addMissionSnapshot,
} from "./utils/missionHistory";


import { generateMissionRecommendations } from "./utils/missionRecommendations";


import {
  RECOVERY_ACTIONS,
  applyRecovery,
} from "./utils/emergencyRecovery";



import {
  INITIAL_MISSION,
  advanceOneSol,
  applyEmergency,
  getCriticalResources,
} from "./utils/missionSimulation";
import "./App.css";

const emergencyScenarios = {
  oxygen: {
    title: "Oxygen Leak",
    message:
      "Oxygen reserves are low. Inspect the simulated oxygen system and isolate the leak.",
  },
  water: {
    title: "Water Leak",
    message:
      "Water reserves are low. Inspect the water recycling system and reduce consumption.",
  },
  power: {
    title: "Power Failure",
    message:
      "Power reserves are low. Prioritize essential habitat systems and inspect power generation.",
  },
  temperature: {
    title: "Temperature Failure",
    message:
      "Habitat temperature is dangerously high. Inspect the thermal control system.",
  },
};

const resourceIcons = {
  Oxygen: "🫁",
  Water: "💧",
  Food: "🍱",
  Power: "⚡",
};

function App() {
  // Mission simulation
  const [mission, setMission] = useState(() => ({
    ...INITIAL_MISSION,
    resources: { ...INITIAL_MISSION.resources },
  }));

  const aiMissionData = {
  sol: mission.sol,
  oxygen: mission.resources.Oxygen,
  water: mission.resources.Water,
  food: mission.resources.Food,
  power: mission.resources.Power,
  temperature: mission.temperature,
};

useEffect(() => {
  fetch("http://localhost:3001/api/esp32/mission", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(aiMissionData),
  }).catch((error) => {
    console.error("ESP32 mission sync failed:", error);
  });
}, [
  mission.sol,
  mission.resources.Oxygen,
  mission.resources.Water,
  mission.resources.Food,
  mission.resources.Power,
  mission.temperature,
]);


  const [activeEmergency, setActiveEmergency] = useState(null);

const [aiAnalysis, setAiAnalysis] = useState("");
const [aiLoading, setAiLoading] = useState(false);
const [aiError, setAiError] = useState("");
const [preventiveAnalysis, setPreventiveAnalysis] = useState("");
const [preventiveLoading, setPreventiveLoading] = useState(false);
const [preventiveError, setPreventiveError] = useState("");

const analyzeMissionWithAI = async () => {
  setAiLoading(true);
  setAiError("");

  try {
    const response = await fetch("http://localhost:3001/api/ai/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(aiMissionData),
    });

    if (!response.ok) {
      throw new Error("AI backend request failed");
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error("AI analysis was unsuccessful");
    }

    setAiAnalysis(data.validatedRecommendation);
  } catch (error) {
    setAiError(error.message);
  } finally {
    setAiLoading(false);
  }
};

const analyzePreventiveWithAI = async () => {
  setPreventiveLoading(true);
  setPreventiveError("");
  setPreventiveAnalysis("");

  try {
    const response = await fetch(
      "http://localhost:3001/api/ai/preventive",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(aiMissionData),
      }
    );

    if (!response.ok) {
      throw new Error("Preventive AI request failed");
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error("Preventive AI analysis failed");
    }

    setPreventiveAnalysis(data.validatedPreventiveRecommendation);
  } catch (error) {
    setPreventiveError(error.message);
  } finally {
    setPreventiveLoading(false);
  }
};

const [missionHistory, setMissionHistory] = useState(() => [
  
  createMissionSnapshot(INITIAL_MISSION),
]);



const [recoveryHistory, setRecoveryHistory] = useState([]);
const [usedRecoveryActions, setUsedRecoveryActions] = useState([]);


  // Mars weather
  const [marsWeather, setMarsWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState(null);

  // NASA images
  const [marsImages, setMarsImages] = useState([]);
  const [nasaLoading, setNasaLoading] = useState(true);
  const [nasaError, setNasaError] = useState(null);

  // Load historical NASA Mars weather
  useEffect(() => {
    let cancelled = false;

    async function loadWeather() {
      try {
        const data = await getMarsWeather();

        if (!cancelled) {
          setMarsWeather(data);
        }
      } catch (error) {
        if (!cancelled) {
          setWeatherError(error.message);
        }
      } finally {
        if (!cancelled) {
          setWeatherLoading(false);
        }
      }
    }

    loadWeather();

    return () => {
      cancelled = true;
    };
  }, []);

  // Load NASA Mars images
  useEffect(() => {
    let cancelled = false;

    async function loadNASAData() {
      try {
        const images = await getMarsImages();

        if (!cancelled) {
          setMarsImages(images);
        }
      } catch (error) {
        if (!cancelled) {
          setNasaError(error.message);
        }
      } finally {
        if (!cancelled) {
          setNasaLoading(false);
        }
      }
    }

    loadNASAData();

    return () => {
      cancelled = true;
    };
  }, []);

  // Mission status
  const emergency = activeEmergency
    ? emergencyScenarios[activeEmergency]
    : null;

  const criticalResources = getCriticalResources(
    mission.resources
  );

const survival = predictSurvival(mission.resources);


const [forecastDays, setForecastDays] = useState(10);


const resourceForecast = forecastResources(mission, forecastDays);


const resourceWarnings = detectResourceShortages(resourceForecast);

const shortagePredictions = predictResourceShortages(mission);




const recommendations = generateMissionRecommendations(
  mission.resources,
  survival,
  mission.temperature
);

  const hasCriticalCondition =
    criticalResources.length > 0 ||
    mission.temperature >= 40;

  const missionInEmergency =
    Boolean(emergency) || hasCriticalCondition;


useEffect(() => {
  setMissionHistory((currentHistory) =>
    addMissionSnapshot(currentHistory, mission)
  );
}, [mission]);


  // Advance one Martian day
  const handleAdvanceSol = () => {
    setMission((current) => advanceOneSol(current));
  };

  // Trigger an emergency
  const handleEmergency = (type) => {
    if (activeEmergency) return;

    setMission((current) => applyEmergency(current, type));
    setActiveEmergency(type);
  };

  // Reset mission
  
const handleRecovery = (actionType) => {
  const action = RECOVERY_ACTIONS[actionType];

  if (!action || usedRecoveryActions.includes(actionType)) {
    return;
  }

  setMission((current) => applyRecovery(current, actionType));

  setUsedRecoveryActions((current) => [
    ...current,
    actionType,
  ]);

  setRecoveryHistory((current) => [
    {
      id: `${Date.now()}-${actionType}`,
      sol: mission.sol,
      action: action.title,
      description: action.description,
    },
    ...current,
  ]);

  // Clear an emergency when its corresponding
  // recovery action has been performed.
  
const resolvedEmergency = {
  oxygenRepair: "oxygen",
  waterRecycling: "water",
  foodSupply: "food",
  backupPower: "power",
  cooling: "temperature",
};


  if (resolvedEmergency[actionType] === activeEmergency) {
    setActiveEmergency(null);
  }
};

const handleReset = () => {
  setMission({
    ...INITIAL_MISSION,
    resources: { ...INITIAL_MISSION.resources },
  });

  setActiveEmergency(null);
  setMissionHistory([createMissionSnapshot(INITIAL_MISSION)]);
  setRecoveryHistory([]);
  setUsedRecoveryActions([]);
};


  return (
    <div className="dashboard">
      <header className="header">
        <h1>🚀 MARS-SAFE</h1>
        <p>AI Mars Survival Mission System</p>

        <span
          className={
            missionInEmergency
              ? "status emergency"
              : "status"
          }
        >
          {missionInEmergency
            ? "⚠ MISSION EMERGENCY"
            : "● MISSION STABLE"}
        </span>
      </header>

      <main>

{/* Survival Prediction */}
<section className="mission-info">
  <h2>🔮 Mars Survival Prediction</h2>

  <p>
    Estimated habitat operating time based on
    current simulated resources.
  </p>

  <h3>
    Estimated Survival: {survival.estimatedSurvivalSols} SOLs
  </h3>

  <p>
    Limiting Resource:{" "}
    <strong>{survival.limitingResource}</strong>
  </p>

  <p>
    Risk Level:{" "}
    <strong>{survival.riskLevel}</strong>
  </p>

  <div className="resource-grid">
    {survival.predictions.map((item) => (
      <div className="resource-card" key={item.resource}>
        <h3>
          {resourceIcons[item.resource]} {item.resource}
        </h3>

        <strong>{item.solsRemaining} SOLs</strong>

        <p>
          Remaining: {item.remaining}%
        </p>

        <p>
          Daily Consumption: {item.dailyUse}%
        </p>
      </div>
    ))}
  </div>

  <p className="weather-note">
    Prediction assumes fixed daily consumption,
    with no resource replenishment.
    Values are simulated, not actual NASA
    survival forecasts.
  </p>
</section>


<section
  style={{
    backgroundColor: "#1e293b",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "20px",
  }}
>
  
<h2>TEST FORECAST BUTTONS - {forecastDays} SOLs</h2>

<div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
  {[5, 10, 20].map((days) => (
    <button
      key={days}
      onClick={() => setForecastDays(days)}
      style={{
        padding: "10px 16px",
        backgroundColor: forecastDays === days ? "#2563eb" : "#334155",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
      }}
    >
      {days} SOLs
    </button>
  ))}
</div>


  <p>
    Predicted resource levels over the next 10 Martian days.
  </p>

  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={resourceForecast}>
      <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
      <XAxis dataKey="sol" stroke="#cbd5e1" />
      <YAxis domain={[0, 100]} stroke="#cbd5e1" />
      <Tooltip />
      <Legend />

      <Line type="monotone" dataKey="oxygen" stroke="#38bdf8" />
      <Line type="monotone" dataKey="water" stroke="#22c55e" />
      <Line type="monotone" dataKey="food" stroke="#f59e0b" />
      <Line type="monotone" dataKey="power" stroke="#ef4444" />
    </LineChart>
  </ResponsiveContainer>
</section>

{/* AI Resource Shortage Prediction */}
<section
  style={{
    backgroundColor: "#1e293b",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "20px",
  }}
>
  <h2>🔮 AI Resource Shortage Prediction</h2>

  <p>
    Predicted time remaining until each resource reaches
    the simulated LOW and CRITICAL thresholds.
  </p>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
      gap: "15px",
      marginTop: "20px",
    }}
  >
    {shortagePredictions.map((prediction) => (
      <div
        key={prediction.resource}
        style={{
          backgroundColor: "#0f172a",
          padding: "18px",
          borderRadius: "10px",
          border: "1px solid #334155",
        }}
      >
        <h3>{prediction.resource}</h3>

        <p>Current Level: {prediction.currentLevel}%</p>

        <p>
          LOW (20%):
          <strong> {prediction.lowIn ?? "N/A"} SOLs</strong>
        </p>

        <p>
          CRITICAL (10%):
          <strong> {prediction.criticalIn ?? "N/A"} SOLs</strong>
        </p>

        <p>
          Depleted (0%):
          <strong> {prediction.depletedIn ?? "N/A"} SOLs</strong>
        </p>

        <p style={{ color: "#94a3b8", fontSize: "13px" }}>
          Predicted LOW at SOL {prediction.lowSol ?? "N/A"}
        </p>
      </div>
    ))}
  </div>

  {shortagePredictions.length > 0 && (
    <div
      style={{
        marginTop: "20px",
        padding: "15px",
        backgroundColor: "#334155",
        borderRadius: "8px",
      }}
    >
      <strong>⚠️ First predicted shortage:</strong>{" "}
      {shortagePredictions[0].resource} in{" "}
      {shortagePredictions[0].lowIn ?? "N/A"} SOLs.
    </div>
  )}

  <p style={{ color: "#94a3b8", marginTop: "15px" }}>
    Predictions assume constant daily consumption and no
    resource replenishment. These are simulated thresholds,
    not NASA safety standards.
  </p>
</section>

{/* AI Preventive Recommendations */}
<section
  style={{
    backgroundColor: "#1e293b",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "20px",
  }}
>
  <h2>🤖 AI Preventive Recommendations</h2>

  <p>
    Ask Ollama to suggest preventive measures based on
    your current Mars habitat resource predictions.
  </p>

  <button
    onClick={analyzePreventiveWithAI}
    disabled={preventiveLoading}
    style={{
      padding: "12px 20px",
      backgroundColor: "#2563eb",
      color: "white",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      marginTop: "12px",
    }}
  >
    {preventiveLoading
      ? "Analyzing..."
      : "Generate AI Preventive Recommendations"}
  </button>

  {preventiveError && (
    <p style={{ color: "#f87171" }}>
      {preventiveError}
    </p>
  )}


  {preventiveAnalysis && (
    <div
      style={{
        marginTop: "20px",
        padding: "20px",
        backgroundColor: "#0f172a",
        borderRadius: "10px",
        borderLeft: preventiveAnalysis.startsWith("CURRENT EMERGENCY")
          ? "4px solid #ef4444"
          : "4px solid #22c55e",
      }}
    >
      <h3
        style={{
          color: preventiveAnalysis.startsWith("CURRENT EMERGENCY")
            ? "#f87171"
            : "#4ade80",
          marginTop: 0,
        }}
      >
        {preventiveAnalysis.startsWith("CURRENT EMERGENCY")
          ? "🚨 Emergency Recovery Required"
          : "🛡️ Preventive Action Recommended"}
      </h3>
      <p style={{ lineHeight: "1.8", marginBottom: 0 }}>
        {preventiveAnalysis}
      </p>
    </div>
  )}

  <p
    style={{
      color: "#94a3b8",
      fontSize: "13px",
      marginTop: "15px",
    }}
  >
    AI recommendations are advisory and generated for
    a simulated Mars habitat. Verified predictions are
    displayed separately above.
  </p>
</section>

{/* Early Resource Shortage Warnings */}
<section className="mission-info">
  <h2>⚠️ Early Resource Shortage Warnings</h2>

  {resourceWarnings.length === 0 ? (
    <p>✅ No resource shortages predicted within the selected forecast period.</p>
  ) : (
    <div className="recommendations-list">
      {resourceWarnings.map((warning) => (
        <div
          key={warning.resource}
          className="resource-card"
          style={{
           
borderLeft:
  warning.severity === "CRITICAL"
    ? "4px solid #ef4444"
    : "4px solid #f59e0b",

            marginBottom: "12px",
          }}
        >
         
<h3>
  {warning.severity === "CRITICAL" ? "🚨" : "⚠️"}{" "}
  {warning.resource.toUpperCase()} — {warning.severity}
</h3>

          <p>{warning.message}</p>

{warning.depletionSol != null && (
  <p>
    ⛔ Resource depletion (0%) expected by SOL {warning.depletionSol}
  </p>
)}

          
<p>
  First warning level: {warning.predictedLevel}%
</p>

<p>
  Lowest predicted level: {
    resourceForecast[resourceForecast.length - 1][warning.resource]
  }%
</p>

{warning.criticalSol !== null && (
  <p>
    🚨 Critical level (10% or below) expected by SOL {warning.criticalSol}
  </p>
)}


        </div>
      ))}
    </div>
  )}
</section>


{/* Mission Resource History */}
<section className="mission-info">
  <h2>📊 Mission Resource History</h2>

  <p>
    Historical resource levels recorded during
    the simulated Mars mission.
  </p>

  <div style={{ overflowX: "auto" }}>
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        textAlign: "center",
      }}
    >
      <thead>
        <tr>
          <th>SOL</th>
          <th>Oxygen</th>
          <th>Water</th>
          <th>Food</th>
          <th>Power</th>
          <th>Temperature</th>
        </tr>
      </thead>

      <tbody>
        {missionHistory.map((entry) => (
          <tr key={entry.sol}>
            <td>{entry.sol}</td>
            <td>{entry.oxygen}%</td>
            <td>{entry.water}%</td>
            <td>{entry.food}%</td>
            <td>{entry.power}%</td>
            <td>{entry.temperature}°C</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</section>


{/* Mission Resource Consumption Chart */}
<section className="mission-info">
  <h2>📈 Resource Consumption Trends</h2>

  <p>
    Track oxygen, water, food, and power
    throughout the simulated Mars mission.
  </p>

  <div style={{ width: "100%", height: 350 }}>
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={missionHistory}
        margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#334155"
        />

        <XAxis
          dataKey="sol"
          stroke="#cbd5e1"
        />

        <YAxis
          domain={[0, 100]}
          stroke="#cbd5e1"
          unit="%"
        />

        <Tooltip
          contentStyle={{
            backgroundColor: "#1e293b",
            border: "1px solid #475569",
            borderRadius: "8px",
            color: "#ffffff",
          }}
        />

        <Legend />

        <Line
          type="monotone"
          dataKey="oxygen"
          name="Oxygen"
          stroke="#38bdf8"
          strokeWidth={3}
          dot
        />

        <Line
          type="monotone"
          dataKey="water"
          name="Water"
          stroke="#22c55e"
          strokeWidth={3}
          dot
        />

        <Line
          type="monotone"
          dataKey="food"
          name="Food"
          stroke="#f59e0b"
          strokeWidth={3}
          dot
        />

        <Line
          type="monotone"
          dataKey="power"
          name="Power"
          stroke="#f43f5e"
          strokeWidth={3}
          dot
        />
      </LineChart>
    </ResponsiveContainer>
  </div>

  <p className="weather-note">
    Chart values represent simulated habitat resources,
    not live NASA mission telemetry.
  </p>
</section>


{/* Mission Risk Visualization */}
<section className="mission-info">
  <h2>⚠️ Mission Risk Visualization</h2>

  <p>
    Current risk based on estimated simulated
    habitat survival time and active emergencies.
  </p>

  <h3>
    Risk Level:{" "}
    {activeEmergency ? "CRITICAL" : survival.riskLevel}
  </h3>

  <div
    style={{
      width: "100%",
      height: "20px",
      backgroundColor: "#334155",
      borderRadius: "10px",
      overflow: "hidden",
    }}
  >
    <div
      style={{
        width: activeEmergency
          ? "100%"
          : survival.riskLevel === "CRITICAL"
          ? "100%"
          : survival.riskLevel === "HIGH"
          ? "75%"
          : survival.riskLevel === "MODERATE"
          ? "50%"
          : "25%",

        height: "100%",

        backgroundColor: activeEmergency
          ? "#ef4444"
          : survival.riskLevel === "CRITICAL"
          ? "#ef4444"
          : survival.riskLevel === "HIGH"
          ? "#f97316"
          : survival.riskLevel === "MODERATE"
          ? "#f59e0b"
          : "#22c55e",

        transition: "width 0.4s ease",
      }}
    />
  </div>

  <p>
    Estimated Survival:{" "}
    <strong>
      {survival.estimatedSurvivalSols} SOLs
    </strong>
  </p>
</section>

        {/* Mission control */}
        <section className="mission-info">
          <h2>Mission Control</h2>

          <p>Mission Day: SOL {mission.sol}</p>

          <p>
            Habitat Temperature: {mission.temperature}°C
            (Simulated)
          </p>
        </section>

        {/* Habitat resources */}
        <h2>Habitat Resources</h2>

        <section className="resource-grid">
          {Object.entries(mission.resources).map(
            ([name, value]) => (
              <div className="resource-card" key={name}>
                <h3>
                  {resourceIcons[name]} {name}
                </h3>

                <strong>{value}%</strong>

                <div className="progress-track">
                  <div
                    className={
                      value <= 20 ||
                      (emergency &&
                        ((activeEmergency === "oxygen" &&
                          name === "Oxygen") ||
                          (activeEmergency === "water" &&
                            name === "Water") ||
                          (activeEmergency === "power" &&
                            name === "Power")))
                        ? "progress-fill danger-fill"
                        : "progress-fill"
                    }
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            )
          )}
        </section>

        {/* Mission time */}
        <section className="mission-info">
          <h2>⏱ Mission Time Controller</h2>

          <p>
            Advance the simulation by one Martian day
            to observe resource consumption.
          </p>

          <div className="emergency-buttons">

            
            <button
              className="reset-button"
              onClick={handleAdvanceSol}
            >
              Advance 1 SOL
            </button>

            <button
              className="reset-button"
              onClick={handleReset}
            >
              Reset Mission
            </button>
          </div>
        </section>

        {/* Historical Mars weather */}
        <section className="weather-panel">
          <h2>🌡 Mars Environmental Monitoring</h2>

          <p>
            Historical observations from NASA's InSight
            lander at Elysium Planitia.
          </p>

          {weatherLoading && (
            <p>Loading Mars weather...</p>
          )}

          {weatherError && (
            <p className="ai-warning">
              NASA weather data could not be loaded:{" "}
              {weatherError}
            </p>
          )}

          {!weatherLoading &&
            !weatherError &&
            marsWeather?.available === false && (
              <p>{marsWeather.message}</p>
            )}

          {marsWeather?.available && (
            <>
              <div className="weather-grid">
                <div className="weather-card">
                  <h3>🌡 Air Temperature</h3>
                  <strong>
                    {typeof marsWeather.temperature === "number"
                      ? `${marsWeather.temperature.toFixed(1)}°C`
                      : "Unavailable"}
                  </strong>
                </div>

                <div className="weather-card">
                  <h3>🌬 Wind Speed</h3>
                  <strong>
                    {typeof marsWeather.windSpeed === "number"
                      ? `${marsWeather.windSpeed.toFixed(1)} m/s`
                      : "Unavailable"}
                  </strong>
                </div>

                <div className="weather-card">
                  <h3>🌫 Atmospheric Pressure</h3>
                  <strong>
                    {typeof marsWeather.pressure === "number"
                      ? `${marsWeather.pressure.toFixed(1)} Pa`
                      : "Unavailable"}
                  </strong>
                </div>

                <div className="weather-card">
                  <h3>🧭 Wind Direction</h3>
                  <strong>
                    {marsWeather.windDirection ?? "Unavailable"}
                  </strong>
                </div>
              </div>

              <p>
                Observation SOL: {marsWeather.sol}
              </p>

              <p>
                Observation date:{" "}
                {marsWeather.lastUTC
                  ? marsWeather.lastUTC.slice(0, 10)
                  : "Unavailable"}
              </p>
            </>
          )}

          <p className="weather-note">
            Source: NASA InSight. Historical measurements,
            not live Mars weather or simulated habitat readings.
          </p>
        </section>

        {/* NASA exploration images */}
        <section className="nasa-panel">
          <h2>🛰 NASA Mars Exploration Data</h2>

          <p>
            Images and mission information retrieved from
            NASA's Image and Video Library.
          </p>

          {nasaLoading && (
            <p>Loading NASA data...</p>
          )}

          {nasaError && (
            <p className="ai-warning">
              Unable to load NASA data: {nasaError}
            </p>
          )}

          {!nasaLoading &&
            !nasaError &&
            marsImages.length === 0 && (
              <p>No NASA images were found.</p>
            )}

          <div className="nasa-grid">
            {marsImages.slice(0, 6).map((image) => (
              <article
                className="nasa-card"
                key={image.id}
              >
                <img
                  src={image.imageUrl}
                  alt={image.title}
                  loading="lazy"
                />

                <div className="nasa-card-content">
                  <h3>{image.title}</h3>

                  <p>
                    Date:{" "}
                    {image.date
                      ? image.date.slice(0, 10)
                      : "Not available"}
                  </p>

                  <p>Source: {image.center}</p>

                  <a
                    href={image.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View NASA Source
                  </a>
                </div>
              </article>
            ))}
          </div>

          <p className="nasa-note">
            NASA images are historical observations and
            mission media, not live habitat sensor readings.
          </p>
        </section>



{/* Ollama AI Mission Advisor */}
<section className="ai-panel">
  <h2>🧠 AI Mission Advisor — Ollama</h2>

  <p>
    Analyze current Mars habitat resources using
    the local Llama 3.2 AI model.
  </p>

  <button
    className="recovery-button"
    onClick={analyzeMissionWithAI}
    disabled={aiLoading}
  >
    {aiLoading ? "Analyzing Mission..." : "🚀 Analyze Mission with AI"}
  </button>

  {aiError && (
    <p className="ai-warning">
      ⚠️ {aiError}
    </p>
  )}

  {aiAnalysis && (
    <div className="resource-card" style={{ marginTop: "20px" }}>
      <h3>🤖 AI Mission Analysis</h3>
      <p style={{ whiteSpace: "pre-wrap" }}>
        {aiAnalysis}
      </p>
    </div>
  )}
</section>

{/* Intelligent Mission Recommendations */}
<section className="ai-panel">
  <h2>🧠 Intelligent Mission Recommendations</h2>

  <p>
    Automated recommendations based on simulated
    habitat resources and survival predictions.
  </p>

  <div className="recommendations-list">
    {recommendations.map((item) => (
      <div
        className="resource-card"
        key={item.resource}
      >
        <h3>
          {item.priority === "CRITICAL"
            ? "🚨"
            : item.priority === "WARNING"
            ? "⚠️"
            : "✅"}{" "}
          {item.resource}
        </h3>

        <p>
          <strong>Priority:</strong> {item.priority}
        </p>

        <p>{item.message}</p>
      </div>
    ))}
  </div>

  <p className="weather-note">
    Recommendations are generated by simulation rules,
    not by a trained AI model or NASA mission-control software.
  </p>
</section>


        {/* Rule-based mission assistant */}
        <section className="ai-panel">
          <h2>🤖 AI Mission Assistant</h2>

          {emergency ? (
            <p className="ai-warning">
              ⚠ {emergency.message}
            </p>
          ) : criticalResources.length > 0 ? (
            <p className="ai-warning">
              ⚠ Critical resources detected:{" "}
              {criticalResources.join(", ")}.
              Immediate intervention is recommended.
            </p>
          ) : mission.temperature >= 40 ? (
            <p className="ai-warning">
              ⚠ Habitat temperature is dangerously high.
            </p>
          ) : (
            <p>
              All systems operational. Resource values
              are currently simulated.
            </p>
          )}
        </section>


{/* Emergency Recovery Control Panel */}
<section className="emergency-panel">
  <h2>🛠 Emergency Recovery Control</h2>

  <p>
    Perform simulated recovery actions to restore
    habitat resources and improve mission survival.
  </p>

  <div className="emergency-buttons">
    {Object.entries(RECOVERY_ACTIONS).map(
      ([actionType, action]) => (
        <button
          key={actionType}
          className="recovery-button"
          onClick={() => handleRecovery(actionType)}
          disabled={usedRecoveryActions.includes(actionType)}
        >
          {usedRecoveryActions.includes(actionType)
            ? `✓ ${action.title} (Used)`
            : action.title}
        </button>
      )
    )}
  </div>

  <h3>📋 Mission Recovery History</h3>

  {recoveryHistory.length === 0 ? (
    <p>No recovery actions performed yet.</p>
  ) : (
    <div className="recommendations-list">
      {recoveryHistory.map((entry) => (
        <div className="resource-card" key={entry.id}>
          <h3>✓ {entry.action}</h3>
          <p>Mission Day: SOL {entry.sol}</p>
          <p>{entry.description}</p>
        </div>
      ))}
    </div>
  )}

  <p className="weather-note">
    Recovery actions are simulated and can be used
    once per mission reset.
  </p>
</section>


        {/* Emergency simulation */}
        <section className="emergency-panel">
          <h2>🚨 Emergency Simulation</h2>

          <p>
            Select an emergency to test the simulated
            Mars habitat response.
          </p>

          <div className="emergency-buttons">
            <button
              className="leak-button"
              onClick={() => handleEmergency("oxygen")}
              disabled={Boolean(activeEmergency)}
            >
              Oxygen Leak
            </button>

            <button
              className="leak-button"
              onClick={() => handleEmergency("water")}
              disabled={Boolean(activeEmergency)}
            >
              Water Leak
            </button>

            <button
              className="leak-button"
              onClick={() => handleEmergency("power")}
              disabled={Boolean(activeEmergency)}
            >
              Power Failure
            </button>

            <button
              className="leak-button"
              onClick={() =>
                handleEmergency("temperature")
              }
              disabled={Boolean(activeEmergency)}
            >
              Temperature Failure
            </button>

<button
  className="leak-button"
  onClick={() => handleEmergency("food")}
  disabled={Boolean(activeEmergency)}
>
  Food Shortage
</button>


            <button
              className="reset-button"
              onClick={handleReset}
            >
              Reset Simulation
            </button>
          </div>

          {missionInEmergency && (
            <div
              className="alert-box"
              role="alert"
            >
              <h3>⚠ EMERGENCY ALERT</h3>

              {emergency && (
                <p>{emergency.message}</p>
              )}

              {criticalResources.length > 0 && (
                <p>
                  Critical resources:{" "}
                  {criticalResources.join(", ")}
                </p>
              )}

              {mission.temperature >= 40 && (
                <p>
                  Habitat temperature:{" "}
                  {mission.temperature}°C
                </p>
              )}

              <p>Mission Status: Emergency</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
