# 🚀 MARS-SAFE Explorers

### AI-Powered Mars Survival Mission Trainer

**NASA Space Apps Challenge 2026**

**Challenge:** Build a Junior Astronaut Mission Trainer

---

## 🌍 About the Project

What would you do if you were living on Mars and your habitat suddenly started losing oxygen?

You wouldn't be able to call for immediate help from Earth. You would have to understand the problem, look at the resources you have left, and decide what to do next.

That was the idea that inspired me to build **MARS-SAFE Explorers**.

It's an interactive Mars survival simulator where users take on the role of a mission commander. They can monitor important resources, deal with emergencies, and see how their decisions affect the mission.

I wanted to make something that would help students understand the challenges of space exploration without making the experience too complicated.

The project started as a web-based simulation, but I also wanted to bring electronics into it. So I connected an ESP32, an OLED display, and a buzzer to the application.

Now, when something changes in the simulation, the hardware can show the updated mission information and respond to critical situations.

MARS-SAFE Explorers brings together space science, programming, AI, and electronics in one educational project.

## 🎯 What I Wanted to Achieve

My main goal was to create a simple and interesting way for students to learn about surviving on Mars.

Through this project, I wanted to:

- Show why oxygen, water, food, and power are so important during a space mission.
- Help students understand how quickly a situation can change during an emergency.
- Encourage users to think carefully before making decisions.
- Explore how AI could help analyze mission conditions.
- Demonstrate how software can communicate with real electronic hardware.
- Make learning about space exploration more interactive.

## 🛰️ Main Features

### 1. Mars Mission Dashboard

The dashboard is where users can see what's happening inside their simulated Mars habitat.

It displays:

- Mission SOL (Martian day)
- Oxygen level
- Water level
- Food level
- Power level
- Habitat temperature
- Current mission status

As the mission moves forward, resources are consumed and their levels change.

This helps users understand why astronauts need to manage their supplies carefully, especially during long missions.

### 2. Emergency Simulation

I wanted users to experience some of the problems astronauts might face on Mars.

The simulator includes different emergency situations:

- Oxygen leaks
- Water shortages
- Power failures
- Food shortages
- Temperature emergencies

When an emergency occurs, the mission conditions change.

Users can respond by taking recovery actions, such as repairing an oxygen leak, activating backup power, starting water recycling, accessing emergency food supplies, or activating emergency cooling.

The idea is to let students experiment with different decisions and understand how those decisions affect the mission.

### 3. AI Mission Assistant

I added an AI assistant to help users understand what's happening during the mission.

It uses **Ollama with the Llama 3.2 model**, running locally on the computer.

The backend checks the current mission conditions and uses the AI model to generate recommendations.

For example, if oxygen becomes critically low, the assistant can explain the situation and suggest an appropriate recovery action.

I also included programmed resource-status checks so the system can identify important conditions before generating recommendations.

The AI is meant to support learning and decision-making within the simulation. It isn't designed to control a real spacecraft.

### 4. Resource Forecasting

Another important part of surviving on Mars is planning ahead.

Knowing how much water or oxygen is available right now is useful, but astronauts would also need to understand how long those resources might last.

I added a forecasting feature that allows users to view predictions for:

- 5 SOL
- 10 SOL
- 20 SOL

The application displays the predictions using charts and highlights possible resource shortages.

These forecasts are based on the consumption rates defined in the simulation.

### 5. NASA Data Integration

I wanted to connect the project with real information from NASA rather than relying entirely on fictional mission scenarios.

The application includes NASA imagery to help users explore real space-related content.

I also experimented with NASA's InSight Mars weather data. However, API access limitations affected the availability of weather information during development.

The mission resources and emergencies are still simulated, while NASA imagery provides an additional connection to real space exploration.

### 6. ESP32 Hardware Integration — Completed

This was one of my favorite parts of building MARS-SAFE Explorers.

At first, the mission information was available only on the website. I wanted to see whether I could display that same information on a real electronic device.

So I connected an **ESP32 development board, SSD1306 OLED display, and buzzer** to the system.

After working through the programming and communication setup, I was able to get the hardware communicating with the backend.

The ESP32 connects through Wi-Fi and receives updated mission information.

The OLED displays resource levels and mission status.

When the simulation enters a critical condition, the hardware can display a CRITICAL warning. I also tested the buzzer during an oxygen emergency.

After a recovery action, the OLED can show the updated mission conditions.

Seeing the information move from the website to the physical display was one of the most satisfying moments of the project.

#### Hardware Used

| Component | Purpose |
|---|---|
| ESP32 development board | Communicates with the backend |
| SSD1306 OLED display | Shows mission information |
| Buzzer module | Provides an audible emergency alert |
| Jumper wires | Connect the components |
| Breadboard | Supports the prototype circuit |
| USB cable | Programs and powers the ESP32 |

#### What I've Tested

- Successfully uploaded the ESP32 program using Arduino IDE.
- Connected the ESP32 to Wi-Fi.
- Established communication with the Node.js backend.
- Displayed mission resource information on the OLED.
- Verified NORMAL and CRITICAL status changes.
- Tested the buzzer during an oxygen emergency.
- Verified that updated mission information appears after simulation changes and recovery actions.

**Current hardware status: Working prototype.**

The hardware integration is complete for the current version of the project.

At this stage, the ESP32 receives simulated mission data from the application. Adding real environmental sensors would be a possible next step.

## 🔄 How Everything Works Together

The project has four main parts: the web application, backend, AI assistant, and ESP32 hardware.

Here's what happens during a typical simulation:

