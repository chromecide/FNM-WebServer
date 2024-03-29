
var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs");
    
var mixinFunctions = {
	init: function(cfg){
		var thisNode = this;
		thisNode.FNMWebserver_Settings = {
			host: 'localhost',
			port: 80,
			webroot: process.cwd()
		};
		
		if(cfg){
			console.log(cfg);
			if(cfg.host){
				thisNode.FNMWebserver_Settings.host = cfg.host;	
			}
			
			if(cfg.port){
				thisNode.FNMWebserver_Settings.port = cfg.port;	
			}
			
			if(cfg.webroot){
				thisNode.FNMWebserver_Settings.webroot = cfg.webroot;	
			}else{
				thisNode.FNMWebserver_Settings.webroot = process.cwd();
			}
		}
		
		thisNode.FNMWebserver_Server = http.createServer(function(request, response) {
		  var uri = url.parse(request.url).pathname
		    , filename = path.join(thisNode.FNMWebserver_Settings.webroot, uri);
		  
	      //TODO: provide meaningful event information about the request that was recieved
	      thisNode.emit('FNMWebserver.RequestRecieved', {
	      	path: uri,
	      	headers: request.headers,
	      	method: request.method
	      });
	      
		  fs.exists(filename, function(exists) {
		    if(!exists) {
		      response.writeHead(404, {"Content-Type": "text/plain"});
		      response.write("404 Not Found\n");
		      response.end();
		      return;
		    }
		
		if (fs.statSync(filename).isDirectory()) filename += '/index.html';
		
		    fs.readFile(filename, "binary", function(err, file) {
		      if(err) {
		        response.writeHead(500, {"Content-Type": "text/plain"});
		        response.write(err + "\n");
		        response.end();
		        return;
		      }
		
		      response.writeHead(200);
		      response.write(file, "binary");
		      response.end();
		      
		      //TODO: provide meaningful event information about the response that was sent
		      thisNode.emit('FNMWebserver.ResponseSent', {
		      	
		      });
		    });
		  });
		});
	},
	FNMWebserver_startServer: function(){
		var thisNode = this;
		thisNode.FNMWebserver_Server.listen(thisNode.FNMWebserver_Settings.port);
	},
	FNMWebserver_stopServer: function(){
		thisNode.FNMWebserver_Server.close();
	},
	FNMWebserver_restartServer: function(){
		
	},
	FNMWebserver_doSomething: function(){
		
	}
}

if (typeof define === 'function' && define.amd) {
	define(mixinFunctions);
} else {
	module.exports = mixinFunctions;
}
	

var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs")
    port = process.argv[2] || 8888;

http.createServer(function(request, response) {

  var uri = url.parse(request.url).pathname
    , filename = path.join(process.cwd(), uri);
  
  path.exists(filename, function(exists) {
    if(!exists) {
      response.writeHead(404, {"Content-Type": "text/plain"});
      response.write("404 Not Found\n");
      response.end();
      return;
    }

if (fs.statSync(filename).isDirectory()) filename += '/index.html';

    fs.readFile(filename, "binary", function(err, file) {
      if(err) {
        response.writeHead(500, {"Content-Type": "text/plain"});
        response.write(err + "\n");
        response.end();
        return;
      }

      response.writeHead(200);
      response.write(file, "binary");
      response.end();
    });
  });
}).listen(parseInt(port, 10));

console.log("Static file server running at\n => http://localhost:" + port + "/\nCTRL + C to shutdown");