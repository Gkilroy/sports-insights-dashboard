import { useState } from 'react'

function Home() {
  const [search, setSearch] = useState('')
  const [result, setResult] = useState(null)

  const handleSearch = async () => {
    const apiKey = import.meta.env.VITE_SPORTSDB_KEY
    const res = await fetch(
      `https://www.thesportsdb.com/api/v1/json/${apiKey}/searchplayers.php?p=${search}`
    )
    const data = await res.json()
    setResult(data.player)
  }

  return (
    <div>
      <h1>Kilroy’s Sports House</h1>
      <p>Search for player stats and information</p>
      <input
        type="text"
        placeholder="Enter player name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      {result && result.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          {result.map((p) => (
            <div key={p.idPlayer} className="player-card">
              <h3>{p.strPlayer}</h3>
              <p>Team: {p.strTeam}</p>
              <p>Position: {p.strPosition}</p>
              {p.strThumb && <img src={p.strThumb} alt={p.strPlayer} />}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Home
