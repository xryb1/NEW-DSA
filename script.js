// Get the canvas and context
const canvas = document.getElementById('array-canvas');
const ctx = canvas.getContext('2d');

// Set the canvas dimensions
canvas.width = 800;
canvas.height = 400;

// Define the array to be sorted
let array = [];
let isSorting = false;

// Function to generate a random array
function generateArray() {
  array = [];
  for (let i = 0; i < 100; i++) {
    array.push(Math.floor(Math.random() * 380) + 20);
  }
}

// Function to draw the array on the canvas
function drawArray(highlightIndices = []) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < array.length; i++) {
    // Default color
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    
    // Highlight specific indices if provided
    if (highlightIndices.includes(i)) {
      ctx.fillStyle = 'red';
    }
    
    ctx.fillRect(i * 8, canvas.height - array[i], 8, array[i]);
  }
}

// Generate and draw the initial array
generateArray();
drawArray();

// Get the sort button, algorithm select, and reset button
const sortButton = document.getElementById('sort-button');
const resetButton = document.getElementById('reset-button');
const algorithmSelect = document.getElementById('algorithm-select');

// Get speed slider
const speedSlider = document.getElementById('speed-slider');

// Modify sleep function to use dynamic speed
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Function to get current speed from slider
function getSpeed() {
  // Invert the slider value so that lower values mean slower speed
  return 500 - speedSlider.value;
}

// Merge Sort with visualization
async function mergeSort(arr, start = 0, end = arr.length - 1) {
  if (start >= end) return;

  const middle = Math.floor((start + end) / 2);
  
  await mergeSort(arr, start, middle);
  await mergeSort(arr, middle + 1, end);
  
  await merge(arr, start, middle, end);
}

async function merge(arr, start, middle, end) {
  const left = arr.slice(start, middle + 1);
  const right = arr.slice(middle + 1, end + 1);
  
  let i = 0, j = 0, k = start;
  
  while (i < left.length && j < right.length) {
    // Highlight the elements being compared
    drawArray([start + i, middle + 1 + j]);
    await sleep(getSpeed());
    
    if (left[i] <= right[j]) {
      arr[k] = left[i];
      i++;
    } else {
      arr[k] = right[j];
      j++;
    }
    k++;
    
    // Redraw after each swap
    drawArray();
    await sleep(getSpeed());
  }
  
  // Handle remaining elements
  while (i < left.length) {
    arr[k] = left[i];
    i++;
    k++;
    drawArray();
    await sleep(getSpeed());
  }
  
  while (j < right.length) {
    arr[k] = right[j];
    j++;
    k++;
    drawArray();
    await sleep(getSpeed());
  }
}

// Quick Sort with visualization
async function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    let pivotIndex = await partition(arr, low, high);
    
    await quickSort(arr, low, pivotIndex - 1);
    await quickSort(arr, pivotIndex + 1, high);
  }
}

async function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;
  
  for (let j = low; j < high; j++) {
    // Highlight pivot and current element
    drawArray([high, j]);
    await sleep(getSpeed());
    
    if (arr[j] < pivot) {
      i++;
      // Swap
      [arr[i], arr[j]] = [arr[j], arr[i]];
      
      // Redraw after swap
      drawArray();
      await sleep(getSpeed());
    }
  }
  
  // Place pivot in correct position
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  
  drawArray();
  await sleep(getSpeed());
  
  return i + 1;
}

// Add event listener to the sort button
sortButton.addEventListener('click', async () => {
  if (isSorting) return;
  
  isSorting = true;
  const algorithm = algorithmSelect.value;
  
  try {
    switch (algorithm) {
      case 'merge-sort':
        await mergeSort(array);
        break;
      case 'quick-sort':
        await quickSort(array);
        break;
      // Keep existing sorting algorithms
      case 'bubble-sort':
        await bubbleSort();
        break;
      case 'selection-sort':
        await selectionSort();
        break;
      case 'insertion-sort':
        await insertionSort();
        break;
    }
  } catch (error) {
    console.error('Sorting error:', error);
  } finally {
    isSorting = false;
  }
});

// Add event listener to the reset button
resetButton.addEventListener('click', () => {
  if (!isSorting) {
    generateArray();
    drawArray();
  }
});

// Bubble sort function
function bubbleSort() {
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
      }
    }
    drawArray();
    setTimeout(() => {}, 10);
  }
}

// Selection sort function
function selectionSort() {
  for (let i = 0; i < array.length; i++) {
    let minIndex = i;
    for (let j = i + 1; j < array.length; j++) {
      if (array[j] < array[minIndex]) {
        minIndex = j;
      }
    }
    [array[i], array[minIndex]] = [array[minIndex], array[i]];
    drawArray();
    setTimeout(() => {}, 10);
  }
}

