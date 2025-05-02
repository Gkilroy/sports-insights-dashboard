import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [oddsData, setOddsData] = useState(null)

  const sportsDbKey = import.meta.env.VITE_SPORTSDB_KEY
  const oddsApiKey = import.meta.env.VITE_ODDSAPI_KEY

  useEffect(() => {
    const fetchOdds = async () => {
      try {
        const response = await fetch(
          `https://api.the-odds-api.com/v4/sports/basketball_nba/odds/?regions=us&markets=player_props&apiKey=${oddsApiKey}`
        )
        const data = await response.json()
        setOddsData(data)
        console.log('Odds API Data:', data)
      } catch (err) {
        console.error('Error fetching odds:', err)
      }
    }

    fetchOdds()
  }, [oddsApiKey])

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>

      <div>
        <h2>NBA Player Prop Odds (via OddsAPI)</h2>
        {oddsData ? (
          <pre>{JSON.stringify(oddsData.slice(0, 1), null, 2)}</pre>
        ) : (
          <p>Loading odds data...</p>
        )}
      </div>
    </>
  )
}

export default App
