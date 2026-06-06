"use strict";

/**
 * app.js
 * - Maintains window.currentList as canonical array
 * - Renders bars directly into .array so existing CSS layout works
 * - Implements interactive algorithm dashboard (complexities, pseudo-code)
 * - Implements stats tracking (comparisons, swaps, accesses, time)
 * - Implements audio synth frequencies for bar values
 * - Implements Pause, Resume, and Stop controls
 */

// Metadata Database for Sorting Algorithms
const ALGORITHM_DETAILS = {
  1: {
    name: "Bubble Sort",
    timeBest: "O(n)",
    timeAvg: "O(n²)",
    timeWorst: "O(n²)",
    space: "O(1)",
    approach: "Compares adjacent elements and swaps them if they are in the wrong order. This process is repeated until the array is sorted.",
    pseudoCode: `procedure bubbleSort(A : list of sortable items)
  n := length(A)
  repeat
    swapped := false
    for i := 1 to n-1 inclusive do
      if A[i-1] > A[i] then
        swap(A[i-1], A[i])
        swapped := true
      end if
    end for
    n := n - 1
  until not swapped
end procedure`
  },
  2: {
    name: "Selection Sort",
    timeBest: "O(n²)",
    timeAvg: "O(n²)",
    timeWorst: "O(n²)",
    space: "O(1)",
    approach: "Divides the array into sorted and unsorted parts. Repeatedly finds the minimum element from the unsorted part and puts it at the beginning.",
    pseudoCode: `procedure selectionSort(A : list of sortable items)
  n := length(A)
  for i := 0 to n-2 do
    minIdx := i
    for j := i+1 to n-1 do
      if A[j] < A[minIdx] then
        minIdx := j
      end if
    end for
    if minIdx != i then
      swap(A[i], A[minIdx])
    end if
  end for
end procedure`
  },
  3: {
    name: "Insertion Sort",
    timeBest: "O(n)",
    timeAvg: "O(n²)",
    timeWorst: "O(n²)",
    space: "O(1)",
    approach: "Builds the final sorted array one item at a time. It takes each element from the unsorted part and inserts it into its correct position in the sorted part.",
    pseudoCode: `procedure insertionSort(A : list of sortable items)
  for i := 1 to length(A)-1 do
    key := A[i]
    j := i - 1
    while j >= 0 and A[j] > key do
      A[j+1] := A[j]
      j := j - 1
    end while
    A[j+1] := key
  end for
end procedure`
  },
  4: {
    name: "Merge Sort",
    timeBest: "O(n log n)",
    timeAvg: "O(n log n)",
    timeWorst: "O(n log n)",
    space: "O(n)",
    approach: "A Divide-and-Conquer algorithm. It divides the input array into two halves, calls itself for the two halves, and then merges the two sorted halves.",
    pseudoCode: `procedure mergeSort(A : list, l : left index, r : right index)
  if l < r then
    mid := floor((l + r) / 2)
    mergeSort(A, l, mid)
    mergeSort(A, mid + 1, r)
    merge(A, l, mid, r)
  end if
end procedure

procedure merge(A : list, l : left, mid : middle, r : right)
  n1 := mid - l + 1
  n2 := r - mid
  create arrays L[0..n1-1] and R[0..n2-1]
  for i := 0 to n1-1 do L[i] := A[l + i]
  for j := 0 to n2-1 do R[j] := A[mid + 1 + j]
  
  i := 0, j := 0, k := l
  while i < n1 and j < n2 do
    if L[i] <= R[j] then
      A[k] := L[i]
      i := i + 1
    else
      A[k] := R[j]
      j := j + 1
    end if
    k := k + 1
  end while
  
  while i < n1 do
    A[k] := L[i]
    i := i + 1
    k := k + 1
  end while
  while j < n2 do
    A[k] := R[j]
    j := j + 1
    k := k + 1
  end while
end procedure`
  },
  5: {
    name: "Quick Sort",
    timeBest: "O(n log n)",
    timeAvg: "O(n log n)",
    timeWorst: "O(n²)",
    space: "O(log n)",
    approach: "A Divide-and-Conquer algorithm. It picks an element as a pivot and partitions the given array around the picked pivot, placing smaller elements to the left and larger to the right.",
    pseudoCode: `procedure quickSort(A : list, low : start index, high : end index)
  if low < high then
    p := partition(A, low, high)
    quickSort(A, low, p - 1)
    quickSort(A, p + 1, high)
  end if
end procedure

procedure partition(A : list, low : start index, high : end index)
  pivot := A[high]
  i := low - 1
  for j := low to high - 1 do
    if A[j] < pivot then
      i := i + 1
      swap(A[i], A[j])
    end if
  end for
  swap(A[i + 1], A[high])
  return i + 1
end procedure`
  }
};

