describe 'Service: Notifications', ->
  
  $compile = undefined
  $rootScope = undefined

  beforeEach ->
    if not $compile? and not $rootScope?
      module 'bc.table'
      inject (_$compile_, _$rootScope_) ->
        $compile = _$compile_
        $rootScope = _$rootScope_

  it 'should load the services', ->
    expect($compile).toBeDefined()
    expect($rootScope).toBeDefined()

  it 'should call the directive and create a bc-table', ->
    elem = $compile('<bc-table></bc-table>')($rootScope)
    $rootScope.$digest()
    expect(elem.html()).toContain '<table ng-class="config.tableClass">'

  