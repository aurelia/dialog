import $ from 'jquery';
export class Modal {
    constructor(options) {
        this.modalRecord = {
            opened: 0,
            closed: 0,
            currentlyOpen: 0
        };
        this.template = '<div class="au-modal"><div class="au-modal-bg"></div><div class="au-modal-scrollpane"><div class="container"><div class="row"><div class="au-modal-box-container span6 offset3"><div class="au-modal-box"><div class="closeIcon"><span class="glyphicon glyphicon-remove"></span></div><div class="title"></div><div class="content"></div><div class="buttons"></div><div class="jquery-clear"></div></div></div></div></div></div></div>';
        this.title = 'Hello';
        this.content = 'Are you sure to continue?';
        this.contentLoaded = function () {
        };
        this.icon = '';
        this.confirmButtonClass = 'btn-default';
        this.cancelButtonClass = 'btn-default';
        this.theme = 'white';
        this.animation = 'scale';
        this.animationSpeed = 400;
        this.animationBounce = 1.5;
        this.keyboardEnabled = false;
        this.container = 'body';
        this.confirm = function () {
        };
        this.cancel = function () {
        };
        this.backgroundDismiss = true;
        this.autoClose = false;
        this.closeIcon = true;
        this.columnClass = 'col-md-6 col-md-offset-3';
        this.animations = ['anim-scale', 'anim-top', 'anim-bottom', 'anim-left', 'anim-right', 'anim-zoom', 'anim-opacity', 'anim-none', 'anim-rotate', 'anim-rotatex', 'anim-rotatey', 'anim-scalex', 'anim-scaley'];
        this.options = options;
        $.extend(this, options);
        this.init();
    }

    init() {
        var self = this;
        this._rand = Math.round(Math.random() * 99999);
        this.buildHtml();
        this.bindEvents();
        setTimeout(() => {
            self.open();
        }, 0);
    }

    buildHtml() {
        var self = this;
		
	    /*
	    * Cleaning animations
	    */
        this.animation = 'anim-' + this.animation.toLowerCase();
        if (this.animation === 'none')
            this.animationSpeed = 0;
		/*
		* Append html to body
		*/
        this.$el = $(this.template).appendTo(this.container).addClass(this.theme);
        this.$el.find('.au-modal-box-container').addClass(this.columnClass);
        this.$b = this.$el.find('.au-modal-box').css({
            '-webkit-transition-duration': this.animationSpeed / 1000 + 's',
            'transition-duration': this.animationSpeed / 1000 + 's',
            '-webkjit-transition-timing-function': 'cubic-bezier(0.27, 1.12, 0.32, ' + this.animationBounce + ')',
            'transition-timing-function': 'cubic-bezier(0.27, 1.12, 0.32, ' + this.animationBounce + ')',
        });
        this.$b.addClass(this.animation);
        if (this.title) {
            this.$el.find('div.title').html('<i class="' + this.icon + '"></i> ' + this.title);
        } else {
            this.$el.find('div.title').remove();
        }
        this.contentDiv = this.$el.find('div.content');
		/*
		* Setting up bottuns
		*/
        this.$btnc = this.$el.find('.buttons');
        if (this.confirmButton && this.confirmButton.trim() !== '') {
            this.$confirmButton = $('<button class="btn">' + this.confirmButton + '</button>')
                .appendTo(this.$btnc)
                .addClass(this.confirmButtonClass);
        }

        if (this.cancelButton && this.cancelButton.trim() !== '') {
            this.$cancelButton = $('<button class="btn">' + this.cancelButton + '</button>')
                .appendTo(this.$btnc)
                .addClass(this.cancelButtonClass);
        }
        if (!this.confirmButton && !this.cancelButton) {
            this.$btnc.remove();
            if (this.closeIcon)
                this.$closeButton = this.$b.find('.closeIcon').show();
        }
        this.setContent();
        if (this.autoClose)
            this.startCountDown();
    }

    startCountDown() {
        var opt = this.autoClose.split('|');
        if (/cancel/.test(opt[0]) && this.type === 'alert') {
            return false;
        } else if (/confirm|cancel/.test(opt[0])) {
            this.$cd = $('<span class="countdown">').appendTo(this['$' + opt[0] + 'Button']);
            var self = this;
            self.$cd.parent().click();
            var time = opt[1] / 1000;
            this.interval = setInterval(function () {
                self.$cd.html(' [' + (time -= 1) + ']');
                if (time === 0) {
                    self.$cd.parent().trigger('click');
                    clearInterval(self.interval);
                }
            }, 1000);
        } else {
            console.error('Invalid option ' + opt[0] + ', must be confirm/cancel');
        }
    }

