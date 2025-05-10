import puzzles from '../../puzzles.json';

export default function handler(req, res) {
  const { guess } = req.body;
  const index = Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % puzzles.length;
  const puzzle = puzzles[index];
  const correct = guess.toLowerCase() === puzzle.answer.toLowerCase();
  res.status(200).json({ correct });
}
