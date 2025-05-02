import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [oddsData, setOddsData] = useState([])

  const sportsDbKey = import.meta.env.VITE_SPORTSDB_KEY
  const oddsApiKey = import.meta.env.VITE_ODDSAPI_KEY

  useEffect(() => {
    const fetchOdds = async () => {
      try {
        const response = await fetch(
          `https://api.the-odds-api.com/v4/sports/basketball_nba/odds/?regions=us&markets=player_props&apiKey=${oddsApiKey}`
        )
        const data = await response.json()

        // Flatten OddsAPI structure
        const parsedOdds = data.flatMap((event) =>
          event.bookmakers.flatMap((bookmaker) =>
            bookmaker.markets.flatMap((market) =>
              market.outcomes.map((outcome) => ({
                playerName: outcome.name,
                line: outcome.point,
                market: market.key,
                bookmaker: bookmaker.key,
              }))
            )
          )
        )
        setOddsData(parsedOdds)
        console.log('Flattened Odds Data:', parsedOdds)
      } catch (err) {
        console.error('Error fetching odds:', err)
      }
    }

    fetchOdds()
  }, [oddsApiKey])

  const handleSearch = async () => {
    if (!searchTerm) return
    setIsLoading(true)

    try {
      const response = await fetch(
        `https://www.thesportsdb.com/api/v1/json/${sportsDbKey}/searchplayers.php?p=${searchTerm}`
      )
      const data = await response.json()
      setSearchResults(data?.player)
    } catch (err) {
      console.error('Error fetching player:', err)
      setSearchResults(null)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="app-container">
      <h1 className="main-heading">🏀 Sports Insights Dashboard</h1>

      <div className="search-section">
        <input
          type="text"
          placeholder="Search for a player..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {isLoading && <p>Loading player data...</p>}

      {searchResults && searchResults.length > 0 ? (
        <div className="results">
          {searchResults.map((player) => {
            const playerOdds = oddsData.find((o) =>
              o.playerName.toLowerCase().includes(player.strPlayer.toLowerCase())
            )

            return (
              <div key={player.idPlayer} className="player-card">
                <h3>{player.strPlayer}</h3>
                <p>Team: {player.strTeam}</p>
                <p>Position: {player.strPosition}</p>

                {playerOdds ? (
                  <p>
                    O/U Line: <strong>{playerOdds.line}</strong> ({playerOdds.bookmaker})
                  </p>
                ) : (
                  <p>No betting line found</p>
                )}

                {player.strCutout || player.strThumb ? (
                  <img
                    src={player.strCutout || player.strThumb}
                    alt={player.strPlayer}
                  />
                ) : (
                  <p>No image available</p>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        !isLoading && searchTerm && <p>No results found.</p>
      )}
    </div>
  )
}

export default App
