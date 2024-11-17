// - - IMPORTS - - //

import Nav from "./Nav"

// - - COMPONENT FUNCTION - - //

function Header() {
  return (
    <header className="container-header">
      <h1>The Playground</h1>
      <div>
        <h3>Curiosity Driven Development</h3>
        <Nav />
      </div>
    </header>
  )
}

// - - EXPORTS - - //

export default Header