# twitter-scheduler
Simple scheduler thing with node and rxjs

`main.js` is the backend, front-end is under `/public`

## To run
- `mkdir resources` (for sqlite db)
- `mkdir secrets`
- enter stuff into `secrets/settings.json` (see example-settings.json) 
- `npm install`
- `node main.js`

Edit cron strings in main.js to change the schedule to your liking.
