// - - IMPORTS - - //

import { useState, useEffect } from "react";

// - - COMPONENT FUNCTION - - //

const Nav = () => {
    const [currentPage, setCurrentPage] = useState(window.location.pathname)

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newPage = e.target.value
        setCurrentPage(newPage)
        window.location.href = newPage
    };

    useEffect(() => {

        setCurrentPage(window.location.pathname)
    }, [])

    return (
        <nav className="nav">
            <select value={currentPage} onChange={handleChange}>
                <option value="/">Home</option>
                <option value="/curves">Curvature</option>
                <option value="/splines">Splines</option>
                <option value="/video-wall">VideoWall</option>
                <option value="/sequences">Sequences</option>
                <option value="/bike-geo">BikeGeo</option>
                <option value="/metronome">Metronome</option>
                <option value="/audio-analysis">Audio Analysers</option>
            </select>
        </nav>
    )
}

// - - EXPORTS - - //

export default Nav
