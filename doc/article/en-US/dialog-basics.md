---
{
  "name": "Dialog: Basics",
  "culture": "en-US",
  "description": "The basics of the dialog plugin for Aurelia.",
  "engines" : { "aurelia-doc" : "^1.0.0" },
  "author": {
    "name": "Patrick Walters",
    "url": "http://patrickwalters.net"
  },
  "contributors": [],
  "translators": [],
  "keywords": ["Dialog", "Modal", "JavaScript", "TypeScript"]
}
---

## [Introduction](aurelia-doc://section/1/version/1.0.0)

This article covers the dialog plugin for Aurelia.  This plugin is created for showing dialogs (sometimes referred to as modals) in your application.  The plugin supports the use of dynamic content for all aspects and is easily configurable / overridable.


## [Installing The Plugin](aurelia-doc://section/2/version/1.0.0)

1. In your **JSPM**-based project install the plugin via `jspm` with following command

```shell
jspm install aurelia-dialog
```

If you use **Webpack**, install the plugin with the following command

```shell
npm install aurelia-dialog --save
```

If you use the **Aurelia CLI**, install the plugin with the following command

```shell
npm install aurelia-dialog --save
```

and then add a section in your `aurelia.json` for the plugin

<code-listing heading="aurelia.json">
  <source-code lang="ES 2015">
  {
    dependencies: [
    //...
      {
        "name": "aurelia-dialog",
        "path": "../node_modules/aurelia-dialog/dist/amd",
        "main": "aurelia-dialog"
      }
    //...
    ]
  }
  </source-code>
</code-listing>

If you use TypeScript, install the plugin's typings with the following command

```shell
typings install github:aurelia/dialog --save
```

