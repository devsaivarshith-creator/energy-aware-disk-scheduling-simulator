# 🚀 Design and Performance Evaluation of an Energy-Aware Disk Scheduling Algorithm
### Operating Systems Laboratory Project & Comprehensive Evaluation

---

## 📌 1. Project Overview (In Plain English)

### What is a Hard Disk?
A traditional computer hard drive (HDD) contains rapidly spinning magnetic disks (called **platters**) and a mechanical **read/write arm** that swings across them. Data is stored on circular rings called **tracks or cylinders**, numbered from `0` to `N-1`.

### The Problem: Mechanical Movement Wastes Time and Electricity
Whenever your computer reads or writes a file, the mechanical arm must physically jump from its current cylinder to the requested cylinder. This physical motion is called **Seek Time**.
- Every mechanical movement **takes time** (latency).
- Every acceleration and braking of the actuator motor **consumes electric power** (energy).

If a hard drive services requests in a careless or naive order, the arm will wildly bounce back and forth across the disk surface, **wasting battery life, generating heat, and slowing the computer down**.

### The Solution: Disk Scheduling
**Disk Scheduling Algorithms** determine the smartest order to visit requested cylinders so that the arm travels the shortest distance, uses the least electric power, and doesn't make any request wait forever.

---

## 🎯 2. Project Objectives

1. **Simulate 6 Classic Operating System Algorithms**:
   - **FCFS** (First-Come, First-Served)
   - **SSTF** (Shortest Seek Time First)
   - **SCAN** (Elevator Algorithm)
   - **C-SCAN** (Circular SCAN)
   - **LOOK** (Smart Elevator)
   - **C-LOOK** (Circular LOOK)
2. **Design a Novel Energy-Aware Algorithm**:
   - Formulates a dual-objective mathematical model balancing **Mechanical Seek Distance** (actuator energy) and **Waiting Time** (anti-starvation & system latency).
3. **Interactive Visual Laboratory**:
   - Provide a zero-setup, interactive web simulator with real-time physical arm animation, textbook trajectory graphs, comparative bar charts, and CSV report export.

---

## 🧠 3. The 7 Algorithms Explained with Real-World Analogies

| Algorithm | Real-World Analogy | How it Works | Pros | Cons |
| :--- | :--- | :--- | :--- | :--- |
| **FCFS** *(First-Come, First-Served)* | 🛒 **The Grocery Checkout Line** | Services requests strictly in the order they arrived. | Perfectly fair; zero chance of starvation. | Head swings randomly; worst energy efficiency and seek time. |
| **SSTF** *(Shortest Seek Time First)* | 🐝 **The Greedy Bee** | Always jumps to whichever track is closest right now. | Very low total seek distance and fast at first. | **Starvation!** Requests on far-away tracks may wait forever if new close requests keep arriving. |
| **SCAN** *(Elevator Algorithm)* | 🛗 **The Skyscraper Elevator** | Moves in one direction servicing tracks on the way until it hits the very edge (Track 0 or Track N-1), then reverses. | Smooth, predictable motion; eliminates starvation. | Wastes energy traveling to empty boundary edges even if no requests are there. |
| **C-SCAN** *(Circular SCAN)* | 🎡 **One-Way Luggage Carousel** | Only sweeps and services in one direction (e.g., Left-to-Right). When it reaches the far edge, it jumps back to Track 0 and sweeps again. | Provides uniform, consistent waiting time for all tracks. | The long return jump to Track 0 consumes seek energy without servicing data. |
| **LOOK** *(Smart Elevator)* | 🏢 **Passenger-Aware Elevator** | Like SCAN, but only travels as far as the furthest actual requested track in that direction, then immediately reverses. | Better energy efficiency than SCAN by eliminating unnecessary edge travel. | Variance in waiting times depending on direction of travel. |
| **C-LOOK** *(Circular LOOK)* | 🔄 **Express Loop Shuttle** | Like C-SCAN, but only travels between the lowest and highest actual requested tracks. Eliminates boundary trips on both ends. | Best all-around conventional algorithm in classical OS textbooks. | Still makes decisions based purely on location, ignoring how long requests have waited. |
| ⭐ **Proposed Energy-Aware** | 🚗 **Intelligent Eco-Route GPS** | Evaluates a dynamic cost function: $\text{Score} = \alpha \times \text{SeekDistance} - \beta \times \text{TimeWaited}$. | **Optimal balance**: Low energy consumption, minimum seek distance, and zero starvation! | Requires parameter tuning ($\\alpha, \\beta$) for specific drive workloads. |

---

## 📐 4. Mathematical Model & Formulas

### 1. Total Seek Distance (Head Movement)
$$\text{Total Seek Distance} = \sum_{i=1}^{M} |C_i - C_{i-1}|$$
*Where $C_0$ is the initial head position, and $C_i$ is the cylinder visited at step $i$.*

### 2. Average Seek Distance
$$\text{Average Seek} = \frac{\text{Total Seek Distance}}{M}$$
*Where $M$ is the total number of serviced requests.*

