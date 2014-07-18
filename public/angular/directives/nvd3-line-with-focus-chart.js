'use strict';

function updateDimensions(scope, attrs, element, chart) {
        if (chart) {
            chart.width(scope.width).height(scope.height);
            var d3Select = getD3Selector(attrs, element);
            d3.select(d3Select + ' svg')
                .attr('viewBox', '0 0 ' + scope.width + ' ' + scope.height);
            nv.utils.windowResize(chart);
            scope.chart.update();
        }
    }

function initializeMargin( scope, attrs ) {
    var margin = scope.$eval( attrs.margin ) || {
      left: 50,
      top: 50,
      bottom: 50,
      right: 50
    };
    if ( typeof margin !== 'object' ) {
      // we were passed a vanilla int, convert to full margin object
      margin = {
        left: margin,
        top: margin,
        bottom: margin,
        right: margin
      };
    }
    scope.margin = margin;
  }

function checkElementID( scope, attrs, element, chart, data ) {
    configureXaxis( chart, scope, attrs );
    configureX2axis( chart, scope, attrs );
    configureYaxis( chart, scope, attrs );
    configureY1axis( chart, scope, attrs );
    configureY2axis( chart, scope, attrs );
    configureLegend( chart, scope, attrs );
    processEvents( chart, scope );
    var d3Select = getD3Selector( attrs, element );
    if ( angular.isArray( data ) && data.length === 0 ) {
      d3.select( d3Select + ' svg' ).remove();
    }
    if ( d3.select( d3Select + ' svg' ).empty() ) {
      d3.select( d3Select ).append( 'svg' );
    }
    d3.select( d3Select + ' svg' ).attr( 'viewBox', '0 0 ' + scope.width + ' ' + scope.height ).datum( data ).transition().duration( attrs.transitionduration === undefined ? 250 : +attrs.transitionduration ).call( chart );
  }

