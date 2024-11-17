// - - IMPORTS - - //

import Header from "./Header"
import { Outlet } from "react-router-dom"

// - - COMPONENT FUNCTION - - //

function Playground() {

  return (
    <>
      <Header />
      <div className="container-main">
        <Outlet />    
      </div>
  </>
  )
}

// - - EXPORTS - - //

export default Playground
