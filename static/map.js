// Constants
const gridCount = 50; // 50x50 grid
const squareSize = 10; // Size of each square in pixels
const svg = document.getElementById('map');

// Object to store all grid points
const points = {};

// Draw the grid
for (let x = 0; x < gridCount; x += 1) {
  for (let y = 0; y < gridCount; y += 1) {
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    points[`${x}:${y}`] = rect;
    rect.setAttribute('width', squareSize);
    rect.setAttribute('height', squareSize);
    rect.setAttribute('x', x * squareSize);
    rect.setAttribute('y', y * squareSize);
    rect.setAttribute('fill', 'white');
    rect.setAttribute('stroke', '#ccc');

    svg.appendChild(rect);
  }
}

// Function to draw obstacles
const drawObstacle = (xStart, xEnd, yStart, yEnd, color) => {
  let x = xStart;
  while (x <= xEnd) {
    let y = yStart;
    while (y <= yEnd) {
      points[`${x}:${y}`] = false; // Mark as obstacle
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('width', squareSize);
      rect.setAttribute('height', squareSize);
      rect.setAttribute('x', x * squareSize);
      rect.setAttribute('y', y * squareSize);
      rect.setAttribute('fill', color || '#d77a61');
      rect.setAttribute('stroke', color || '#d77a61');

      svg.appendChild(rect);

      y += 1;
    }
    x += 1;
  }
};

// Example obstacles
drawObstacle(36, 38, 5, 10); // Rectangle obstacle
drawObstacle(10, 15, 20, 25, '#a8d5e2'); // Another obstacle with custom color

// Helper function to define obstacles by clicking
const drawHelper = (() => {
  let count = 0;
  let minX = null, maxX = null, minY = null, maxY = null;
  const allCoords = [];

  const highlightObstacle = () => {
    let x = minX;
    while (x <= maxX) {
      let y = minY;
      while (y <= maxY) {
        const rect = points[`${x}:${y}`];
        if (rect) rect.setAttribute('fill', 'gray');
        y += 1;
      }
      x += 1;
    }
  };

  return (x, y) => {
    count += 1;

    if (!minX || x < minX) minX = x;
    if (!maxX || x > maxX) maxX = x;
    if (!minY || y < minY) minY = y;
    if (!maxY || y > maxY) maxY = y;

    highlightObstacle();

    if (count === 3) {
      count = 0;
      allCoords.push([minX, maxX, minY, maxY]);
      minX = null, maxX = null, minY = null, maxY = null;
      console.log(JSON.stringify(allCoords));
    }
  };
})();

// Add click event listener to the SVG
svg.addEventListener('click', (event) => {
  const rect = svg.getBoundingClientRect();
  const x = Math.floor((event.clientX - rect.left) / squareSize);
  const y = Math.floor((event.clientY - rect.top) / squareSize);
  drawHelper(x, y);
});