// package: 
// file: plugin.proto

var plugin_pb = require("./plugin_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var PluginService = (function () {
  function PluginService() {}
  PluginService.serviceName = "PluginService";
  return PluginService;
}());

PluginService.Connect = {
  methodName: "Connect",
  service: PluginService,
  requestStream: false,
  responseStream: false,
  requestType: plugin_pb.ConnectRequest,
  responseType: plugin_pb.ConnectResponse
};

PluginService.Call = {
  methodName: "Call",
  service: PluginService,
  requestStream: false,
  responseStream: true,
  requestType: plugin_pb.CallRequest,
  responseType: plugin_pb.CallResponse
};

exports.PluginService = PluginService;

function PluginServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

PluginServiceClient.prototype.connect = function connect(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(PluginService.Connect, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

PluginServiceClient.prototype.call = function call(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(PluginService.Call, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onMessage: function (responseMessage) {
      listeners.data.forEach(function (handler) {
        handler(responseMessage);
      });
    },
    onEnd: function (status, statusMessage, trailers) {
      listeners.status.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners.end.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners = null;
    }
  });
  return {
    on: function (type, handler) {
      listeners[type].push(handler);
      return this;
    },
    cancel: function () {
      listeners = null;
      client.close();
    }
  };
};

exports.PluginServiceClient = PluginServiceClient;

