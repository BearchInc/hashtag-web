angular.module('Services')

.service('Channel', function ($http, HOST) {

  var self = this;

  this.token = function() {
    return localStorage.getItem('channelToken');
  };

  this.setToken = function(token) {
    localStorage.setItem('channelToken', token);
  };

  this.generateToken = function(clientID) {
    $http.get(HOST + '/generateChannelToken', {
      params: {
        'clientID': clientID
      },
      responseType: 'text'
    })
    .success(function(data, status, headers, config) {
      self.setToken(data);
    });
  };

  this.createSocket = function(handler) {
    var token = this.token();
    var channel = new goog.appengine.Channel(token);
    var socket = channel.open(handler);
    return socket;
  };

});
