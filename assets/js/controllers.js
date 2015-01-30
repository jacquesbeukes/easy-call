/* Controllers */

var ecAppControllers = angular.module('ecAppControllers', ['restangular']);


ecAppControllers.controller('readyCtrl', 
  ['$scope', 'Restangular', '$q',
  function($scope, Restangular, $q) {
    'use strict';

    Restangular.all('list_types/').getList().then(function(types) {
      $scope.types = types;
    });
  }]);


ecAppControllers.controller('callCtrl', 
  ['$scope', '$routeParams', 'Restangular', '$q',
  function($scope, $routeParams, Restangular, $q) {
    'use strict';

    Restangular.one('list_types/' + $routeParams.callCat + '/').get().then(
      function(callType) {
        $scope.callType = callType;
    });

    $scope.getNextRecord = function() {
      var deferred = $q.defer();

      var record = Restangular.one('call_records/' + $routeParams.callCat + '/next/');
      record.get().then(
        function(demographics) {
          $scope.demographics = demographics;
          deferred.resolve();
        }, function (response) {
          console.log("Error with status code", response.status);
          deferred.reject();
        });

      return deferred.promise;
    };

    $scope.getUserNotes = function() {
      Restangular.one('call_records/' + $scope.demographics.pk + '/notes/')
        .get().then(
          function(usernotes) {
            $scope.usernotes = usernotes;
      });
    };

    $scope.getExtraInfo = function() {
      Restangular.one('call_records/' + $scope.demographics.pk + '/extra/')
        .get().then(
          function(extra) {
            $scope.extra = extra;
      });
    };

    $scope.createNote = function(text) {
      var recordId = $scope.demographics.pk;
      var notes = Restangular.one('call_records', recordId).all('notes/');
      
      var newNote = {text: text};
      notes.post(newNote, {}, {"X-CSRFToken": csrf_token}).then(
        function (response) {
          console.log("Note created.");
          $scope.getUserNotes();
        }, function (response) {
          console.log("Error with status code", response.status);
        });
    };

    $scope.deleteNote = function(id) {
      var note = Restangular.one('user_notes/' + id + '/');
      
      note.remove({}, {"X-CSRFToken": csrf_token}).then(
        function (response) {
          console.log("Note deleted.");
          $scope.getUserNotes();
        }, function (response) {
          console.log("Error with status code", response.status);
        });
    };

    $scope.updateNote = function(id, text) {
      var note = Restangular.one('user_notes/' + id + '/');
      note.get().then(
        function(data) {
          data.text = text;
          data.put({}, {"X-CSRFToken": csrf_token}).then(
            function (response) {
              console.log("Note updated.");
              $scope.getUserNotes();
            }, function (response) {
              console.log("Error with status code", response.status);
            });
        });
    };

    $scope.next = function() {
      $scope.getNextRecord()
        .then( function() {
          $scope.getUserNotes();
          $scope.getExtraInfo();
        });
    };
    $scope.next();

  }]);