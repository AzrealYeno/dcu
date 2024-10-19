

fnm env --use-on-cd | Out-String | Invoke-Expression
fnm use --install-if-missing 20

npm i
npm run start

npm run build

firebase deploy --only hosting