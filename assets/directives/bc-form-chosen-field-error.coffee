angular.module('bc.form-chosen-field-error', ['bc.base-form-field-error']).directive 'bcFormChosenFieldError', ['$timeout', 'baseBcFormFieldError', ($timeout, baseBcFormFieldError) ->
  # Form field error directive must be specified as an attribute on a parent
  #  container whose children include both the field name label and select/chosen element
  restrict: "A"
  require: "^form"
  scope: true
  link: (scope, element, attrs, formCtrl) ->
    # Tooltip target should display relative to the top level chosen element
    scope.getInputElement = -> element.find('#' + attrs.bcFormFieldId)
    scope.getTooltipTarget = -> element.find('#' + attrs.bcFormFieldId + '_chosen')

    scope.setFieldFocusHandler = ->
      $timeout ->
        element.find('#' + attrs.bcFormFieldId).chosen().on 'chosen:showing_dropdown', ->
          scope.$apply ->
            scope.clearErrorTooltip()

    baseBcFormFieldError.OnLink(scope, element, attrs, formCtrl)
]
