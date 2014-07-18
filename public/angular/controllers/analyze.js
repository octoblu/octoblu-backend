'use strict';

angular.module('octobluApp')
    .controller('analyzeController', function ($scope, $http, $injector, $log, elasticService, currentUser, myDevices) {
        $scope.debug_logging = true;
        //Elastic Search Time Format Dropdowns
        $scope.ESdateFormats = elasticService.getDateFormats();

        $scope.forms = {};
        // Get user devices

	$log.log("currentUser");
	$log.log(currentUser);
        $log.log("getting devices from ownerService");
	$log.log(myDevices);

        $scope.devices = _.filter(myDevices, function (device) {
            return device.type !== 'gateway';
        });
        $scope.logic_devices = "";
        $scope.deviceLookup = {};
        _.each($scope.devices, function (device) {
            $scope.logic_devices += device.uuid + " OR ";
            $scope.deviceLookup[device.uuid] = device.name;
        });
	
        //$scope.devices[$scope.devices.length] = { _id: "_all", name: "All Devices", "uuid": "*" };
        $log.log("logging devices");
        $log.log($scope.devices);
        $log.log($scope.logic_devices);

        //Not sure what's going on here...but you probably should tackle it another way if you can.
        $scope.setFormScope = function (scope) {
            $scope.formScope = scope;
            $log.log("setting form scope to " + scope);
        };

        $scope.currentPage = 1;

        $scope.$watch('currentPage', function (newValue, oldValue) {
            //newvalue *is* the $scope.currentPage at this point already.
            //$scope.currentPage = newValue;
            search(newValue);
        });
        $log.log("New Value for Devices");
        elasticService.setOwnedDevices($scope.devices);
        elasticService.paramSearch({ "from": "now-1d/d", "to": "now", "size": 0, "query": "", "facet": {}, "aggs": {}}, $scope.devices, function (err, data) {
            if (err) {
                return $log.log(err);
            }
            $log.log("function=paramSearch callback");
            $log.log(data);
        });
        // LOAD GRAPHS
        loadTop();


        $scope.eGCharts = [];
        $scope.eGCharts.push({      text: "Line"    });
        $scope.eGCharts.push({    text: "Bar" });

        $scope.loadExploreGraph = function () {
            $scope.eGstartDate = $scope.forms.EX_starting;
            $scope.eGendDate = $scope.forms.EX_ending;
            $scope.eGselectDevices = $scope.forms.EX_graphDevices;
            $scope.eGEC = $scope.forms.EX_eventCode;
            $log.log("Ending: " + $scope.eGendDate + ", Starting: " + $scope.eGstartDate + ", EventCodes: " + $scope.eGEC + ", Selected Devices: " + $scope.eGselectDevices);
            $scope.legFirst = true;
            $scope.myAdditionalQuery = "";
            $scope.leg = {};
	    if (!$scope.eGendDate) { $scope.eGendDate = "now"; }
	    if (!$scope.eGstartDate) { $scope.eGstartDate = "now-30d/d"; }
	    $scope.leg.config = { "contains_uuid" : "false", "contains_ec" : "false" };
            if ($scope.eGselectDevices && $scope.eGselectDevices.length > 0 ) {
                _.each($scope.eGselectDevices, function (key, value) {
                    $log.log(key);
                    if ($scope.legFirst && key != "all") {
                        $scope.leg.config.contains_uuid = "true";
                        $scope.myAdditionalQuery += " uuid=" + key + " ";
                        $scope.legFirst = false;
                    }
                    else if (key != "all") {
                        $scope.myAdditionalQuery += " OR uuid=" + key + " ";
                    }
                });

            }
            $scope.leg.facets = { "eventCodes": {"terms": { "field": "eventCode" } },
				  'times': { 'date_histogram': { 'field': 'timestamp', 'interval': "hour"  }  },
				  "uuids": { "terms":{"field":"uuid"} }
				 };
	    $scope.leg.aggs = {
				"uuids" : {
            				"terms" : {
                				"field" : "uuid"
            				}
        			},
				"eventcodes" : {
					"terms" : {
						"field" : "eventCode"
					}
				},
				"count_by_uuid": {
         				"terms": {
            					"field": "uuid"
        				 },
         				"aggs": {
            				"events_by_date": {
               					"date_histogram": {
                  				"field": "timestamp",
                  				"interval": "hour"
               				},
               				"aggs": {
                  				"value_count_terms": {
                     					"value_count": {
                        					"field": "uuid"
                     					}
                  				}
					}
					}
					}
				}
			      };
            if ($scope.eGEC && $scope.eGEC != "all") {
               var oper = "";
                    $scope.leg.config.contains_ec = "true";
                    if ($scope.leg.config.contains_uuid == "true") { oper = " AND ( "; } 
		$scope.leg.firstEC = true;
                _.each($scope.eGEC, function (key, value) {
                    if ($scope.leg.firstEC) {
			$scope.leg.firstEC = false;
			$scope.myAdditionalQuery += oper + " eventCode=" + key;
		    } else {
                    	$scope.myAdditionalQuery += " OR eventCode=" + key;
                    }
                });
              if ($scope.leg.config.contains_uuid == "true") { $scope.myAdditionalQuery += " ) "; }
            }
            $scope.myAdditionalQuery += "";
	    $scope.myAQ = "";
	    if ($scope.myAdditionalQuery.length > 1) {$scope.myAQ = " ( " + $scope.myAdditionalQuery + " ) "; }
	    $log.log($scope.myAQ);
            elasticService.paramSearch({ "from":$scope.eGstartDate, "to":$scope.eGendDate, "size":0, "query":$scope.myAQ, "facet": $scope.leg.facets, "aggs": $scope.leg.aggs }, $scope.eGselectDevices, function (err, data) {
                if (err) {
                    return $log.log(err);
                }
                $log.log("function=loadExploreGraph callback");
                $log.log(data);
		$scope.legCounter = 0;
		_.each(data.aggregations.count_by_uuid.buckets, function(key, val) {
			$log.log("each Aggregate");
		});
		var tmpAggro = _.each(data.aggregations.count_by_uuid.buckets,function(key, val){
                                                        return {  "key": key.key, "values": _.map(key.events_by_date.buckets, function(item){              
                                                                return { x: item.key, y: item.value_count_terms.value };
                                                        })
                                                        };
				});

                $scope.leg = {"results": data, 
				"total": data.hits.total, 
				"dcEC": data.facets.eventCodes.terms.length, 
				"dcUUIDs" : data.facets.uuids.terms.length,
				"eventCounts": [ 
					{ key: "Event Count", 
					  values: _.map(data.facets.times.entries, function(item) {
						return { x: item.time, y: item.count };
					})
					}],
				"uuid_counts": _.map(data.aggregations.count_by_uuid.buckets,function(key){
                                                        return {  "key": ( $scope.deviceLookup[key.key] ? $scope.deviceLookup[key.key] : key.key), "values": _.map(key.events_by_date.buckets, function(item){
                                                                return { x: item.key, y: item.value_count_terms.value };
                                                        })
                                                        };
                                	       })
			};
		$log.log($scope.leg);
	});
        };

	$scope.sort = "=", $scope.order = '='; $scope.itemsPerPage = 10;
	$scope.sort_by = function(newSortingOrder) {       
            var sort = $scope.sort;

            if (sort.sortingOrder == newSortingOrder){
                sort.reverse = !sort.reverse;
            }                    

            sort.sortingOrder = newSortingOrder;        
        };


        $scope.selectedCls = function(column) {
            if(column == $scope.sort.sortingOrder){
                return ('icon-chevron-' + (($scope.sort.reverse) ? 'down' : 'up'));
            }
            else{            
                return'icon-sort' 
            } 
        };      

    // calculate page in place
    $scope.groupToPages = function () {
        $scope.freeform_results_ngTable.pagedItems = [];
        $log.log("groupToPages");
	$log.log($scope.freeform_results); 
        for (var i = 0; i < $scope.freeform_results.length; i++) {
            if (i % $scope.itemsPerPage === 0) {
                $scope.freeform_results_ngTable.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [ $scope.freeform_results[i] ];
            } else {
                $scope.freeform_results_ngTable.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.freeform_results[i]);
            }
        }
    };
    
    $scope.range = function (size,start, end) {
        var ret = [];        
        console.log(size,start, end);
                      
        if (size < end) {
            end = size;
            start = size-$scope.gap;
        }
        for (var i = start; i < end; i++) {
            ret.push(i);
        }        
         console.log(ret);        
        return ret;
    };
    
    $scope.prevPage = function () {
        if ($scope.currentPage > 0) {
            $scope.currentPage--;
        }
    };
    
    $scope.nextPage = function () {
        if ($scope.currentPage < $scope.pagedItems.length - 1) {
            $scope.currentPage++;
        }
    };
    
    $scope.setPage = function () {
        $scope.currentPage = this.n;
    };

	
	$scope.search = function(currentPage) { 
		$scope.ff = {};
        	$log.log("starting search function, analyzer controller");
            $scope.results = [ { "text":"searching..." } ];
            $log.log("searchText = " + $scope.forms.FF_searchText);
            if ($scope.forms.FF_searchText !== undefined) {
                elasticService.search($scope.devices, $scope.forms.FF_searchText, currentUser.skynetuuid, currentPage, $scope.forms.FF_eventCode, function (error, response) {
                    if (error) {
                        $log.log(error);
                    } else {
			$log.log("Found stuff");
			$log.log("response follows");
			$log.log(response);
			$log.log(currentUser);
			$scope.ff.currentPage = currentPage;
                        $scope.freeform_results = response.hits.hits;
			$scope.freeform_results_ngTable = { "headers": [ { "name": "one" }, {"name":"two"} ] };			
			$scope.groupToPages();
			$log.log($scope.freeform_results_ngTable);
                        $scope.results = response;
                        $scope.totalItems = response.hits.total;
                        $scope.ff.maxSize = 10;

                    }
                });

            } else {
                $scope.results = "None Found";
		$log.log("no search term");
            }

	 };
        function search (currentPage) {
            $log.log("starting search function, analyzer controller");
            $scope.results = [ { "text":"searching..." } ];
            $log.log("searchText = " + $scope.forms.FF_searchText);
            if ($scope.forms.FFsearchText !== undefined) {
                elasticService.search($scope.devices, $scope.forms.FF_searchText, currentUser.skynetuuid, currentPage, $scope.forms.FF_eventCode, function (error, response) {
                    if (error) {
                        $log.log(error);
                    } else {
			$scope.freeform_results = response.hits.hits;
                        $scope.results = response;
                        $scope.totalItems = response.hits.total;
                        $scope.maxSize = 10;

                    }
                });

            } else {
                $scope.results = "";
            }
        }

        //Load Top Counts Panels On init of page
        function loadTop() {
            $scope.step1open = true;
            $log.log("Searching LoadTop");
            $scope.loadTopfacetObject = {
                "toUuids": {"terms": {"script_field": "doc['toUuid.uuid'].value"}},
                "fromUuids": { "terms": { "script_field": "doc['fromUuid.uuid'].value" } },
                "eventCodes": {"terms": { "field": "eventCode" } }
            };
            elasticService.paramSearch({"from":"now-1d/d", "to":"now", "size":0, "query":"", "facet": $scope.loadTopfacetObject, "aggs":{}}, $scope.devices, function (err, data) {
                if (err) {
                    return $log.log(err);
                }
                $log.log("Total Top Hits: " + data.hits.total);
                $scope.topResults = {
                    total: data.hits.total,
                    fromUuid: _.map(data.facets.fromUuids.terms, function (item) {
                        return {
                            label: $scope.deviceLookup[item.term] ? $scope.deviceLookup[item.term] : item.term,
                            value: item.count
                        };
                    }),
                    toUuid: _.map(data.facets.toUuids.terms, function (item) {
                        return {
                            label: $scope.deviceLookup[item.term] ? $scope.deviceLookup[item.term] : item.term,
                            value: item.count
                        };
                    }),
                    eventCodes: _.map(data.facets.eventCodes.terms, function (item) {
                        return {
                            label: item.term,
                            value: item.count
                        };
                    })
                }
            });
        };

        elasticService.getEvents("", function (data) {
            $scope.events = data;
        });

        $scope.setPage = function (pageNo) {
            $scope.currentPage = pageNo;
        };

        var sensorGrid = [];

        $scope.sensorListen = function (sensor) {
            $log.log('sensor listen', sensor);
            sensorGrid = [];
        };
    });