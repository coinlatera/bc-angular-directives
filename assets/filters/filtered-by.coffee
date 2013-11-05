angular.module('filtered-by', []).filter 'filteredBy', () ->
  (data, keys, value) ->

    if not exist(keys) or keys.length is 0 or not exist(value) or not (type value is 'string') or value is ''
      return data

    filtered = []
    for obj in data
      for key in keys
        unless not exist(obj[key].indexOf) or not exist(obj[key].toLowerCase()) or obj[key].toLowerCase().indexOf(value.toLowerCase()) is -1
          filtered.push obj
          break

    return filtered