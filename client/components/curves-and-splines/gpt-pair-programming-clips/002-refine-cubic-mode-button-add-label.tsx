// // - - RELEVANT SNIPPET - - //

// <div>
//   <label htmlFor="toggleRelativeButton">Control Points:</label>
//   <button
//     id="toggleRelativeButton"
//     onClick={toggleRelative}
//     style={{ marginLeft: '10px' }}
//   >
//     {isRelative ? 'Relative' : 'Absolute'}
//   </button>
// </div>

// // - - END RELEVANT SNIPPET - - //

// // - - FULL CONTEXT - - //

// <div className="splines">
//     <h2>Experiments in Interactive Bézier Curve & Spline Generation</h2>
  
//     {/* Toggle Relative/Absolute Button */}
//     <div>
//       <label htmlFor="toggleRelativeButton">Control Points:</label>
//       <button
//         id="toggleRelativeButton"
//         onClick={toggleRelative}
//         style={{ marginLeft: '10px' }}
//       >
//         {isRelative ? 'Relative' : 'Absolute'}
//       </button>
//     </div>
  
//     {/* Quadratic Bézier Section */}
//     <div className="curve-container">
//       <h3>Quadratic Bézier Curve</h3>
//       <canvas
//         ref={quadCanvasRef}
//         width={400}
//         height={300}
//         onMouseDown={(e) => handleMouseDown(e, quadPoints, 'quad')}
//         style={{ border: '1px solid black' }}
//       />
//       {/* Quadratic point controls */}
//       {/* ... */}
//     </div>
  
//     {/* Cubic Bézier Section */}
//     <div className="curve-container">
//       <h3>Cubic Bézier Curve</h3>
//       <canvas
//         ref={cubicCanvasRef}
//         width={400}
//         height={300}
//         onMouseDown={(e) => handleMouseDown(e, cubicPoints, 'cubic')}
//         style={{ border: '1px solid black' }}
//       />
//       {/* Cubic point controls */}
//       {/* ... */}
//     </div>
//   </div>
  
