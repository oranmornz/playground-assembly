// - - IMPORTS - - //

import React, { useState } from 'react'

// - - COMPONENT FUNCTION - - //

const Metronome: React.FC = () => {
  const [tempo, setTempo] = useState(120)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempo(Number(e.target.value))
  }

  return (
    <div>
      <h2>Metronome</h2>
      <label>
        Tempo: 
        <input type="number" value={tempo} onChange={handleChange} />
      </label>
    </div>
  )
}

// - - EXPORTS - - //

export default Metronome
