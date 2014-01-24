describe('Example', function () {

  beforeEach(function () {
    browser().navigateTo('/test-app/');
  });

  it('should have access to /', function () {
    expect(browser().location().path()).toBe('');
  });

  it('should display the title', function () {
    expect(element('h1').count()).toBe(1);
  });

});