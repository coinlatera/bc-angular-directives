define ['app', ], (app) ->
  app.module('bc-angular-directives').directive 'bcTable', () ->
    restrict: 'E'

    replace: true

    scope:
      tableConfig: '=',
      headerModel: '=',
      tableModel: '='

    template:
      '<div>' +
        '<table ng-class="config.tableClass">' +
          '<tr>' + 
            '<th ng-repeat="header in headers" ng-style="{width: header.width}" ng-class="header.classNames" ng-click="headerClick(header, $index)">' +
              '{{header.label}}' +
              '<span ng-show="header.sortable">' +
                '<span ng-switch on="currentSort.headerIndex - $index">' +
                  '<span ng-switch-when="0">' +
                    '<i ng-show="currentSort.reverse" class="icon icon-caret-up"></i>' +
                    '<i ng-hide="currentSort.reverse" class="icon icon-caret-down"></i>' +
                  '</span>' +
                  '<span ng-switch-default><i class="icon icon-sort"></i></span>' +
                '</span>' +
              '</span>' + 
            '</th>' +
          '</tr>' +
          '<tr ng-repeat="line in data | filteredBy:filter.filterKeys:filter.filterValue | orderBy:currentSort.sortingKey:currentSort.reverse | startAt:(currentPage - 1) * pageSize | limitTo:pageSize" ng-click="lineClick(line)" ng-class="{\'clickable-row\': config.lineClick}">' +
            '<td ng-repeat="header in headers" ng-switch on="line[header.key].type" class="wide middle">' +
              '<div ng-switch-when="button"><span class="btn" href="#" ng-click="line[header.key].callback(line)" ng-class="line[header.key].classNames" ng-bind-html-unsafe="line[header.key].title"></span></div>' +
              '<div ng-switch-default ng-bind-html-unsafe="header.format(line[header.key])"></div>' +
            '</td>' +
          '</tr>' +
        '</table>' +
        '<div class="right" ng-show="showPagination"><pagination total-items="(data | filteredBy:filter.filterKeys:filter.filterValue).length || 1" items-per-page="pageSize" page="currentPage"></pagination></div>' +
      '</div>'

    link: (scope, element, attrs) ->

      # Define the default sorting state
      scope.currentSort = {
        headerIndex: -1,
        sortingKey: '',
        reverse: false
      }


      # Watch any change in the model
      scope.$watch 'tableConfig', () ->
        modelChanged()
      , true
      scope.$watch 'headerModel', () ->
        modelChanged()
      , true
      scope.$watch 'tableModel', () ->
        modelChanged()
      , true


      # Handle a change in the model and rebuild the
      # directive data
      modelChanged = () ->
        # Get model data
        scope.headers = scope.headerModel
        scope.data = scope.tableModel
        scope.config = scope.tableConfig
        scope.filter = if exist scope.config.filter then scope.config.filter else {}

        # Update pagination variable
        if exist scope.config.pagination
          scope.showPagination = true
          scope.pageSize = scope.config.pagination.pageSize
          scope.currentPage = scope.config.pagination.currentPage
        else
          scope.showPagination = false
          scope.pageSize = scope.data.length
          scope.currentPage = 1

        # Header postprocessing
        for header in scope.headers

          # Set a format function for each header
          # If the format field is not defined, we set a default function
          unless exist(header.format) and (type header.format) is 'function'
            header.format = (value) -> value
            continue

          # Define the header classes
          header.classNames = 'left'
          if exist header.sortable
            header.classNames += ' sortable-header'
          if exist header.customClass
            header.classNames += ' ' + header.customClass

        return


      # Handle a click on a header
      scope.headerClick = (header, index) ->
        if header.sortable
          scope.currentSort.reverse = scope.currentSort.headerIndex is index and not scope.currentSort.reverse
          scope.currentSort.headerIndex = index
          scope.currentSort.sortingKey = header.key


      # Handle a click on a line
      scope.lineClick = (line) ->
        if exist scope.config.lineClick
          scope.config.lineClick line

