#!/usr/bin/env sh

# abort on errors
set -e
echo "dao.ironchain.xyz" > CNAME

# build
yarn run build --production

# navigate into the build output directory
cd dist
cp index.html 404.html

# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'deploy'
git push -f git@github.com-ironchain-dao:ironchain-xyz/ironchaindao.git master:gh-pages

cd -