let currentList = [];
window.currentList = currentList;
let isSorting = false;

// Control flow states
window.isPaused = false;
window.isCancelled = false;
let isMuted = false;

// Stats tracking
let comparisonsCount = 0;
let swapsCount = 0;
let accessesCount = 0;
let startTime = null;
let elapsedTime = 0;
let timerInterval = null;

// Audio synth context
let audioCtx = null;

const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
};

const playBeep = (value) => {
  if (isMuted) return;
  try {
    initAudio();
    if (!audioCtx) return;
    
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    // Map value (1 to 100) to frequency (150Hz to 850Hz)
    const minFreq = 150;
    const maxFreq = 850;
    const freq = minFreq + (value / 100) * (maxFreq - minFreq);
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    
    gainNode.gain.setValueAtTime(0.012, audioCtx.currentTime); // Low volume
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.08);
    
    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + 0.08);
  } catch (e) {
    console.error("Audio error:", e);
  }
};

// Expose stats trackers globally for the algorithms
window.trackComparison = (val) => {
  comparisonsCount++;
  accessesCount += 2;
  updateStatsUI();
  if (val !== undefined) playBeep(val);
};

window.trackSwap = (val) => {
  swapsCount++;
  accessesCount += 4; // Read 2, write 2
  updateStatsUI();
  if (val !== undefined) playBeep(val);
};

window.trackWrite = (val) => {
  swapsCount++;
  accessesCount += 2; // Write 1, read 1
  updateStatsUI();
  if (val !== undefined) playBeep(val);
};

const updateStatsUI = () => {
  const compEl = document.getElementById("stat-comparisons");
  const swapEl = document.getElementById("stat-swaps");
  const accEl = document.getElementById("stat-accesses");
  
  if (compEl) compEl.innerText = comparisonsCount;
  if (swapEl) swapEl.innerText = swapsCount;
  if (accEl) accEl.innerText = accessesCount;
};

const resetStats = () => {
  comparisonsCount = 0;
  swapsCount = 0;
  accessesCount = 0;
  elapsedTime = 0;
  updateStatsUI();
  if (timerInterval) clearInterval(timerInterval);
  const timeEl = document.getElementById("stat-time");
  if (timeEl) timeEl.innerText = "0.0s";
};

const startTimer = () => {
  startTime = Date.now();
  timerInterval = setInterval(() => {
    elapsedTime = ((Date.now() - startTime) / 1000).toFixed(1);
    const timeEl = document.getElementById("stat-time");
    if (timeEl) timeEl.innerText = `${elapsedTime}s`;
  }, 100);
};

const stopTimer = () => {
  if (timerInterval) clearInterval(timerInterval);
};

const disableControls = () => {
  const startBtn = document.querySelector(".start");
  const randomBtn = document.querySelector("#random");
  const algoMenu = document.querySelector(".algo-menu");
  const sizeMenu = document.querySelector(".size-menu");
  const speedMenu = document.querySelector(".speed-menu");
  const customBtn = document.getElementById("custom-array-btn");
  const customInput = document.getElementById("custom-array-val");

  if (startBtn) startBtn.classList.add("disabled");
  if (randomBtn) randomBtn.classList.add("disabled");
  if (algoMenu) algoMenu.disabled = true;
  if (sizeMenu) sizeMenu.disabled = true;
  if (speedMenu) speedMenu.disabled = true;
  if (customBtn) customBtn.disabled = true;
  if (customInput) customInput.disabled = true;
};

