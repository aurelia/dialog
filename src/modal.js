export class Modal {
	defaultSettings = {
		width: 'auto',
		height: 'auto',
		lock: false,
		hideClose: false,
		draggable: false,
		closeAfter: 0,
		openCallback: false,
		closeCallback: false,
		hideOverlay: false
	};
	closeModalEvent: any;
	centerModal: any;
	settings: any = {};
	method: any = {};
	cancelButton: any = "Cancel";
	confirmlButton: any = "Ok";
	constructor(options) {		
		this.init(options);
	}
	init(options) {
		var self = this;
		this.modalOverlay = document.createElement('div');
		this.modalContainer = document.createElement('div');
		this.modalHeader = document.createElement('div');
		this.modalContent = document.createElement('div');
		this.modalClose = document.createElement('div');
		this.modalFooter = document.createElement('div');
		this.modalCancel = document.createElement('button');
		this.modalConfirm = document.createElement('button');

		this.modalOverlay.setAttribute('id', 'modal-overlay');
        this.modalContainer.setAttribute('id', 'modal-container');
        this.modalHeader.setAttribute('id', 'modal-header');
        this.modalContent.setAttribute('id', 'modal-content');
		this.modalFooter.setAttribute('id', 'modal-footer');
        this.modalClose.setAttribute('id', 'modal-close');
		this.modalClose.setAttribute('class', 'fa fa-times');
		this.modalCancel.setAttribute('id', 'cancel');
		this.modalConfirm.setAttribute('id', 'confirm');
        this.modalHeader.appendChild(this.modalClose);
        this.modalContainer.appendChild(this.modalHeader);
        this.modalContainer.appendChild(this.modalContent);
		this.modalContainer.appendChild(this.modalFooter);

        this.modalOverlay.style.visibility = 'hidden';
        this.modalContainer.style.visibility = 'hidden';

        if (window.addEventListener) {        
			document.body.appendChild(self.modalOverlay);
			document.body.appendChild(self.modalContainer);
        } else if (window.attachEvent) {
			document.body.appendChild(self.modalOverlay);
			document.body.appendChild(self.modalContainer);
        }
	}
	open(parameters) {
		var self = this;
		this.settings.width = parameters.width || this.defaultSettings.width;
		this.settings.height = parameters.height || this.defaultSettings.height;
		this.settings.lock = parameters.lock || this.defaultSettings.lock;
		this.settings.hideClose = parameters.hideClose || this.defaultSettings.hideClose;
		this.settings.draggable = parameters.draggable || this.defaultSettings.draggable;
		this.settings.closeAfter = parameters.closeAfter || this.defaultSettings.closeAfter;
		this.settings.closeCallback = parameters.closeCallback || this.defaultSettings.closeCallback;
		this.settings.openCallback = parameters.openCallback || this.defaultSettings.openCallback;
		this.settings.hideOverlay = parameters.hideOverlay || this.defaultSettings.hideOverlay;
		this.centerModal = function () {
			self.center({});
		};

		if (parameters.content && !parameters.ajaxContent) {
			this.modalContent.innerHTML = parameters.content;
		} else if (parameters.ajaxContent && !parameters.content) {
			this.modalContainer.className = 'fa fa-spinner fa-spin';
			this.method.ajax(parameters.ajaxContent, function insertAjaxResult(ajaxResult) {
				self.modalContent.innerHTML = ajaxResult;
			});
		} else {
			this.modalContent.innerHTML = '';
		}

		this.modalContainer.style.width = this.settings.width;
		this.modalContainer.style.height = this.settings.height;
		
		this.center({});

		if (this.settings.lock || this.settings.hideClose) {
			this.modalClose.style.visibility = 'hidden';
		}
		if (!this.settings.hideOverlay) {
			this.modalOverlay.style.visibility = 'visible';
		}
		this.modalContainer.style.visibility = 'visible';

		document.onkeypress = function (e) {
			if (e.keyCode === 27 && self.settings.lock !== true) {
				self.close();
			}
		};

		this.modalClose.onclick = function () {
			if (!self.settings.hideClose) {
				self.close();
			} else {
				return false;
			}
		};
		if (parameters.cancelButton && parameters.cancelButton.trim() !== '') {
			this.modalCancel.textContent = parameters.cancelButton;
			this.modalFooter.appendChild(this.modalCancel);
			if (parameters.cancel) {
				this.modalCancel.addEventListener("click",parameters.cancel);				
			}
			if (parameters.cancelButtonClass) {
				this.modalCancel.setAttribute("class",parameters.cancelButtonClass);
			}
			this.modalCancel.addEventListener("click",this.modalClose.onclick);
		}
		if (parameters.confirmButton && parameters.confirmButton.trim() !== '') {
			this.modalConfirm.textContent = parameters.confirmButton;
			this.modalFooter.appendChild(this.modalConfirm);
			if (parameters.confirm) {
				this.modalConfirm.addEventListener("click",parameters.confirm);				
			}
			if (parameters.confirmButtonClass) {
				this.modalConfirm.setAttribute("class",parameters.confirmButtonClass);
			}
			this.modalConfirm.addEventListener("click",this.modalClose.onclick);
		}
		if (typeof parameters.confirmButton != "undefined" && !parameters.confirmButton &&
			typeof parameters.cancelButton != "undefined" && !parameters.cancelButton) {
            this.modalFooter.remove();
        }
		this.modalOverlay.onclick = function () {
			if (!self.settings.lock) {
				self.close();
			} else {
				return false;
			}
		};

		if (window.addEventListener) {
			window.addEventListener('resize', this.centerModal, false);
		} else if (window.attachEvent) {
			window.attachEvent('onresize', this.centerModal);
		}

		if (this.settings.draggable) {
			this.modalHeader.style.cursor = 'move';
			this.modalHeader.onmousedown = function (e) {
				self.drag(e);
				return false;
			};
		} else {
			this.modalHeader.onmousedown = function () {
				return false;
			};
		}
		if (this.settings.closeAfter > 0) {
			this.closeModalEvent = window.setTimeout(function () {
				self.close();
			}, this.settings.closeAfter * 1000);
		}
		if (this.settings.openCallback) {
			this.settings.openCallback();
		}
	}
	close() {
		this.modalContent.innerHTML = '';
		this.modalOverlay.setAttribute('style', '');
		this.modalOverlay.style.cssText = '';
		this.modalOverlay.style.visibility = 'hidden';
		this.modalContainer.setAttribute('style', '');
		this.modalContainer.style.cssText = '';
		this.modalContainer.style.visibility = 'hidden';
		this.modalHeader.style.cursor = 'default';
		this.modalClose.setAttribute('style', '');
		this.modalClose.style.cssText = '';

		if (this.closeModalEvent) {
			window.clearTimeout(this.closeModalEvent);
		}

		if (this.settings.closeCallback) {
			this.settings.closeCallback();
		}

		if (window.removeEventListener) {
			window.removeEventListener('resize', this.centerModal, false);
		} else if (window.detachEvent) {
			window.detachEvent('onresize', this.centerModal);
		}
	}

	center(parameters) {
		var documentHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),

			modalWidth = Math.max(this.modalContainer.clientWidth, this.modalContainer.offsetWidth),
			modalHeight = Math.max(this.modalContainer.clientHeight, this.modalContainer.offsetHeight),

			browserWidth = 0,
			browserHeight = 0,

			amountScrolledX = 0,
			amountScrolledY = 0;

		if (typeof (window.innerWidth) === 'number') {
			browserWidth = window.innerWidth;
			browserHeight = window.innerHeight;
		} else if (document.documentElement && document.documentElement.clientWidth) {
			browserWidth = document.documentElement.clientWidth;
			browserHeight = document.documentElement.clientHeight;
		}

		if (typeof (window.pageYOffset) === 'number') {
			amountScrolledY = window.pageYOffset;
			amountScrolledX = window.pageXOffset;
		} else if (document.body && document.body.scrollLeft) {
			amountScrolledY = document.body.scrollTop;
			amountScrolledX = document.body.scrollLeft;
		} else if (document.documentElement && document.documentElement.scrollLeft) {
			amountScrolledY = document.documentElement.scrollTop;
			amountScrolledX = document.documentElement.scrollLeft;
		}

		if (!parameters.horizontalOnly) {
			this.modalContainer.style.top = amountScrolledY + (browserHeight / 2) - (modalHeight / 2) + 'px';
		}

		this.modalContainer.style.left = amountScrolledX + (browserWidth / 2) - (modalWidth / 2) + 'px';

		this.modalOverlay.style.height = documentHeight + 'px';
		this.modalOverlay.style.width = '100%';
	}
	drag(e) {
		var self = this;
		var xPosition = (window.event !== undefined) ? window.event.clientX : e.clientX,
			yPosition = (window.event !== undefined) ? window.event.clientY : e.clientY,
			differenceX = xPosition - this.modalContainer.offsetLeft,
			differenceY = yPosition - this.modalContainer.offsetTop;

		document.onmousemove = function (e) {
			xPosition = (window.event !== undefined) ? window.event.clientX : e.clientX;
			yPosition = (window.event !== undefined) ? window.event.clientY : e.clientY;

			self.modalContainer.style.left = ((xPosition - differenceX) > 0) ? (xPosition - differenceX) + 'px' : 0;
			self.modalContainer.style.top = ((yPosition - differenceY) > 0) ? (yPosition - differenceY) + 'px' : 0;

			document.onmouseup = function () {
				window.document.onmousemove = null;
			};
		};
	}
	ajax(url, successCallback) {
		var self = this;
		var i,
			XMLHttpRequestObject = false,
			XMLHttpRequestObjects = [
				function () {
					return new window.XMLHttpRequest();  // IE7+, Firefox, Chrome, Opera, Safari
				},
				function () {
					return new window.ActiveXObject('Msxml2.XMLHTTP.6.0');
				},
				function () {
					return new window.ActiveXObject('Msxml2.XMLHTTP.3.0');
				},
				function () {
					return new window.ActiveXObject('Msxml2.XMLHTTP');
				}
			];
		for (i = 0; i < XMLHttpRequestObjects.length; i += 1) {
			try {
				XMLHttpRequestObject = XMLHttpRequestObjects[i]();
			} catch (ignore) {
			}

			if (XMLHttpRequestObject !== false) {
				break;
			}
		}
		XMLHttpRequestObject.open('GET', url, true);
		
		XMLHttpRequestObject.onreadystatechange = function () {
			if (XMLHttpRequestObject.readyState === 4) {
				if (XMLHttpRequestObject.status === 200) {
					successCallback(XMLHttpRequestObject.responseText);
					self.modalContainer.removeAttribute('class');
				} else {
					successCallback(XMLHttpRequestObject.responseText);
					self.modalContainer.removeAttribute('class');
				}
			}
		};
		XMLHttpRequestObject.send(null);
	}
}