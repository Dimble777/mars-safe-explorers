# 🚀 MARS-SAFE Explorers
### AI-Powered Mars Survival Mission Trainer

**NASA Space Apps Challenge 2026**

**Challenge:** Build a Junior Astronaut Mission Trainer

## 🌍 Project Overview

MARS-SAFE Explorers is an interactive Mars survival mission simulator which is designed to help young people to get a feel for the sorts of problems that astronauts would face if they were living and working on Mars.

The project is a blend of space science, AI, mission simulation and planned electronics integration to deliver an engaging astronaut training experience.

Users act as the Mars mission commander, monitoring the habitat resources, dealing with emergencies and making the decisions necessary to keep the crew safe.

## 🎯 Project Objectives

- Teach students about resource management in space.
- Show the importance of oxygen, water, food and electrical power.
- Introduce emergency decision making and problem solving.
- Look at how AI can help the astronauts out on the mission.
- Link the software simulations to the electronics and sensors.

## 🛰️ Key Features

### 1. Mars Mission Dashboard
- Shows mission SOL (Martian day).
- Monitors oxygen, water, food and power levels.
- Displays habitat temperature.
- Shows mission resource status.

### 2. Emergency Simulation
Users can respond to simulated mission emergencies, including:

- Oxygen leaks
- Power shortages
- Water shortages
- Food shortages
- Temperature emergencies

Emergency recovery actions enable the user to explore the effect of mission decisions on crew survival.

### 3. AI Mission Assistant
- Uses a locally running Ollama language model.
- Assesses the mission resource situation.
- Makes recommendations based on simulated mission data.
- Supports emergency decision-making.

### 4. Resource Forecasting
- Predicts future availability of resources.
- Supports 5, 10 and 20 SOL forecasts.
- Shows resource trends in the form of charts.
- Warns users of potential shortfalls.

### 5. NASA Data Integration
- Includes NASA imagery and Mars weather integration.
- Links the simulated mission learning to real space exploration information.
- External data availability is dependent on NASA API access.

### 6. ESP32 Electronics Integration
The project includes software to allow communication of mission information to an ESP32 based electronics module.

Planned hardware components include:

- ESP32 development board
- OLED display
- Buzzer

**Current status:** ESP32 sketch compiled successfully, mission data API tested. Physical ESP32 upload and hardware testing still to go.

## 💻 Technologies Used

| Component | Technology |
|---|---|
| Frontend | React, Vite, JavaScript |
| Backend | Node.js, Express |
| Artificial Intelligence | Ollama, Llama 3.2 |
| Data Visualization | Recharts |
| Hardware Platform | ESP32 |
| Programming | JavaScript, Arduino C++ |
| Version Control | Git and GitHub |

## ⚙️ Running the Project Locally

### Prerequisites

- Node.js and npm
- Ollama with the Llama 3.2 model installed

### Installation

Clone the repository:

```bash
git clone https://github.com/Dimble777/mars-safe-explorers.git
cd mars-safe-explorers
npm install
```

### Start the Backend

```bash
node server/index.cjs
```

The backend runs at:

`http://localhost:3001`

### Start the Frontend

Open a second terminal and run:

```bash
npm run dev
```

Open the local address shown by Vite, normally:

`http://localhost:5173`

### Start the Local AI Model

Ensure Ollama is installed and running, then use:

```bash
ollama pull llama3.2
ollama serve
```

If Ollama is already running then you don't need to start a second server.

The AI functionality will require the local Ollama service to be running.

## 🧪 Testing and Development Status

**Tested software features:**
- Mars mission resource simulation
- Mission SOL progression
- Emergency recovery actions
- Resource forecasting
- Backend mission API
- Software synchronization through ESP32 mission endpoints
- AI backend responses

**Pending validation:**
- Physical ESP32 firmware upload
- OLED display operation
- Buzzer operation
- End-to-end hardware testing

## 🔮 Future Improvements

- Full physical ESP32 hardware integration.
- Introduce further astronaut training scenarios.
- Add in more interactive educational challenges.
- Expand NASA data integration.
- Improve mission analytics and learning feedback.

## 🌟 Educational Impact

MARS-SAFE Explorers is all about encouraging students to develop critical thinking, STEM knowledge, resource management skills and an appreciation of space exploration.

By combining interactive simulation, AI assistance and electronics the project is designed to make Mars mission training accessible and exciting for young people.

## 📌 Project Repository

https://github.com/Dimble777/mars-safe-explorers

---

* MARS-SAFE Explorers — Learn. Explore. Survive on Mars.**
