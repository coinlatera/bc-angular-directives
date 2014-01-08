(function() {
  angular.module('bc.angular-directives', ['bc.form', 'bc.base-form-field-error', 'bc.form-text-field-error', 'bc.form-chosen-field-error', 'bc.form-date-of-birth-field-error', 'bc.form-hidden-field-error', 'bc.table', 'bc.chosen', 'bc.switch']);

}).call(this);

(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  angular.module('bc.chosen', []).directive('chosen', [
    '$timeout', '$compile', function($timeout, $compile) {
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
            $compile(element)(scope);
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
              if (attr.required && typeof scope.$eval(attr.ngModel) === 'object') {
                ctrl.$setValidity('required', !!Object.keys(scope.$eval(attr.ngModel)).length);
              }
              origRender();
              return element.trigger('chosen:updated');
            };
            if (attr.multiple || typeof scope.$eval(attr.ngModel) === 'object') {
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
              }
              if (!newVal || isEmpty(newVal)) {
                return disableWithMessage(options.no_results_text || 'No values available');
              }
            });
          }
        }
      };
    }
  ]);

}).call(this);

(function() {
  angular.module('bc.form-chosen-field-error', ['bc.base-form-field-error']).directive('bcFormChosenFieldError', [
    '$timeout', 'baseBcFormFieldError', function($timeout, baseBcFormFieldError) {
      return {
        restrict: "A",
        require: "^form",
        scope: true,
        link: function(scope, element, attrs, formCtrl) {
          scope.getInputElement = function() {
            return element.find('#' + attrs.bcFormFieldId);
          };
          scope.getTooltipTarget = function() {
            return element.find('#' + attrs.bcFormFieldId + '_chosen');
          };
          scope.setFieldFocusHandler = function() {
            return $timeout(function() {
              return element.find('#' + attrs.bcFormFieldId).chosen().on('chosen:showing_dropdown', function() {
                return scope.$apply(function() {
                  return scope.clearErrorTooltip();
                });
              });
            });
          };
          return baseBcFormFieldError.OnLink(scope, element, attrs, formCtrl);
        }
      };
    }
  ]);

}).call(this);

