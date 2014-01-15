angular.module('filtered-by-radio', ['filtered-by']).filter 'filteredByRadio', ($filter) ->
  (data, keys, value) ->
    return data if value is 'all'
    return $filter('filteredBy')(data, keys, value)

