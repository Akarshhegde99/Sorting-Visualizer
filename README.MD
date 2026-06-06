# 📊 SortInsight - Interactive Sorting Visualizer

SortInsight is a premium, high-fidelity web application that visualizes sorting algorithms in real-time. Built with pure **HTML5**, **CSS3**, and **JavaScript (ES6)**, it features a glassmorphic dashboard, live statistics, audio frequency feedback, custom input options, and animation playback controls.

👉 **[Live Demo Hosted on GitHub Pages](https://akarshhegde99.github.io/Sorting-Visualizer/)**

---

## 🌟 Key Features

### 1. 📈 Live Statistics Dashboard
Monitor algorithm efficiency in real-time as they sort:
- **Comparisons**: Live counter of element-to-element checks.
- **Swaps & Writes**: Live counter of element swaps and writes.
- **Array Accesses**: Precise count of all read and write operations.
- **Elapsed Time**: A running timer tracking active execution duration.

### 2. 🎛️ Dynamic Playback Controls
- **Pause & Resume**: Stop the animation and timer mid-sort, analyze the current comparisons, and resume seamlessly.
- **Stop**: Cancel sorting execution instantly to reset or generate a new array.
- **Speed Slider**: Configure execution speeds from **0.50x** to **4.00x**.
- **Array Size Slider**: Adjust array sizes dynamically from **5** to **80** elements.

### 3. 🔊 Web Audio Synthesizer
- Plays pleasant sine-wave beep frequencies mapped dynamically to the values of array elements being compared or swapped.
- Includes a **Mute/Unmute toggle** directly in the navigation bar.

### 4. 📝 Interactive Algorithm Info & Code Panels
- **Algorithm Info**: Displays Best, Average, and Worst Case Time Complexities along with Space Complexities using clean, color-coded badges, accompanied by a description of the sorting approach.
- **Pseudo-code Panel**: Displays well-formatted pseudo-code for the active sorting algorithm.

### 5. ✍️ Custom Array Input
- Input custom values (separated by commas) to visualize specific edge cases or analyze exact array permutations.
- Automatically handles sanitization, bounds checking (values between 1 and 100), and dynamic bar layout distribution.

---

## 🚀 Implemented Algorithms

| Algorithm | Best Complexity | Average Complexity | Worst Complexity | Space Complexity |
|-----------|-----------------|--------------------|------------------|------------------|
| **Bubble Sort** | $O(n)$ | $O(n^2)$ | $O(n^2)$ | $O(1)$ |
| **Selection Sort** | $O(n^2)$ | $O(n^2)$ | $O(n^2)$ | $O(1)$ |
| **Insertion Sort** | $O(n)$ | $O(n^2)$ | $O(n^2)$ | $O(1)$ |
| **Merge Sort** | $O(n \log n)$ | $O(n \log n)$ | $O(n \log n)$ | $O(n)$ |
| **Quick Sort** | $O(n \log n)$ | $O(n \log n)$ | $O(n^2)$ | $O(\log n)$ |

---

## 🔧 Tech Stack

- **Frontend Structure**: HTML5 (Semantic Structure)
- **Styling**: Vanilla CSS3 (Custom Grid Layouts, Glassmorphism, Responsive Media Queries)
- **Logics**: ES6 JavaScript (Async/Await Animation Hooks, Promises)
- **Audio synthesis**: Web Audio API (Frequency Oscillators)
- **Typography**: Google Fonts (Outfit)
- **Icons**: FontAwesome 4.7

---

## 💻 Running Locally

Since this is a client-side application, you can run it directly without any installation:

1. Clone the repository:
   ```bash
   git clone https://github.com/Akarshhegde99/Sorting-Visualizer.git
   ```
2. Navigate to the project directory:
   ```bash
   cd Sorting-Visualizer
   ```
3. Open `index.html` in your favorite web browser, or serve it using a lightweight static server (e.g. VS Code Live Server or Python's HTTP Server):
   ```bash
   python -m http.server 8000
   ```