(function() {
  angular.module('bc.form-date-of-birth-field-error', []).directive('bcFormDateOfBirthFieldError', [
    '$timeout', function($timeout) {
      return {
        restrict: "A",
        require: "^form",
        scope: true,
        link: function(scope, element, attrs, formCtrl) {
          scope.subFields = ['month', 'day', 'year'];
          scope.subFieldElement = function(subField) {
            return element.find('#' + attrs.bcFormFieldId + '_' + subField);
          };
          scope.subFieldChosenElement = function(subField) {
            return element.find('#' + attrs.bcFormFieldId + '_' + subField + '_chosen');
          };
          scope.modelCtrls = {};
          angular.forEach(scope.subFields, function(subField) {
            return scope.modelCtrls[subField] = formCtrl[attrs.bcFormFieldId + '_' + subField];
          });
          scope.errorTooltipSet = false;
          scope.getTooltipTarget = function() {
            return scope.subFieldChosenElement('day');
          };
          scope.displayErrorHighlight = function() {
            if (!element.hasClass('bc-form-error')) {
              return element.addClass('bc-form-error');
            }
          };
          scope.clearErrorHighlight = function() {
            return element.removeClass('bc-form-error');
          };
          scope.displayErrorTooltip = function(error) {
            var targetElement;
            scope.clearErrorTooltip();
            scope.errorTooltipSet = true;
            targetElement = scope.getTooltipTarget();
            targetElement.tooltip({
              trigger: 'manual',
              placement: 'bottom',
              title: error.toString()
            });
            return targetElement.tooltip('show');
          };
          scope.clearErrorTooltip = function() {
            if (scope.errorTooltipSet) {
              scope.errorTooltipSet = false;
              return scope.getTooltipTarget().tooltip('destroy');
            }
          };
          scope.displayError = function(error) {
            scope.displayErrorHighlight();
            return scope.displayErrorTooltip(error);
          };
          scope.$on('bcFormSubmit', function(evt, formName) {
            if (formName !== formCtrl.$name) {
              return;
            }
            scope.bcFormSubmitAttempt = true;
            return scope.updateVisibleErrorState();
          });
          scope.$on('bcFormReset', function(evt, formName) {
            if (formName !== formCtrl.$name) {
              return;
            }
            scope.bcFormSubmitAttempt = false;
            scope.clearErrorTooltip();
            scope.clearErrorHighlight();
            return angular.forEach(scope.subFields, function(subField) {
              scope.modelCtrls[subField].$dirty = false;
              scope.modelCtrls[subField].$pristine = true;
              return scope.subFieldElement(subField).removeClass('ng-dirty').addClass('ng-pristine');
            });
          });
          $timeout(function() {
            return angular.forEach(scope.subFields, function(subField) {
              return scope.subFieldElement(subField).chosen().on('chosen:showing_dropdown', function() {
                return scope.$apply(function() {
                  return scope.clearErrorTooltip();
                });
              });
            });
          });
          scope.hasClientFieldErrors = function() {
            return _.reduce(scope.subFields, function(result, subField) {
              return scope.modelCtrls[subField].$error['required'] || result;
            }, false);
          };
          scope.updateVisibleErrorState = function() {
            if (scope.hasClientFieldErrors()) {
              return scope.displayError("Date Of Birth required");
            } else {
              scope.clearErrorTooltip();
              return scope.clearErrorHighlight();
            }
          };
          scope.shouldDisplayError = function(subField) {
            return scope.bcFormSubmitAttempt || scope.isFieldComplete();
          };
          scope.isFieldComplete = function() {
            return _.reduce(scope.subFields, function(result, subField) {
              return result && scope.modelCtrls[subField].$dirty;
            }, true);
          };
          return angular.forEach(scope.subFields, function(subField) {
            var subFieldName;
            subFieldName = subField;
            return scope.$watch(function() {
              return scope.modelCtrls[subFieldName].$error;
            }, function() {
              if (scope.shouldDisplayError(subFieldName)) {
                return scope.updateVisibleErrorState(subFieldName);
              }
            }, true);
          });
        }
      };
    }
  ]);

}).call(this);

(function() {
  angular.module('bc.form-hidden-field-error', ['bc.base-form-field-error']).directive('bcFormHiddenFieldError', [
    'baseBcFormFieldError', function(baseBcFormFieldError) {
      return {
        restrict: "A",
        require: "^form",
        scope: true,
        link: function(scope, element, attrs, formCtrl) {
          scope.getInputElement = function() {
            return element.find('#' + attrs.bcFormFieldId);
          };
          scope.getTooltipTarget = function() {
            return element;
          };
          scope.setFieldFocusHandler = function() {};
          scope.setFieldBlurHandler = function() {};
          return baseBcFormFieldError.OnLink(scope, element, attrs, formCtrl);
        }
      };
    }
  ]);

}).call(this);

(function() {
  angular.module('bc.form-text-field-error', ['bc.base-form-field-error', 'SafeApply']).directive('bcFormTextFieldError', [
    'baseBcFormFieldError', function(baseBcFormFieldError) {
      return {
        restrict: "A",
        require: "^form",
        scope: true,
        link: function(scope, element, attrs, formCtrl) {
          scope.getInputElement = function() {
            return element.find('#' + attrs.bcFormFieldId);
          };
          scope.getTooltipTarget = function() {
            return element.find('#' + attrs.bcFormFieldId);
          };
          scope.setFieldFocusHandler = function() {
            return scope.getTooltipTarget().focus(function() {
              return scope.$safeApply(function() {
                return scope.clearErrorTooltip();
              });
            });
          };
          scope.setFieldBlurHandler = function() {
            return scope.getTooltipTarget().blur(function() {
              return scope.$safeApply(function() {
                return scope.updateBlurPassiveErrorState();
              });
            });
          };
          return baseBcFormFieldError.OnLink(scope, element, attrs, formCtrl);
        }
      };
    }
  ]);

}).call(this);

