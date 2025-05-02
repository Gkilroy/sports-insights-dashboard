import { useState, useEffect } from 'react'
import './App.css'

const SPORT_OPTIONS = {
  NBA: { label: 'NBA', oddsKey: 'basketball_nba' },
  MLB: { label: 'MLB', oddsKey: 'baseball_mlb' },
  NFL: { label: 'NFL', oddsKey: 'americanfootball_nfl' },
}

function App() {
  const [selectedSports, setSelectedSports] = useState(['NBA'])
  const [oddsData, setOddsData] = useState([])
  const [parlay, setParlay] = useState([])
  const [parlaySize, setParlaySize] = useState(3)

  const oddsApiKey = import.meta.env.VITE_ODDSAPI_KEY

  const toggleSport = (sportKey) => {
    setSelectedSports((prev) =>
      prev.includes(sportKey)
        ? prev.filter((s) => s !== sportKey)
        : [...prev, sportKey]
    )
  }

  const fetchOddsAcrossSports = async () => {
    let allOdds = []

    for (const sportKey of selectedSports) {
      try {
        const oddsSportKey = SPORT_OPTIONS[sportKey].oddsKey
        const response = await fetch(
          `https://api.the-odds-api.com/v4/sports/${oddsSportKey}/odds/?regions=us&markets=player_props&apiKey=${oddsApiKey}`
        )
        const data = await response.json()

        const parsed = data.flatMap((event) =>
          event.bookmakers.flatMap((bookmaker) =>
            bookmaker.markets.flatMap((market) =>
              market.outcomes.map((outcome) => ({
                playerName: outcome.name,
                line: outcome.point,
                market: market.key,
                bookmaker: bookmaker.key,
                sport: sportKey,
              }))
            )
          )
        )

        allOdds.push(...parsed)
      } catch (err) {
        console.error(`Error fetching odds for ${sportKey}:`, err)
      }
    }

    setOddsData(allOdds)
  }

  const generateParlay = () => {
    const withSimulatedStats = oddsData.map((o) => {
      const simulatedStat = parseFloat((20 + Math.random() * 10).toFixed(1))
      const edge = parseFloat((simulatedStat - o.line).toFixed(1))
      return { ...o, simulatedStat, edge }
    })

    const sorted = withSimulatedStats
      .filter((o) => !isNaN(o.line) && o.line !== null)
      .sort((a, b) => b.edge - a.edge)

    setParlay(sorted.slice(0, parlaySize))
  }

  useEffect(() => {
    if (selectedSports.length > 0) {
      fetchOddsAcrossSports()
    }
  }, [selectedSports])

  return (
    <div className="app-container">
      <h1 className="main-heading">💸 Auto Parlay Builder</h1>

      {/* Multi-sport checkboxes */}
      <div className="tabs">
        {Object.keys(SPORT_OPTIONS).map((sportKey) => (
          <label key={sportKey} className="checkbox-tab">
            <input
              type="checkbox"
              checked={selectedSports.includes(sportKey)}
              onChange={() => toggleSport(sportKey)}
            />
            {SPORT_OPTIONS[sportKey].label}
          </label>
        ))}
      </div>

      {/* Parlay size slider */}
      <div style={{ margin: '1rem 0' }}>
        <label>
          Parlay Size: <strong>{parlaySize}</strong> legs
        </label>
        <input
          type="range"
          min="2"
          max="12"
          value={parlaySize}
          onChange={(e) => setParlaySize(Number(e.target.value))}
          style={{ width: '100%', maxWidth: '400px' }}
        />
      </div>

      <button onClick={generateParlay} disabled={oddsData.length === 0}>
        Build Parlay
      </button>

      {parlay.length > 0 && (
        <div className="parlay-results">
          <h2>🔥 Suggested Parlay ({parlaySize} Legs)</h2>
          {parlay.map((leg, index) => (
            <div key={index} className="player-card">
              <h3>{leg.playerName}</h3>
              <p>Sport: {leg.sport}</p>
              <p>O/U Line: {leg.line}</p>
              <p>Simulated Stat: {leg.simulatedStat}</p>
              <p>
                Edge:{' '}
                <strong style={{ color: leg.edge > 0 ? 'green' : 'red' }}>
                  {leg.edge > 0 ? '+' : ''}
                  {leg.edge}
                </strong>
              </p>
              <p>Bookmaker: {leg.bookmaker}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default App
