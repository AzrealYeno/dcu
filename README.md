

fnm env --use-on-cd | Out-String | Invoke-Expression
fnm use --install-if-missing 20

npm i
npm run start

npm run build




-----

npm install -g firebase-tools
firebase login:ci

firebase deploy --only hosting