### 3. Average Waiting Time
For each request $r$, its waiting time $W_r$ is the cumulative seek time elapsed from the start of the simulation until the head reaches cylinder $r$:
$$\text{Average Wait Time} = \frac{1}{M} \sum_{r=1}^{M} W_r$$

### 4. Energy Consumption Model
Mechanical energy consumed by the disk drive is modeled as:
$$\text{Energy (Joules)} = E_{\text{base}} + (\text{Total Seek Distance} \times E_{\text{factor}})$$
- **$E_{\text{base}}$**: Baseline electric power consumed by the spinning spindle motor and idle drive electronics (default: `5.0 J`).
- **$E_{\text{factor}}$**: Dynamic kinetic energy consumed per cylinder traveled by the voice-coil actuator motor (default: `0.05 J/cylinder`).

### 5. Proposed Energy-Aware Decision Formula
At each decision step, from current head position $H$ and total elapsed time $T$:
$$\text{Cost}(r) = \alpha \times |r - H| - \beta \times T$$
- The algorithm chooses the pending request with the **minimum cost**.
- **$\alpha$ (Seek Weight)**: Penalizes long physical jumps to conserve actuator motor electricity.
- **$\beta$ (Waiting Weight)**: Rewards requests that have been waiting in the queue, preventing starvation of distant cylinders.

---

## 💻 5. How to Run the Simulator

This project is built as a **self-contained, zero-dependency web application**. You do not need to install Python, C++, or Node.js to use it!

1. Open File Explorer and navigate to:
   ```
   C:\Users\varsh\OneDrive\Desktop\os cbp\index.html
   ```
2. Double-click **`index.html`** (or right-click → *Open with Google Chrome / Microsoft Edge*).
3. The interactive simulator will open in your browser immediately.

---

## 🕹️ 6. Simulator Features & User Guide

1. **Quick Presets**:
   - Choose from pre-configured scenarios including the **Classic Galvin OS Textbook Example** (`98, 183, 37, 122, 14, 124, 65, 67`), **Clustered High Locality**, or **Heavy Starvation Risk**.
2. **Interactive Hardware Track & Arm Animator**:
   - Shows a physical mechanical track (`0` to `199`).
   - Yellow pins show pending requests; pulsing red shows the current target; green shows serviced cylinders.
   - Click **▶ Play** to watch the mechanical arm (`H`) physically glide across tracks!
   - Step forward (**⏭**) or backward (**⏮**) one step at a time, or adjust speed (**0.5x, 1x, 2x**).
3. **Textbook Head Trajectory Path**:
   - Visualizes the classic zig-zag seek path of the disk arm (Cylinder on X-axis vs Step sequence on Y-axis).
4. **Metric Trophies**:
   - Automatically calculates and crowns the winners for **Lowest Energy**, **Shortest Seek Distance**, and **Lowest Wait Time**.
5. **Comparative Bar Charts**:
   - Side-by-side Chart.js visualizations comparing Seek Movement and Total Energy in Joules.
6. **Detailed Evaluation Table**:
   - Displays exact Service Order sequence, Total Seek, Avg Seek, Avg Wait, Total Energy, and Throughput for all 7 algorithms.
   - **Click any row in the table** to instantly preview its animation on the hardware track!
7. **📥 Export CSV**:
   - Click the *Export CSV* button to download an official spreadsheet summary of your simulation results.

---

## 🎓 7. Common Viva / Interview Questions & Answers

### Q1: Why does disk scheduling matter if Solid State Drives (SSDs) exist?
> **Answer**: While consumer laptops use flash SSDs, massive enterprise data centers, cloud archives (AWS Glacier, Google Cloud Storage), video surveillance systems, and high-capacity storage still heavily rely on Hard Disk Drives (HDDs) because of their lower cost per terabyte. Optimizing energy in millions of enterprise HDDs saves megawatts of electricity globally.

### Q2: What is the main drawback of SSTF?
> **Answer**: **Starvation**. If a stream of requests arrives near the head's current cylinder, the head will keep servicing them and never travel to requests waiting at the opposite end of the platter.

### Q3: How is LOOK different from SCAN?
> **Answer**: SCAN travels all the way to the extreme boundary edges of the disk (Track 0 or Track N-1) before reversing, even if no data is requested there. LOOK is smarter: it only travels as far as the furthest requested track, then immediately reverses, saving seek distance and energy.

### Q4: Why is the Proposed Energy-Aware Algorithm better than conventional algorithms?
> **Answer**: Conventional algorithms only look at one factor (either pure proximity like SSTF or rigid sweeping like SCAN). The Energy-Aware algorithm dynamically balances physical seek distance (energy savings) with request waiting time (fairness), preventing starvation while achieving near-optimal power consumption.

---

## 📁 8. Project Structure

```
os cbp/
│
├── index.html              <-- Complete Standalone Interactive Simulator (HTML + CSS + JS)
├── PROJECT_DESCRIPTION.md  <-- This detailed documentation and lab report guide
└── README.md               <-- Quick overview and usage instructions
```

---
*Created for Operating Systems Laboratory Coursework & Project Evaluation.*
