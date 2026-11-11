# TalentMatch repair notes

## Fixes applied

- Guarded the AI Matching experience comparison when the API response omits the legacy `experienceComparison.delta` field. The UI now derives the experience gap from employee and project values as a fallback.
- Made Model Weight Tuner changes explicit: slider movement is local, and **Apply weights** sends one matching request. The backend normalizes the three weights and returns contribution values that reconcile with the headline score.
- Fixed direct authorization by persisting the allocation as `approved` in the same database transaction. Only admins may use this path; managers still submit for approval.
- Made approve/reject handlers safe when Express 5 receives no JSON body (`req.body` is undefined).
- Updated employee skill filtering to match both legacy string skills and the `{ name, proficiency }` objects stored by the UI.
- Return HTTP 400 for missing or malformed `projectId` values on the AI matching endpoint.
- Kept Add Employee and Add Project modals open while saving, disabled duplicate submissions, and displayed server-side errors instead of swallowing rejected promises.
- Changed the error-boundary recovery action to clear authentication deliberately rather than silently deleting all local storage. The Reset Data action no longer clears the login token.
- Updated score breakdown labels so they no longer claim fixed `/60`, `/25`, and `/15` maxima when weights are configurable.

## Tests and checks run in this environment

- AI engine: `pytest -q` — **19 passed**.
- Backend scoring utility: `npm test` (Node built-in test runner) — **5 passed**.
- Backend JavaScript syntax: `node --check` over backend JavaScript files — passed.
- Frontend JS/JSX syntax: TypeScript transpile parser over 18 source files — passed.
- Python source compilation: `python -m compileall -q ai-engine/app` — passed.

## Not verified here

- The frontend production build and browser UI tests were not run because `npm ci` timed out in this environment. Re-run `npm ci`, `npm run build`, and `npm run lint` locally after extraction.
- Real MongoDB Atlas transactions and full Express-to-MongoDB end-to-end flows require the project's configured Atlas credentials and network access. Direct authorization relies on MongoDB transactions, so use Atlas or another replica-set deployment, not a standalone local MongoDB process.
- The archive intentionally contains no `.env` files. Copy the `.env.example` files and add your own credentials. Rotate any credentials that were ever committed or shared.

## Test commands

```powershell
cd backend
npm install
npm test

cd ..\ai-engine
python -m pip install -r requirements.txt
python -m pytest -q

cd ..\frontend
npm install
npm run build
npm run lint
```
