import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
      <Link to="/">Home</Link>
      <Link to="/parlay">Parlay Builder</Link>
    </nav>
  )
}

export default Navbar
