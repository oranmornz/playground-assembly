import React, { useState, useEffect } from 'react';

const Splines = () => {
  // States for points and modes
  const [isRelative, setIsRelative] = useState(false);
  const [p0, setP0] = useState({ x: 10, y: 10 });
  const [p1, setP1] = useState({ x: 15, y: 20 });
  const [p2, setP2] = useState({ x: 30, y: 40 });
  const [p3, setP3] = useState({ x: 50, y: 60 });

  // Offsets for relative mode
  const [p1Offset, setP1Offset] = useState({ x: p1.x - p0.x, y: p1.y - p0.y });
  const [p2Offset, setP2Offset] = useState({ x: p2.x - p3.x, y: p2.y - p3.y });

  // Toggle between relative and absolute mode
  const toggleRelative = () => {
    setIsRelative(!isRelative);
    if (!isRelative) {
      // When switching to relative, calculate and store offsets
      setP1Offset({ x: p1.x - p0.x, y: p1.y - p0.y });
      setP2Offset({ x: p2.x - p3.x, y: p2.y - p3.y });
    }
  };

  // Update points in relative mode based on the offsets
  useEffect(() => {
    if (isRelative) {
      // Update P1 position relative to P0
      setP1({ x: p0.x + p1Offset.x, y: p0.y + p1Offset.y });

      // Update P2 position relative to P3
      setP2({ x: p3.x + p2Offset.x, y: p3.y + p2Offset.y });
    }
  }, [isRelative, p0, p3, p1Offset, p2Offset]);

  return (
    <div className="splines">
      <h2>Interactive Bézier Curves</h2>

      <div>
        <label htmlFor="toggleRelativeButton">Control Points:</label>
        <button id="toggleRelativeButton" onClick={toggleRelative}>
          {isRelative ? 'Relative' : 'Absolute'}
        </button>
      </div>

      <div>
        <h3>Quadratic Bézier Curve</h3>
        <canvas
          width={400}
          height={300}
          style={{ border: '1px solid black' }}
        />
        {/* Render P0, P1, P2 */}
        {/* ... */}
      </div>

      <div>
        <h3>Cubic Bézier Curve</h3>
        <canvas
          width={400}
          height={300}
          style={{ border: '1px solid black' }}
        />
        {/* Render P0, P1, P2, P3 */}
        {/* ... */}
      </div>
    </div>
  );
};

export default Splines;
