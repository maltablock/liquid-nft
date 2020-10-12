# Liquid NFT - DSP IPFS Hosting Service - Backend

### Dokku

Testing on a Dokku server

```bash
# install mongo
sudo dokku plugin:install https://github.com/dokku/dokku-mongo.git mongo
dokku mongo:create hoster

# create hoster-backend app
dokku apps:create hoster
dokku config:set hoster KEY=‘VALUE’
dokku proxy:ports-add hoster http:3000:3003 # available on port 3000
# ip route get 8.8.8.8 # take last one eth0

# sets process.env.MONGO_URL
dokku mongo:link hoster hoster
git remote add dokku dokku@dokku-host:hoster
```

