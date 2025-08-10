"use strict";

/**
 * app.js
 * - Maintains window.currentList as canonical array
 * - Renders bars directly into .array so existing CSS layout works
 * - Shows number inside each bar
 */

let currentList = [];
window.currentList = currentList; // global reference used by sort algorithms

const start = async () => {
  let algoValue = Number(document.querySelector(".algo-menu").value);
  let speedValue = Number(document.querySelector(".speed-menu").value);

  if (speedValue === 0) {
    speedValue = 1;
  }
  if (algoValue === 0) {
    alert("No Algorithm Selected");
    return;
  }

  let algorithm = new sortAlgorithms(speedValue);
  if (algoValue === 1) await algorithm.BubbleSort();
  if (algoValue === 2) await algorithm.SelectionSort();
  if (algoValue === 3) await algorithm.InsertionSort();
  if (algoValue === 4) await algorithm.MergeSort();
  if (algoValue === 5) await algorithm.QuickSort();
};

const RenderScreen = async () => {
  await RenderList();
};

const RenderList = async () => {
  let sizeValue = Number(document.querySelector(".size-menu").value || 10);
  await clearScreen();

  currentList = await randomList(sizeValue);
  window.currentList = currentList;
  renderFromArray(currentList);
};

const renderFromArray = (list) => {
  const arrayNode = document.querySelector(".array");
  if (!arrayNode) return;
  arrayNode.innerHTML = "";

  // Append bars directly into .array so CSS flex works as before
  for (const element of list) {
    const dnode = document.createElement("div");
    dnode.className = "cell";
    dnode.setAttribute("data-value", String(element));
    dnode.style.height = `${3.8 * element}px`;

    // show number inside bar
    dnode.innerText = element;

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
  let sizeValue = Number(document.querySelector(".size-menu").value);
  await clearScreen();

  let list = await randomList(sizeValue);
  if (sorted) list.sort((a, b) => a - b);

  const arrayNode = document.querySelector(".array");
  // simple fallback: render as bars too
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

document.querySelector(".icon")?.addEventListener("click", response);
document.querySelector(".start")?.addEventListener("click", start);
document.querySelector(".size-menu")?.addEventListener("change", RenderScreen);
document.querySelector(".algo-menu")?.addEventListener("change", RenderScreen);
window.onload = RenderScreen;

// expose render function so algorithms can call it if needed
window.renderFromArray = renderFromArray;