const enableControls = () => {
  const startBtn = document.querySelector(".start");
  const randomBtn = document.querySelector("#random");
  const algoMenu = document.querySelector(".algo-menu");
  const sizeMenu = document.querySelector(".size-menu");
  const speedMenu = document.querySelector(".speed-menu");
  const customBtn = document.getElementById("custom-array-btn");
  const customInput = document.getElementById("custom-array-val");

  if (startBtn) startBtn.classList.remove("disabled");
  if (randomBtn) randomBtn.classList.remove("disabled");
  if (algoMenu) algoMenu.disabled = false;
  if (sizeMenu) sizeMenu.disabled = false;
  if (speedMenu) speedMenu.disabled = false;
  if (customBtn) customBtn.disabled = false;
  if (customInput) customInput.disabled = false;
};

const start = async () => {
  if (isSorting) return;

  let algoValue = Number(document.querySelector(".algo-menu").value);
  let speedValue = Number(document.querySelector(".speed-menu").value);

  if (speedValue === 0) {
    speedValue = 1;
  }
  if (algoValue === 0) {
    alert("No Algorithm Selected");
    return;
  }

  isSorting = true;
  window.isPaused = false;
  window.isCancelled = false;
  disableControls();
  
  const pauseBtn = document.getElementById("pause-btn");
  const cancelBtn = document.getElementById("cancel-btn");
  if (pauseBtn) {
    pauseBtn.innerText = "Pause";
    pauseBtn.classList.remove("hidden");
  }
  if (cancelBtn) {
    cancelBtn.classList.remove("hidden");
  }

  resetStats();
  startTimer();

  try {
    let algorithm = new sortAlgorithms(speedValue);
    if (algoValue === 1) await algorithm.BubbleSort();
    if (algoValue === 2) await algorithm.SelectionSort();
    if (algoValue === 3) await algorithm.InsertionSort();
    if (algoValue === 4) await algorithm.MergeSort();
    if (algoValue === 5) await algorithm.QuickSort();
  } catch (error) {
    if (error.message === "SORT_CANCELLED") {
      console.log("Sorting cancelled by user.");
      await RenderList();
    } else {
      console.error("Sorting error:", error);
    }
  } finally {
    isSorting = false;
    enableControls();
    stopTimer();
    if (pauseBtn) pauseBtn.classList.add("hidden");
    if (cancelBtn) cancelBtn.classList.add("hidden");
  }
};

const RenderScreen = async () => {
  if (isSorting) return;
  await RenderList();
};

const RenderList = async () => {
  let sizeValue = Number(document.querySelector(".size-menu").value);
  if (sizeValue === 0) {
    sizeValue = 40; // Default fallback size
  }
  await clearScreen();

  currentList = await randomList(sizeValue);
  window.currentList = currentList;
  renderFromArray(currentList);
  resetStats();
};

const renderFromArray = (list) => {
  const arrayNode = document.querySelector(".array");
  if (!arrayNode) return;
  arrayNode.innerHTML = "";

  for (const element of list) {
    const dnode = document.createElement("div");
    dnode.className = "cell";
    dnode.setAttribute("data-value", String(element));
    dnode.style.height = `${3.8 * element}px`;

    // show number inside bar if array size is relatively small
    if (list.length <= 25) {
      dnode.innerText = element;
    }

    // ensure number is positioned well inside the bar
    dnode.style.display = "flex";
    dnode.style.alignItems = "flex-end"; // number at bottom
    dnode.style.justifyContent = "center";
    dnode.style.paddingBottom = "6px";
    dnode.style.color = "white";
    dnode.style.fontSize = "12px";
    dnode.style.fontWeight = "700";

    arrayNode.appendChild(dnode);
  }
};

const RenderArray = async (sorted) => {
  let sizeValue = Number(document.querySelector(".size-menu").value || 40);
  await clearScreen();

  let list = await randomList(sizeValue);
  if (sorted) list.sort((a, b) => a - b);

  renderFromArray(list);
};

const randomList = async (Length) => {
  let list = [];
  let lowerBound = 1;
  let upperBound = 100;

  for (let counter = 0; counter < Length; ++counter) {
    let randomNumber = Math.floor(
      Math.random() * (upperBound - lowerBound + 1) + lowerBound
    );
    list.push(parseInt(randomNumber));
  }
  return list;
};

const clearScreen = async () => {
  const node = document.querySelector(".array");
  if (node) node.innerHTML = "";
};

const response = () => {
  let Navbar = document.querySelector(".navbar");
  if (Navbar.className === "navbar") {
    Navbar.className += " responsive";
  } else {
    Navbar.className = "navbar";
  }
};

