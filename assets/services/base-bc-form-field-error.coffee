angular.module('bc.base-form-field-error', []).service 'baseBcFormFieldError', ->
  OnLink: (scope, element, attrs, formCtrl) ->
    # Provide empty default functions for child classes to override
    scope.getInputElement or= ->
    scope.getTooltipTarget or= ->
    scope.setFieldFocusHandler or= ->
    scope.setFieldBlurHandler or= ->

    scope.errorTooltipSet = false
    scope.modelCtrl = formCtrl[attrs.bcFormFieldId]
    attrs.bcFormFieldErrorTooltipPlacement = attrs.bcFormFieldErrorTooltipPlacement or 'bottom'

    # Methods to set and unset server error after form submission
    scope.setServerError = (error) ->
      scope.bcServerError = error
      scope.modelCtrl.$setValidity 'server', false

    scope.clearServerError = ->
      delete scope.bcServerError
      scope.modelCtrl.$setValidity 'server', true

    # Listen for parent scope broadcasting any server errors when trying to submit
    #  Check for errors matching ID of this field element and update accordingly
    scope.$on 'formFieldServerError', (event, error) ->
      if error.errorFieldId is attrs.bcFormFieldId
        scope.setServerError error.toString()

    # Listen to custom errors coming from the scope
    scope.$on 'customFieldError', (event, error) ->
      if error.errorFieldId is attrs.bcFormFieldId
        scope.modelCtrl.$setValidity error.errorCode, !error.hasError

    # Automatically clear server errors when field value changes in view/model
    #  Return the given value to allow chain to continue executing successfully
    scope.onValueChange = (value) ->
      scope.clearServerError()
      value

    scope.modelCtrl.$parsers.push scope.onValueChange
    scope.modelCtrl.$formatters.push scope.onValueChange


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
        title: error.toString()
        placement: attrs.bcFormFieldErrorTooltipPlacement
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
      scope.updateActiveErrorState()
      scope.updateAllPassiveErrorState()

    scope.$on 'bcFormReset', (evt, formName) ->
      return unless formName is formCtrl.$name

      scope.bcFormSubmitAttempt = false
      scope.clearErrorTooltip()
      scope.clearErrorHighlight()

      scope.modelCtrl.$dirty = false
      scope.modelCtrl.$pristine = true

      inputElement = scope.getInputElement()
      inputElement.removeClass('ng-dirty').addClass('ng-pristine')

    # Set listener to remove any error tooltips when a field receives focus/blur
    scope.setFieldFocusHandler()
    scope.setFieldBlurHandler()

    # Utility method to check error states and decide what to display
    #  'Active' error should record any failure where the user actively
    #   enters invalid data, or the server validates and rejects a value
    scope.updateActiveErrorState = ->
      if scope.bcServerError
        scope.displayError scope.bcServerError
      else if scope.modelCtrl.$error['validOrderAmountNumber']
        displayName = attrs.bcFormFieldDisplayName or 'Order amount'
        scope.displayError displayName + ' must be a valid number'
      else if scope.modelCtrl.$error['bcDecimalError']
        scope.displayError 'Enter a valid number'
      else if scope.modelCtrl.$error['validAccountBalanceLimit']
        scope.displayError 'Amount exceeds your account balance'
      else if scope.modelCtrl.$error['singleTransactionLimitMax']
        scope.displayError 'Amount exceeds single transaction limit'
      else if scope.modelCtrl.$error['singleTransactionLimitMin']
        scope.displayError 'Amount is below transaction limit'
      else if scope.modelCtrl.$error['cumulativeTransactionLimitMax']
        scope.displayError 'Amount exceeds account transaction limit'
      else
        scope.clearErrorTooltip()
        scope.clearErrorHighlight()

    # 'Passive' error should record any failure where the default state is
    #  invalid and user must enter valid data - Only show errors on blur/submit
    scope.updateAllPassiveErrorState = ->
      scope.updateBlurPassiveErrorState()
      scope.updateSubmitPassiveErrorState()

    scope.updateBlurPassiveErrorState = ->
      if scope.modelCtrl.$error['email']
        scope.displayError 'Enter a valid Email address'
      else if scope.modelCtrl.$error['validPhoneNumber']
        scope.displayError 'Enter a valid phone number'
      else if scope.modelCtrl.$error['bitcoinAddress']
        scope.displayError 'Invalid Bitcoin address'

    scope.updateSubmitPassiveErrorState = ->
      if scope.modelCtrl.$error['required']
        displayName = attrs.bcFormFieldDisplayName or element.find('label').text()
        scope.displayError(displayName + " required")
      else if scope.modelCtrl.$error['passwordStrength']
        scope.displayError 'Choose a stronger password'
      else if scope.modelCtrl.$error['validOrderAmountPositive']
        displayName = attrs.bcFormFieldDisplayName or 'Order amount'
        scope.displayError displayName + ' must be positive'

    scope.onChangeEvent = ->
      scope.updateActiveErrorState()
      scope.$broadcast('bcFormErrorUpdate')

    # Use a watch on the controller model value to determine when to
    #  recompute state and add/remove error tooltip for an active error
    scope.$watch ->
      scope.modelCtrl.$modelValue
    , scope.onChangeEvent, true

    # Add watch on controller error state for any server error properties
    scope.$watch ->
      scope.modelCtrl.$error
    , scope.onChangeEvent, true
