// - - IMPORTS - - //

import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import CurveQuadratic from './curves-and-splines/CurveQuadratic'
import CurveCubic from './curves-and-splines/CurveCubic'

// - - COMPONENT FUNCTION - - //

const Curvature = () => {
  // Check if there's a saved value in localStorage, otherwise default to "quadratic"
  const savedCurve = localStorage.getItem('selectedCurve') || 'quadratic'
  const [selectedCurve, setSelectedCurve] = useState(savedCurve)

  // When the selectedCurve changes, save it to localStorage
  useEffect(() => {
    localStorage.setItem('selectedCurve', selectedCurve)
  }, [selectedCurve])

  return (
    <div>
        <div>
            <h2>Experiments in Interactive Bézier Curve & Splines</h2>
        </div>
        <div className='container-selector'>
            <label htmlFor="curve-select"><h4>Curve Type</h4></label>
            <select
                id="curve-select"
                onChange={(e) => setSelectedCurve(e.target.value)}
                value={selectedCurve}
            >
                <option value="quadratic">Bézier: Quadratic</option>
                <option value="cubic">Bézier: Cubic</option>
            </select>
        </div>
        <div>
            {selectedCurve === 'quadratic' && <CurveQuadratic />}
            {selectedCurve === 'cubic' && <CurveCubic />}
        </div>
        <Outlet />
    </div>
  )
}

export default Curvature
