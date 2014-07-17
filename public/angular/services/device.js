angular.module('octobluApp')
    .service('deviceService', function ($q, $http, $rootScope, skynetService, reservedProperties) {
        var myDevices = [];
        var skynetPromise = skynetService.getSkynetConnection();

        function addDevice(device) {
            myDevices.push(device);
            skynetPromise.then(function (skynetConnection) {
                skynetConnection.unsubscribe({uuid: device.uuid, token: device.token});
                skynetConnection.subscribe({uuid: device.uuid, token: device.token});
            });
        }

        skynetPromise.then(function (skynetConnection) {
            skynetConnection.on('message', function (message) {
                $rootScope.$broadcast('skynet:message:' + message.fromUuid, message);
                if (message.payload && _.has(message.payload, 'online')) {
                    var device = _.findWhere(myDevices, {uuid: message.fromUuid});
                    if (device) {
                        device.online = message.payload.online;
                    }
                }
            });
        });

        var service = {
            getDevices: function (force) {
                var defer = $q.defer();
                if (myDevices.length && !force) {
                    defer.resolve(myDevices);
                } else {
                    skynetPromise
                        .then(function (skynetConnection) {
                            skynetConnection.mydevices({}, function (result) {
                                angular.copy([], myDevices);
                                _.each(result.devices, function (device) {
                                    addDevice(device);
                                });

                                defer.resolve(myDevices);
                            });
                        });
                }
                return defer.promise;
            },

            registerDevice: function (options) {
                var device = _.omit(options, reservedProperties),
                    defer = $q.defer();

                skynetPromise.then(function (skynetConnection) {
                    device.owner = skynetConnection.options.uuid;

                    skynetConnection.register(device, function (result) {
                        console.log('registered device!');
                        myDevices.push(result);
                        defer.resolve(result);
                    });
                });
                return defer.promise;
            },

            claimDevice: function (options) {
                var device = _.omit(options, reservedProperties),
                    defer = $q.defer();

                skynetPromise.then(function (skynetConnection) {
                    skynetConnection.claimdevice(device, function (data) {
                        defer.resolve(data);
                        addDevice(options);
                    });
                });

                return defer.promise;
            },

            updateDevice: function (options) {
                var device = _.omit(options, reservedProperties),
                    defer = $q.defer();

                skynetPromise.then(function (skynetConnection) {
                    skynetConnection.update(device, function () {
                        defer.resolve(device);
                    });
                });

                return defer.promise;
            },

            unregisterDevice: function (device) {
                var defer = $q.defer();

                skynetPromise.then(function (skynetConnection) {
                    skynetConnection.unregister(device, function (result) {
                        console.log('unregistered device:' , result);
                        service.getDevices(true).then(function(devices){
                            defer.resolve(devices);
                        });
                    });
                });

                return defer.promise;
            },

            getUnclaimedDevices: function () {
                var defer = $q.defer();

                skynetPromise.then(function (skynetConnection) {
                    skynetConnection.localdevices({}, function (result) {
                        defer.resolve(result);
                    });
                });

                return defer.promise;
            },

            getUnclaimedGateways: function () {
                return service.getUnclaimedDevices().then(function (devices) {
                    return _.where(device, {type: 'gateway'});
                });
            },

            gatewayConfig: function (options) {
                var defer = $q.defer();

                skynetPromise.then(function (skynetConnection) {
                    skynetConnection.gatewayConfig(options, function (result) {
                        defer.resolve(result);
                    });
                });

                return defer.promise;
            },

            createSubdevice: function (options) {
                return service.gatewayConfig(_.extend({ method: 'createSubdevice' },
                    _.omit(options, reservedProperties)));
            },

            updateSubdevice: function (options) {
                return service.gatewayConfig(_.extend({ method: 'updateSubdevice' },
                    _.omit(options, reservedProperties)));
            },

            deleteSubdevice: function (options) {
                return service.gatewayConfig(_.extend({ method: 'deleteSubdevice' },
                    _.omit(options, reservedProperties)));
            }
        };

        service.getUnclaimedNodes = service.getUnclaimedDevices;
        return service;
    });
