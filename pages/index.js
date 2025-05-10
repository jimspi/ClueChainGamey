import { useState } from 'react';
import styles from '../styles/Home.module.css';

export default function Home({ puzzle }) {
  const [guess, setGuess] = useState('');
  const [feedback, setFeedback] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [revealedClues, setRevealedClues] = useState(1);
  const [showInstructions, setShowInstructions] = useState(false);

  async function handleSubmit() {
    const res = await fetch('/api/guess', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ guess })
    });
    const { correct } = await res.json();
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (correct) {
      setFeedback('✅ Correct!');
    } else if (newAttempts >= 5) {
      setFeedback(`❌ Out of tries! The answer was “${puzzle.answer.toUpperCase()}.”`);
      setRevealedClues(puzzle.clues.length);
    } else {
      setRevealedClues(Math.min(revealedClues + 1, puzzle.clues.length));
      setFeedback(`❌ Nope—${5 - newAttempts} tries left.`);
    }
  }

  return (
    <div className={styles.container}>
      <h1>ClueChain</h1>
      <button onClick={() => setShowInstructions(true)} className={styles.infoButton}>
        How to Play
      </button>

      {showInstructions && (
        <div className={styles.modalOverlay} onClick={() => setShowInstructions(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2>How to Play</h2>
            <p>You get 5 chances to guess the mystery word.</p>
            <p>You’ll get one clue to start.</p>
            <p>Each wrong guess reveals another clue.</p>
            <p>Guess right before you run out of attempts!</p>
            <button onClick={() => setShowInstructions(false)} className={styles.closeButton}>Got it!</button>
          </div>
        </div>
      )}

      <div className={styles.clueBox}>
        <strong>Clue #{revealedClues}:</strong> {puzzle.clues[revealedClues - 1]}
      </div>

      <input
        type="text"
        value={guess}
        onChange={e => setGuess(e.target.value)}
        placeholder="Enter your guess"
        className={styles.input}
      />
      <button onClick={handleSubmit} className={styles.button}>Submit</button>
      <p className={styles.feedback}>{feedback}</p>
    </div>
  );
}

export async function getServerSideProps() {
  const puzzles = require('../puzzles.json');
  const index = Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % puzzles.length;
  const puzzle = puzzles[index];
  return { props: { puzzle } };
}
