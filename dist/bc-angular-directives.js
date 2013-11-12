(function() {
  angular.module('bc.angular-directives', ['bc.table', 'bc.chosen']);

}).call(this);

(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  angular.module('bc.chosen', []).directive('chosen', [
    '$timeout', function($timeout) {
      var CHOSEN_OPTION_WHITELIST, NG_OPTIONS_REGEXP, chosen, isEmpty, snakeCase;
      NG_OPTIONS_REGEXP = /^\s*(.*?)(?:\s+as\s+(.*?))?(?:\s+group\s+by\s+(.*))?\s+for\s+(?:([\$\w][\$\w\d]*)|(?:\(\s*([\$\w][\$\w\d]*)\s*,\s*([\$\w][\$\w\d]*)\s*\)))\s+in\s+(.*)$/;
      CHOSEN_OPTION_WHITELIST = ['noResultsText', 'allowSingleDeselect', 'disableSearchThreshold', 'disableSearch', 'enableSplitWordSearch', 'inheritSelectClasses', 'maxSelectedOptions', 'placeholderTextMultiple', 'placeholderTextSingle', 'searchContains', 'singleBackstrokeDelete', 'displayDisabledOptions', 'displaySelectedOptions', 'width'];
      snakeCase = function(input) {
        return input.replace(/[A-Z]/g, function($1) {
          return "_" + ($1.toLowerCase());
        });
      };
      isEmpty = function(value) {
        var key, _i, _len;
        if (angular.isArray(value)) {
          return value.length === 0;
        } else if (angular.isObject(value)) {
          for (_i = 0, _len = value.length; _i < _len; _i++) {
            key = value[_i];
            if (value.hasOwnProperty(key)) {
              return false;
            }
          }
        }
        return true;
      };
      return chosen = {
        restrict: 'A',
        require: '?ngModel',
        terminal: true,
        link: function(scope, element, attr, ctrl) {
          var disableWithMessage, match, options, origRender, startLoading, stopLoading, valuesExpr, viewWatch;
          options = scope.$eval(attr.chosen) || {};
          angular.forEach(attr, function(value, key) {
            if (__indexOf.call(CHOSEN_OPTION_WHITELIST, key) >= 0) {
              return options[snakeCase(key)] = scope.$eval(value);
            }
          });
          startLoading = function() {
            return element.addClass('loading').attr('disabled', true).trigger('chosen:updated');
          };
          stopLoading = function() {
            return element.removeClass('loading').attr('disabled', false).trigger('chosen:updated');
          };
          disableWithMessage = function(message) {
            return element.empty().append("<option selected>" + message + "</option>").attr('disabled', true).trigger('chosen:updated');
          };
          $timeout(function() {
            return element.chosen(options);
          });
          if (ctrl) {
            origRender = ctrl.$render;
            ctrl.$render = function() {
              origRender();
              return element.trigger('chosen:updated');
            };
            if (attr.multiple) {
              viewWatch = function() {
                return ctrl.$viewValue;
              };
              scope.$watch(viewWatch, ctrl.$render, true);
            }
          }
          if (attr.ngOptions) {
            match = attr.ngOptions.match(NG_OPTIONS_REGEXP);
            valuesExpr = match[7];
            if (angular.isUndefined(scope.$eval(valuesExpr))) {
              startLoading();
            }
            return scope.$watch(valuesExpr, function(newVal, oldVal) {
              if (newVal !== oldVal) {
                stopLoading();
                if (isEmpty(newVal)) {
                  return disableWithMessage(options.no_results_text || 'No values available');
                }
              }
            });
          }
        }
      };
    }
  ]);

}).call(this);

