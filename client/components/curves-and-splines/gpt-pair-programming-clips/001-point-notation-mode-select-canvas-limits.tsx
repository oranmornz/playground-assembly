// - - IMPORTS - - //
import React, { useRef, useEffect, useState } from 'react';

// - - HELPER FUNCTIONS - - //

const isPointClicked = (mouseX: number, mouseY: number, pointX: number, pointY: number, radius = 5) => {
  return Math.hypot(mouseX - pointX, mouseY - pointY) <= radius;
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const drawLabeledPoint = (ctx: CanvasRenderingContext2D, x: number, y: number, label: string, color: string) => {
  ctx.beginPath();
  ctx.arc(x, y, 5, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.font = '12px Arial';
  ctx.fillStyle = 'black';
  ctx.fillText(label, x + 7, y - 7);
};

const drawQuadraticBezier = (ctx: CanvasRenderingContext2D, points: number[][]) => {
  const [p0, p1, p2] = points;

  // Draw control lines
  ctx.beginPath();
  ctx.moveTo(p0[0], p0[1]);
  ctx.lineTo(p1[0], p1[1]);
  ctx.lineTo(p2[0], p2[1]);
  ctx.strokeStyle = '#aaa';
  ctx.stroke();

  // Draw curve
  ctx.beginPath();
  ctx.moveTo(p0[0], p0[1]);
  ctx.quadraticCurveTo(p1[0], p1[1], p2[0], p2[1]);
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Draw labeled control points
  drawLabeledPoint(ctx, p0[0], p0[1], 'P0', 'red');
  drawLabeledPoint(ctx, p1[0], p1[1], 'P1', 'blue');
  drawLabeledPoint(ctx, p2[0], p2[1], 'P2', 'red');
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
  ]);
  const [cubicPoints, setCubicPoints] = useState([
    [50, 150],
    [150, 50],
    [250, 250],
    [350, 150],
  ]);

  const [draggingPoint, setDraggingPoint] = useState<{ curve: 'quad' | 'cubic'; index: number } | null>(null);
  const [isRelative, setIsRelative] = useState(false);
  const [enforceBounds, setEnforceBounds] = useState(false);

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
    const points = curve === 'quad' ? quadPoints : cubicPoints;
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

  const toggleRelative = () => {
    setIsRelative((prev) => !prev);
    setCubicPoints((prev) => {
      if (isRelative) {
        // Convert relative to absolute
        return [
          prev[0],
          [prev[0][0] + prev[1][0], prev[0][1] + prev[1][1]],
          [prev[3][0] + prev[2][0], prev[3][1] + prev[2][1]],
          prev[3],
        ];
      } else {
        // Convert absolute to relative
        return [
          prev[0],
          [prev[1][0] - prev[0][0], prev[1][1] - prev[0][1]],
          [prev[2][0] - prev[3][0], prev[2][1] - prev[3][1]],
          prev[3],
        ];
      }
    });
  };

  return (
    <div className="splines" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
      <h2>Experiments in Interactive Bézier Curve & Spline Generation</h2>
      {/* Quadratic and Cubic Bézier */}
      {/* ... Add content similarly */}
      <button onClick={toggleRelative}>Toggle Relative</button>
    </div>
  );
};

export default Splines;
