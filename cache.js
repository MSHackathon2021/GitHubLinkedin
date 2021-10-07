var redis = require("redis");
var bluebird = require("bluebird");
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const Rediscachehostname = "GithubLinkedin.redis.cache.windows.net"
const cacheKey= "RhPv+bFE9akBY95aGuHzCBBnV9ZpkvmtxjzTo3G19OY="


module.exports = {
    SetCache: async function(key,value) {
        var cacheConnection = redis.createClient(6380, Rediscachehostname, 
            {auth_pass: cacheKey, tls: {servername: Rediscachehostname}});
            await cacheConnection.setAsync(`${key}`,`${value}`);
    },
    GetCache: async function(key) {
        var cacheConnection = redis.createClient(6380, Rediscachehostname, 
            {auth_pass: cacheKey, tls: {servername: Rediscachehostname}});
          return  await cacheConnection.getAsync(`${key}`);


    },
};