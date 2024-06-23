/* eslint-disable */
import { POSTGRES_URI } from "../../../../config/src";
const configObj = url2obj(POSTGRES_URI);

// console.log(configObj);

module.exports = {
  development: {
    username: configObj.user,
    password: configObj.password,
    database: configObj.segments[0],
    host: configObj.hostname,
    port: configObj.port || 5432,
    dialect: 'postgres'
  },
  test: {
    username: 'root',
    password: null,
    database: 'test',
    host: '127.0.0.1',
    port: configObj.port || 5432,
    dialect: 'postgres'
  },
  production: {
    username: configObj.user,
    password: configObj.password,
    database: configObj.segments[0],
    host: configObj.hostname,
    port: configObj.port || 5432,
    dialect: 'postgres'
  }
};

// Used to parse the POSTGRES_URI env var so that we don't have to pass a bunch
// of env vars instead of just a single POSTGRES_URI env var.
function url2obj(url) {
  var pattern = /^(?:([^:\/?#\s]+):\/{2})?(?:([^@\/?#\s]+)@)?([^\/?#\s]+)?(?:\/([^?#\s]*))?(?:[?]([^#\s]+))?\S*$/;
  var matches =  url.match(pattern);
  var params = {};
  if (matches[5] != undefined) {
    matches[5].split('&').map(function(x){
      var a = x.split('=');
      params[a[0]]=a[1];
    });
  }

  return {
    protocol: matches[1],
    user: matches[2] != undefined ? matches[2].split(':')[0] : undefined,
    password: matches[2] != undefined ? matches[2].split(':')[1] : undefined,
    host: matches[3],
    hostname: matches[3] != undefined ? matches[3].split(/:(?=\d+$)/)[0] : undefined,
    port: matches[3] != undefined ? matches[3].split(/:(?=\d+$)/)[1] : undefined,
    segments : matches[4] != undefined ? matches[4].split('/') : undefined,
    params: params
  };
}