function initializeLegendMargin( scope, attrs ) {
    var margin = ( scope.$eval( attrs.legendmargin ) || {
      left: 0,
      top: 5,
      bottom: 5,
      right: 0
    } );
    if ( typeof ( margin ) !== 'object' ) {
      // we were passed a vanilla int, convert to full margin object
      margin = {
        left: margin,
        top: margin,
        bottom: margin,
        right: margin
      };
    }
    scope.legendmargin = margin;
  }

  function configureLegend( chart, scope, attrs ) {
    if ( chart.legend && attrs.showlegend && ( attrs.showlegend === 'true' ) ) {
      initializeLegendMargin( scope, attrs );
      chart.legend.margin( scope.legendmargin );
      chart.legend.width( attrs.legendwidth === undefined ? 400 : ( +attrs.legendwidth ) );
      chart.legend.height( attrs.legendheight === undefined ? 20 : ( +attrs.legendheight ) );
      chart.legend.key( attrs.legendkey === undefined ? function ( d ) {
        return d.key;
      } : scope.legendkey() );
      chart.legend.color( attrs.legendcolor === undefined ? nv.utils.defaultColor() : scope.legendcolor() );
      chart.legend.align( attrs.legendalign === undefined ? true : ( attrs.legendalign === 'true' ) );
      chart.legend.rightAlign( attrs.legendrightalign === undefined ? true : ( attrs.legendrightalign === 'true' ) );
      chart.legend.updateState( attrs.legendupdatestate === undefined ? true : ( attrs.legendupdatestate === 'true' ) );
      chart.legend.radioButtonMode( attrs.legendradiobuttonmode === undefined ? false : ( attrs.legendradiobuttonmode === 'true' ) );
    }
  }

  function processEvents( chart, scope ) {
    if ( chart.dispatch ) {
      if ( chart.dispatch.tooltipShow ) {
        chart.dispatch.on( 'tooltipShow.directive', function ( event ) {
          scope.$emit( 'tooltipShow.directive', event );
        } );
      }

      if ( chart.dispatch.tooltipHide ) {
        chart.dispatch.on( 'tooltipHide.directive', function ( event ) {
          scope.$emit( 'tooltipHide.directive', event );
        } );
      }

      if ( chart.dispatch.beforeUpdate ) {
        chart.dispatch.on( 'beforeUpdate.directive', function ( event ) {
          scope.$emit( 'beforeUpdate.directive', event );
        } );
      }

      if ( chart.dispatch.stateChange ) {
        chart.dispatch.on( 'stateChange.directive', function ( event ) {
          scope.$emit( 'stateChange.directive', event );
        } );
      }

      if ( chart.dispatch.changeState ) {
        chart.dispatch.on( 'changeState.directive', function ( event ) {
          scope.$emit( 'changeState.directive', event );
        } );
      }
    }

    if ( chart.lines ) {
      chart.lines.dispatch.on( 'elementMouseover.tooltip.directive', function ( event ) {
        scope.$emit( 'elementMouseover.tooltip.directive', event );
      } );

      chart.lines.dispatch.on( 'elementMouseout.tooltip.directive', function ( event ) {
        scope.$emit( 'elementMouseout.tooltip.directive', event );
      } );

      chart.lines.dispatch.on( 'elementClick.directive', function ( event ) {
        scope.$emit( 'elementClick.directive', event );
      } );
    }

    if ( chart.stacked && chart.stacked.dispatch ) {
      chart.stacked.dispatch.on( 'areaClick.toggle.directive', function ( event ) {
        scope.$emit( 'areaClick.toggle.directive', event );
      } );

      chart.stacked.dispatch.on( 'tooltipShow.directive', function ( event ) {
        scope.$emit( 'tooltipShow.directive', event );
      } );

      chart.stacked.dispatch.on( 'tooltipHide.directive', function ( event ) {
        scope.$emit( 'tooltipHide.directive', event );
      } );

    }

    if ( chart.interactiveLayer ) {
      if ( chart.interactiveLayer.elementMouseout ) {
        chart.interactiveLayer.dispatch.on( 'elementMouseout.directive', function ( event ) {
          scope.$emit( 'elementMouseout.directive', event );
        } );
      }

      if ( chart.interactiveLayer.elementMousemove ) {
        chart.interactiveLayer.dispatch.on( 'elementMousemove.directive', function ( event ) {
          scope.$emit( 'elementMousemove.directive', event );
        } );
      }
    }

    if ( chart.discretebar ) {
      chart.discretebar.dispatch.on( 'elementMouseover.tooltip.directive', function ( event ) {
        scope.$emit( 'elementMouseover.tooltip.directive', event );
      } );

      chart.discretebar.dispatch.on( 'elementMouseout.tooltip.directive', function ( event ) {
        scope.$emit( 'elementMouseout.tooltip.directive', event );
      } );

      chart.discretebar.dispatch.on( 'elementClick.directive', function ( event ) {
        scope.$emit( 'elementClick.directive', event );
      } );
    }

    if ( chart.multibar ) {
      chart.multibar.dispatch.on( 'elementMouseover.tooltip.directive', function ( event ) {
        scope.$emit( 'elementMouseover.tooltip.directive', event );
      } );

      chart.multibar.dispatch.on( 'elementMouseout.tooltip.directive', function ( event ) {
        scope.$emit( 'elementMouseout.tooltip.directive', event );
      } );

      chart.multibar.dispatch.on( 'elementClick.directive', function ( event ) {
        scope.$emit( 'elementClick.directive', event );
      } );

    }

    if ( chart.pie ) {
      chart.pie.dispatch.on( 'elementMouseover.tooltip.directive', function ( event ) {
        scope.$emit( 'elementMouseover.tooltip.directive', event );
      } );

      chart.pie.dispatch.on( 'elementMouseout.tooltip.directive', function ( event ) {
        scope.$emit( 'elementMouseout.tooltip.directive', event );
      } );

      chart.pie.dispatch.on( 'elementClick.directive', function ( event ) {
        scope.$emit( 'elementClick.directive', event );
      } );
    }

    if ( chart.scatter ) {
      chart.scatter.dispatch.on( 'elementMouseover.tooltip.directive', function ( event ) {
        scope.$emit( 'elementMouseover.tooltip.directive', event );
      } );

      chart.scatter.dispatch.on( 'elementMouseout.tooltip.directive', function ( event ) {
        scope.$emit( 'elementMouseout.tooltip.directive', event );
      } );
    }

    if ( chart.bullet ) {
      chart.bullet.dispatch.on( 'elementMouseover.tooltip.directive', function ( event ) {
        scope.$emit( 'elementMouseover.tooltip.directive', event );
      } );

      chart.bullet.dispatch.on( 'elementMouseout.tooltip.directive', function ( event ) {
        scope.$emit( 'elementMouseout.tooltip.directive', event );
      } );
    }

    if ( chart.legend ) {
      //'legendClick', 'legendDblclick', 'legendMouseover'
      //stateChange
      chart.legend.dispatch.on( 'stateChange.legend.directive', function ( event ) {
        scope.$emit( 'stateChange.legend.directive', event );
      } );
      chart.legend.dispatch.on( 'legendClick.directive', function ( d, i ) {
        scope.$emit( 'legendClick.directive', d, i );
      } );
      chart.legend.dispatch.on( 'legendDblclick.directive', function ( d, i ) {
        scope.$emit( 'legendDblclick.directive', d, i );
      } );
      chart.legend.dispatch.on( 'legendMouseover.directive', function ( d, i ) {
        scope.$emit( 'legendMouseover.directive', d, i );
      } );
    }

    if ( chart.controls ) {
      if ( chart.controls.legendClick ) {
        chart.controls.dispatch.on( 'legendClick.directive', function ( d, i ) {
          scope.$emit( 'legendClick.directive', d, i );
        } );
      }
    }

  }

  function configureXaxis( chart, scope, attrs ) {
    if ( attrs.xaxisorient ) {
      chart.xAxis.orient( attrs.xaxisorient );
    }
    if ( attrs.xaxisticks ) {
      chart.xAxis.scale().ticks( attrs.xaxisticks );
    }
    if ( attrs.xaxistickvalues ) {
      if ( Array.isArray( scope.$eval( attrs.xaxistickvalues ) ) ) {
        chart.xAxis.tickValues( scope.$eval( attrs.xaxistickvalues ) );
      } else if ( typeof scope.xaxistickvalues() === 'function' ) {
        chart.xAxis.tickValues( scope.xaxistickvalues() );
      }
    }
    if ( attrs.xaxisticksubdivide ) {
      chart.xAxis.tickSubdivide( scope.xaxisticksubdivide() );
    }
    if ( attrs.xaxisticksize ) {
      chart.xAxis.tickSize( scope.xaxisticksize() );
    }
    if ( attrs.xaxistickpadding ) {
      chart.xAxis.tickPadding( scope.xaxistickpadding() );
    }
    if ( attrs.xaxistickformat ) {
      chart.xAxis.tickFormat( scope.xaxistickformat() );
    }
    if ( attrs.xaxislabel ) {
      chart.xAxis.axisLabel( attrs.xaxislabel );
    }
    if ( attrs.xaxisscale ) {
      chart.xAxis.scale( scope.xaxisscale() );
    }
    if ( attrs.xaxisdomain ) {
      if ( Array.isArray( scope.$eval( attrs.xaxisdomain ) ) ) {
        chart.xDomain( scope.$eval( attrs.xaxisdomain ) );
      } else if ( typeof scope.xaxisdomain() === 'function' ) {
        chart.xDomain( scope.xaxisdomain() );
      }
    }
    if ( attrs.xaxisrange ) {
      if ( Array.isArray( scope.$eval( attrs.xaxisrange ) ) ) {
        chart.xRange( scope.$eval( attrs.xaxisrange ) );
      } else if ( typeof scope.xaxisrange() === 'function' ) {
        chart.xRange( scope.xaxisrange() );
      }
    }
    if ( attrs.xaxisrangeband ) {
      chart.xAxis.rangeBand( scope.xaxisrangeband() );
    }
    if ( attrs.xaxisrangebands ) {
      chart.xAxis.rangeBands( scope.xaxisrangebands() );
    }
    if ( attrs.xaxisshowmaxmin ) {
      chart.xAxis.showMaxMin( ( attrs.xaxisshowmaxmin === 'true' ) );
    }
    if ( attrs.xaxishighlightzero ) {
      chart.xAxis.highlightZero( ( attrs.xaxishighlightzero === 'true' ) );
    }
    if ( attrs.xaxisrotatelabels ) {
      chart.xAxis.rotateLabels( ( +attrs.xaxisrotatelabels ) );
    }
    //    if(attrs.xaxisrotateylabel){
    //        chart.xAxis.rotateYLabel((attrs.xaxisrotateylabel === "true"));
    //    }
    if ( attrs.xaxisstaggerlabels ) {
      chart.xAxis.staggerLabels( ( attrs.xaxisstaggerlabels === 'true' ) );
    }
    if ( attrs.xaxislabeldistance ) {
      chart.xAxis.axisLabelDistance( ( +attrs.xaxislabeldistance ) );
    }
  }

  function configureX2axis( chart, scope, attrs ) {
    if ( attrs.x2axisorient ) {
      chart.x2Axis.orient( attrs.x2axisorient );
    }
    if ( attrs.x2axisticks ) {
      chart.x2Axis.scale().ticks( attrs.x2axisticks );
    }
    if ( attrs.x2axistickvalues ) {
      if ( Array.isArray( scope.$eval( attrs.x2axistickvalues ) ) ) {
        chart.x2Axis.tickValues( scope.$eval( attrs.x2axistickvalues ) );
      } else if ( typeof scope.xaxistickvalues() === 'function' ) {
        chart.x2Axis.tickValues( scope.x2axistickvalues() );
      }
    }
    if ( attrs.x2axisticksubdivide ) {
      chart.x2Axis.tickSubdivide( scope.x2axisticksubdivide() );
    }
    if ( attrs.x2axisticksize ) {
      chart.x2Axis.tickSize( scope.x2axisticksize() );
    }
    if ( attrs.x2axistickpadding ) {
      chart.x2Axis.tickPadding( scope.x2axistickpadding() );
    }
    if ( attrs.x2axistickformat ) {
      chart.x2Axis.tickFormat( scope.x2axistickformat() );
    }
    if ( attrs.x2axislabel ) {
      chart.x2Axis.axisLabel( attrs.x2axislabel );
    }
    if ( attrs.x2axisscale ) {
      chart.x2Axis.scale( scope.x2axisscale() );
    }
    if ( attrs.x2axisdomain ) {
      if ( Array.isArray( scope.$eval( attrs.x2axisdomain ) ) ) {
        chart.x2Axis.domain( scope.$eval( attrs.x2axisdomain ) );
      } else if ( typeof scope.x2axisdomain() === 'function' ) {
        chart.x2Axis.domain( scope.x2axisdomain() );
      }
    }
    if ( attrs.x2axisrange ) {
      if ( Array.isArray( scope.$eval( attrs.x2axisrange ) ) ) {
        chart.x2Axis.range( scope.$eval( attrs.x2axisrange ) );
      } else if ( typeof scope.x2axisrange() === 'function' ) {
        chart.x2Axis.range( scope.x2axisrange() );
      }
    }
    if ( attrs.x2axisrangeband ) {
      chart.x2Axis.rangeBand( scope.x2axisrangeband() );
    }
    if ( attrs.x2axisrangebands ) {
      chart.x2Axis.rangeBands( scope.x2axisrangebands() );
    }
    if ( attrs.x2axisshowmaxmin ) {
      chart.x2Axis.showMaxMin( ( attrs.x2axisshowmaxmin === 'true' ) );
    }
    if ( attrs.x2axishighlightzero ) {
      chart.x2Axis.highlightZero( ( attrs.x2axishighlightzero === 'true' ) );
    }
    if ( attrs.x2axisrotatelables ) {
      chart.x2Axis.rotateLabels( ( +attrs.x2axisrotatelables ) );
    }
    //    if(attrs.xaxisrotateylabel){
    //        chart.xAxis.rotateYLabel((attrs.xaxisrotateylabel === "true"));
    //    }
    if ( attrs.x2axisstaggerlabels ) {
      chart.x2Axis.staggerLabels( ( attrs.x2axisstaggerlabels === 'true' ) );
    }
    if ( attrs.x2axislabeldistance ) {
      chart.x2Axis.axisLabelDistance( ( +attrs.x2axislabeldistance ) );
    }
  }

  function configureYaxis( chart, scope, attrs ) {
    if ( attrs.yaxisorient ) {
      chart.yAxis.orient( attrs.yaxisorient );
    }
    if ( attrs.yaxisticks ) {
      chart.yAxis.scale().ticks( attrs.yaxisticks );
    }
    if ( attrs.yaxistickvalues ) {
      if ( Array.isArray( scope.$eval( attrs.yaxistickvalues ) ) ) {
        chart.yAxis.tickValues( scope.$eval( attrs.yaxistickvalues ) );
      } else if ( typeof scope.yaxistickvalues() === 'function' ) {
        chart.yAxis.tickValues( scope.yaxistickvalues() );
      }
    }
    if ( attrs.yaxisticksubdivide ) {
      chart.yAxis.tickSubdivide( scope.yaxisticksubdivide() );
    }
    if ( attrs.yaxisticksize ) {
      chart.yAxis.tickSize( scope.yaxisticksize() );
    }
    if ( attrs.yaxistickpadding ) {
      chart.yAxis.tickPadding( scope.yaxistickpadding() );
    }
    if ( attrs.yaxistickformat ) {
      chart.yAxis.tickFormat( scope.yaxistickformat() );
    }
    if ( attrs.yaxislabel ) {
      chart.yAxis.axisLabel( attrs.yaxislabel );
    }
    if ( attrs.yaxisscale ) {
      chart.yAxis.scale( scope.yaxisscale() );
    }
    if ( attrs.yaxisdomain ) {
      if ( Array.isArray( scope.$eval( attrs.yaxisdomain ) ) ) {
        chart.yDomain( scope.$eval( attrs.yaxisdomain ) );
      } else if ( typeof scope.yaxisdomain() === 'function' ) {
        chart.yDomain( scope.yaxisdomain() );
      }
    }
    if ( attrs.yaxisrange ) {
      if ( Array.isArray( scope.$eval( attrs.yaxisrange ) ) ) {
        chart.yRange( scope.$eval( attrs.yaxisrange ) );
      } else if ( typeof scope.yaxisrange() === 'function' ) {
        chart.yRange( scope.yaxisrange() );
      }
    }
    if ( attrs.yaxisrangeband ) {
      chart.yAxis.rangeBand( scope.yaxisrangeband() );
    }
    if ( attrs.yaxisrangebands ) {
      chart.yAxis.rangeBands( scope.yaxisrangebands() );
    }
    if ( attrs.yaxisshowmaxmin ) {
      chart.yAxis.showMaxMin( ( attrs.yaxisshowmaxmin === 'true' ) );
    }
    if ( attrs.yaxishighlightzero ) {
      chart.yAxis.highlightZero( ( attrs.yaxishighlightzero === 'true' ) );
    }
    if ( attrs.yaxisrotatelabels ) {
      chart.yAxis.rotateLabels( ( +attrs.yaxisrotatelabels ) );
    }
    if ( attrs.yaxisrotateylabel ) {
      chart.yAxis.rotateYLabel( ( attrs.yaxisrotateylabel === 'true' ) );
    }
    if ( attrs.yaxisstaggerlabels ) {
      chart.yAxis.staggerLabels( ( attrs.yaxisstaggerlabels === 'true' ) );
    }
    if ( attrs.yaxislabeldistance ) {
      chart.yAxis.axisLabelDistance( ( +attrs.yaxislabeldistance ) );
    }
  }

  function configureY1axis( chart, scope, attrs ) {
    if ( attrs.y1axisticks ) {
      chart.y1Axis.scale().ticks( attrs.y1axisticks );
    }
    if ( attrs.y1axistickvalues ) {
      if ( Array.isArray( scope.$eval( attrs.y1axistickvalues ) ) ) {
        chart.y1Axis.tickValues( scope.$eval( attrs.y1axistickvalues ) );
      } else if ( typeof scope.y1axistickvalues() === 'function' ) {
        chart.y1Axis.tickValues( scope.y1axistickvalues() );
      }
    }
    if ( attrs.y1axisticksubdivide ) {
      chart.y1Axis.tickSubdivide( scope.y1axisticksubdivide() );
    }
    if ( attrs.y1axisticksize ) {
      chart.y1Axis.tickSize( scope.y1axisticksize() );
    }
    if ( attrs.y1axistickpadding ) {
      chart.y1Axis.tickPadding( scope.y1axistickpadding() );
    }
    if ( attrs.y1axistickformat ) {
      chart.y1Axis.tickFormat( scope.y1axistickformat() );
    }
    if ( attrs.y1axislabel ) {
      chart.y1Axis.axisLabel( attrs.y1axislabel );
    }
    if ( attrs.y1axisscale ) {
      chart.y1Axis.yScale( scope.y1axisscale() );
    }
    if ( attrs.y1axisdomain ) {
      if ( Array.isArray( scope.$eval( attrs.y1axisdomain ) ) ) {
        chart.y1Axis.domain( scope.$eval( attrs.y1axisdomain ) );
      } else if ( typeof scope.y1axisdomain() === 'function' ) {
        chart.y1Axis.domain( scope.y1axisdomain() );
      }
    }
    if ( attrs.y1axisrange ) {
      if ( Array.isArray( scope.$eval( attrs.y1axisrange ) ) ) {
        chart.y1Axis.range( scope.$eval( attrs.y1axisrange ) );
      } else if ( typeof scope.y1axisrange() === 'function' ) {
        chart.y1Axis.range( scope.y1axisrange() );
      }
    }
    if ( attrs.y1axisrangeband ) {
      chart.y1Axis.rangeBand( scope.y1axisrangeband() );
    }
    if ( attrs.y1axisrangebands ) {
      chart.y1Axis.rangeBands( scope.y1axisrangebands() );
    }
    if ( attrs.y1axisshowmaxmin ) {
      chart.y1Axis.showMaxMin( ( attrs.y1axisshowmaxmin === 'true' ) );
    }
    if ( attrs.y1axishighlightzero ) {
      chart.y1Axis.highlightZero( ( attrs.y1axishighlightzero === 'true' ) );
    }
    if ( attrs.y1axisrotatelabels ) {
      chart.y1Axis.rotateLabels( ( +scope.y1axisrotatelabels ) );
    }
    if ( attrs.y1axisrotateylabel ) {
      chart.y1Axis.rotateYLabel( ( attrs.y1axisrotateylabel === 'true' ) );
    }
    if ( attrs.y1axisstaggerlabels ) {
      chart.y1Axis.staggerlabels( ( attrs.y1axisstaggerlabels === 'true' ) );
    }
    if ( attrs.y1axislabeldistance ) {
      chart.y1Axis.axisLabelDistance( ( +attrs.y1axislabeldistance ) );
    }
  }

  function configureY2axis( chart, scope, attrs ) {
    if ( attrs.y2axisticks ) {
      chart.y2Axis.scale().ticks( attrs.y2axisticks );
    }
    if ( attrs.y2axistickvalues ) {
      chart.y2Axis.tickValues( scope.$eval( attrs.y2axistickvalues ) );
    }
    if ( attrs.y2axisticksubdivide ) {
      chart.y2Axis.tickSubdivide( scope.y2axisticksubdivide() );
    }
    if ( attrs.y2axisticksize ) {
      chart.y2Axis.tickSize( scope.y2axisticksize() );
    }
    if ( attrs.y2axistickpadding ) {
      chart.y2Axis.tickPadding( scope.y2axistickpadding() );
    }
    if ( attrs.y2axistickformat ) {
      chart.y2Axis.tickFormat( scope.y2axistickformat() );
    }
    if ( attrs.y2axislabel ) {
      chart.y2Axis.axisLabel( attrs.y2axislabel );
    }
    if ( attrs.y2axisscale ) {
      chart.y2Axis.yScale( scope.y2axisscale() );
    }
    if ( attrs.y2axisdomain ) {
      if ( Array.isArray( scope.$eval( attrs.y2axisdomain ) ) ) {
        chart.y2Axis.domain( scope.$eval( attrs.y2axisdomain ) );
      } else if ( typeof scope.y2axisdomain() === 'function' ) {
        chart.y2Axis.domain( scope.y2axisdomain() );
      }
    }
    if ( attrs.y2axisrange ) {
      if ( Array.isArray( scope.$eval( attrs.y2axisrange ) ) ) {
        chart.y2Axis.range( scope.$eval( attrs.y2axisrange ) );
      } else if ( typeof scope.y2axisrange() === 'function' ) {
        chart.y2Axis.range( scope.y2axisrange() );
      }
    }
    if ( attrs.y2axisrangeband ) {
      chart.y2Axis.rangeBand( scope.y2axisrangeband() );
    }
    if ( attrs.y2axisrangebands ) {
      chart.y2Axis.rangeBands( scope.y2axisrangebands() );
    }
    if ( attrs.y2axisshowmaxmin ) {
      chart.y2Axis.showMaxMin( ( attrs.y2axisshowmaxmin === 'true' ) );
    }
    if ( attrs.y2axishighlightzero ) {
      chart.y2Axis.highlightZero( ( attrs.y2axishighlightzero === 'true' ) );
    }
    if ( attrs.y2axisrotatelabels ) {
      chart.y2Axis.rotateLabels( ( +scope.y2axisrotatelabels ) );
    }
    if ( attrs.y2axisrotateylabel ) {
      chart.y2Axis.rotateYLabel( ( attrs.y2axisrotateylabel === 'true' ) );
    }
    if ( attrs.y2axisstaggerlabels ) {
      chart.y2Axis.staggerlabels( ( attrs.y2axisstaggerlabels === 'true' ) );
    }
    if ( attrs.y2axislabeldistance ) {
      chart.y2Axis.axisLabelDistance( ( +attrs.y2axislabeldistance ) );
    }
  }
 function getD3Selector( attrs, element ) {
    if ( !attrs.id ) {
      //if an id is not supplied, create a random id.
      if ( !attrs[ 'data-chartid' ] ) {
        angular.element( element ).attr( 'data-chartid', 'chartid' + Math.floor( Math.random() * 1000000001 ) );
      }
      return '[data-chartid=' + attrs[ 'data-chartid' ] + ']';
    } else {
      return '#' + attrs.id;
    }
  }
