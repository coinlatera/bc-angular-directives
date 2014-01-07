angular.module('bc.form-date-of-birth-field-error', []).directive 'bcFormDateOfBirthFieldError', ['$timeout', ($timeout) ->
  restrict: "A"
  require: "^form"
  scope :true
  link: (scope, element, attrs, formCtrl) ->
    scope.subFields = ['month', 'day', 'year']

    scope.subFieldElement = (subField) ->
      element.find('#' + attrs.bcFormFieldId + '_' + subField)
    scope.subFieldChosenElement = (subField) ->
      element.find('#' + attrs.bcFormFieldId + '_' + subField + '_chosen')

    scope.modelCtrls = {}
    angular.forEach scope.subFields, (subField) ->
      scope.modelCtrls[subField] = formCtrl[attrs.bcFormFieldId + '_' + subField]

    scope.errorTooltipSet = false
    scope.getTooltipTarget = -> scope.subFieldChosenElement 'day'

    # Methods to set and unset red CSS error highlighting color
    scope.displayErrorHighlight = ->
      element.addClass('bc-form-error') unless element.hasClass('bc-form-error')

    scope.clearErrorHighlight = -> element.removeClass('bc-form-error')


    # Methods to set and unset error tooltip and associated state
    scope.displayErrorTooltip = (error) ->
      scope.clearErrorTooltip()

      scope.errorTooltipSet = true
      targetElement = scope.getTooltipTarget()
      targetElement.tooltip
        trigger: 'manual'
        placement: 'bottom'
        title: error.toString()
      targetElement.tooltip 'show'

    scope.clearErrorTooltip = ->
      if scope.errorTooltipSet
        scope.errorTooltipSet = false
        scope.getTooltipTarget().tooltip 'destroy'

    # Displaying field error should both highlight field and display tooltip
    scope.displayError = (error) ->
      scope.displayErrorHighlight()
      scope.displayErrorTooltip(error)

    # Set listener to display any errors when form submit occurs
    scope.$on 'bcFormSubmit', (evt, formName) ->
      return unless formName is formCtrl.$name

      scope.bcFormSubmitAttempt = true
      scope.updateVisibleErrorState()

    scope.$on 'bcFormReset', (evt, formName) ->
      return unless formName is formCtrl.$name

      scope.bcFormSubmitAttempt = false
      scope.clearErrorTooltip()
      scope.clearErrorHighlight()

      angular.forEach scope.subFields, (subField) ->
        scope.modelCtrls[subField].$dirty = false
        scope.modelCtrls[subField].$pristine = true
        scope.subFieldElement(subField).removeClass('ng-dirty').addClass('ng-pristine')


    # Set listener to remove any error tooltips when a field receives focus
    $timeout ->
      angular.forEach scope.subFields, (subField) ->
        scope.subFieldElement(subField).chosen().on 'chosen:showing_dropdown', ->
          scope.$apply ->
            scope.clearErrorTooltip()

    # Check whether any date subfields are in current error state
    scope.hasClientFieldErrors = ->
      _.reduce scope.subFields, (result, subField) ->
        scope.modelCtrls[subField].$error['required'] or result
      , false

    # Utility method to check error states and decide what to display
    scope.updateVisibleErrorState = () ->
      if scope.hasClientFieldErrors()
        scope.displayError "Date Of Birth required"
      else
        scope.clearErrorTooltip()
        scope.clearErrorHighlight()

    # Only show errors in UI after all subFields are modified or form submit attempted
    scope.shouldDisplayError = (subField) ->
      scope.bcFormSubmitAttempt or scope.isFieldComplete()

    scope.isFieldComplete = ->
      _.reduce scope.subFields, (result, subField) ->
        result and scope.modelCtrls[subField].$dirty
      , true

    # Use a watch on the controller error object to determine when a new error
    #  has been added/removed and we need to render a tooltip with error help
    angular.forEach scope.subFields, (subField) ->
      subFieldName = subField
      scope.$watch ->
        scope.modelCtrls[subFieldName].$error
      , ->
        if scope.shouldDisplayError(subFieldName)
          scope.updateVisibleErrorState(subFieldName)
      , true
]