1. The user opens the MARS-SAFE Explorers website.
2. The dashboard shows the current mission resources.
3. The user advances the mission or triggers an emergency.
4. The application updates the simulated mission conditions.
5. The backend provides mission information and supports AI analysis.
6. The ESP32 retrieves updated data through Wi-Fi.
7. The OLED displays the latest resource levels and status.
8. During a tested critical oxygen emergency, the buzzer provides an alert.
9. The user can perform a recovery action and observe the changes.

This was my way of showing how software, AI, and electronics can work together in one project.

## 💻 Technologies Used

| Part of the Project | Technology |
|---|---|
| Frontend | React, Vite, JavaScript |
| Backend | Node.js, Express |
| AI | Ollama, Llama 3.2 |
| Charts | Recharts |
| Microcontroller | ESP32 |
| Display | SSD1306 OLED |
| Emergency alert | Buzzer |
| Hardware programming | Arduino IDE, C++ |
| Communication | Wi-Fi, HTTP API |
| Version control | Git, GitHub |

## ⚙️ How to Run the Project

The web simulation can run locally without the ESP32 hardware.

To use the AI assistant, Ollama must also be running.

### 1. Clone the Repository

```bash
git clone https://github.com/Dimble777/mars-safe-explorers.git
cd mars-safe-explorers
```

### 2. Install Dependencies

Make sure Node.js and npm are installed.

Then run:

```bash
npm install
```

### 3. Start the Backend

```bash
node server/index.cjs
```

The backend runs at:

`http://localhost:3001`

### 4. Start the Frontend

Open another terminal and run:

```bash
npm run dev
```

The application normally opens at:

`http://localhost:5173`

### 5. Set Up the AI Model

Install Ollama and download Llama 3.2:

```bash
ollama pull llama3.2
```

If Ollama isn't already running, start it with:

```bash
ollama serve
```

The AI assistant needs the local Ollama service to generate responses.

### 6. Connect the ESP32 Hardware

For anyone interested in trying the hardware part, these are the connections used in my prototype.

**OLED Display**

| OLED Pin | ESP32 Pin |
|---|---|
| GND | GND |
| VCC | 3V3 |
| SCL | GPIO 22 |
| SDA | GPIO 21 |

**Buzzer**

| Buzzer Pin | ESP32 Pin |
|---|---|
| GND | GND |
| I/O | GPIO 25 |
| VCC | 3V3 |

Use a compatible 3.3V buzzer module and check the pin labels before connecting power.

The ESP32 program can be uploaded through Arduino IDE.

Before uploading, configure the Wi-Fi credentials and the backend computer's local IP address in the ESP32 code.

The ESP32 and backend computer need to be on a network where they can communicate.

The hardware receives mission data through this endpoint:

`/api/esp32/mission`

Once the connection is established, the OLED can display mission information from the simulation.

## 🧪 Testing and Current Status

I've tested the main software features, including:

- Mission resource monitoring
- SOL progression
- Emergency simulations
- Recovery actions
- Resource forecasting
- AI recommendations
- Backend API communication

I've also tested the ESP32 hardware integration, including:

- Firmware upload
- Wi-Fi connectivity
- Backend communication
- OLED display updates
- NORMAL and CRITICAL status changes
- Buzzer response during an oxygen emergency

**Both the software simulation and the ESP32 hardware prototype are working together.**

There are still things I would like to improve, but the main features of the current prototype have been implemented and demonstrated.

## ⚠️ Current Limitations

MARS-SAFE Explorers is an educational project, so it doesn't attempt to reproduce every detail of a real Mars mission.

There are a few important limitations:

- Resource values are simulated rather than measured.
- Forecasts use predefined resource consumption rates.
- AI recommendations are intended for educational use.
- NASA data availability depends on external services.
- The ESP32 receives mission information from the backend rather than real environmental sensors.
- The buzzer has been tested during an oxygen emergency; other alert scenarios can be expanded and tested further.

The project is not intended to be used as a real astronaut safety or life-support system.

## 🔮 What I'd Like to Improve Next

Now that the basic software and hardware are working, there are several features I'd like to explore in the future.

Some of them are:

- Adding real environmental sensors.
- Creating more Mars emergency scenarios.
- Improving the resource forecasting system.
- Adding more NASA data.
- Introducing interactive astronaut training challenges.
- Exploring more advanced AI features.
- Expanding the hardware with additional indicators and sensors.

These improvements could make the learning experience more interactive and closer to the challenges involved in real space missions.

## 🌟 What Students Can Learn

I built MARS-SAFE Explorers to help students learn by experimenting.

Instead of only reading about astronauts and Mars missions, they can try managing resources, responding to emergencies, and seeing what happens after making different decisions.

The project introduces ideas from several STEM subjects, including:

- Space exploration
- Resource management
- Programming
- Artificial intelligence
- Electronics
- Problem-solving

I hope it encourages students to become curious about space science and to try building projects of their own.

## ❤️ What I Learned

Building this project helped me understand how different technologies can work together.

I worked with React and Node.js to build the simulation, used Ollama to add AI recommendations, and programmed the ESP32 to receive mission information.

The hardware part was especially interesting because it involved both programming and electronics.

Getting the OLED to display mission information and the buzzer to respond during an emergency made the project feel much more real.

There is still plenty to explore, but I'm happy that I was able to bring the main idea to life.

## 📌 Project Details

**Project:** MARS-SAFE Explorers

**Event:** NASA Space Apps Challenge 2026

**Challenge:** Build a Junior Astronaut Mission Trainer

**GitHub Repository:** https://github.com/Dimble777/mars-safe-explorers

---

### 🚀 MARS-SAFE Explorers — Learn. Explore. Survive on Mars.
