angular.module('bc.highcharts', []).directive 'bcHighcharts', ['$timeout', ($timeout) ->
    restrict: 'EAC'
    replace: true
    template: '<div></div>'
    scope:
      config: '='
      loading: '='
      loadingMessage: '='
      afterSetExtremes: '='

    link: (scope, element, attrs) ->

      DEFAULT_LOADING_MESSAGE = 'Loading data from server...'

      afterSetExtremesHandler = (e) ->
        if type scope.afterSetExtremes is 'function'
          scope.afterSetExtremes e, element.highcharts()

      scope.$watch 'config', (newVal, oldVal) ->
        if newVal && newVal != oldVal
          if not exist newVal.xAxis then newVal.xAxis = {}
          newVal.xAxis.events = { afterSetExtremes : afterSetExtremesHandler }
          element.highcharts 'StockChart', newVal, (chart) ->
            $timeout ->
              xExt = chart.xAxis[0].getExtremes()
              chart.xAxis[0].setExtremes(xExt.min, xExt.max)

      scope.$watch 'loading', (newVal, oldVal) ->
        if exist newVal
          chart = element.highcharts()
          if chart
            if newVal
              chart.showLoading (scope.loadingMessage || DEFAULT_LOADING_MESSAGE)
            else if oldVal
              chart.hideLoading()
  ]