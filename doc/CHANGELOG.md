<a name="2.0.0-rc.6"></a>
# [2.0.0-rc.6](https://github.com/aurelia/dialog/compare/2.0.0-rc.5...2.0.0-rc.6) (2019-05-31)


### Bug Fixes

* **build:** adjust umd build, add umd-es2015 ([342c023](https://github.com/aurelia/dialog/commit/342c023))
* **package.json:** fix package.json ([5ae0d3a](https://github.com/aurelia/dialog/commit/5ae0d3a))


### Features

* **dialog-renderer:** add native dialog renderer close [#338](https://github.com/aurelia/dialog/issues/338) ([9da52fe](https://github.com/aurelia/dialog/commit/9da52fe))
* **keyboard:** allow to configure keyevent type ([2f57949](https://github.com/aurelia/dialog/commit/2f57949))



<a name="2.0.0-rc.5"></a>
# [2.0.0-rc.5](https://github.com/aurelia/dialog/compare/2.0.0-rc.4...2.0.0-rc.5) (2019-01-21)


### Bug Fixes

* **build:** correct namespace for umd build ([b3b08e7](https://github.com/aurelia/dialog/commit/b3b08e7))



<a name="2.0.0-rc.4"></a>
# [2.0.0-rc.4](https://github.com/aurelia/dialog/compare/2.0.0-rc.3...2.0.0-rc.4) (2019-01-19)


### Bug Fixes

* **build:** add umd build to build script ([0c46fdc](https://github.com/aurelia/dialog/commit/0c46fdc))
* **build:** update rollup dep, config ([0c9e029](https://github.com/aurelia/dialog/commit/0c9e029))
* **doc:** fix html5 syntax ([629ad1c](https://github.com/aurelia/dialog/commit/629ad1c)), closes [/github.com/aurelia/templating/pull/647#issuecomment-427989601](https://github.com//github.com/aurelia/templating/pull/647/issues/issuecomment-427989601)


### Features

* **keyboard:** allow to configure keyevent type ([3aad34f](https://github.com/aurelia/dialog/commit/3aad34f))



<a name="2.0.0-rc.3"></a>
# [2.0.0-rc.3](https://github.com/aurelia/dialog/compare/2.0.0-rc.2...2.0.0-rc.3) (2018-08-22)


### Bug Fixes

* **resources:** use named exports instead of default ([4033216](https://github.com/aurelia/dialog/commit/4033216))



<a name="2.0.0-rc.2"></a>
# [2.0.0-rc.2](https://github.com/aurelia/dialog/compare/2.0.0-rc.1...2.0.0-rc.2) (2018-08-22)


### Bug Fixes

* **attach-focus:** AttachFocus must be the default export fix [#358](https://github.com/aurelia/dialog/issues/358) ([fb5e829](https://github.com/aurelia/dialog/commit/fb5e829))



<a name="2.0.0-rc.1"></a>
# [2.0.0-rc.1](https://github.com/aurelia/dialog/compare/1.0.0...2.0.0-rc.1) (2018-08-21)


### Bug Fixes

* **css:** update styles to use ux- prefix instead of ai- ([f29d8cb](https://github.com/aurelia/dialog/commit/f29d8cb)), closes [#306](https://github.com/aurelia/dialog/issues/306)
* **package.json:** add missing dependency ([ed9c5df](https://github.com/aurelia/dialog/commit/ed9c5df))


### Features

* **attach-focus:** make work as boolean attr ([f75abb4](https://github.com/aurelia/dialog/commit/f75abb4)), closes [#349](https://github.com/aurelia/dialog/issues/349)
* **resources:** register resources by class ([#354](https://github.com/aurelia/dialog/issues/354)) ([ff55c80](https://github.com/aurelia/dialog/commit/ff55c80))


### BREAKING CHANGES

* **resources:** - default resources are no longer reexported, need to be explicitly included when bundling



<a name="1.0.0"></a>
# [1.0.0](https://github.com/aurelia/dialog/compare/1.0.0-rc.2.0.0...1.0.0) (2018-07-23)


### Bug Fixes

* **DI:** use static method for Element ([700dd62](https://github.com/aurelia/dialog/commit/700dd62))
* **doc:** correct link from dialog to bootstraping ([432533d](https://github.com/aurelia/dialog/commit/432533d))



<a name="1.0.0-rc.2.0.0"></a>
# [1.0.0-rc.2.0.0](https://github.com/aurelia/dialog/compare/1.0.0-rc.1.0.3...1.0.0-rc.2.0.0) (2017-11-05)


### Bug Fixes

* **dialog-configuration:** set defaults for ".renderer" and ".cssText" ([fd58f2a](https://github.com/aurelia/dialog/commit/fd58f2a)), closes [#307](https://github.com/aurelia/dialog/issues/307)
* **dialog-renderer:** lazy DOM access fix [#294](https://github.com/aurelia/dialog/issues/294) ([f71ecf8](https://github.com/aurelia/dialog/commit/f71ecf8))
* **dialog-service:** fix no fail for undefined moduleId ([e90a9d8](https://github.com/aurelia/dialog/commit/e90a9d8)), closes [#312](https://github.com/aurelia/dialog/issues/312)
* **typings:** fix as it was in [#280](https://github.com/aurelia/dialog/issues/280) ([c6dd762](https://github.com/aurelia/dialog/commit/c6dd762))


### Features

* **dialog-controller:** add param to canDeactivate / deactivate functions. ([42ad7f3](https://github.com/aurelia/dialog/commit/42ad7f3))
* **dialog-controller:** pass close result to lifecycle hooks ([320504c](https://github.com/aurelia/dialog/commit/320504c))


### BREAKING CHANGES

* **dialog-controller:** - DialogController.prototype.error wraps the passed reason
in DialogCloseError



<a name="1.0.0-rc.1.0.3"></a>
# [1.0.0-rc.1.0.3](https://github.com/aurelia/dialog/compare/1.0.0-rc.1.0.2...v1.0.0-rc.1.0.3) (2017-05-05)


### Bug Fixes

* **dialog-renderer:** don't cancel events fix [#281](https://github.com/aurelia/dialog/issues/281) ([9a92123](https://github.com/aurelia/dialog/commit/9a92123))



<a name="1.0.0-rc.1"></a>
# [1.0.0-rc.1](https://github.com/aurelia/dialog/compare/1.0.0-beta.3.0.1...v1.0.0-rc.1) (2017-04-28)


### Bug Fixes

* **dialog-configuration:** fix [#264](https://github.com/aurelia/dialog/issues/264) add missing padding unit ([902c921](https://github.com/aurelia/dialog/commit/902c921))
* **dialog-configuration:** use PLATFORM.moduleName ([9dc62ff](https://github.com/aurelia/dialog/commit/9dc62ff))
* **dialog-renderer:** check for transitions ([ed77c85](https://github.com/aurelia/dialog/commit/ed77c85))
* **dialog-renderer:** let click events bubble ([6a03bbd](https://github.com/aurelia/dialog/commit/6a03bbd))
* **enableescclose:** default to true ([58bfc88](https://github.com/aurelia/dialog/commit/58bfc88))
* **lefecycle:** handle thrown errors ([e7f1284](https://github.com/aurelia/dialog/commit/e7f1284))
* **lifecycle:** fix lifecycle methods default value ([67a5c64](https://github.com/aurelia/dialog/commit/67a5c64))


### Features

* **all:** migrate to TS ([5a68ca3](https://github.com/aurelia/dialog/commit/5a68ca3))
* **all:** remove "lock" setting ([a0fd54a](https://github.com/aurelia/dialog/commit/a0fd54a))
* **all:** switch prefix - "ai" => "ux" ([817be7f](https://github.com/aurelia/dialog/commit/817be7f))
* **dialog options:** allow esc to close dialog without lock: false ([c0baaf5](https://github.com/aurelia/dialog/commit/c0baaf5))
* **dialog-service:** add .closeAll() ([76048e6](https://github.com/aurelia/dialog/commit/76048e6))
* **dialog-service:** add .closeAll() ([f59dfc7](https://github.com/aurelia/dialog/commit/f59dfc7))
* **dialog-service:** refactor consolidate open methods in one ([676ee58](https://github.com/aurelia/dialog/commit/676ee58))
* **dialog-service:** refactor consolidate open methods in one ([dc44a34](https://github.com/aurelia/dialog/commit/dc44a34))
* **dialog-service, dialog-controller:** add "rejectOnCancel" ([e8cd8e5](https://github.com/aurelia/dialog/commit/e8cd8e5))
* **dialog-settings, dialog-renderer:** add host ([4aebd63](https://github.com/aurelia/dialog/commit/4aebd63))
* **dialog-settings, dialog-service:** add childContainer ([db0aca5](https://github.com/aurelia/dialog/commit/db0aca5))



# 1.0.0-beta.3.0.1

## Bug Fixes

* **dialog-service:** .open() proper error propagation
* **dialog-controller:** clear close promise when canDeactivate=>false
* **dialog-renderer, dialog-service:** fix settings merging
* **dialog-renderer:** do not track controllers per renderer instance
* **dialog-service:** fix remove controllers closed with .error
* **styles:** make ai-dialog display:table

<a name="1.0.0-beta.3.0.0"></a>
# [1.0.0-beta.3.0.0](https://github.com/aurelia/dialog/compare/1.0.0-beta.2.0.0...v1.0.0-beta.3.0.0) (2016-07-27)


### Bug Fixes

* **dialog-configuration:** Add settings to configuration types and docs. ([7d5f6b8](https://github.com/aurelia/dialog/commit/7d5f6b8))
* **dialog-configuration:** correct typings ([541cd8e](https://github.com/aurelia/dialog/commit/541cd8e))
* **dialog-configuration:** do not inject empty styling ([6c48a8c](https://github.com/aurelia/dialog/commit/6c48a8c))
* **dialog-configuration:** Fix useRenderer typing ([451cd2c](https://github.com/aurelia/dialog/commit/451cd2c))
* **dialog-configuration:** register renderer as transient ([901a004](https://github.com/aurelia/dialog/commit/901a004)), closes [aurelia/dialog#180](https://github.com/aurelia/dialog/issues/180)


### Features

* **dialog-service:** rename openc to openAndYieldController ([d21458d](https://github.com/aurelia/dialog/commit/d21458d))



<a name="1.0.0-beta.2.0.0"></a>
# [1.0.0-beta.2.0.0](https://github.com/aurelia/dialog/compare/1.0.0-beta.1.1.0...v1.0.0-beta.2.0.0) (2016-07-12)


### Bug Fixes

* **dialog-configuration:** setup default renderer ([2c4c1fb](https://github.com/aurelia/dialog/commit/2c4c1fb)), closes [#129](https://github.com/aurelia/dialog/issues/129)



<a name="1.0.0-beta.1.1.0"></a>
# [1.0.0-beta.1.1.0](https://github.com/aurelia/dialog/compare/1.0.0-beta.1.0.2...v1.0.0-beta.1.1.0) (2016-06-22)



### 0.6.2 (2016-05-24)


#### Bug Fixes

* **dialog-service:** add host element to container (#152) ([bcd24532](https://github.com/aurelia/dialog/commit/bcd2453248eada5c6595a53083bcc9dfacbec9e6), closes [#150](https://github.com/aurelia/dialog/issues/150))
* **dialogResult:** export DialogResult for dts (#153) ([736f6fa1](https://github.com/aurelia/dialog/commit/736f6fa1eacc612d65c80ce66b577ef034c67f7b), closes [#134](https://github.com/aurelia/dialog/issues/134))


### 0.6.1 (2016-05-17)


#### Bug Fixes

* **style:** alter div styles ([388bffac](https://github.com/aurelia/dialog/commit/388bffac91d9f952d7b9ad30d2f781c6d9264735), closes [#148](https://github.com/aurelia/dialog/issues/148))


## 0.6.0 (2016-05-10)


#### Bug Fixes

* **dialog.css:** fix close button positioning ([ca7af613](https://github.com/aurelia/dialog/commit/ca7af613be6f7c820d3493fe448314ac8c34887e), closes [#128](https://github.com/aurelia/dialog/issues/128))
* **renderer:** modal scrolling, close behavior ([75f9606a](https://github.com/aurelia/dialog/commit/75f9606adf1671da3e4846c6ad9faca3253357a1), closes [#125](https://github.com/aurelia/dialog/issues/125), [#103](https://github.com/aurelia/dialog/issues/103))


### 0.5.10 (2016-03-23)


#### Bug Fixes

* **build:** incorrect build configuration ([f03146ee](https://github.com/aurelia/dialog/commit/f03146ee66ec3545d508f62de3bb618a064b4b2f))


### 0.5.9 (2016-03-22)


#### Features

* **dialog:** track controllers in service ([b58d17f5](https://github.com/aurelia/dialog/commit/b58d17f5d1bd4461ad1fb5f943de63d6ce8b81bd), closes [#121](https://github.com/aurelia/dialog/issues/121))


### 0.5.8 (2016-03-10)


#### Bug Fixes

* **dialog:** put back centerDialog ([1e03984a](https://github.com/aurelia/dialog/commit/1e03984a4163ab9999b2890d5f70f19f2d8ded9e))
* **dialog-controller:**
  * remove promise pyramid of doom ([e5d42e3f](https://github.com/aurelia/dialog/commit/e5d42e3fa5a63032d298a4e2fd7c5eaec18de3f7))
  * fix the class interface ([7ac0be86](https://github.com/aurelia/dialog/commit/7ac0be86d7a98964d8c30f27e3669004549d93d5), closes [#82](https://github.com/aurelia/dialog/issues/82))


#### Features

* **position:** allow to pass in callback to do setup on elements ([825e0e16](https://github.com/aurelia/dialog/commit/825e0e16a7b456ba40f009b590d909b3dc499bdc))


### 0.5.7 (2016-03-01)


#### Bug Fixes

* **dialog:**
  * allow response to click events ([1fd3bfc8](https://github.com/aurelia/dialog/commit/1fd3bfc89d736fdbf4f7fc407a2fbb7630ab5e7e))
  * allow response to click events ([ec8a8ce0](https://github.com/aurelia/dialog/commit/ec8a8ce0aba4965e7793a9aa074c5e3074b85570))
  * accessibility fixes ([79a796da](https://github.com/aurelia/dialog/commit/79a796da73ce94336e0d1eaf28acb964247dec8c))


#### Features

* use attach-focus attribute value to decide if the element is to be focused ([ceb7196f](https://github.com/aurelia/dialog/commit/ceb7196fbb226ae1f6de25222460ebb6fddaa8e5))
* **z-index:** make z-index configurable ([e9d164f5](https://github.com/aurelia/dialog/commit/e9d164f592a5409785ef94b9590ae689c3115485), closes [#90](https://github.com/aurelia/dialog/issues/90))


### 0.5.6 (2016-02-09)


#### Bug Fixes

* **changelog:** fix changelog generation ([3f123e38](https://github.com/aurelia/dialog/commit/3f123e38987e9326e6086a18e3a47aec59df3350), closes [#71](https://github.com/aurelia/dialog/issues/71))
* **ie:** clicking overlay closes ([2c4cfa63](https://github.com/aurelia/dialog/commit/2c4cfa635e178071cd8080384cfc1592cbfbaef2), closes [#87](https://github.com/aurelia/dialog/issues/87))


## 0.5.4 (2016-01-30)

* feat(all): update jspm meta; core-js; aurelia deps
* fix(deps): move aurelia-pal to dev-dep
* disable pointer events on ai-dialog-container
* fix(dialog): use CSS auto margins instead of JS

### 0.5.1 (2015-12-03)

* Destroy modal only when modalContainer ends its transition
* incorrect DialogFooter name

### 0.2.1 (2015-09-07)


#### Bug Fixes

* **dialog:** Update link to `require` ([3caf3a7d](https://github.com/aurelia/dialog/commit/3caf3a7de0435754bd6707ad2e790efafd84b7dc))


## 0.2.0 (2015-09-05)


#### Bug Fixes

* **build:** update linting, testing and tools ([9b011a5e](https://github.com/aurelia/dialog/commit/9b011a5ecd89ccd097b96bfa286a3515f76405df))
* **dialog-service:** update to latest templating ([3a2c7edd](https://github.com/aurelia/dialog/commit/3a2c7edd1365debd8a764d28a64356e1f11fa313))


### 0.1.1 (2015-08-24)


### 0.1.1 (2015-08-24)
