angular.module('octobluApp')
     .controller('design2Controller', function ($rootScope, $scope, $http, $injector, $location, nodeRedService, currentUser) {
         var getSessionFlow = function () {
             $http({method: 'GET', url: '/api/get/flow'})
                 .success(function (data, status, headers, config) {
                     console.log('/api/get/flow', data);
                     if (data.flow) {
                         RED.view.importFromCommunity(data.flow);
                     }
                 });
         };

         nodeRedService.getPort(currentUser.skynet.uuid, currentUser.skynet.token, function (port) {
             initializeRED();
             RED.wsConnect(RED.loadSettings, currentUser.skynet.uuid, currentUser.skynet.token, port);
             getSessionFlow();
         });

         $scope.save = function(){
             RED.save();
         };
     });