angular.module('bc.switch', []).directive 'bcSwitch', ['$timeout', ($timeout) ->
  restrict: 'A'
  scope:
    ngModel: '='
            
  link: (scope, element, attrs) ->
    # Wrap input w/ switch divs for setup and set state because ng-checked fires too soon
    activeClass = if scope.ngModel then 'active' else ''
    $(element).wrap('<div class="switch '+activeClass+'" data-animated="false" />').parent().bootstrapSwitch()
    $(element).parents('.switch').bootstrapSwitch('setState', scope.ngModel)

    # On change, update checkbox ngModel
    $(element).parents('.switch').on 'switch-change', (e, data) ->
      $(element).parents('.has-switch').toggleClass('active', data.value)
      scope.ngModel = data.value
      scope.$apply()

    # Watch ngModel changes
    scope.$watch 'ngModel', (newValue) ->
      if exist(newValue)
        $timeout ->
          $(element).parents('.switch').bootstrapSwitch('setState', newValue)
]