angular.module('octobluApp')
.directive( 'nvd3LineWithFocusChart',
    function () {
      return {
        restrict: 'A',
        scope: {
          data: '=',
          width: '@',
          height: '@',
          height2: '@',
          id: '@',
          showlegend: '@',
          tooltips: '@',
          showxaxis: '@',
          showyaxis: '@',
          rightalignyaxis: '@',
          defaultstate: '@',
          nodata: '@',
          margin: '&',
          margin2: '&',
          tooltipcontent: '&',
          color: '&',
          x: '&',
          y: '&',
          forceX: '@',
          forceY: '@',
          clipedge: '@',
          clipvoronoi: '@',
          interpolate: '@',
          isArea: '@',
          size: '&',
          defined: '&',
          interactive: '@',
          callback: '&',
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
          x2axisorient: '&',
          x2axisticks: '&',
          x2axistickvalues: '&xaxistickvalues',
          x2axisticksubdivide: '&',
          x2axisticksize: '&',
          x2axistickpadding: '&',
          x2axistickformat: '&',
          x2axislabel: '@',
          x2axisscale: '&',
          x2axisdomain: '&',
          x2axisrange: '&',
          x2axisrangeband: '&',
          x2axisrangebands: '&',
          x2axisshowmaxmin: '@',
          x2axishighlightzero: '@',
          x2axisrotatelables: '@',
          x2axisrotateylabel: '@',
          x2axisstaggerlabels: '@',
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
          y2axisorient: '&',
          y2axisticks: '&',
          y2axistickvalues: '&',
          y2axisticksubdivide: '&',
          y2axisticksize: '&',
          y2axistickpadding: '&',
          y2axistickformat: '&',
          y2axislabel: '@',
          y2axisscale: '&',
          y2axisdomain: '&',
          y2axisrange: '&',
          y2axisrangeband: '&',
          y2axisrangebands: '&',
          y2axisshowmaxmin: '@',
          y2axishighlightzero: '@',
          y2axisrotatelabels: '@',
          y2axisrotateylabel: '@',
          y2axisstaggerlabels: '@',
          legendmargin: '&',
          legendwidth: '@',
          legendheight: '@',
          legendkey: '@',
          legendcolor: '&',
          legendalign: '@',
          legendrightalign: '@',
          legendupdatestate: '@',
          legendradiobuttonmode: '@',
          objectequality: '@',
          transitionduration: '@'
        },
        controller: [
          '$scope',
          '$element',
          '$attrs',
          function ( $scope, $element, $attrs ) {
            $scope.d3Call = function ( data, chart ) {
              checkElementID( $scope, $attrs, $element, chart, data );
            };
          }
        ],
        link: function ( scope, element, attrs ) {
          scope.$watch( 'width + height', function () {
            updateDimensions( scope, attrs, element, scope.chart );
          } );
          scope.$watch( 'data', function ( data ) {
            if ( data && angular.isDefined( scope.filtername ) && angular.isDefined( scope.filtervalue ) ) {
              data = $filter( scope.filtername )( data, scope.filtervalue );
            }
            if ( data ) {
              //if the chart exists on the scope, do not call addGraph again, update data and call the chart.
              if ( scope.chart ) {
                return scope.d3Call( data, scope.chart );
              }
              nv.addGraph( {
                generate: function () {
                  initializeMargin( scope, attrs );
                  //setup height 2
                  //height 2 is 100
                  //margin
                  //nvd3 default is {top: 30, right: 30, bottom: 30, left: 60}
                  //setup margin 2
                  //nvd3 default is {top: 0, right: 30, bottom: 20, left: 60}
                  if ( attrs.margin2 ) {
                    var margin2 = scope.$eval( attrs.margin2 );
                    if ( typeof margin2 !== 'object' ) {
                      // we were passed a vanilla int, convert to full margin object
                      margin2 = {
                        left: margin2,
                        top: margin2,
                        bottom: margin2,
                        right: margin2
                      };
                    }
                    scope.margin2 = margin2;
                  } else {
                    scope.margin2 = {
                      top: 0,
                      right: 30,
                      bottom: 20,
                      left: 60
                    };
                  }
                  //'xDomain', 'yDomain', 'xRange', 'yRange', ''clipEdge', 'clipVoronoi'
                  var chart = nv.models.lineWithFocusChart().width( scope.width ).height( scope.height ).height2( attrs.height2 === undefined ? 100 : +attrs.height2 ).margin( scope.margin ).margin2( scope.margin2 ).x( attrs.x === undefined ? function ( d ) {
                    return d[ 0 ];
                  } : scope.x() ).y( attrs.y === undefined ? function ( d ) {
                    return d[ 1 ];
                  } : scope.y() ).forceX( attrs.forcex === undefined ? [] : scope.$eval( attrs.forcex ) ).forceY( attrs.forcey === undefined ? [] : scope.$eval( attrs.forcey ) ).showLegend( attrs.showlegend === undefined ? false : attrs.showlegend === 'true' ).tooltips( attrs.tooltips === undefined ? false : attrs.tooltips === 'true' ).noData( attrs.nodata === undefined ? 'No Data Available.' : scope.nodata ).color( attrs.color === undefined ? nv.utils.defaultColor() : scope.color() ).isArea( attrs.isarea === undefined ? function ( d ) {
                    return d.area;
                  } : function () {
                    return attrs.isarea === 'true';
                  } ).size( attrs.size === undefined ? function ( d ) {
                    return d.size === undefined ? 1 : d.size;
                  } : scope.size() ).interactive( attrs.interactive === undefined ? false : attrs.interactive === 'true' ).clipEdge( attrs.clipedge === undefined ? false : attrs.clipedge === 'true' ).clipVoronoi( attrs.clipvoronoi === undefined ? false : attrs.clipvoronoi === 'true' ).interpolate( attrs.interpolate === undefined ? 'linear' : attrs.interpolate );
                  if ( attrs.defined ) {
                    chart.defined( scope.defined() );
                  }
                  if ( attrs.tooltipcontent ) {
                    chart.tooltipContent( scope.tooltipcontent() );
                  }
                  scope.d3Call( data, chart );
                  nv.utils.windowResize( chart.update );
                  scope.chart = chart;
                  return chart;
                },
                callback: attrs.callback === undefined ? null : scope.callback()
              } );
            }
          }, attrs.objectequality === undefined ? false : attrs.objectequality === 'true' );
        }
      };
    }
  );