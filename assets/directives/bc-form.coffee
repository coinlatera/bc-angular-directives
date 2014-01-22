angular.module('bc.form', ['bc.angular-models', 'bc.angular-notification']).directive 'bcForm', ['$parse', '$q', 'ErrorMessage', 'Notifications', 'NotificationsStore', ($parse, $q, ErrorMessage, Notifications, NotificationsStore) ->
  restrict: "A"
  require: "^form"
  link: (scope, formElement, attrs, formCtrl) ->
    formElement.addClass 'bc-form'

    submitButton = formElement.find('input[type=submit]')
    initialText = submitButton.val() or 'Submit'
    loadingMessage = attrs.bcFormLoadingMessage or "Loading..."
    submitButton.data('bc-form-submit-text', initialText)
    submitButton.data('bc-form-loading-text', loadingMessage)

    # Parse the set of functions for each event made available on current scope
    #  Success callback takes one argument called 'successResult' with result message
    #  Failure callback takes one argument called 'failedResult' with raw error message
    onSuccessFn = if attrs.bcFormOnSuccess then $parse attrs.bcFormOnSuccess else ->
    onFailureFn = if attrs.bcFormOnFailure then $parse attrs.bcFormOnFailure else ->

    # Submit callback takes no arguments and MUST return a promise to chain success/failure
    onSubmitFn = if attrs.bcFormOnSubmit then $parse attrs.bcFormOnSubmit else ->
      emptyDeferred = $q.defer()
      emptyDeferred.resolve({})
      emptyDeferred.promise

    formElement.bind 'submit', ->
      scope.$safeApply ->
        # Broadcast to all child scopes that form submission is happening
        scope.$broadcast('bcFormSubmit', formCtrl.$name)
        scope.$broadcast('bcFormErrorUpdate')

        if formCtrl.$invalid then return false

        setFormLoading()
        onSubmitFn(scope).then (successResult) ->
          if attrs.bcFormReset
            resetForm()

          # Call success handler and return result for any other callbacks
          unsetFormLoading()
          onSuccessFn(scope, successResult: successResult)
          successResult
        , (failureResult) ->
          # Parse error response and handle each unique error in the result
          #  Broadcast item failures out to all child form fields to display,
          #   or show a single prominent notification for some other issue
          unsetFormLoading()
          errorMessages = ErrorMessage.FromMessage(failureResult)
          angular.forEach errorMessages.errors, (error) ->
            if error.errorType is 'Field'
              scope.$broadcast('formFieldServerError', error)
            else
              Notifications.show NotificationsStore.server_notification error.toString()

          # Now call any failure callbacks and return result
          onFailureFn(scope, failureResult: failureResult)
          throw failureResult

    # Manually handle enable/disable submit button while form is loading
    #  Loading directive has timing issues and Bootstrap 'reset' overwrites disabled state
    #  Need to add/remove the disable attribute inside the Angular scope/apply context
    setFormLoading = ->
      submitButton = formElement.find('input[type=submit]')
      loadingMessage = submitButton.data('bc-form-loading-text')
      submitButton.val(loadingMessage).attr('disabled', true)

    unsetFormLoading = ->
      submitButton = formElement.find('input[type=submit]')
      previousText = submitButton.data('bc-form-submit-text')
      submitButton.val(previousText).attr('disabled', false)

    resetForm = ->
      formCtrl.$dirty = false
      formCtrl.$pristine = true
      scope.$broadcast('bcFormErrorUpdate')
      scope.$broadcast('bcFormReset', formCtrl.$name)
      formElement.removeClass('ng-dirty').addClass('ng-pristine')

    formCtrl.bcResetForm = resetForm
]