(function() {
  angular.module('bc.table', ['start-at', 'filtered-by']).directive('bcTable', function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        tableConfig: '=',
        headerModel: '=',
        tableModel: '='
      },
      template: '<div>' + '<table ng-class="config.tableClass">' + '<thead>' + '<tr>' + '<th ng-repeat="header in headers" ng-style="{width: header.width}" ng-class="header.classNames" ng-click="headerClick(header, $index)">' + '{{header.label}}' + '<span ng-show="header.sortable">' + '<span ng-switch on="currentSort.headerIndex - $index">' + '<span ng-switch-when="0">' + '<i ng-show="currentSort.reverse" class="icon icon-caret-up"></i>' + '<i ng-hide="currentSort.reverse" class="icon icon-caret-down"></i>' + '</span>' + '<span ng-switch-default><i class="icon icon-sort"></i></span>' + '</span>' + '</span>' + '</th>' + '</tr>' + '</thead>' + '<tbody>' + '<tr ng-repeat="line in data | filteredBy:filter.filterKeys:filter.filterValue | orderBy:currentSort.sortingKey:currentSort.reverse | startAt:(currentPage - 1) * pageSize | limitTo:pageSize" ng-click="lineClick(line)" ng-class="{\'clickable-row\': config.lineClick}">' + '<td ng-repeat="header in headers" ng-switch on="line[header.key].type" class="wide middle">' + '<div ng-switch-when="button"><span class="btn" href="#" ng-click="line[header.key].callback(line)" ng-class="line[header.key].classNames" ng-bind-html-unsafe="line[header.key].title"></span></div>' + '<div ng-switch-default ng-bind-html-unsafe="header.format(line[header.key])"></div>' + '</td>' + '</tr>' + '</tbody>' + '</table>' + '<div class="right" ng-show="showPagination"><pagination total-items="(data | filteredBy:filter.filterKeys:filter.filterValue).length || 1" items-per-page="pageSize" page="currentPage"></pagination></div>' + '</div>',
      link: function(scope, element, attrs) {
        var modelChanged;
        scope.currentSort = {
          headerIndex: -1,
          sortingKey: '',
          reverse: false
        };
        scope.$watch('tableConfig', function() {
          return modelChanged();
        }, true);
        scope.$watch('headerModel', function() {
          return modelChanged();
        }, true);
        scope.$watch('tableModel', function() {
          return modelChanged();
        }, true);
        modelChanged = function() {
          var header, _i, _len, _ref;
          scope.headers = scope.headerModel;
          scope.data = scope.tableModel;
          scope.config = scope.tableConfig;
          scope.filter = exist(scope.config.filter) ? scope.config.filter : {};
          if (exist(scope.config.pagination)) {
            scope.showPagination = true;
            scope.pageSize = scope.config.pagination.pageSize;
            scope.currentPage = scope.config.pagination.currentPage;
          } else {
            scope.showPagination = false;
            scope.pageSize = scope.data.length;
            scope.currentPage = 1;
          }
          _ref = scope.headers;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            header = _ref[_i];
            if (!(exist(header.format) && (type(header.format)) === 'function')) {
              header.format = function(value) {
                return value;
              };
              continue;
            }
            header.classNames = 'left';
            if (exist(header.sortable)) {
              header.classNames += ' sortable-header';
            }
            if (exist(header.customClass)) {
              header.classNames += ' ' + header.customClass;
            }
          }
        };
        scope.headerClick = function(header, index) {
          if (header.sortable) {
            scope.currentSort.reverse = scope.currentSort.headerIndex === index && !scope.currentSort.reverse;
            scope.currentSort.headerIndex = index;
            return scope.currentSort.sortingKey = header.key;
          }
        };
        return scope.lineClick = function(line) {
          if (exist(scope.config.lineClick)) {
            return scope.config.lineClick(line);
          }
        };
      }
    };
  });

}).call(this);

(function() {
  angular.module('filtered-by', []).filter('filteredBy', function() {
    return function(data, keys, value) {
      var filtered, key, obj, _i, _j, _len, _len1;
      if (!exist(keys) || keys.length === 0 || !exist(value) || !(type(value === 'string')) || value === '') {
        return data;
      }
      filtered = [];
      for (_i = 0, _len = data.length; _i < _len; _i++) {
        obj = data[_i];
        for (_j = 0, _len1 = keys.length; _j < _len1; _j++) {
          key = keys[_j];
          if (!(!exist(obj[key].indexOf) || !exist(obj[key].toLowerCase()) || obj[key].toLowerCase().indexOf(value.toLowerCase()) === -1)) {
            filtered.push(obj);
            break;
          }
        }
      }
      return filtered;
    };
  });

}).call(this);

(function() {
  angular.module('start-at', []).filter('startAt', function() {
    return function(data, index) {
      if (!exist(data)) {
        return data;
      }
      return data.slice(index, data.length);
    };
  });

}).call(this);