    setContent(string) {
        var self = this;
        if (typeof string !== undefined && typeof string === 'string') {
            this.content = string;
            this.setContent();
        } else if (typeof this.content === 'boolean') {
            if (!this.content)
                this.contentDiv.remove();
            else
                console.error('Invalid option for property content: passed TRUE');
        } else if (typeof this.content === 'string') {
            if (this.content.substr(0, 4).toLowerCase() === 'url:') {
                this.contentDiv.html('');
                this.$btnc.find('button').prop('disabled', true);
                var url = this.content.substring(4, this.content.length);
                $.get(url).done(function (html) {
                    self.contentDiv.html(html);
                }).always(function (data, status, xhr) {
                    if (typeof self.contentLoaded === 'function')
                        self.contentLoaded(data, status, xhr);
                    self.$btnc.find('button').prop('disabled', false);
                    self.setDialogCenter();
                });
            } else {
                this.contentDiv.html(this.content);
            }
        } else if (typeof this.content === 'function') {
            this.contentDiv.html('');
            this.$btnc.find('button').attr('disabled', 'disabled');
            var promise = this.content(this);
            if (typeof promise !== 'object') {
                console.error('The content function must return jquery promise.');
            } else if (typeof promise.always !== 'function') {
                console.error('The object returned is not a jquery promise.');
            } else {
                promise.always(function () {
                    self.$btnc.find('button').removeAttr('disabled');
                    self.setDialogCenter();
                });
            }
        } else {
            console.error('Invalid option for property content, passed: ' + typeof this.content);
        }
        this.setDialogCenter();
    }

    setDialogCenter(animate) {
        var windowHeight = $(window).height();
        var boxHeight = this.$b.outerHeight();
        var topMargin = (windowHeight - boxHeight) / 2;
        var minMargin = 100;
        if (boxHeight > (windowHeight - minMargin)) {
            var style = {
                'margin-top': minMargin / 2,
                'margin-bottom': minMargin / 2,
            }
        } else {
            var style = {
                'margin-top': topMargin,
            }
        }
        if (animate) {
            this.$b.animate(style, {
                duration: (animate) ? this.animationSpeed : 0,
                queue: false
            });
        } else {
            this.$b.css(style);
        }
    }

    bindEvents() {
        var self = this;
        this.$el.find('.au-modal-scrollpane').click(function (e) {
            if (self.backgroundDismiss) {
                self.cancel();
                self.close();
            } else {
                self.$b.addClass('hilight');
                setTimeout(function () {
                    self.$b.removeClass('hilight');
                }, 400);
            }
        });

        this.$el.find('.au-modal-box').click(function (e) {
            e.stopPropagation();
        });
        if (this.$confirmButton) {
            this.$confirmButton.click(function (e) {
                e.preventDefault();
                var r = self.confirm(self.$b);
                if (typeof r === 'undefined' || r)
                    self.close();
            });
        }
        if (this.$cancelButton) {
            this.$cancelButton.click(function (e) {
                e.preventDefault();
                var r = self.cancel(self.$b);
                if (typeof r === 'undefined' || r)
                    self.close();
            });
        }
        if (this.$closeButton) {
            this.$closeButton.click(function (e) {
                e.preventDefault();
                self.cancel();
                self.close();
            });
        }
        if (this.keyboardEnabled) {
            setTimeout(function () {
                $(window).on('keyup.' + this._rand, function (e) {
                    self.reactOnKey(e);
                });
            }, 500);
        }
        $(window).on('resize.' + this._rand, function () {
            self.setDialogCenter(true);
        });
    }

    open() {
        var self = this;
        if (this.isClosed())
            return false;
        /*
         * Timeout needed for DOM render time. or it never animates.
         */
        setTimeout(function () {
            self.$el.find('.au-modal-bg').animate({
                opacity: 1
            }, self.animationSpeed / 3);
        }, 1);

        $('body').addClass('au-modal-noscroll');
        this.$b.removeClass(this.animations.join(' '));
        /**
         * Blur the focused elements, prevents re-execution with button press.
         */
        $('body :focus').trigger('blur');
        this.$b.find('input[autofocus]:visible:first').focus();
        this.modalRecord.opened += 1;
        this.modalRecord.currentlyOpen += 1;
        return true;
    }
    isClosed() {
        return (this.$el.css('display') === '') ? true : false;
    }

    close() {
        var self = this;
        /*
         unbind the window resize & keyup event.
         */
        $(window).unbind('resize.' + this._rand);
        if (this.keyboardEnabled)
            $(window).unbind('keyup.' + this._rand);

        this.$el.find('.au-modal-bg').animate({
            opacity: 0
        }, this.animationSpeed / 3);
        this.$b.addClass(this.animation);
        $('body').removeClass('au-modal-noscroll');
        setTimeout(function () {
            self.$el.remove();
        }, this.animationSpeed + 30); // wait 30 miliseconds more, ensure everything is done.
        this.modalRecord.closed += 1;
        this.modalRecord.currentlyOpen -= 1;
    }
    reactOnKey(e) {           
        /*
         * prevent keyup event if the dialog is not last! 
         */
        var a = $('.au-modal');
        if (a.eq(a.length - 1)[0] !== this.$el[0])
            return false;
        var key = e.which;
        if (key === 27) {
            /*
             * if ESC key
             */
            if (!this.backgroundDismiss) {
                /*
                 * If background dismiss is false, Glow the modal.
                 */
                this.$el.find('.au-modal-bg').click();
                return false;
            }
            if (this.$cancelButton) {
                this.$cancelButton.click();
            } else {
                this.close();
            }
        }
        if (key === 13 || key == 32) {
            /*
             * if ENTER or SPACE key
             */
            if (this.$confirmButton) {
                this.$confirmButton.click();
            }
        }
    }
}