angular.module('ng.restrict', []).directive 'ngRestrict', ['$parse', ($parse) ->
    restrict: 'A'
    require: 'ngModel'
    link: (scope, iElement, iAttrs, controller) ->
      scope.$watch iAttrs.ngModel, (value = '') ->
        try
          regexs = eval iAttrs.ngRestrict
        catch
          regexs = iAttrs.ngRestrict

        if (exist regexs) and (exist value)
          if type regexs is 'string'
            regexs = [regexs]
          if type regexs is 'array'
            for regex in regexs
              if type regex is 'string'
                $parse(iAttrs.ngModel).assign scope, value.toString().replace(new RegExp(regex, "g"), "").replace(/\s+/g, "-")
  ]
