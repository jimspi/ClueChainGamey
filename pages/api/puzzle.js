import puzzles from '../../puzzles.json';

export default function handler(req, res) {
  const index = Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % puzzles.length;
  res.status(200).json(puzzles[index]);
}
