angular.module('bc.form-hidden-field-error', ['bc.base-form-field-error']).directive 'bcFormHiddenFieldError', ['baseBcFormFieldError', (baseBcFormFieldError) ->
  # Form field error directive must be specified as an attribute on a parent
  #  container whose children include both the field name label and hidden input element
  restrict: "A"
  require: "^form"
  scope: true
  link: (scope, element, attrs, formCtrl) ->
    scope.getInputElement = -> element.find('#' + attrs.bcFormFieldId)
    scope.getTooltipTarget = -> element

    scope.setFieldFocusHandler = ->
    scope.setFieldBlurHandler = ->

    baseBcFormFieldError.OnLink(scope, element, attrs, formCtrl)
]