// Insertion sort function
function insertionSort() {
  for (let i = 1; i < array.length; i++) {
    let key = array[i];
    let j = i - 1;
    while (j >= 0 && array[j] > key) {
      array[j + 1] = array[j];
      j--;
    }
    array[j + 1] = key;
    drawArray();
    setTimeout(() => {}, 10);
  }
}

// Linked List Visualizer
class LinkedListNode {
    constructor(data) {
        this.data = data;
        this.next = null;
        this.prev = null;
    }
}

class LinkedListVisualizer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.head = null;
        this.type = 'singly';
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawSinglyLinkedList() {
        this.clear();
        let current = this.head;
        let x = 50;
        const y = 100;

        while (current) {
            // Draw node
            this.ctx.fillStyle = '#3498db';
            this.ctx.fillRect(x, y, 60, 40);
            
            // Draw data
            this.ctx.fillStyle = 'white';
            this.ctx.font = '14px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(current.data, x + 30, y + 25);

            // Draw arrow
            if (current.next) {
                this.ctx.beginPath();
                this.ctx.moveTo(x + 60, y + 20);
                this.ctx.lineTo(x + 100, y + 20);
                this.ctx.lineTo(x + 90, y + 10);
                this.ctx.moveTo(x + 100, y + 20);
                this.ctx.lineTo(x + 90, y + 30);
                this.ctx.stroke();
            }

            x += 100;
            current = current.next;
        }
    }

    drawDoublyLinkedList() {
        this.clear();
        let current = this.head;
        let x = 50;
        const y = 100;

        while (current) {
            // Draw node
            this.ctx.fillStyle = '#2ecc71';
            this.ctx.fillRect(x, y, 80, 40);
            
            // Draw data
            this.ctx.fillStyle = 'white';
            this.ctx.font = '14px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(current.data, x + 40, y + 25);

            // Draw arrows
            if (current.next) {
                // Forward arrow
                this.ctx.beginPath();
                this.ctx.moveTo(x + 80, y + 20);
                this.ctx.lineTo(x + 120, y + 20);
                this.ctx.lineTo(x + 110, y + 10);
                this.ctx.moveTo(x + 120, y + 20);
                this.ctx.lineTo(x + 110, y + 30);
                this.ctx.stroke();
            }

            x += 120;
            current = current.next;
        }
    }

    insertAtBeginning(data) {
        const newNode = new LinkedListNode(data);
        
        if (this.type === 'singly') {
            newNode.next = this.head;
            this.head = newNode;
        } else {
            newNode.next = this.head;
            if (this.head) {
                this.head.prev = newNode;
            }
            this.head = newNode;
        }

        this.type === 'singly' ? this.drawSinglyLinkedList() : this.drawDoublyLinkedList();
    }

    insertAtEnd(data) {
        const newNode = new LinkedListNode(data);
        
        if (!this.head) {
            this.head = newNode;
        } else {
            let current = this.head;
            while (current.next) {
                current = current.next;
            }
            
            if (this.type === 'singly') {
                current.next = newNode;
            } else {
                current.next = newNode;
                newNode.prev = current;
            }
        }

        this.type === 'singly' ? this.drawSinglyLinkedList() : this.drawDoublyLinkedList();
    }

    deleteAtBeginning() {
        if (this.head) {
            this.head = this.head.next;
            if (this.type === 'doubly' && this.head) {
                this.head.prev = null;
            }
        }

        this.type === 'singly' ? this.drawSinglyLinkedList() : this.drawDoublyLinkedList();
    }
}

// Initialize Linked List Visualizer
const linkedListVisualizer = new LinkedListVisualizer('linked-list-canvas');

// Event Listeners for Linked List Visualizer
document.getElementById('linked-list-type').addEventListener('change', (e) => {
    linkedListVisualizer.type = e.target.value;
    linkedListVisualizer.head = null;
    linkedListVisualizer.clear();
});

document.getElementById('insert-begin-btn').addEventListener('click', () => {
    const value = document.getElementById('node-value').value;
    if (value) {
        linkedListVisualizer.insertAtBeginning(value);
        document.getElementById('node-value').value = '';
    }
});

document.getElementById('insert-end-btn').addEventListener('click', () => {
    const value = document.getElementById('node-value').value;
    if (value) {
        linkedListVisualizer.insertAtEnd(value);
        document.getElementById('node-value').value = '';
    }
});

document.getElementById('delete-begin-btn').addEventListener('click', () => {
    linkedListVisualizer.deleteAtBeginning();
});

