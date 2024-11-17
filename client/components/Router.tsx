/* eslint-disable react/jsx-key */

// - - IMPORTS - - //

import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom'
import Playground from './Playground'
import Home from './Home'
import BikeGeo from './BikeGeo'
import VideoWall from './VideoWall'
import Sequences from './Sequences'
import Splines from './Splines'
import Metronome from './Metronome'
import AudioAnalysis from './AudioAnalysis'
import NotFound from './NotFound'
import Curvature from './Curvature'

// - - COMPONENT FUNCTION - - //

const router = createBrowserRouter(
    createRoutesFromElements([
      <Route path="/" element={<Playground />}>
        <Route index element={<Home />} />
        <Route path="curves" element={<Curvature />} />
        <Route path="splines" element={<Splines />} />
        <Route path="video-wall" element={<VideoWall />} />
        <Route path="sequences" element={<Sequences />} />
        <Route path="bike-geo" element={<BikeGeo />} />
        <Route path="audio-analysis" element={<AudioAnalysis />} />
        <Route path="metronome" element={<Metronome />} />
      </Route>,
      <Route path="*" element={<NotFound />} />
    ])
)

// - - EXPORTS - - //

export default router
