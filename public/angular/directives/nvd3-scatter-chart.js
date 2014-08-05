'use strict';

angular.module('octobluApp')
    .directive('nvd3ScatterChart', function () {
        return {
            restrict: 'A',
            replace: true,
            template: '<div class="chart"></div>',
            scope: {
		data: '=',
                    filtername: '=',
                    filtervalue: '=',
                    width: '@',
                    height: '@',
                    id: '@',
                    showlegend: '@',
                    tooltips: '@',
                    showcontrols: '@',
                    showDistX: '@',
                    showDistY: '@',
                    rightAlignYAxis: '@',
                    fisheye: '@',
                    xPadding: '@',
                    yPadding: '@',
                    tooltipContent: '&',
                    tooltipXContent: '&',
                    tooltipYContent: '&',
                    color: '&',
                    margin: '&',
                    nodata: '@',
                    transitionDuration: '@',
                    shape: '&',
                    onlyCircles: '@',
                    interactive: '@',
                    x: '&',
                    y: '&',
                    size: '&',
                    forceX: '@',
                    forceY: '@',
                    forceSize: '@',
                    xrange: '&',
                    xdomain: '&',
                    xscale: '&',
                    yrange: '&',
                    ydomain: '&',
                    yscale: '&',
                    sizerange: '&',
                    sizedomain: '&',
                    zscale: '&',

                    callback: '&',

                    //xaxis
                    xaxisorient: '&',
                    xaxisticks: '&',
                    xaxistickvalues: '&xaxistickvalues',
                    xaxisticksubdivide: '&',
                    xaxisticksize: '&',
                    xaxistickpadding: '&',
                    xaxistickformat: '&',
                    xaxislabel: '@',
                    xaxisscale: '&',
                    xaxisdomain: '&',
                    xaxisrange: '&',
                    xaxisrangeband: '&',
                    xaxisrangebands: '&',
                    xaxisshowmaxmin: '@',
                    xaxishighlightzero: '@',
                    xaxisrotatelabels: '@',
                    xaxisrotateylabel: '@',
                    xaxisstaggerlabels: '@',
                    xaxisaxislabeldistance: '@',
                    //yaxis
                    yaxisorient: '&',
                    yaxisticks: '&',
                    yaxistickvalues: '&yaxistickvalues',
                    yaxisticksubdivide: '&',
                    yaxisticksize: '&',
                    yaxistickpadding: '&',
                    yaxistickformat: '&',
                    yaxislabel: '@',
                    yaxisscale: '&',
                    yaxisdomain: '&',
                    yaxisrange: '&',
                    yaxisrangeband: '&',
                    yaxisrangebands: '&',
                    yaxisshowmaxmin: '@',
                    yaxishighlightzero: '@',
                    yaxisrotatelabels: '@',
                    yaxisrotateylabel: '@',
                    yaxisstaggerlabels: '@',
                    yaxislabeldistance: '@',
                    legendmargin: '&',
                    legendwidth: '@',
                    legendheight: '@',
                    legendkey: '@',
                    legendcolor: '&',
                    legendalign: '@',
                    legendrightalign: '@',
                    legendupdatestate: '@',
                    legendradiobuttonmode: '@',

                    //angularjs specific
                    objectequality: '@',

                    //d3.js specific
                    transitionduration: '@'
            },
            link: function (scope, element, attr) {
		scope.$watch('width + height', function() { updateDimensions(scope,attrs,element,scope.chart); });
                    scope.$watch('data', function(data){
                        if (data && angular.isDefined(scope.filtername) && angular.isDefined(scope.filtervalue)) {
                            data = $filter(scope.filtername)(data, scope.filtervalue);
                        }

                        if(data){
		             console.log("Building Scatter Chart with Data");
                            //if the chart exists on the scope, do not call addGraph again, update data and call the chart.
                            if(scope.chart){
                                return scope.d3Call(data, scope.chart);
                            }
                            nv.addGraph({
                                generate: function(){
                                    initializeMargin(scope, attrs);
                                    var chart = nv.models.scatterChart()
                                        .width(scope.width)
                                        .height(scope.height)
                                        .margin(scope.margin)
                                        .x(attrs.x === undefined ? function(d){ return d.x; } : scope.x())
                                        .y(attrs.y === undefined ? function(d){ return d.y; } : scope.y())
                                        .size(attrs.size === undefined ? function(d){ return (d.size === undefined ? 1 : d.size); }: scope.size())
                                        .forceX(attrs.forcex === undefined ? [] : scope.$eval(attrs.forcex))
                                        .forceY(attrs.forcey === undefined ? [] : scope.$eval(attrs.forcey))
                                        .forceSize(attrs.forcesize === undefined ? [] : scope.$eval(attrs.forcesize))
                                        .interactive(attrs.interactive === undefined ? false : (attrs.interactive === 'true'))
                                        .tooltips(attrs.tooltips === undefined ? false : (attrs.tooltips === 'true'))
                                        .tooltipContent(attrs.tooltipContent === undefined ? null : scope.tooltipContent())
                                        .tooltipXContent(attrs.tooltipxcontent === undefined ? function(key, x) { return '<strong>' + x + '</strong>'; } : scope.tooltipXContent())
                                        .tooltipYContent(attrs.tooltipycontent === undefined ? function(key, x, y) { return '<strong>' + y + '</strong>'; } : scope.tooltipYContent())
                                        .showControls(attrs.showcontrols === undefined ? false : (attrs.showcontrols === 'true'))
                                        .showLegend(attrs.showlegend === undefined ? false : (attrs.showlegend === 'true'))
                                        .showDistX(attrs.showdistx === undefined ? false : (attrs.showdistx === 'true'))
                                        .showDistY(attrs.showdisty === undefined ? false : (attrs.showdisty === 'true'))
                                        .xPadding(attrs.xpadding === undefined ? 0 : (+attrs.xpadding))
                                        .yPadding(attrs.ypadding === undefined ? 0 : (+attrs.ypadding))
                                        .fisheye(attrs.fisheye === undefined ? 0 : (+attrs.fisheye))
                                        .noData(attrs.nodata === undefined ? 'No Data Available.' : scope.nodata)
                                        .color(attrs.color === undefined ? nv.utils.defaultColor() : scope.color())
                                        .transitionDuration(attrs.transitionduration === undefined ? 250 : (+attrs.transitionduration));

                                    if(attrs.shape){
                                        chart.scatter.onlyCircles(false);
                                        chart.scatter.shape(attrs.shape === undefined ? function(d) { return d.shape || 'circle'; } : scope.shape());
                                    }

    //'pointActive', 'clipVoronoi', 'clipRadius', 'useVoronoi'

                                    if(attrs.xdomain){
                                        if(Array.isArray(scope.$eval(attrs.xdomain))){
                                            chart.xDomain(scope.$eval(attrs.xdomain));
                                        } else if(typeof scope.xdomain() === 'function'){
                                            chart.xDomain(scope.xdomain());
                                        }
                                    }

                                    if(attrs.ydomain){
                                        if(Array.isArray(scope.$eval(attrs.ydomain))){
                                            chart.yDomain(scope.$eval(attrs.ydomain));
                                        } else if(typeof scope.ydomain() === 'function'){
                                            chart.yDomain(scope.ydomain());
                                        }
                                    }

                                    if(attrs.xscale){
                                        chart.xDomain(scope.xdomain());
                                        chart.xRange(scope.xrange());
                                        chart.xScale(scope.xscale());
                                    }

                                    if(attrs.yscale){
                                        chart.yDomain(scope.ydomain());
                                        chart.yRange(scope.yrange());
                                        chart.yScale(scope.yscale());
                                    }

                                    if(attrs.zscale){
                                        chart.sizeDomain(scope.sizedomain());
                                        chart.sizeRange(scope.sizerange());
                                        chart.zScale(scope.zscale());
                                    }

                                    scope.d3Call(data, chart);
                                    nv.utils.windowResize(chart.update);
                                    scope.chart = chart;
                                    return chart;
                                },
                                callback: attrs.callback === undefined ? null : scope.callback()
                            });
                        }
                    }, (attrs.objectequality === undefined ? false : (attrs.objectequality === 'true')));
            }
        }
    });
