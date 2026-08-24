function App() {
  return (
    <main className="game-shell">
      <header className="game-header">
        <span className="eyebrow">A reasoning game</span>
        <button className="language-toggle" type="button" aria-label="Change language">
          EN
        </button>
      </header>

      <section className="welcome-card" aria-labelledby="game-title">
        <p className="cake-mark" aria-hidden="true">
          🍰
        </p>
        <h1 id="game-title">Missing Cake</h1>
        <p className="intro">Something is missing. Follow the clues, question every detail, and find out what happened.</p>
        <button className="start-button" type="button">
          Coming soon
        </button>
      </section>
    </main>
  )
}

export default App