(function() {
  angular.module('bc.form', ['bc.angular-models', 'bc.angular-notification']).directive('bcForm', [
    '$parse', '$q', 'ErrorMessage', 'Notifications', 'NotificationsStore', function($parse, $q, ErrorMessage, Notifications, NotificationsStore) {
      return {
        restrict: "A",
        require: "^form",
        link: function(scope, formElement, attrs, formCtrl) {
          var initialText, loadingMessage, onFailureFn, onSubmitFn, onSuccessFn, resetForm, setFormLoading, submitButton, unsetFormLoading;
          formElement.addClass('bc-form');
          submitButton = formElement.find('input[type=submit]');
          initialText = submitButton.val() || 'Submit';
          loadingMessage = attrs.bcFormLoadingMessage || "Loading...";
          submitButton.data('bc-form-submit-text', initialText);
          submitButton.data('bc-form-loading-text', loadingMessage);
          onSuccessFn = attrs.bcFormOnSuccess ? $parse(attrs.bcFormOnSuccess) : function() {};
          onFailureFn = attrs.bcFormOnFailure ? $parse(attrs.bcFormOnFailure) : function() {};
          onSubmitFn = attrs.bcFormOnSubmit ? $parse(attrs.bcFormOnSubmit) : function() {
            var emptyDeferred;
            emptyDeferred = $q.defer();
            emptyDeferred.resolve({});
            return emptyDeferred.promise;
          };
          formElement.bind('submit', function() {
            return scope.$apply(function() {
              scope.$broadcast('bcFormSubmit', formCtrl.$name);
              scope.$broadcast('bcFormErrorUpdate');
              if (formCtrl.$invalid) {
                return false;
              }
              setFormLoading();
              return onSubmitFn(scope).then(function(successResult) {
                if (attrs.bcFormReset) {
                  resetForm();
                }
                unsetFormLoading();
                onSuccessFn(scope, {
                  successResult: successResult
                });
                return successResult;
              }, function(failureResult) {
                var errorMessages;
                unsetFormLoading();
                errorMessages = ErrorMessage.FromMessage(failureResult);
                angular.forEach(errorMessages.errors, function(error) {
                  if (error.errorType === 'Field') {
                    return scope.$broadcast('formFieldServerError', error);
                  } else {
                    return Notifications.show(NotificationsStore.getNotification('error', error.toString(), '', 'active', false));
                  }
                });
                onFailureFn(scope, {
                  failureResult: failureResult
                });
                throw failureResult;
              });
            });
          });
          setFormLoading = function() {
            submitButton = formElement.find('input[type=submit]');
            loadingMessage = submitButton.data('bc-form-loading-text');
            return submitButton.val(loadingMessage).attr('disabled', true);
          };
          unsetFormLoading = function() {
            var previousText;
            submitButton = formElement.find('input[type=submit]');
            previousText = submitButton.data('bc-form-submit-text');
            return submitButton.val(previousText).attr('disabled', false);
          };
          resetForm = function() {
            formCtrl.$dirty = false;
            formCtrl.$pristine = true;
            scope.$broadcast('bcFormErrorUpdate');
            scope.$broadcast('bcFormReset', formCtrl.$name);
            return formElement.removeClass('ng-dirty').addClass('ng-pristine');
          };
          return formCtrl.bcResetForm = resetForm;
        }
      };
    }
  ]);

}).call(this);

