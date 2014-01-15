# Allows filtering based on radio values that *exactly* match the value of the target key value
angular.module('filtered-by-radio', []).filter 'filteredByRadio', ->
  (data, keys, value) ->

    if not exist(keys) or keys.length is 0 or not exist(value) or not (type value is 'string') or value is '_radio_all_'
      return data

    filtered = []
    for obj in data
      for key in keys
        if obj[key] is value
          filtered.push obj
          break

    return filtered
