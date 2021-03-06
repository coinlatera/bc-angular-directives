angular.module('bc.table', ['start-at', 'filtered-by', 'filtered-by-radio']).directive 'bcTable', ['$sce', ($sce) ->
  restrict: 'E'

  replace: true

  scope:
    tableConfig: '=',
    headerModel: '=',
    tableModel: '='

  template:
    '<div>' +
      '<table ng-class="config.tableClass">' +
        '<thead>' +
          '<tr>' +
            '<th ng-repeat="header in headers" ng-style="{width: header.width}" ng-class="header.classNames" ng-click="headerClick(header, $index)">' +
              '{{header.processedLabel}}' +
              '<span ng-show="header.sortable">' +
                '<span ng-switch on="currentSort.headerIndex - $index">' +
                  '<span ng-switch-when="0">' +
                    '<i ng-show="currentSort.reverse" class="icon icon-caret-down"></i>' +
                    '<i ng-hide="currentSort.reverse" class="icon icon-caret-up"></i>' +
                  '</span>' +
                  '<span ng-switch-default><i class="icon icon-sort"></i></span>' +
                '</span>' +
              '</span>' +
            '</th>' +
          '</tr>' +
        '</thead>' +
        '<tbody>' +
          '<tr ng-repeat="line in data | filteredBy:filter.filterKeys:filter.filterValue | filteredByRadio:radio.filterKeys:radio.filterValue | orderBy:currentSort.sortingKey:currentSort.reverse | startAt:(currentPage - 1) * pageSize | limitTo:pageSize" ng-click="lineClick(line)" ng-class="{\'clickable-row\': config.lineClick}">' +
            '<td ng-repeat="header in headers" ng-switch on="line[header.key].type" class="wide middle" ng-class="header.customContentClass">' +
              '<div ng-switch-when="button"><span class="btn" href="#" ng-click="line[header.key].callback(line)" ng-class="line[header.key].classNames" ng-bind-html="getSafeValue(line[header.key].title)"></span></div>' +
              '<div ng-switch-when="link"><a href="#" onclick="return false;" ng-click="line[header.key].callback(line)" ng-class="line[header.key].classNames" ng-bind-html="getSafeValue(line[header.key].title)"></a></div>' +
              '<div ng-switch-default ng-bind-html="getSafeValue(header.format(line[header.key]))"></div>' +
            '</td>' +
          '</tr>' +
        '</tbody>' +
      '</table>' +
      '<div class="right pagination" ng-show="showPagination"><pagination total-items="(data | filteredBy:filter.filterKeys:filter.filterValue | filteredByRadio:radio.filterKeys:radio.filterValue).length || 1" items-per-page="pageSize" page="currentPage"></pagination></div>' +
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
      scope.radio = if exist scope.config.radio then scope.config.radio else {}

      # Update pagination variable
      if exist scope.config.pagination
        scope.showPagination = true
        scope.pageSize = scope.config.pagination.pageSize || 5
        scope.currentPage = scope.config.pagination.currentPage || 1
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

        # Process the header label
        if not exist header.label 
          header.processedLabel = ''
        else if (type header.label) is 'string'
          header.processedLabel = header.label
        else if (type header.label) is 'function'
          header.processedLabel = header.label()
        else
          header.processedLabel = ''

        # Define the header classes
        header.classNames = 'left'
        if exist header.sortable
          header.classNames += ' sortable-header'
        if exist header.customHeaderClass
          header.classNames += ' ' + header.customHeaderClass

      return


    # Handle a click on a header
    scope.headerClick = (header, index) ->
      if header.sortable
        scope.currentSort.reverse = scope.currentSort.headerIndex is index and not scope.currentSort.reverse
        scope.currentSort.headerIndex = index
        scope.currentSort.sortingKey = if exist(header.sortingKey) then header.sortingKey else header.key
        scope.currentPage = scope.config.pagination.currentPage || 1


    # Handle a click on a line
    scope.lineClick = (line) ->
      if exist scope.config.lineClick
        scope.config.lineClick line

    scope.getSafeValue = (value) ->
      return $sce.trustAsHtml value
]
