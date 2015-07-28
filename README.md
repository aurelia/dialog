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
3. Download the [SystemJS](https://github.com/systemjs/systemjs) module loader:

	```shell
	jspm dl-loader
	```

4. Ensure that you have Chrome installed. Karma runs the test suite in Chrome.

5. You can now run the tests with this command:

	```shell
	karma start
	```

## Using the plugin

There are a few ways you can take advantage of the Aurelia dialog.

1. You can use the dialog service to open a prompt -

  ```javascript
  import {DialogService, Prompt} from 'aurelia/modal';
  export class Welcome {
    submit(){
      this.dialogService.open({ viewModel: Prompt, model: 'Good or Bad?'}).then(() => {
        console.log('good');
      }).catch(() => {
        console.log('bad');
      });
    }
  }
  ```

  This will open a prompt that `resolve`s if the user clicks ok.  If the user clicks out, clicks cancel, or clicks the 'x' in the top right it will `reject` the promise.

2. You can create your own view / view-model and use the dialog service to call it from your app's view-model -

  ```javascript
  import {EditPerson} from './edit-person';
  import {DialogService} from 'aurelia/modal';
  export class Welcome {
    person = { firstName: 'Wade', middleName: 'Owen', lastName: 'Watts' };
    submit(){
      this.dialogService.open({ viewModel: EditPerson, model: this.person}).then(() => {
        console.log('edited');
      }).catch(() => {
        console.log('didnt edit');
      });
    }
  }
  ```

  This will open a dialog and control it the same way as the prompt.  The important thing to keep in mind is you need to follow the same method of utilizing a `DialogController` in your `EditPerson` view-model as well as accepting the model in your activate method -

  ```javascript
  import {DialogController} from 'aurelia/modal';

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
    <dialog>
      <dialog-body>
        <h2>Edit first name</h2>
        <input value.bind="person.firstName" />
      </dialog-body>

      <dialog-footer>
        <button click.trigger="controller.cancel()">Cancel</button>
        <button click.trigger="controller.ok(person)">Ok</button>
      </dialog-footer>
    </dialog>
  </template>
  ```
