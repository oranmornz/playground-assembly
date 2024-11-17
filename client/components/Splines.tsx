// - - IMPORTS - - //

import React, { useRef, useEffect, useState } from 'react'

// - - HELPER FUNCTIONS - - //

const isPointClicked = (mouseX: number, mouseY: number, pointX: number, pointY: number, radius = 5) => {
  return Math.hypot(mouseX - pointX, mouseY - pointY) <= radius
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

const drawLabeledPoint = (ctx: CanvasRenderingContext2D, x: number, y: number, label: string, color: string) => {
  ctx.beginPath();
  ctx.arc(x, y, 5, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.font = '12px Arial';
  ctx.fillStyle = 'black';
  ctx.fillText(label, x + 7, y - 7);
}

const drawQuadraticBezier = (ctx: CanvasRenderingContext2D, points: number[][]) => {
  const [p0, p1, p2] = points

  // Draw control lines
  ctx.beginPath();
  ctx.moveTo(p0[0], p0[1])
  ctx.lineTo(p1[0], p1[1])
  ctx.lineTo(p2[0], p2[1])
  ctx.strokeStyle = '#aaa'
  ctx.stroke()

  // Draw curve
  ctx.beginPath()
  ctx.moveTo(p0[0], p0[1])
  ctx.quadraticCurveTo(p1[0], p1[1], p2[0], p2[1])
  ctx.strokeStyle = '#000'
  ctx.lineWidth = 2;
  ctx.stroke();

  // Draw labeled control points
  drawLabeledPoint(ctx, p0[0], p0[1], 'P0', 'red');
  drawLabeledPoint(ctx, p1[0], p1[1], 'P1', 'blue');
  drawLabeledPoint(ctx, p2[0], p2[1], 'P2', 'red')
};

const drawCubicBezier = (ctx: CanvasRenderingContext2D, points: number[][]) => {
  const [p0, p1, p2, p3] = points;

  // Draw control lines
  ctx.beginPath();
  ctx.moveTo(p0[0], p0[1]);
  ctx.lineTo(p1[0], p1[1]);
  ctx.moveTo(p2[0], p2[1]);
  ctx.lineTo(p3[0], p3[1]);
  ctx.strokeStyle = '#aaa';
  ctx.stroke();

  // Draw curve
  ctx.beginPath();
  ctx.moveTo(p0[0], p0[1]);
  ctx.bezierCurveTo(p1[0], p1[1], p2[0], p2[1], p3[0], p3[1]);
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Draw labeled control points
  drawLabeledPoint(ctx, p0[0], p0[1], 'P0', 'red');
  drawLabeledPoint(ctx, p1[0], p1[1], 'P1', 'blue');
  drawLabeledPoint(ctx, p2[0], p2[1], 'P2', 'blue');
  drawLabeledPoint(ctx, p3[0], p3[1], 'P3', 'red');
};

// - - COMPONENT FUNCTION - - //

const Splines = () => {
  const quadCanvasRef = useRef<HTMLCanvasElement>(null);
  const cubicCanvasRef = useRef<HTMLCanvasElement>(null);

  const [quadPoints, setQuadPoints] = useState([
    [50, 150],
    [200, 50],
    [350, 150],
  ])
  const [cubicPoints, setCubicPoints] = useState([
    [50, 150],
    [150, 50],
    [250, 250],
    [350, 150],
  ])

  const [draggingPoint, setDraggingPoint] = useState<{ curve: 'quad' | 'cubic'; index: number } | null>(null);
  // const [isRelative, setIsRelative] = useState(false);
  const [enforceBounds, setEnforceBounds] = useState(false)

  // Redraw quadratic Bézier curve
  useEffect(() => {
    const canvas = quadCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawQuadraticBezier(ctx, quadPoints);
      }
    }
  }, [quadPoints]);

  // Redraw cubic Bézier curve
  useEffect(() => {
    const canvas = cubicCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawCubicBezier(ctx, cubicPoints);
      }
    }
  }, [cubicPoints]);

  const handleMouseDown = (e: React.MouseEvent, points: number[][], curve: 'quad' | 'cubic') => {
    const canvas = curve === 'quad' ? quadCanvasRef.current : cubicCanvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    points.forEach(([x, y], index) => {
      if (isPointClicked(mouseX, mouseY, x, y)) {
        setDraggingPoint({ curve, index });
      }
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingPoint) return;

    const { curve, index } = draggingPoint;
    // const points = curve === 'quad' ? quadPoints : cubicPoints;
    const setPoints = curve === 'quad' ? setQuadPoints : setCubicPoints;

    const canvas = curve === 'quad' ? quadCanvasRef.current : cubicCanvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    let mouseX = e.clientX - rect.left;
    let mouseY = e.clientY - rect.top;

    // Enforce bounds
    if (enforceBounds) {
      mouseX = clamp(mouseX, 0, canvas.width);
      mouseY = clamp(mouseY, 0, canvas.height);
    }

    setPoints((prev) => {
      const newPoints = [...prev];
      newPoints[index] = [mouseX, mouseY];
      return newPoints;
    });
  };

  const handleMouseUp = () => {
    setDraggingPoint(null);
  };

  const handleInputChange = (
    index: number,
    axis: 0 | 1,
    value: number,
    points: number[][],
    setPoints: React.Dispatch<React.SetStateAction<number[][]>>
  ) => {
    setPoints((prev) => {
      const newPoints = [...prev];
      newPoints[index][axis] = value;
      return newPoints;
    });
  };

  // States for points and modes
  const [isRelative, setIsRelative] = useState(false);
  const [p0, setP0] = useState({ x: 10, y: 10 });
  const [p1, setP1] = useState({ x: 15, y: 20 });
  const [p2, setP2] = useState({ x: 30, y: 40 });
  const [p3, setP3] = useState({ x: 50, y: 60 })

  // Offsets for relative mode
  const [p1Offset, setP1Offset] = useState({ x: p1.x - p0.x, y: p1.y - p0.y });
  const [p2Offset, setP2Offset] = useState({ x: p2.x - p3.x, y: p2.y - p3.y })

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
  }, [isRelative, p0, p3, p1Offset, p2Offset])

  return (
    <div className="splines" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
      <h2>Experiments in Interactive Bézier Curve & Spline Generation</h2>

      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        {/* Quadratic Bézier */}
        <div className='curve-container'>
          <h3>Quadratic Bézier Curve</h3>
          <canvas
            ref={quadCanvasRef}
            width="400"
            height="300"
            style={{ border: '1px solid black', display: 'block', marginBottom: '10px' }}
            onMouseDown={(e) => handleMouseDown(e, quadPoints, 'quad')}
          />
          {quadPoints.map(([x, y], i) => (
            <div key={i} style={{ marginBottom: '5px' }}>
              <label>
                {`P${i}`} X:
                <input
                  type="number"
                  value={x}
                  onChange={(e) =>
                    handleInputChange(i, 0, parseInt(e.target.value, 10), quadPoints, setQuadPoints)
                  }
                  style={{ width: '60px', marginLeft: '5px' }}
                />
              </label>
              <label style={{ marginLeft: '10px' }}>
                {`P${i}`} Y:
                <input
                  type="number"
                  value={y}
                  onChange={(e) =>
                    handleInputChange(i, 1, parseInt(e.target.value, 10), quadPoints, setQuadPoints)
                  }
                  style={{ width: '60px', marginLeft: '5px' }}
                />
              </label>
            </div>
          ))}
        </div>

        {/* Cubic Bézier */}
        <div className='curve-container'>
          <h3>Cubic Bézier Curve</h3>
          <canvas
            ref={cubicCanvasRef}
            width="400"
            height="300"
            style={{ border: '1px solid black', display: 'block', marginBottom: '10px' }}
            onMouseDown={(e) => handleMouseDown(e, cubicPoints, 'cubic')}
          />
          {cubicPoints.map(([x, y], i) => (
            <div key={i} style={{ marginBottom: '5px' }}>
              <label>
                {`P${i}`} X:
                <input
                  type="number"
                  value={x}
                  onChange={(e) =>
                    handleInputChange(i, 0, parseInt(e.target.value, 10), cubicPoints, setCubicPoints)
                  }
                  style={{ width: '60px', marginLeft: '5px' }}
                />
              </label>
              <label style={{ marginLeft: '10px' }}>
                {`P${i}`} Y:
                <input
                  type="number"
                  value={y}
                  onChange={(e) =>
                    handleInputChange(i, 1, parseInt(e.target.value, 10), cubicPoints, setCubicPoints)
                  }
                  style={{ width: '60px', marginLeft: '5px' }}
                />
              </label>
              
            </div>
          ))}
          <div>
            <label htmlFor="toggleRelativeButton">Control Points:</label>
            <button
              id="toggleRelativeButton"
              onClick={toggleRelative}
              style={{ marginLeft: '10px' }}
            >
              {isRelative ? 'Relative' : 'Absolute'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Splines;
