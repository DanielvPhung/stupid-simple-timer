import './App.css'
import { Body } from './components/body/body'
import { TimersProvider } from './contexts/timersContext'

function App() {
  return (
    <div className="app">
      <div>
        <h1>Stupid Simple Timer</h1>
      </div>
      <TimersProvider>
        <Body />
      </TimersProvider>
    </div>
  )
}

export default App
