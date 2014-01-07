angular.module('bc.form-text-field-error', ['bc.base-form-field-error', 'SafeApply']).directive 'bcFormTextFieldError', ['baseBcFormFieldError', (baseBcFormFieldError) ->
  # Form field error directive must be specified as an attribute on a parent
  #  container whose children include both the field name label and text input element
  restrict: "A"
  require: "^form"
  scope: true
  link: (scope, element, attrs, formCtrl) ->
    scope.getInputElement = -> element.find('#' + attrs.bcFormFieldId)
    scope.getTooltipTarget = -> element.find('#' + attrs.bcFormFieldId)

    scope.setFieldFocusHandler = ->
      scope.getTooltipTarget().focus ->
        scope.$safeApply ->
          scope.clearErrorTooltip()

    scope.setFieldBlurHandler = ->
      scope.getTooltipTarget().blur ->
        scope.$safeApply ->
          scope.updateBlurPassiveErrorState()

    baseBcFormFieldError.OnLink(scope, element, attrs, formCtrl)
]
