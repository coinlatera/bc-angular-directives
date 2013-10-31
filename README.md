bc-angular-directives
============================

## Developer guide

### Environment installation

Launch the following command to setup a dev environment

```
git clone https://github.com/buttercoin/bc-angular-directives
cd bc-angular-directives/
npm install
bower install
```


### Development

The repository is made of three folders:
* `assets`, which contain the source code of the library
* `dist`, which contain the prod version of the library
* `test-app`, which is an app used to test the library during the development

To start working on this library just launch the command

```
grunt server
```

This command will do three tasks:
* Launching a local server and opening the test application.
* Run a task in background which will watch for any changes in the library's source code (the `assets` folder) a regenerate the dist file.
* Start a livereload module (any changes made in the library or the test app will automatically trigger a refresh of the browser).