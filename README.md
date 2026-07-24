# Take The Tile — Voice Duel Prototype

A standalone, mobile-first GitHub Pages prototype inspired by visual identification chess-clock duels.

## Deploy to GitHub Pages
1. Create a new public GitHub repository.
2. Upload every file and folder from this package to the repository root.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select **main** and **/(root)**, then save.
6. Open the published HTTPS address in Safari on an iPhone.

## iPhone testing
- Use Safari first.
- Allow microphone access when prompted.
- Keep Silent Mode off if you later add sound effects.
- The prototype has a CORRECT fallback because iOS browser speech recognition can occasionally stop or mishear short answers.

## Rules implemented
- Two separate 45-second clocks.
- Challenger/Player 1 answers first.
- Correct answer stops the active clock and switches play.
- Unlimited wrong spoken guesses; the clock keeps running.
- PASS changes the image for the same player and subtracts three seconds.
- First clock to reach zero loses.
