//Create web server
//Load modules
var http = require('http');
var url = require('url');
var fs = require('fs');
var qs = require('querystring');
var template = require('./lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');
var db = require('./lib/db');
var topic = require('./lib/topic');
var author = require('./lib/author');
var cookie = require('cookie');
var session = require('express-session');
var FileStore = require('session-file-store')(session);

var app = http.createServer(function(request,response){
    var _url = request.url; // _url = query string
    var queryData = url.parse(_url, true).query; //queryData = query string object
    var pathname = url.parse(_url, true).pathname; //pathname = path name
    var title = queryData.id; //title = query string id value
    var cookies = {};
    if(request.headers.cookie !== undefined){
      cookies = cookie.parse(request.headers.cookie);
    }
    if(pathname === '/'){
      if(cookies.email === undefined || cookies.password === undefined){
        author.login(request,response);
      } else {
        db.query(`SELECT * FROM author WHERE email=?`,[cookies.email],function(error,author){
          if(error){
            throw error;
          }
          if(author[0].password === cookies.password){
            topic.home(request,response);
          } else {
            author.login(request,response);
          }
        });
      }
    } else if(pathname === '/login_process'){
      author.login_process(request,response);
    } else if(pathname === '/logout_process'){
      author.logout_process(request,response);
    } else if(pathname === '/create'){
      topic.create(request,response);
    } else if(pathname === '/create_process'){
      topic.create_process(request,response);
    } else if(pathname === '/update'){
      topic.update(request,response);
    } else if(pathname === '/update_process'){
      topic.update_process(request,response);
    } else if(pathname === '/delete_process'){
      topic.delete_process(request,response);
    } else if(pathname === '/author'){
      author.home(request,response);
    } else if(pathname === '/author/create_process'){
      author.create_process(request,response);
    } else if(pathname === '/author/update'){
      author.update(request,response);
    } else if(pathname === '/author/update_process'){
      author.update_process
    }
});