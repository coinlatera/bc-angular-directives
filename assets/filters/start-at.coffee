angular.module('start-at', []).filter 'startAt', () ->
  (data, index) ->
    if not exist data
      return data
    return data.slice(index, data.length)