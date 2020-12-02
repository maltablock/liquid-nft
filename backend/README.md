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

> ⚠️ Need to change dokku's nginx config to allow uploads > 1mb.


```bash
mkdir /home/dokku/node-js-app/nginx.conf.d/
echo 'client_max_body_size 20m;' > /home/dokku/node-js-app/nginx.conf.d/upload.conf
chown dokku:dokku /home/dokku/node-js-app/nginx.conf.d/upload.conf
service nginx reload
```

[Source](http://dokku.viewdocs.io/dokku/configuration/nginx/#customizing-via-configuration-files-included-by-the-default-tem)
