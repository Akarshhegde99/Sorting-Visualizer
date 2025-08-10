class sortAlgorithms {
  constructor(speed) {
    this.speed = speed || 1;
    this.delay = Math.max(10, Math.floor(1000 / this.speed));
  }

  sleep(ms) {
    return new Promise((res) => setTimeout(res, ms));
  }

  // IMPORTANT: select bars directly under .array
  getBars() {
    return document.querySelectorAll(".array .cell");
  }

  updateBar(i, value) {
    const bars = this.getBars();
    if (!bars[i]) return;
    bars[i].style.height = `${3.8 * value}px`;
    bars[i].innerText = value;
    bars[i].setAttribute("data-value", String(value));
  }

  async swapIndices(i, j) {
    const arr = window.currentList;
    if (i === j) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    this.updateBar(i, arr[i]);
    this.updateBar(j, arr[j]);
    await this.highlightTemp(i, j, "#ff7043");
    await this.sleep(this.delay);
    this.unhighlight(i, j);
  }

  getBarAt(i) {
    return this.getBars()[i];
  }

  async highlightTemp(i, j, color) {
    const bars = this.getBars();
    if (bars[i]) bars[i].style.backgroundColor = color;
    if (bars[j]) bars[j].style.backgroundColor = color;
  }

  unhighlight(i, j) {
    const bars = this.getBars();
    if (bars[i]) bars[i].style.backgroundColor = "";
    if (bars[j]) bars[j].style.backgroundColor = "";
  }

  markSorted(i) {
    const bars = this.getBars();
    if (bars[i]) bars[i].style.backgroundColor = "#4caf50";
  }

  /* --- sorting implementations (same logic as earlier) --- */

  async BubbleSort() {
    const arr = window.currentList;
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        await this.highlightTemp(j, j + 1, "#ffd54f");
        await this.sleep(this.delay);
        if (arr[j] > arr[j + 1]) {
          await this.swapIndices(j, j + 1);
        } else {
          this.unhighlight(j, j + 1);
        }
      }
      this.markSorted(n - i - 1);
    }
    for (let k = 0; k < n; k++) this.markSorted(k);
  }

  async SelectionSort() {
    const arr = window.currentList;
    const n = arr.length;
    for (let i = 0; i < n; i++) {
      let minIdx = i;
      await this.highlightTemp(minIdx, minIdx, "#ff7043");
      for (let j = i + 1; j < n; j++) {
        await this.highlightTemp(minIdx, j, "#ffd54f");
        await this.sleep(this.delay);
        if (arr[j] < arr[minIdx]) {
          this.unhighlight(minIdx, minIdx);
          minIdx = j;
          await this.highlightTemp(minIdx, minIdx, "#ff7043");
        } else {
          this.unhighlight(minIdx, j);
        }
      }
      if (minIdx !== i) {
        await this.swapIndices(i, minIdx);
      } else {
        this.unhighlight(minIdx, minIdx);
      }
      this.markSorted(i);
    }
  }

  async InsertionSort() {
    const arr = window.currentList;
    const n = arr.length;
    for (let i = 1; i < n; i++) {
      let key = arr[i];
      let j = i - 1;
      await this.highlightTemp(i, i, "#ff7043");
      await this.sleep(this.delay);
      while (j >= 0 && arr[j] > key) {
        arr[j + 1] = arr[j];
        this.updateBar(j + 1, arr[j + 1]);
        await this.highlightTemp(j, j + 1, "#ffd54f");
        await this.sleep(this.delay);
        this.unhighlight(j, j + 1);
        j = j - 1;
      }
      arr[j + 1] = key;
      this.updateBar(j + 1, arr[j + 1]);
      this.unhighlight(i, i);
      await this.sleep(this.delay);
    }
    for (let k = 0; k < n; k++) this.markSorted(k);
  }

  async MergeSort() {
    const arr = window.currentList;
    await this._mergeSortHelper(0, arr.length - 1);
    for (let k = 0; k < arr.length; k++) this.markSorted(k);
  }

  async _mergeSortHelper(l, r) {
    if (l >= r) return;
    const mid = Math.floor((l + r) / 2);
    await this._mergeSortHelper(l, mid);
    await this._mergeSortHelper(mid + 1, r);
    await this._merge(l, mid, r);
  }

  async _merge(l, mid, r) {
    const arr = window.currentList;
    const left = arr.slice(l, mid + 1);
    const right = arr.slice(mid + 1, r + 1);
    let i = 0, j = 0, k = l;
    while (i < left.length && j < right.length) {
      await this.highlightTemp(k, k, "#ffd54f");
      if (left[i] <= right[j]) {
        arr[k] = left[i++];
      } else {
        arr[k] = right[j++];
      }
      this.updateBar(k, arr[k]);
      await this.sleep(this.delay);
      this.unhighlight(k, k);
      k++;
    }
    while (i < left.length) {
      arr[k] = left[i++];
      this.updateBar(k, arr[k]);
      await this.sleep(this.delay);
      k++;
    }
    while (j < right.length) {
      arr[k] = right[j++];
      this.updateBar(k, arr[k]);
      await this.sleep(this.delay);
      k++;
    }
  }

  async QuickSort() {
    const n = window.currentList.length;
    await this._quickSortHelper(0, n - 1);
    for (let k = 0; k < n; k++) this.markSorted(k);
  }

  async _quickSortHelper(low, high) {
    if (low < high) {
      const p = await this._partition(low, high);
      await this._quickSortHelper(low, p - 1);
      await this._quickSortHelper(p + 1, high);
    }
  }

  async _partition(low, high) {
    const arr = window.currentList;
    const pivot = arr[high];
    let i = low - 1;
    await this.highlightTemp(high, high, "#ff7043");
    for (let j = low; j < high; j++) {
      await this.highlightTemp(j, high, "#ffd54f");
      await this.sleep(this.delay);
      if (arr[j] < pivot) {
        i++;
        await this.swapIndices(i, j);
      } else {
        this.unhighlight(j, high);
      }
    }
    await this.swapIndices(i + 1, high);
    this.unhighlight(high, high);
    return i + 1;
  }
}

window.sortAlgorithms = sortAlgorithms;
