angular.module('octobluApp')
  .service('LinkRenderer', function () {

    var renderLine = d3.svg.line()
      .x(function (coordinate) {
        return coordinate.x;
      })
      .y(function (coordinate) {
        return coordinate.y;
      })
      .interpolate('basis');


    function linkPath(from, to) {

      var fromCoordinateCurveStart = {
        x: from.x + 20,
        y: from.y
      };

      var toCoordinate = {
        x: to.x,
        y: to.y
      };

      var toCoordinateCurveStart = {
        x: toCoordinate.x - 20,
        y: toCoordinate.y
      };

      return renderLine([from, fromCoordinateCurveStart,
        toCoordinateCurveStart, to]);
    }

    return {
      render: function (renderScope, from, to) {
        return renderScope
          .append('path')
          .classed('flow-link', true)
          .classed('flow-potential-link', true)
          .attr('d', linkPath(from, to));
      }
    };
  });
