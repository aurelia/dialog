import 'github:twbs/bootstrap@3.3.5';

export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .developmentLogging()
    .plugin('aurelia-dialog', (settings) => {
      settings.lock = true;
    });

  aurelia.start().then(a => a.setRoot('src/app'));
}