(function() {
  angular.module('bc.switch', []).directive('bcSwitch', [
    '$timeout', function($timeout) {
      return {
        restrict: 'A',
        scope: {
          ngModel: '='
        },
        link: function(scope, element, attrs) {
          var activeClass;
          activeClass = scope.ngModel ? 'active' : '';
          $(element).wrap('<div class="switch ' + activeClass + '" data-animated="false" />').parent().bootstrapSwitch();
          $(element).parents('.switch').bootstrapSwitch('setState', scope.ngModel);
          $(element).parents('.switch').on('switch-change', function(e, data) {
            $(element).parents('.has-switch').toggleClass('active', data.value);
            scope.ngModel = data.value;
            return scope.$apply();
          });
          return scope.$watch('ngModel', function(newValue) {
            if (exist(newValue)) {
              return $timeout(function() {
                return $(element).parents('.switch').bootstrapSwitch('setState', newValue);
              });
            }
          });
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
      template: '<div>' + '<table ng-class="config.tableClass">' + '<thead>' + '<tr>' + '<th ng-repeat="header in headers" ng-style="{width: header.width}" ng-class="header.classNames" ng-click="headerClick(header, $index)">' + '{{header.processedLabel}}' + '<span ng-show="header.sortable">' + '<span ng-switch on="currentSort.headerIndex - $index">' + '<span ng-switch-when="0">' + '<i ng-show="currentSort.reverse" class="icon icon-caret-up"></i>' + '<i ng-hide="currentSort.reverse" class="icon icon-caret-down"></i>' + '</span>' + '<span ng-switch-default><i class="icon icon-sort"></i></span>' + '</span>' + '</span>' + '</th>' + '</tr>' + '</thead>' + '<tbody>' + '<tr ng-repeat="line in data | filteredBy:filter.filterKeys:filter.filterValue | orderBy:currentSort.sortingKey:currentSort.reverse | startAt:(currentPage - 1) * pageSize | limitTo:pageSize" ng-click="lineClick(line)" ng-class="{\'clickable-row\': config.lineClick}">' + '<td ng-repeat="header in headers" ng-switch on="line[header.key].type" class="wide middle">' + '<div ng-switch-when="button"><span class="btn" href="#" ng-click="line[header.key].callback(line)" ng-class="line[header.key].classNames" ng-bind-html-unsafe="line[header.key].title"></span></div>' + '<div ng-switch-when="link"><a href="#" onclick="return false;" ng-click="line[header.key].callback(line)" ng-class="line[header.key].classNames" ng-bind-html-unsafe="line[header.key].title"></a></div>' + '<div ng-switch-default ng-bind-html-unsafe="header.format(line[header.key])"></div>' + '</td>' + '</tr>' + '</tbody>' + '</table>' + '<div class="right pagination" ng-show="showPagination"><pagination total-items="(data | filteredBy:filter.filterKeys:filter.filterValue).length || 1" items-per-page="pageSize" page="currentPage"></pagination></div>' + '</div>',
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
            if (!exist(header.label)) {
              header.processedLabel = '';
            } else if ((type(header.label)) === 'string') {
              header.processedLabel = header.label;
            } else if ((type(header.label)) === 'function') {
              header.processedLabel = header.label();
            } else {
              header.processedLabel = '';
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
            return scope.currentSort.sortingKey = exist(header.sortingKey) ? header.sortingKey : header.key;
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

(function() {
  angular.module('bc.base-form-field-error', []).service('baseBcFormFieldError', function() {
    return {
      OnLink: function(scope, element, attrs, formCtrl) {
        scope.getInputElement || (scope.getInputElement = function() {});
        scope.getTooltipTarget || (scope.getTooltipTarget = function() {});
        scope.setFieldFocusHandler || (scope.setFieldFocusHandler = function() {});
        scope.setFieldBlurHandler || (scope.setFieldBlurHandler = function() {});
        scope.errorTooltipSet = false;
        scope.modelCtrl = formCtrl[attrs.bcFormFieldId];
        attrs.bcFormFieldErrorTooltipPlacement = attrs.bcFormFieldErrorTooltipPlacement || 'bottom';
        scope.setServerError = function(error) {
          scope.bcServerError = error;
          return scope.modelCtrl.$setValidity('server', false);
        };
        scope.clearServerError = function() {
          delete scope.bcServerError;
          return scope.modelCtrl.$setValidity('server', true);
        };
        scope.$on('formFieldServerError', function(event, error) {
          if (error.errorFieldId === attrs.bcFormFieldId) {
            return scope.setServerError(error.toString());
          }
        });
        scope.$on('customFieldError', function(event, error) {
          if (error.errorFieldId === attrs.bcFormFieldId) {
            return scope.modelCtrl.$setValidity(error.errorCode, !error.hasError);
          }
        });
        scope.onValueChange = function(value) {
          scope.clearServerError();
          return value;
        };
        scope.modelCtrl.$parsers.push(scope.onValueChange);
        scope.modelCtrl.$formatters.push(scope.onValueChange);
        scope.displayErrorHighlight = function() {
          if (!element.hasClass('bc-form-error')) {
            return element.addClass('bc-form-error');
          }
        };
        scope.clearErrorHighlight = function() {
          return element.removeClass('bc-form-error');
        };
        scope.displayErrorTooltip = function(error) {
          var targetElement;
          scope.clearErrorTooltip();
          scope.errorTooltipSet = true;
          targetElement = scope.getTooltipTarget();
          targetElement.tooltip({
            trigger: 'manual',
            title: error.toString(),
            placement: attrs.bcFormFieldErrorTooltipPlacement
          });
          return targetElement.tooltip('show');
        };
        scope.clearErrorTooltip = function() {
          if (scope.errorTooltipSet) {
            scope.errorTooltipSet = false;
            return scope.getTooltipTarget().tooltip('destroy');
          }
        };
        scope.displayError = function(error) {
          scope.displayErrorHighlight();
          return scope.displayErrorTooltip(error);
        };
        scope.$on('bcFormSubmit', function(evt, formName) {
          if (formName !== formCtrl.$name) {
            return;
          }
          scope.bcFormSubmitAttempt = true;
          scope.updateActiveErrorState();
          return scope.updateAllPassiveErrorState();
        });
        scope.$on('bcFormReset', function(evt, formName) {
          var inputElement;
          if (formName !== formCtrl.$name) {
            return;
          }
          scope.bcFormSubmitAttempt = false;
          scope.clearErrorTooltip();
          scope.clearErrorHighlight();
          scope.modelCtrl.$dirty = false;
          scope.modelCtrl.$pristine = true;
          inputElement = scope.getInputElement();
          return inputElement.removeClass('ng-dirty').addClass('ng-pristine');
        });
        scope.setFieldFocusHandler();
        scope.setFieldBlurHandler();
        scope.updateActiveErrorState = function() {
          var displayName;
          if (scope.bcServerError) {
            return scope.displayError(scope.bcServerError);
          } else if (scope.modelCtrl.$error['validOrderAmountNumber']) {
            displayName = attrs.bcFormFieldDisplayName || 'Order amount';
            return scope.displayError(displayName + ' must be a valid number');
          } else if (scope.modelCtrl.$error['bcDecimalError']) {
            return scope.displayError('Enter a valid number');
          } else if (scope.modelCtrl.$error['validAccountBalanceLimit']) {
            return scope.displayError('Amount exceeds your account balance');
          } else if (scope.modelCtrl.$error['withdrawalLimit']) {
            return scope.displayError('Amount exceeds your withdrawal limit');
          } else if (scope.modelCtrl.$error['withdrawalLimitMax']) {
            return scope.displayError('Amount exceeds your withdrawal limit');
          } else if (scope.modelCtrl.$error['withdrawalLimitMin']) {
            return scope.displayError('Amount is below your withdrawal limit');
          } else {
            scope.clearErrorTooltip();
            return scope.clearErrorHighlight();
          }
        };
        scope.updateAllPassiveErrorState = function() {
          scope.updateBlurPassiveErrorState();
          return scope.updateSubmitPassiveErrorState();
        };
        scope.updateBlurPassiveErrorState = function() {
          if (scope.modelCtrl.$error['email']) {
            return scope.displayError('Enter a valid Email address');
          } else if (scope.modelCtrl.$error['validPhoneNumber']) {
            return scope.displayError('Enter a valid phone number');
          }
        };
        scope.updateSubmitPassiveErrorState = function() {
          var displayName;
          if (scope.modelCtrl.$error['required']) {
            displayName = attrs.bcFormFieldDisplayName || element.find('label').text();
            return scope.displayError(displayName + " required");
          } else if (scope.modelCtrl.$error['passwordStrength']) {
            return scope.displayError('Choose a stronger password');
          } else if (scope.modelCtrl.$error['validOrderAmountPositive']) {
            displayName = attrs.bcFormFieldDisplayName || 'Order amount';
            return scope.displayError(displayName + ' must be positive');
          }
        };
        scope.onChangeEvent = function() {
          scope.updateActiveErrorState();
          return scope.$broadcast('bcFormErrorUpdate');
        };
        scope.$watch(function() {
          return scope.modelCtrl.$modelValue;
        }, scope.onChangeEvent, true);
        return scope.$watch(function() {
          return scope.modelCtrl.$error;
        }, scope.onChangeEvent, true);
      }
    };
  });

}).call(this);