// Stack and Queue Visualizer
class StackQueueVisualizer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.type = 'stack';
        this.items = [];
        this.maxSize = 10;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    draw() {
        this.clear();
        const boxWidth = 60;
        const boxHeight = 40;
        const spacing = 10;

        this.ctx.fillStyle = '#3498db';
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'center';

        if (this.type === 'stack') {
            // Draw stack from top to bottom
            this.items.slice().reverse().forEach((item, index) => {
                const y = this.canvas.height - (index + 1) * (boxHeight + spacing);
                this.ctx.fillRect(this.canvas.width / 2 - boxWidth / 2, y, boxWidth, boxHeight);
                this.ctx.fillStyle = 'white';
                this.ctx.fillText(item, this.canvas.width / 2, y + boxHeight / 2 + 5);
                this.ctx.fillStyle = '#3498db';
            });
        } else {
            // Draw queue from left to right
            this.items.forEach((item, index) => {
                const x = index * (boxWidth + spacing);
                this.ctx.fillRect(x, this.canvas.height / 2 - boxHeight / 2, boxWidth, boxHeight);
                this.ctx.fillStyle = 'white';
                this.ctx.fillText(item, x + boxWidth / 2, this.canvas.height / 2 + 5);
                this.ctx.fillStyle = '#3498db';
            });
        }
    }

    pushOrEnqueue(value) {
        if (this.items.length < this.maxSize) {
            if (this.type === 'stack') {
                this.items.push(value);
            } else {
                this.items.push(value);
            }
            this.draw();
        } else {
            alert(`${this.type.charAt(0).toUpperCase() + this.type.slice(1)} is full!`);
        }
    }

    popOrDequeue() {
        if (this.items.length > 0) {
            if (this.type === 'stack') {
                this.items.pop();
            } else {
                this.items.shift();
            }
            this.draw();
        } else {
            alert(`${this.type.charAt(0).toUpperCase() + this.type.slice(1)} is empty!`);
        }
    }
}

// Initialize Stack/Queue Visualizer
const stackQueueVisualizer = new StackQueueVisualizer('stack-queue-canvas');

// Event Listeners for Stack/Queue Visualizer
document.getElementById('data-structure-type').addEventListener('change', (e) => {
    stackQueueVisualizer.type = e.target.value;
    stackQueueVisualizer.items = [];
    stackQueueVisualizer.draw();
});

document.getElementById('push-enqueue-btn').addEventListener('click', () => {
    const value = document.getElementById('element-value').value;
    if (value) {
        stackQueueVisualizer.pushOrEnqueue(value);
        document.getElementById('element-value').value = '';
    }
});

document.getElementById('pop-dequeue-btn').addEventListener('click', () => {
    stackQueueVisualizer.popOrDequeue();
});

class TreeNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

class SimpleTreeVisualizer {
    constructor() {
        this.canvas = document.getElementById('tree-canvas');
        if (!this.canvas) {
            console.error('Canvas not found!');
            return;
        }
        this.ctx = this.canvas.getContext('2d');
        this.root = null;
    }

    insert(value) {
        const newNode = new TreeNode(parseInt(value));
        
        if (!this.root) {
            this.root = newNode;
            this.drawTree();
            return;
        }

        this._insertNode(this.root, newNode);
        this.drawTree();
    }

    _insertNode(currentNode, newNode) {
        if (newNode.value < currentNode.value) {
            if (!currentNode.left) {
                currentNode.left = newNode;
            } else {
                this._insertNode(currentNode.left, newNode);
            }
        } else {
            if (!currentNode.right) {
                currentNode.right = newNode;
            } else {
                this._insertNode(currentNode.right, newNode);
            }
        }
    }

    drawTree() {
        console.log('Drawing tree...');
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this._drawNode(this.root, this.canvas.width / 2, 50, this.canvas.width / 4);
    }

    _drawNode(node, x, y, spread) {
        if (!node) return;

        // Draw node
        this.ctx.beginPath();
        this.ctx.arc(x, y, 20, 0, 2 * Math.PI);
        this.ctx.fillStyle = 'blue';
        this.ctx.fill();

        // Draw value
        this.ctx.fillStyle = 'white';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(node.value, x, y);

        // Recursively draw children
        if (node.left) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, y + 20);
            this.ctx.lineTo(x - spread, y + 80);
            this.ctx.stroke();
            this._drawNode(node.left, x - spread, y + 80, spread / 2);
        }

        if (node.right) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, y + 20);
            this.ctx.lineTo(x + spread, y + 80);
            this.ctx.stroke();
            this._drawNode(node.right, x + spread, y + 80, spread / 2);
        }
    }
}

// Initialize Tree Visualizer
const treeVisualizer = new SimpleTreeVisualizer();

// Event Listeners
document.getElementById('insert-node-btn').addEventListener('click', () => {
    const value = document.getElementById('node-value').value;
    if (value) {
        treeVisualizer.insert(value);
        document.getElementById('node-value').value = '';
    }
});

document.getElementById('clear-tree-btn').addEventListener('click', () => {
    treeVisualizer = new SimpleTreeVisualizer();
});