// UI Handlers & Tab toggling
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(c => c.classList.add("hidden"));
    
    btn.classList.add("active");
    const tabId = `tab-${btn.getAttribute("data-tab")}`;
    document.getElementById(tabId)?.classList.remove("hidden");
  });
});

// Update complexities & info on algo change
const updateAlgoDetails = (algoValue) => {
  const details = ALGORITHM_DETAILS[algoValue];
  if (!details) {
    document.getElementById("info-algo-name").innerText = "Select an Algorithm";
    document.getElementById("info-best-time").innerText = "-";
    document.getElementById("info-avg-time").innerText = "-";
    document.getElementById("info-worst-time").innerText = "-";
    document.getElementById("info-space-comp").innerText = "-";
    document.getElementById("info-algo-desc").innerText = "Choose a sorting algorithm from the dropdown to see its time and space complexity details, implementation logic, and pseudo-code.";
    document.getElementById("code-block").innerText = "Select an algorithm to view pseudo-code.";
    return;
  }

  document.getElementById("info-algo-name").innerText = details.name;
  document.getElementById("info-best-time").innerText = details.timeBest;
  document.getElementById("info-avg-time").innerText = details.timeAvg;
  document.getElementById("info-worst-time").innerText = details.timeWorst;
  document.getElementById("info-space-comp").innerText = details.space;
  document.getElementById("info-algo-desc").innerText = details.approach;
  document.getElementById("code-block").innerText = details.pseudoCode;
};

document.querySelector(".algo-menu")?.addEventListener("change", (e) => {
  updateAlgoDetails(Number(e.target.value));
});

// Controls & Audio syntheziser bindings
const toggleAudio = () => {
  isMuted = !isMuted;
  const icon = document.querySelector("#audio-toggle i");
  if (icon) {
    if (isMuted) {
      icon.className = "fa fa-volume-off";
      icon.style.color = "#ef4444";
    } else {
      icon.className = "fa fa-volume-up";
      icon.style.color = "";
    }
  }
};

const togglePause = () => {
  window.isPaused = !window.isPaused;
  const pauseBtn = document.getElementById("pause-btn");
  if (pauseBtn) {
    pauseBtn.innerText = window.isPaused ? "Resume" : "Pause";
  }
  
  if (window.isPaused) {
    stopTimer();
  } else {
    startTime = Date.now() - (elapsedTime * 1000);
    timerInterval = setInterval(() => {
      elapsedTime = ((Date.now() - startTime) / 1000).toFixed(1);
      const timeEl = document.getElementById("stat-time");
      if (timeEl) timeEl.innerText = `${elapsedTime}s`;
    }, 100);
  }
};

const cancelSorting = () => {
  window.isCancelled = true;
  window.isPaused = false;
};

const loadCustomArray = () => {
  if (isSorting) return;
  const inputVal = document.getElementById("custom-array-val").value;
  if (!inputVal) return;

  const list = inputVal.split(",")
    .map(x => parseInt(x.trim()))
    .filter(x => !isNaN(x) && x >= 1 && x <= 100);

  if (list.length === 0) {
    alert("Please enter valid numbers between 1 and 100 separated by commas.");
    return;
  }

  currentList = list;
  window.currentList = currentList;
  renderFromArray(currentList);
  resetStats();
};

document.querySelector(".icon")?.addEventListener("click", response);
document.querySelector(".start")?.addEventListener("click", start);
document.querySelector(".size-menu")?.addEventListener("change", RenderScreen);
document.querySelector(".algo-menu")?.addEventListener("change", RenderScreen);

document.getElementById("audio-toggle")?.addEventListener("click", toggleAudio);
document.getElementById("pause-btn")?.addEventListener("click", togglePause);
document.getElementById("cancel-btn")?.addEventListener("click", cancelSorting);
document.getElementById("custom-array-btn")?.addEventListener("click", loadCustomArray);

window.onload = async () => {
  const sizeMenu = document.querySelector(".size-menu");
  if (sizeMenu && sizeMenu.value === "0") {
    sizeMenu.value = "40";
  }
  const speedMenu = document.querySelector(".speed-menu");
  if (speedMenu && speedMenu.value === "0") {
    speedMenu.value = "1";
  }
  await RenderScreen();
};

window.renderFromArray = renderFromArray;
