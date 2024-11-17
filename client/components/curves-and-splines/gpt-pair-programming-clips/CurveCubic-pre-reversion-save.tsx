// - - IMPORTS - - //

import React, { useRef, useEffect, useState } from 'react'

// - - INTERFACES - - //

interface DragState {
    isDragging: boolean
    initialValue: number
    initialY: number
}

// - - HELPER FUNCTIONS - - //

const isPointClicked = (mouseX: number, mouseY: number, pointX: number, pointY: number, radius = 5) => {
    return Math.hypot(mouseX - pointX, mouseY - pointY) <= radius
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

const drawLabeledPoint = (ctx: CanvasRenderingContext2D, x: number, y: number, label: string, color: string) => {
    ctx.beginPath()
    ctx.arc(x, y, 5, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.fill()
    ctx.font = '12px Arial'
    ctx.fillStyle = 'black'
    ctx.fillText(label, x + 7, y - 7)
}

const drawCubicBezier = (
    ctx: CanvasRenderingContext2D, 
    points: number[][], 
    color: string = '#000' // Default to black
    ) => {
    const [p0, p1, p2, p3] = points

    // Draw control lines
    ctx.beginPath()
    ctx.moveTo(p0[0], p0[1])
    ctx.lineTo(p1[0], p1[1])
    ctx.moveTo(p2[0], p2[1])
    ctx.lineTo(p3[0], p3[1])
    ctx.strokeStyle = color
    ctx.stroke()

    // Draw curve
    ctx.beginPath()
    ctx.moveTo(p0[0], p0[1])
    ctx.bezierCurveTo(p1[0], p1[1], p2[0], p2[1], p3[0], p3[1])
    ctx.strokeStyle = '#000'
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw labeled control points
    drawLabeledPoint(ctx, p0[0], p0[1], 'P0', 'red')
    drawLabeledPoint(ctx, p1[0], p1[1], 'P1', color)
    drawLabeledPoint(ctx, p2[0], p2[1], 'P2', color)
    drawLabeledPoint(ctx, p3[0], p3[1], 'P3', 'red')
}

// - - COMPONENT FUNCTION - - //

const CurveCubic = () => {
    // Dragging state for number inputs
    const [dragState, setDragState] = useState<DragState | null>(null)

    // States for points and modes
    const [isRelative, setIsRelative] = useState(false)

    // Init Point Coordinates
        const [points, setPoints] = useState([
            [50, 150],
            [150, 50],
            [250, 250],
            [350, 150],
        ])

    // Offsets For Relative Mode
    const [p1Offset, setP1Offset] = useState({ x: points[1][0] - points[0][0], y: points[1][1] - points[0][1] })
    const [p2Offset, setP2Offset] = useState({ x: points[2][0] - points[3][0], y: points[2][1] - points[3][1] })

    // Canvas Interaction Reference
    const canvasRef = useRef<HTMLCanvasElement>(null)

    // Toggle between relative and absolute mode
    const toggleRelative = () => {
        setIsRelative(!isRelative)
        if (!isRelative) {
            // Store offsets when switching to relative mode
            setP1Offset({ x: points[1][0] - points[0][0], y: points[1][1] - points[0][1] })
            setP2Offset({ x: points[2][0] - points[3][0], y: points[2][1] - points[3][1] })
        }
    }

    // Point Drag Hook
    const [draggingPoint, setDraggingPoint] = useState<{ index: number } | null>(null)

    // Relative Mode Control Point Updating
    useEffect(() => {
        if (isRelative) {
            setPoints((prev) => {
                const newPoints = [...prev]
                // Update P1 and P2 only if their anchors (P0 or P3) move
                if (!draggingPoint || draggingPoint.index === 0) {
                    newPoints[1] = [prev[0][0] + p1Offset.x, prev[0][1] + p1Offset.y]
                }
                if (!draggingPoint || draggingPoint.index === 3) {
                    newPoints[2] = [prev[3][0] + p2Offset.x, prev[3][1] + p2Offset.y]
                }
                return newPoints
            })
        }
    }, [isRelative, points[0], points[3], p1Offset, p2Offset, draggingPoint])

    // Point Coordinate Limits Hook
    const [enforceBounds, setEnforceBounds] = useState(false)

    // Redraw cubic Bézier curve
    useEffect(() => {
        const canvas = canvasRef.current
        if (canvas) {
            const ctx = canvas.getContext('2d')
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height)
                drawCubicBezier(ctx, points, isRelative ? 'green' : 'blue') // Pass color for P1 and P2
            }
        }
    }, [points, isRelative])

    // Mouse Down Event
    const handleMouseDown = (e: React.MouseEvent) => {
        const canvas = canvasRef.current
        if (!canvas) return

        const rect = canvas.getBoundingClientRect()
        const mouseX = e.clientX - rect.left
        const mouseY = e.clientY - rect.top

        points.forEach(([x, y], index) => {
        if (isPointClicked(mouseX, mouseY, x, y)) {
            setDraggingPoint({ index })
        }
        })
    }

    // Mouse Move Event
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!draggingPoint) return

        const { index } = draggingPoint

        const canvas = canvasRef.current
        if (!canvas) return

        const rect = canvas.getBoundingClientRect()
        let mouseX = e.clientX - rect.left
        let mouseY = e.clientY - rect.top

        if (enforceBounds) {
        mouseX = clamp(mouseX, 0, canvas.width)
        mouseY = clamp(mouseY, 0, canvas.height)
        }

        setPoints((prev) => {
            const newPoints = [...prev]
            newPoints[index] = [mouseX, mouseY]
        
            // Update offsets when moving control points independently
            if (isRelative) {
                if (index === 1) {
                    setP1Offset({ x: mouseX - prev[0][0], y: mouseY - prev[0][1] })
                } else if (index === 2) {
                    setP2Offset({ x: mouseX - prev[3][0], y: mouseY - prev[3][1] })
                }
            }
        
            return newPoints
        })
    }

    // Mouse Click Release Handler
    const handleMouseUp = () => {
        setDraggingPoint(null)
    }

    // Handle drag start
    const handleDragStart = (e: React.MouseEvent, index: number, axis: 0 | 1) => {
        e.preventDefault(); // Prevent text selection
        const initialValue = points[index][axis];
        const initialY = e.clientY;
        setDragState({ isDragging: true, initialValue, initialY });
    };

    // Handle dragging
    const handleDrag = (e: React.MouseEvent, index: number, axis: 0 | 1) => {
        if (!dragState || !dragState.isDragging) return;

        const delta = dragState.initialY - e.clientY; // Inverted to make dragging intuitive
        const newValue = dragState.initialValue + delta;

        setPoints((prev) => {
            const updatedPoints = [...prev];
            updatedPoints[index][axis] = newValue;
            return updatedPoints;
        });
    };

    // Handle drag end
    const handleDragEnd = () => {
        if (dragState?.isDragging) {
            setDragState(null);
        }
    };

    // Handle manual input changes
    const handleInputChange = (index: number, axis: 0 | 1, rawValue: number | string) => {
        const value = parseFloat(rawValue as string);
        if (isNaN(value)) return;

        setPoints((prev) => {
            const updatedPoints = [...prev];
            updatedPoints[index][axis] = value;
            return updatedPoints;
        });
    }

    // // Number Box Input Handler
    // const handleInputChange = (index: number, axis: 0 | 1, rawValue: number | string) => {
    //     const value = parseFloat(rawValue as string) // Safely parse input value as float
    //     if (isNaN(value)) return // Ignore invalid numbers
    
    //     setPoints((prev) => {
    //         const newPoints = [...prev]
    //         newPoints[index][axis] = value
    
    //         // Update offsets when P0 or P3 changes in relative mode
    //         if (isRelative) {
    //             if (index === 0) {
    //                 setP1Offset((prevOffset) => ({
    //                     ...prevOffset,
    //                     [axis === 0 ? 'x' : 'y']: newPoints[1][axis] - newPoints[0][axis],
    //                 }))
    //             } else if (index === 3) {
    //                 setP2Offset((prevOffset) => ({
    //                     ...prevOffset,
    //                     [axis === 0 ? 'x' : 'y']: newPoints[2][axis] - newPoints[3][axis],
    //                 }))
    //             }
    //         }
    
    //         return newPoints
    //     })
    // }

    return (
        <div className="curve-container" 
            onMouseUp={handleDragEnd} 
            onMouseMove={(e) => dragState?.isDragging && handleDrag(e, 0, 0)}
        >
            <div>
                <h4>Cubic Bézier Curve</h4>
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
            <div className='curve-points'>
                {points.map(([x, y], i) => (
                    <div key={i}>
                        <label>
                            {`P${i}`} X:
                            <input
                                type="text"
                                value={x}
                                onMouseDown={(e) => handleDragStart(e, i, 0)}
                                onChange={(e) => handleInputChange(i, 0, e.target.value)}
                                style={{
                                    cursor: 'ns-resize',
                                    width: '60px',
                                    marginLeft: '5px',
                                }}
                            />
                        </label>
                        <label>
                            {`P${i}`} Y:
                            <input
                                type="text"
                                value={y}
                                onMouseDown={(e) => handleDragStart(e, i, 1)}
                                onChange={(e) => handleInputChange(i, 1, e.target.value)}
                                style={{
                                    cursor: 'ns-resize',
                                    width: '60px',
                                    marginLeft: '5px',
                                }}
                            />
                        </label>
                    </div>
                ))}     
                <div>
                <label htmlFor="toggleRelativeButton">Control Points:</label>
                    <button
                        id="toggleRelativeButton"
                        onClick={toggleRelative}
                        style={{
                            marginLeft: '10px',
                            backgroundColor: isRelative ? 'green' : 'blue',
                            color: 'white',
                            padding: '5px 10px',
                        }}
                    >
                        {isRelative ? 'Relative' : 'Absolute'}
                    </button>
                    <span
                        style={{
                            display: 'inline-block',
                            marginLeft: '10px',
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            backgroundColor: isRelative ? 'green' : 'blue',
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

export default CurveCubic
