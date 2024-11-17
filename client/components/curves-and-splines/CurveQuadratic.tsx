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

// - - COMPONENT FUNCTION - - //

const CurveQuadratic = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [points, setPoints] = useState([
        [50, 150],
        [200, 50],
        [350, 150],
    ]);
    
    const [draggingPoint, setDraggingPoint] = useState<{ index: number } | null>(null);
    const [enforceBounds, setEnforceBounds] = useState(false);

    // Redraw quadratic Bézier curve
    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawQuadraticBezier(ctx, points);
        }
        }
    }, [points]);

    const handleMouseDown = (e: React.MouseEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        points.forEach(([x, y], index) => {
        if (isPointClicked(mouseX, mouseY, x, y)) {
            setDraggingPoint({ index });
        }
        });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!draggingPoint) return;

        const { index } = draggingPoint;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        let mouseX = e.clientX - rect.left;
        let mouseY = e.clientY - rect.top;

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
        value: number
    ) => {
        setPoints((prev) => {
        const newPoints = [...prev];
        newPoints[index][axis] = value;
        return newPoints;
        });
    };

    return (
        <div className="curve-container">
            <div> 
                <h3>Quadratic Bézier Curve</h3>
            </div>
            <div>
                <canvas
                    ref={canvasRef}
                    width="400"
                    height="300"
                    style={{ border: '1px solid black', display: 'block', marginBottom: '10px' }}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                />
            </div> 
            <div>
                {points.map(([x, y], i) => (
                    <div key={i} style={{ marginBottom: '5px' }}>
                    <label>
                        {`P${i}`} X:
                        <input
                        type="number"
                        value={x}
                        onChange={(e) =>
                            handleInputChange(i, 0, parseInt(e.target.value, 10))
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
                            handleInputChange(i, 1, parseInt(e.target.value, 10))
                        }
                        style={{ width: '60px', marginLeft: '5px' }}
                        />
                    </label>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CurveQuadratic