2. Make sure you use [manual bootstrapping](http://aurelia.io/docs#startup-and-configuration). In order to do so open your `index.html` and locate the element with the attribute aurelia-app. Change it to look like this:

<code-listing heading="index.html">
  <source-code lang="HTML">
  <body aurelia-app="main">...</body>
  </source-code>
</code-listing>

3. Create (if you haven't already) a file `main.js` in your `src` folder with following content:

<code-listing heading="main.js">
  <source-code lang="ES 2015">
  import {PLATFORM} from 'aurelia-pal';
  export function configure(aurelia) {
    aurelia.use
      .standardConfiguration()
      .developmentLogging()
      .plugin(PLATFORM.moduleName('aurelia-dialog'));

    aurelia.start().then(a => a.setRoot());
  }
  </source-code>
</code-listing>

> Warning: When the `<body>` is marked with the `aurelia-app` attribute any dialog open prior to the app being attached to the DOM(before `Aurelia.prototype.setRoot` completes), will be *removed* from the DOM. Opening a dialog in the `canActivate` or `activate` hooks is *OK* in any scenario *if* you *await* it to close *before continuing*. If you just want to open a dialog, without awaiting it to close, do it the `attached` hook instead.

> Warning: `PLATFORM.moduleName` should *not* be omitted if you are using Webpack.

## [Using The Plugin](aurelia-doc://section/3/version/1.0.0)

There are a few ways you can take advantage of the Aurelia dialog.

1. You can use the dialog service to open a prompt -

<code-listing heading="welcome.js">
  <source-code lang="ES 2015">
  import {DialogService} from 'aurelia-dialog';
  import {Prompt} from './prompt';
  export class Welcome {
    static inject = [DialogService];
    constructor(dialogService) {
      this.dialogService = dialogService;
    }
    submit(){
      this.dialogService.open({ viewModel: Prompt, model: 'Good or Bad?', lock: false }).whenClosed(response => {
        if (!response.wasCancelled) {
          console.log('good');
        } else {
          console.log('bad');
        }
        console.log(response.output);
      });
    }
  }
  </source-code>
</code-listing>

This will open a prompt and return a promise that `resolve`s when closed.  If the user clicks out, clicks cancel, or clicks the 'x' in the top right it will still `resolve` the promise but will have a property on the response `wasCancelled` to allow the developer to handle cancelled dialogs.

There is also an `output` property that gets returned with the outcome of the user action if one was taken.

2. You can create your own view / view-model and use the dialog service to call it from your app's view-model -

<code-listing heading="welcome.js">
  <source-code lang="ES 2015">
  import {EditPerson} from './edit-person';
  import {DialogService} from 'aurelia-dialog';
  export class Welcome {
    static inject = [DialogService];
    constructor(dialogService) {
      this.dialogService = dialogService;
    }
    person = { firstName: 'Wade', middleName: 'Owen', lastName: 'Watts' };
    submit(){
      this.dialogService.open({ viewModel: EditPerson, model: this.person, lock: false }).whenClosed(response => {
        if (!response.wasCancelled) {
          console.log('good - ', response.output);
        } else {
          console.log('bad');
        }
        console.log(response.output);
      });
    }
  }
  </source-code>
</code-listing>

  This will open a dialog and control it the same way as the prompt.  The important thing to keep in mind is you need to follow the same method of utilizing a `DialogController` in your `EditPerson` view-model as well as accepting the model in your activate method -

<code-listing heading="edit-person.js">
  <source-code lang="ES 2015">
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
  </source-code>
</code-listing>

  and the corresponding view -

<code-listing heading="edit-person.html">
  <source-code lang="HTML">
  <template>
    <ux-dialog>
      <ux-dialog-body>
        <h2>Edit first name</h2>
        <input value.bind="person.firstName" />
      </ux-dialog-body>

      <ux-dialog-footer>
        <button click.trigger="controller.cancel()">Cancel</button>
        <button click.trigger="controller.ok(person)">Ok</button>
      </ux-dialog-footer>
    </ux-dialog>
  </template>
  </source-code>
</code-listing>

## [Attach Focus Custom Attribute](aurelia-doc://section/4/version/1.0.0)

The library exposes an `attach-focus` custom attribute that allows focusing in on an element in the modal when it is loaded.  You can use this to focus a button, input, etc...  Example usage -

<code-listing heading="edit-person.html">
  <source-code lang="HTML">
  <template>
    <ux-dialog>
      <ux-dialog-body>
        <h2>Edit first name</h2>
        <input attach-focus="true" value.bind="person.firstName" />
      </ux-dialog-body>
    </ux-dialog>
  </template>
  </source-code>
</code-listing>

You can also bind the value of the attach-focus attribute if you want to alter which element will be focused based on a view model property.

<code-listing heading="edit-person.html">
  <source-code lang="ES 2015">
  <input attach-focus.bind="isNewPerson" value.bind="person.email" />
  <input attach-focus.bind="!isNewPerson" value.bind="person.firstName" />
  </source-code>
</code-listing>

## [Settings](aurelia-doc://section/5/version/1.0.0)

### Global Settings

You can specify global settings as well for all dialogs to use when installing the plugin via the configure method. If providing a custom configuration, you *must* call the `useDefaults()` method to apply the base configuration.

<code-listing heading="main.js">
  <source-code lang="ES 2015">
  import {PLATFORM} from 'aurelia-pal';

  export function configure(aurelia) {
    aurelia.use
      .standardConfiguration()
      .developmentLogging()
      .plugin(PLATFORM.moduleName('aurelia-dialog'), config => {
        config.useDefaults();
        config.settings.lock = true;
        config.settings.centerHorizontalOnly = false;
        config.settings.startingZIndex = 5;
        config.settings.keyboard = true;
      });

    aurelia.start().then(a => a.setRoot());
  }
  </source-code>
</code-listing>

### Dialog Settings

The settings available for the dialog are set on the dialog controller on a per-dialog basis.
- `viewModel` can be url, class reference or instance.
  - url - path relative to the application root.
    ```
    .
    +-- app.js
    +-- forms
        +-- consent-form.js
        +-- consent-form.html
    +-- prompts
        +-- prompt.js
        +-- prompt.html
    ```
    If you want to open a `prompt` from `consent-form` the path will be `prompts/prompt`.

    > Warning: Webpack users should *always* mark dynamically loaded dependencies with `PLATFORM.moduleName`. For more details do check the `aurelia-webpack-plugin` [wiki](https://github.com/aurelia/webpack-plugin/wiki).

  - object - it will be used as the view model. In this case `view` must also be specified.
  - class - the view model *class* or *constructor function*.
    > Note: This approach depends on being able resolve the origin of the class.

    > Note: Webpack users are advised to use the string overload, wrapped with `PLATFORM.moduleName`, instead of this one.

    > Warning: This approach might not work for Webpack users when using *DLLPlugin* or *ModuleConcatenationPlugin*.
- `view` can be url or view strategy to override the default view location convention.
- `model` the data to be passed to the `canActivate` and `activate` methods of the view model if implemented.
- `host` allows providing the element which will parent the dialog - if not provided the body will be used.
- `childContainer` allows specifying the DI Container instance to be used for the dialog.
If not provided a new child container will be created from the root one.
- `lock` makes the dialog modal, and removes the close button from the top-right hand corner. (defaults to true)
- `keyboard` allows configuring keyboard keys that close the dialog. To disable set to `false`. To cancel close a dialog when the *ESC* key is pressed set to `true`, `'Escape'` or and array containing `'Escape'` - `['Escape']`. To close with confirmation when the *ENTER* key is pressed set to `'Enter'` or an array containing `'Enter'` - `['Enter']`. To combine the *ESC* and *ENTER* keys set to `['Enter', 'Escape']` - the order is irrelevant. (takes precedence over `lock`)
- `overlayDismiss` if set to `true` cancel closes the dialog when clicked outside of it. (takes precedence over `lock`)
- `centerHorizontalOnly` means that the dialog will be centered horizontally, and the vertical alignment is left up to you. (defaults to false)
- `position` a callback that is called right before showing the modal with the signature: `(modalContainer: Element, modalOverlay: Element) => void`. This allows you to setup special classes, play with the position, etc... If specified, `centerHorizontalOnly` is ignored. (optional)
- `ignoreTransitions` is a Boolean you must set to `true` if you disable css animation of your dialog. (optional, default to false)
- `rejectOnCancel` is a Boolean you must set to `true` if you want to handle cancellations as rejection. The reason will be a `DialogCancelError` - the property `wasCancelled` will be set to `true` and if cancellation data was provided it will be set to the `output` property.

> Warning: Plugin authors are advised to be explicit with settings that change behavior (`rejectOnCancel`).

<code-listing heading="prompt.js">
  <source-code lang="ES 2015">
  export class Prompt {
    static inject = [DialogController];

    constructor(controller){
      this.controller = controller;
      this.answer = null;

      controller.settings.lock = false;
      controller.settings.centerHorizontalOnly = true;
    }
  }
  </source-code>
</code-listing>

## [Accessing The DialogController API](aurelia-doc://section/6/version/1.0.0)

It is possible to resolve and close (using cancel/ok/error methods) dialog in the same context where you open it.

<code-listing heading="welcome.js">
  <source-code lang="ES 2015">
  import {EditPerson} from './edit-person';
  import {DialogService} from 'aurelia-dialog';
  export class Welcome {
    static inject = [DialogService];
    constructor(dialogService) {
      this.dialogService = dialogService;
    }
    person = { firstName: 'Wade', middleName: 'Owen', lastName: 'Watts' };
    submit(){
      this.dialogService.open({viewModel: EditPerson, model: this.person}).then(openDialogResult => {
        // Note you get here when the dialog is opened, and you are able to close dialog
        setTimeout(() => {
          openDialogResult.controller.cancel('canceled outside after 3 sec')
        }, 3000);

        // Promise for the result is stored in openDialogResult.closeResult property
        return openDialogResult.closeResult;
      }).then((response) => {
        if (!response.wasCancelled) {
          console.log('good');
        } else {
          console.log('bad');
        }
        console.log(response);
      });
    }
  }
  </source-code>
</code-listing>

## [Styling The Dialog](aurelia-doc://section/7/version/1.0.0)

### Overlay With 50% Opacity

Bootstrap adds 50% opacity and a background color of black to the modal.  To achieve this in dialog you can simply add the following CSS -

<code-listing heading="welcome.js">
  <source-code lang="CSS">
ux-dialog-overlay.active {
  background-color: black;
  opacity: .5;
}
  </source-code>
</code-listing>

## [Lifecycle Hooks](aurelia-doc://section/8/version/1.0.0)

In adition to the lifecycle hooks defined by `aurelia-templating`, the `aurelia-dialog` defines additional ones. All dialog specific hooks can return a `Promise`, that resolves to the appropriate value for the hook, and will be awaited.

### `.canActivate()`

With this hook you can cancel the opening of a dialog. It is invoked with one parameter - the value of the `model` setting passed to `.open()`. To cancel the opening of the dialog return `false` - `null` and `undefined` will be coerced to `true`.

### `.activate()`

This hook can be used to do any necessary init work. The hook is invoked with one parameter - the value of the `model` setting passed to `.open()`.

### `.canDeactivate()`

With this hook you can cancel the closing of a dialog. To do so return `false` - `null` and `undefined` will be coerced to `true`.

> Warning
> When `DialogController.prototype.error()` is called this hook will be skipped.

### `.deactivate()`

This hook can be used to do any clean up work.

### Order of Invocation

Each dialog instance goes through the full lifecycle once.

1. constructor call
2. `.canActivate()` - `aurelia-dialog` *specific*
3. `.activate()` - `aurelia-dialog` *specific*
4. `.created()` - as defined by `aurelia-templating`
5. `.bind()` - as defined by `aurelia-templating`
6. `.attached()` - as defined by `aurelia-templating`
7. `.canDeactivate()` - `aurelia-dialog` *specific*
8. `.deactivate()` - `aurelia-dialog` *specific*
9. `.detached()` - as defined by `aurelia-templating`
10. `.unbind()` - as defined by `aurelia-templating`
