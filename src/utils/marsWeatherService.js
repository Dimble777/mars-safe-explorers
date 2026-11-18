
const WEATHER_API =
  "https://api.nasa.gov/insight_weather/";

// Convert a sensor measurement to a usable number.
function getAverage(sensor) {
  const value = sensor?.av;
  return typeof value === "number" &&
    Number.isFinite(value)
    ? value
    : null;
}

export async function getMarsWeather() {
  const params = new URLSearchParams({
    api_key: "DEMO_KEY",
    feedtype: "json",
    ver: "1.0",
  });

  const response = await fetch(
    `${WEATHER_API}?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error(
      `NASA weather request failed: ${response.status}`
    );
  }

  const data = await response.json();

  const sols = Array.isArray(data.sol_keys)
    ? data.sol_keys
    : [];

  if (sols.length === 0) {
    return {
      available: false,
      message:
        "No historical InSight weather observations are currently available from this API.",
      source: "NASA InSight",
    };
  }

  const latestSol = sols[sols.length - 1];
  const observation = data[latestSol];

  if (!observation) {
    return {
      available: false,
      message: "Weather observation data is missing.",
      source: "NASA InSight",
    };
  }

  return {
    available: true,
    source: "NASA InSight",
    location: "Elysium Planitia, Mars",
    sol: latestSol,
    firstUTC: observation.First_UTC ?? null,
    lastUTC: observation.Last_UTC ?? null,
    temperature: getAverage(observation.AT),
    pressure: getAverage(observation.PRE),
    windSpeed: getAverage(observation.HWS),
    windDirection:
      observation.WD?.most_common?.compass_point ??
      null,
    historical: true,
  };
}
