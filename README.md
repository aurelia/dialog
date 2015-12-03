# aurelia-dialog

[![ZenHub](https://raw.githubusercontent.com/ZenHubIO/support/master/zenhub-badge.png)](https://zenhub.io)
[![Join the chat at https://gitter.im/aurelia/discuss](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/aurelia/discuss?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

This library is part of the [Aurelia](http://www.aurelia.io/) platform and contains a dialog plugin.

> To keep up to date on [Aurelia](http://www.aurelia.io/), please visit and subscribe to [the official blog](http://blog.durandal.io/). If you have questions, we invite you to [join us on Gitter](https://gitter.im/aurelia/discuss). If you would like to have deeper insight into our development process, please install the [ZenHub](https://zenhub.io) Chrome Extension and visit any of our repository's boards. You can get an overview of all Aurelia work by visiting [the framework board](https://github.com/aurelia/framework#boards).

## Dependencies

This library has **NO** external dependencies.

## Used By

This library is a plugin and is not used by the core framework.

## Platform Support

This library can be used in the **browser** as well as on the **server**.

## Building The Code

To build the code, follow these steps.

1. Ensure that [NodeJS](http://nodejs.org/) is installed. This provides the platform on which the build tooling runs.
2. From the project folder, execute the following command:

	```shell
	npm install
	```
3. Ensure that [Gulp](http://gulpjs.com/) is installed. If you need to install it, use the following command:

	```shell
	npm install -g gulp
	```
4. To build the code, you can now run:

	```shell
	gulp build
	```
5. You will find the compiled code in the `dist` folder, available in three module formats: AMD, CommonJS and ES6.

6. See `gulpfile.js` for other tasks related to generating the docs and linting.

## Running The Tests

To run the unit tests, first ensure that you have followed the steps above in order to install all dependencies and successfully build the library. Once you have done that, proceed with these additional steps:

1. Ensure that the [Karma](http://karma-runner.github.io/) CLI is installed. If you need to install it, use the following command:

	```shell
	npm install -g karma-cli
	```
2. Ensure that [jspm](http://jspm.io/) is installed. If you need to install it, use the following commnand:

	```shell
	npm install -g jspm
	```

3. You can now run `jspm` to install dependencies required for running the test suite:

  ```shell
  jspm install
  ```

4. Download the [SystemJS](https://github.com/systemjs/systemjs) module loader:

  ```shell
  jspm dl-loader
  ```

5. Ensure that you have Chrome installed. Karma runs the test suite in Chrome.

6. You can now run the tests with this command:

	```shell
	karma start
	```

## Running The Sample

To run the sample code using this plugin proceed with these additional steps:

1. Go to the `sample` directory and install dependencies using `jspm`:

  ```shell
  cd sample
  jspm install
  ```
2. Go back to the root of the project and use gulp to serve the sample project:

  ```shell
  cd ..
  gulp watch
  ```


## How to install this plugin?

1. In your project install the plugin via `jspm` with following command

  ```shell
jspm install aurelia-dialog
  ```
2. Make sure you use [manual bootstrapping](http://aurelia.io/docs#startup-and-configuration). In order to do so open your `index.html` and locate the element with the attribute aurelia-app. Change it to look like this:

  ```html
  <body aurelia-app="main">
  ...
  ```
3. Create (if you haven't already) a file `main.js` in your `src` folder with following content:

```javascript
  export function configure(aurelia) {
    aurelia.use
      .standardConfiguration()
      .developmentLogging()
      .plugin('aurelia-dialog');

    aurelia.start().then(a => a.setRoot());
  }
```

## Using the plugin

There are a few ways you can take advantage of the Aurelia dialog.

1. You can use the dialog service to open a prompt -

  ```javascript
  import {DialogService} from 'aurelia-dialog';
  import {Prompt} from './prompt';
  export class Welcome {
    static inject = [DialogService];
    constructor(dialogService) {
      this.dialogService = dialogService;
    }
    submit(){
      this.dialogService.open({ viewModel: Prompt, model: 'Good or Bad?'}).then(response => {
        if (!response.wasCancelled) {
          console.log('good');
        } else {
          console.log('bad');
        }
        console.log(response.output);
      });
    }
  }
  ```

  This will open a prompt and return a promise that `resolve`s when closed.  If the user clicks out, clicks cancel, or clicks the 'x' in the top right it will still `resolve` the promise but will have a property on the response `wasCancelled` to allow the developer to handle cancelled dialogs.

  There is also an `output` property that gets returned with the outcome of the user action if one was taken.

2. You can create your own view / view-model and use the dialog service to call it from your app's view-model -

  ```javascript
  import {EditPerson} from './edit-person';
  import {DialogService} from 'aurelia-dialog';
  export class Welcome {
    static inject = [DialogService];
    constructor(dialogService) {
      this.dialogService = dialogService;
    }
    person = { firstName: 'Wade', middleName: 'Owen', lastName: 'Watts' };
    submit(){
      this.dialogService.open({ viewModel: EditPerson, model: this.person}).then(response => {
        if (!response.wasCancelled) {
          console.log('good - ', response.output);
        } else {
          console.log('bad');
        }
        console.log(response.output);
      });
    }
  }
  ```

  This will open a dialog and control it the same way as the prompt.  The important thing to keep in mind is you need to follow the same method of utilizing a `DialogController` in your `EditPerson` view-model as well as accepting the model in your activate method -

  ```javascript
  import {DialogController} from 'aurelia-dialog';

  export class EditPerson {
    static inject = [DialogController];
    person = { firstName: '' };
    constructor(controller){
      this.controller = controller;
    }
    activate(person){
      this.person = person;
    }
  }
  ```

  and the corresponding view -

  ```html
  <template>
    <ai-dialog>
      <ai-dialog-body>
        <h2>Edit first name</h2>
        <input value.bind="person.firstName" />
      </ai-dialog-body>

      <ai-dialog-footer>
        <button click.trigger="controller.cancel()">Cancel</button>
        <button click.trigger="controller.ok(person)">Ok</button>
      </ai-dialog-footer>
    </ai-dialog>
  </template>
  ```
###Settings
The settings available for the dialog are set on the dialog controller on a per-dialog basis.
- `lock` makes the dialog modal, and removes the close button from the top-right hand corner. (defaults to true)
- `centerHorizontalOnly` means that the dialog will be centered horizontally, and the vertical alignment is left up to you. (defaults to false)

```javascript
export class Prompt {
  static inject = [DialogController];

  constructor(controller){
    this.controller = controller;
    this.answer = null;

    controller.settings.lock = false;
    controller.settings.centerHorizontalOnly = true;
  }
}
```
