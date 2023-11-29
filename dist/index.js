function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var fabric = require('fabric');
var EventEmitter = _interopDefault(require('events'));
var hotkeys = _interopDefault(require('hotkeys-js'));
var Select = _interopDefault(require('react-select'));
var reactColor = require('react-color');
var FontFaceObserver = _interopDefault(require('fontfaceobserver'));
var axios = _interopDefault(require('axios'));
var toast = require('react-hot-toast');
var toast__default = _interopDefault(toast);
var fileSaver = require('file-saver');
var reactSortableHoc = require('react-sortable-hoc');
var LoadingOverlay = _interopDefault(require('react-loading-overlay'));

// A type of promise-like that resolves synchronously and supports only one observer
const _Pact = /*#__PURE__*/(function() {
	function _Pact() {}
	_Pact.prototype.then = function(onFulfilled, onRejected) {
		const result = new _Pact();
		const state = this.s;
		if (state) {
			const callback = state & 1 ? onFulfilled : onRejected;
			if (callback) {
				try {
					_settle(result, 1, callback(this.v));
				} catch (e) {
					_settle(result, 2, e);
				}
				return result;
			} else {
				return this;
			}
		}
		this.o = function(_this) {
			try {
				const value = _this.v;
				if (_this.s & 1) {
					_settle(result, 1, onFulfilled ? onFulfilled(value) : value);
				} else if (onRejected) {
					_settle(result, 1, onRejected(value));
				} else {
					_settle(result, 2, value);
				}
			} catch (e) {
				_settle(result, 2, e);
			}
		};
		return result;
	};
	return _Pact;
})();

// Settles a pact synchronously
function _settle(pact, state, value) {
	if (!pact.s) {
		if (value instanceof _Pact) {
			if (value.s) {
				if (state & 1) {
					state = value.s;
				}
				value = value.v;
			} else {
				value.o = _settle.bind(null, pact, state);
				return;
			}
		}
		if (value && value.then) {
			value.then(_settle.bind(null, pact, state), _settle.bind(null, pact, 2));
			return;
		}
		pact.s = state;
		pact.v = value;
		const observer = pact.o;
		if (observer) {
			observer(pact);
		}
	}
}

function _isSettledPact(thenable) {
	return thenable instanceof _Pact && thenable.s & 1;
}

// Asynchronously iterate through an object that has a length property, passing the index as the first argument to the callback (even as the length property changes)
function _forTo(array, body, check) {
	var i = -1, pact, reject;
	function _cycle(result) {
		try {
			while (++i < array.length && (!check || !check())) {
				result = body(i);
				if (result && result.then) {
					if (_isSettledPact(result)) {
						result = result.v;
					} else {
						result.then(_cycle, reject || (reject = _settle.bind(null, pact = new _Pact(), 2)));
						return;
					}
				}
			}
			if (pact) {
				_settle(pact, 1, result);
			} else {
				pact = result;
			}
		} catch (e) {
			_settle(pact || (pact = new _Pact()), 2, e);
		}
	}
	_cycle();
	return pact;
}

const _iteratorSymbol = /*#__PURE__*/ typeof Symbol !== "undefined" ? (Symbol.iterator || (Symbol.iterator = Symbol("Symbol.iterator"))) : "@@iterator";

const _asyncIteratorSymbol = /*#__PURE__*/ typeof Symbol !== "undefined" ? (Symbol.asyncIterator || (Symbol.asyncIterator = Symbol("Symbol.asyncIterator"))) : "@@asyncIterator";

// Asynchronously call a function and send errors to recovery continuation
function _catch(body, recover) {
	try {
		var result = body();
	} catch(e) {
		return recover(e);
	}
	if (result && result.then) {
		return result.then(void 0, recover);
	}
	return result;
}

// Asynchronously await a promise and pass the result to a finally continuation
function _finallyRethrows(body, finalizer) {
	try {
		var result = body();
	} catch (e) {
		return finalizer(true, e);
	}
	if (result && result.then) {
		return result.then(finalizer.bind(null, false), finalizer.bind(null, true));
	}
	return finalizer(false, result);
}

var styles = {"workContent":"_styles-module__workContent__2NudB"};

function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  _setPrototypeOf(subClass, superClass);
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}
function _objectDestructuringEmpty(obj) {
  if (obj == null) throw new TypeError("Cannot destructure " + obj);
}
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
function _createForOfIteratorHelperLoose(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (it) return (it = it.call(o)).next.bind(it);
  if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
    if (it) o = it;
    var i = 0;
    return function () {
      if (i >= o.length) return {
        done: true
      };
      return {
        done: false,
        value: o[i++]
      };
    };
  }
  throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var _this = undefined;
var throttle = function throttle(fn, timer) {
  var time = null;
  return function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    if (time) clearTimeout(time);
    time = setTimeout(function () {
      fn.apply(_this, args);
    }, timer);
  };
};
function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0;
    var v = c === 'x' ? r : r & 0x3 | 0x8;
    return v.toString(16);
  });
}
function retainNumber(value) {
  if (!value) return '0';
  var result = ('' + value).replace(/[^0-9]/g, '');
  return Number(result) + '';
}

function initAligningGuidelines(canvas) {
  var disabled = false;
  var ctx = canvas.getSelectionContext();
  var aligningLineOffset = 5;
  var aligningLineMargin = 4;
  var aligningLineWidth = 1;
  var aligningLineColor = 'rgb(0,255,0)';
  var viewportTransform;
  var zoom = 1;
  function drawVerticalLine(coords) {
    drawLine(coords.x + 0.5, coords.y1 > coords.y2 ? coords.y2 : coords.y1, coords.x + 0.5, coords.y2 > coords.y1 ? coords.y2 : coords.y1);
  }
  function drawHorizontalLine(coords) {
    drawLine(coords.x1 > coords.x2 ? coords.x2 : coords.x1, coords.y + 0.5, coords.x2 > coords.x1 ? coords.x2 : coords.x1, coords.y + 0.5);
  }
  function drawLine(x1, y1, x2, y2) {
    if (viewportTransform == null || disabled) return;
    ctx.save();
    ctx.lineWidth = aligningLineWidth;
    ctx.strokeStyle = aligningLineColor;
    ctx.beginPath();
    ctx.moveTo(x1 * zoom + viewportTransform[4], y1 * zoom + viewportTransform[5]);
    ctx.lineTo(x2 * zoom + viewportTransform[4], y2 * zoom + viewportTransform[5]);
    ctx.stroke();
    ctx.restore();
  }
  function isInRange(value1, value2) {
    value1 = Math.round(value1);
    value2 = Math.round(value2);
    for (var i = value1 - aligningLineMargin, len = value1 + aligningLineMargin; i <= len; i++) {
      if (i === value2) {
        return true;
      }
    }
    return false;
  }
  var verticalLines = [];
  var horizontalLines = [];
  canvas.on('mouse:down', function () {
    viewportTransform = canvas.viewportTransform;
    zoom = canvas.getZoom();
  });
  canvas.on('object:moving', function (e) {
    if (viewportTransform === undefined || e.target === undefined) return;
    var activeObject = e.target;
    var canvasObjects = canvas.getObjects();
    var activeObjectCenter = activeObject.getCenterPoint();
    var activeObjectLeft = activeObjectCenter.x;
    var activeObjectTop = activeObjectCenter.y;
    var activeObjectBoundingRect = activeObject.getBoundingRect();
    var activeObjectHeight = activeObjectBoundingRect.height / viewportTransform[3];
    var activeObjectWidth = activeObjectBoundingRect.width / viewportTransform[0];
    var horizontalInTheRange = false;
    var verticalInTheRange = false;
    var transform = canvas._currentTransform;
    if (!transform) return;
    for (var i = canvasObjects.length; i--;) {
      if (canvasObjects[i] === activeObject) continue;
      if (activeObject instanceof fabric.fabric.GuideLine && canvasObjects[i] instanceof fabric.fabric.GuideLine) {
        continue;
      }
      var objectCenter = canvasObjects[i].getCenterPoint();
      var objectLeft = objectCenter.x;
      var objectTop = objectCenter.y;
      var objectBoundingRect = canvasObjects[i].getBoundingRect();
      var objectHeight = objectBoundingRect.height / viewportTransform[3];
      var objectWidth = objectBoundingRect.width / viewportTransform[0];
      if (isInRange(objectLeft, activeObjectLeft)) {
        verticalInTheRange = true;
        verticalLines.push({
          x: objectLeft,
          y1: objectTop < activeObjectTop ? objectTop - objectHeight / 2 - aligningLineOffset : objectTop + objectHeight / 2 + aligningLineOffset,
          y2: activeObjectTop > objectTop ? activeObjectTop + activeObjectHeight / 2 + aligningLineOffset : activeObjectTop - activeObjectHeight / 2 - aligningLineOffset
        });
        activeObject.setPositionByOrigin(new fabric.fabric.Point(objectLeft, activeObjectTop), 'center', 'center');
      }
      if (isInRange(objectLeft - objectWidth / 2, activeObjectLeft - activeObjectWidth / 2)) {
        verticalInTheRange = true;
        verticalLines.push({
          x: objectLeft - objectWidth / 2,
          y1: objectTop < activeObjectTop ? objectTop - objectHeight / 2 - aligningLineOffset : objectTop + objectHeight / 2 + aligningLineOffset,
          y2: activeObjectTop > objectTop ? activeObjectTop + activeObjectHeight / 2 + aligningLineOffset : activeObjectTop - activeObjectHeight / 2 - aligningLineOffset
        });
        activeObject.setPositionByOrigin(new fabric.fabric.Point(objectLeft - objectWidth / 2 + activeObjectWidth / 2, activeObjectTop), 'center', 'center');
      }
      if (isInRange(objectLeft + objectWidth / 2, activeObjectLeft + activeObjectWidth / 2)) {
        verticalInTheRange = true;
        verticalLines.push({
          x: objectLeft + objectWidth / 2,
          y1: objectTop < activeObjectTop ? objectTop - objectHeight / 2 - aligningLineOffset : objectTop + objectHeight / 2 + aligningLineOffset,
          y2: activeObjectTop > objectTop ? activeObjectTop + activeObjectHeight / 2 + aligningLineOffset : activeObjectTop - activeObjectHeight / 2 - aligningLineOffset
        });
        activeObject.setPositionByOrigin(new fabric.fabric.Point(objectLeft + objectWidth / 2 - activeObjectWidth / 2, activeObjectTop), 'center', 'center');
      }
      if (isInRange(objectTop, activeObjectTop)) {
        horizontalInTheRange = true;
        horizontalLines.push({
          y: objectTop,
          x1: objectLeft < activeObjectLeft ? objectLeft - objectWidth / 2 - aligningLineOffset : objectLeft + objectWidth / 2 + aligningLineOffset,
          x2: activeObjectLeft > objectLeft ? activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset : activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset
        });
        activeObject.setPositionByOrigin(new fabric.fabric.Point(activeObjectLeft, objectTop), 'center', 'center');
      }
      if (isInRange(objectTop - objectHeight / 2, activeObjectTop - activeObjectHeight / 2)) {
        horizontalInTheRange = true;
        horizontalLines.push({
          y: objectTop - objectHeight / 2,
          x1: objectLeft < activeObjectLeft ? objectLeft - objectWidth / 2 - aligningLineOffset : objectLeft + objectWidth / 2 + aligningLineOffset,
          x2: activeObjectLeft > objectLeft ? activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset : activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset
        });
        activeObject.setPositionByOrigin(new fabric.fabric.Point(activeObjectLeft, objectTop - objectHeight / 2 + activeObjectHeight / 2), 'center', 'center');
      }
      if (isInRange(objectTop + objectHeight / 2, activeObjectTop + activeObjectHeight / 2)) {
        horizontalInTheRange = true;
        horizontalLines.push({
          y: objectTop + objectHeight / 2,
          x1: objectLeft < activeObjectLeft ? objectLeft - objectWidth / 2 - aligningLineOffset : objectLeft + objectWidth / 2 + aligningLineOffset,
          x2: activeObjectLeft > objectLeft ? activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset : activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset
        });
        activeObject.setPositionByOrigin(new fabric.fabric.Point(activeObjectLeft, objectTop + objectHeight / 2 - activeObjectHeight / 2), 'center', 'center');
      }
    }
    if (!horizontalInTheRange) {
      horizontalLines.length = 0;
    }
    if (!verticalInTheRange) {
      verticalLines.length = 0;
    }
  });
  canvas.on('before:render', function () {
    try {
      canvas.clearContext(canvas.contextTop);
    } catch (error) {
      console.log(error);
    }
  });
  canvas.on('after:render', function () {
    for (var i = verticalLines.length; i--;) {
      drawVerticalLine(verticalLines[i]);
    }
    for (var j = horizontalLines.length; j--;) {
      drawHorizontalLine(horizontalLines[j]);
    }
    verticalLines.length = 0;
    horizontalLines.length = 0;
  });
  canvas.on('mouse:up', function () {
    verticalLines.length = 0;
    horizontalLines.length = 0;
    canvas.renderAll();
  });
  return {
    disable: function disable() {
      return disabled = true;
    },
    enable: function enable() {
      return disabled = false;
    }
  };
}

function rotateIcon(angle) {
  return "url(\"data:image/svg+xml,%3Csvg height='18' width='18' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg' style='color: black;'%3E%3Cg fill='none' transform='rotate(" + angle + " 16 16)'%3E%3Cpath d='M22.4484 0L32 9.57891L22.4484 19.1478V13.1032C17.6121 13.8563 13.7935 17.6618 13.0479 22.4914H19.2141L9.60201 32.01L0 22.4813H6.54912C7.36524 14.1073 14.0453 7.44023 22.4484 6.61688V0Z' fill='white'/%3E%3Cpath d='M24.0605 3.89587L29.7229 9.57896L24.0605 15.252V11.3562C17.0479 11.4365 11.3753 17.0895 11.3048 24.0879H15.3048L9.60201 29.7308L3.90932 24.0879H8.0806C8.14106 15.3223 15.2645 8.22345 24.0605 8.14313V3.89587Z' fill='black'/%3E%3C/g%3E%3C/svg%3E \") 12 12,crosshair";
}
function initControlsRotate(canvas) {
  fabric.fabric.Object.prototype.controls.mtr = new fabric.fabric.Control({
    x: -0.5,
    y: -0.5,
    offsetY: -10,
    offsetX: -10,
    rotate: 20,
    actionName: 'rotate',
    actionHandler: fabric.fabric.controlsUtils.rotationWithSnapping,
    render: function render() {
      return '';
    }
  });
  fabric.fabric.Object.prototype.controls.mtr2 = new fabric.fabric.Control({
    x: 0.5,
    y: -0.5,
    offsetY: -10,
    offsetX: 10,
    rotate: 20,
    actionName: 'rotate',
    actionHandler: fabric.fabric.controlsUtils.rotationWithSnapping,
    render: function render() {
      return '';
    }
  });
  fabric.fabric.Object.prototype.controls.mtr3 = new fabric.fabric.Control({
    x: 0.5,
    y: 0.5,
    offsetY: 10,
    offsetX: 10,
    rotate: 20,
    actionName: 'rotate',
    actionHandler: fabric.fabric.controlsUtils.rotationWithSnapping,
    render: function render() {
      return '';
    }
  });
  fabric.fabric.Object.prototype.controls.mtr4 = new fabric.fabric.Control({
    x: -0.5,
    y: 0.5,
    offsetY: 10,
    offsetX: -10,
    rotate: 20,
    actionName: 'rotate',
    actionHandler: fabric.fabric.controlsUtils.rotationWithSnapping,
    render: function render() {
      return '';
    }
  });
  canvas.on('after:render', function () {
    var _activeObj$angle;
    var activeObj = canvas.getActiveObject();
    var angle = activeObj === null || activeObj === void 0 ? void 0 : (_activeObj$angle = activeObj.angle) === null || _activeObj$angle === void 0 ? void 0 : _activeObj$angle.toFixed(2);
    if (angle !== undefined) {
      fabric.fabric.Object.prototype.controls.mtr.cursorStyle = rotateIcon(Number(angle));
      fabric.fabric.Object.prototype.controls.mtr2.cursorStyle = rotateIcon(Number(angle) + 90);
      fabric.fabric.Object.prototype.controls.mtr3.cursorStyle = rotateIcon(Number(angle) + 180);
      fabric.fabric.Object.prototype.controls.mtr4.cursorStyle = rotateIcon(Number(angle) + 270);
    }
  });
  canvas.on('object:rotating', function (event) {
    var _canvas$getActiveObje, _canvas$getActiveObje2, _event$transform;
    var body = canvas.lowerCanvasEl.nextSibling;
    var angle = (_canvas$getActiveObje = canvas.getActiveObject()) === null || _canvas$getActiveObje === void 0 ? void 0 : (_canvas$getActiveObje2 = _canvas$getActiveObje.angle) === null || _canvas$getActiveObje2 === void 0 ? void 0 : _canvas$getActiveObje2.toFixed(2);
    if (angle === undefined) return;
    switch ((_event$transform = event.transform) === null || _event$transform === void 0 ? void 0 : _event$transform.corner) {
      case 'mtr':
        body.style.cursor = rotateIcon(Number(angle));
        break;
      case 'mtr2':
        body.style.cursor = rotateIcon(Number(angle) + 90);
        break;
      case 'mtr3':
        body.style.cursor = rotateIcon(Number(angle) + 180);
        break;
      case 'mtr4':
        body.style.cursor = rotateIcon(Number(angle) + 270);
        break;
    }
  });
}

var CenterAlign = /*#__PURE__*/function () {
  function CenterAlign(canvas) {
    this.canvas = canvas;
  }
  var _proto = CenterAlign.prototype;
  _proto.centerH = function centerH(workspace, object) {
    return this.canvas._centerObject(object, new fabric.fabric.Point(workspace.getCenterPoint().x, object.getCenterPoint().y));
  };
  _proto.center = function center(workspace, object) {
    var center = workspace.getCenterPoint();
    return this.canvas._centerObject(object, center);
  };
  _proto.centerV = function centerV(workspace, object) {
    return this.canvas._centerObject(object, new fabric.fabric.Point(object.getCenterPoint().x, workspace.getCenterPoint().y));
  };
  _proto.position = function position(name) {
    var anignType = ['centerH', 'center', 'centerV'];
    var activeObject = this.canvas.getActiveObject();
    if (anignType.includes(name) && activeObject) {
      var defaultWorkspace = this.canvas.getObjects().find(function (item) {
        return item.id === 'workspace';
      });
      if (defaultWorkspace) {
        this[name](defaultWorkspace, activeObject);
      }
      this.canvas.renderAll();
    }
  };
  return CenterAlign;
}();

var KeyNames = {
  lrdu: 'left,right,down,up',
  shiftMove: 'shift+left,shift+right,shift+down,shift+up',
  "delete": 'delete,backspace',
  ctrlz: 'ctrl+z,command+z',
  ctrlshiftz: 'ctrl+shift+z,command+shift+z',
  enter: 'enter',
  esc: 'esc',
  zoom: 'command+*,command+*,ctrl+*,ctrl+*'
};

function initHotkeys(canvas) {
  hotkeys(KeyNames.lrdu, function (_event, handler) {
    var activeObject = canvas.getActiveObject();
    if (!activeObject) return;
    switch (handler.key) {
      case 'left':
        if (activeObject.left === undefined) return;
        activeObject.set('left', activeObject.left - 1);
        break;
      case 'right':
        if (activeObject.left === undefined) return;
        activeObject.set('left', activeObject.left + 1);
        break;
      case 'down':
        if (activeObject.top === undefined) return;
        activeObject.set('top', activeObject.top + 1);
        break;
      case 'up':
        if (activeObject.top === undefined) return;
        activeObject.set('top', activeObject.top - 1);
        break;
    }
    canvas.renderAll();
  });
  hotkeys(KeyNames.shiftMove, function (_event, handler) {
    var activeObject = canvas.getActiveObject();
    if (!activeObject) return;
    switch (handler.key) {
      case 'shift+left':
        if (activeObject.left === undefined) return;
        activeObject.set('left', activeObject.left - 10);
        break;
      case 'shift+right':
        if (activeObject.left === undefined) return;
        activeObject.set('left', activeObject.left + 10);
        break;
      case 'shift+down':
        if (activeObject.top === undefined) return;
        activeObject.set('top', activeObject.top + 10);
        break;
      case 'shift+up':
        if (activeObject.top === undefined) return;
        activeObject.set('top', activeObject.top - 10);
        break;
    }
    canvas.renderAll();
  });
}

var Types = {
  CHANGE_SCALE: 'changeScale',
  CANVAS_CHANGE: 'canvasChange',
  CLIP_IMAGE: 'clipImage',
  SHOW_LOADING: 'show_loading'
};

var events = new EventEmitter();

var isNumber = function isNumber(value) {
  return typeof value === 'number';
};
var isUndef = function isUndef(value) {
  return typeof value === 'undefined';
};

var verticalImg = 'https://ossprod.jrdaimao.com/file/1691055918106919.svg';
var edgeImg = 'https://ossprod.jrdaimao.com/file/1691055938230666.svg';
var rotateImg = 'https://ossprod.jrdaimao.com/file/1691574701262500.svg';
var horizontalImg = 'https://ossprod.jrdaimao.com/file/1691055964267980.svg';
var copyImg = 'https://ossprod.jrdaimao.com/file/1691660518949720.svg';
var deleteImg = 'https://ossprod.jrdaimao.com/file/1691662370382182.svg';
var clipImg = 'https://ossprod.jrdaimao.com/file/1691718842537240.svg';
var topBgImg = 'https://ossprod.jrdaimao.com/file/1691978616647204.svg';
fabric.fabric.Object.NUM_FRACTION_DIGITS = 4;
var setBaseControlVisible = function setBaseControlVisible(object, visible) {
  if (!object) return;
  object.setControlsVisibility({
    mt: visible,
    mb: visible,
    ml: visible,
    mr: visible,
    tl: visible,
    tr: visible,
    bl: visible,
    br: visible
  });
};
var setHighControlVisible = function setHighControlVisible(object, visible) {
  if (!object) return;
  object.setControlsVisibility({
    copy: visible,
    "delete": visible,
    clip: visible,
    rotate: visible,
    topBg: visible
  });
};
function drawImg(ctx, left, top, img, wSize, hSize, angle) {
  if (angle === undefined) return;
  ctx.save();
  ctx.translate(left, top);
  ctx.rotate(fabric.fabric.util.degreesToRadians(angle));
  ctx.drawImage(img, -wSize / 2, -hSize / 2, wSize, hSize);
  ctx.restore();
}
function intervalControl() {
  var verticalImgIcon = document.createElement('img');
  verticalImgIcon.src = verticalImg;
  var horizontalImgIcon = document.createElement('img');
  horizontalImgIcon.src = horizontalImg;
  function renderIcon(ctx, left, top, styleOverride, fabricObject) {
    drawImg(ctx, left, top, verticalImgIcon, 20, 25, fabricObject.angle);
  }
  function renderIconHoz(ctx, left, top, styleOverride, fabricObject) {
    drawImg(ctx, left, top, horizontalImgIcon, 25, 20, fabricObject.angle);
  }
  fabric.fabric.Object.prototype.controls.ml = new fabric.fabric.Control({
    x: -0.5,
    y: 0,
    offsetX: -1,
    cursorStyleHandler: fabric.fabric.controlsUtils.scaleSkewCursorStyleHandler,
    actionHandler: fabric.fabric.controlsUtils.scalingXOrSkewingY,
    getActionName: fabric.fabric.controlsUtils.scaleOrSkewActionName,
    render: renderIcon
  });
  fabric.fabric.Object.prototype.controls.mr = new fabric.fabric.Control({
    x: 0.5,
    y: 0,
    offsetX: 1,
    cursorStyleHandler: fabric.fabric.controlsUtils.scaleSkewCursorStyleHandler,
    actionHandler: fabric.fabric.controlsUtils.scalingXOrSkewingY,
    getActionName: fabric.fabric.controlsUtils.scaleOrSkewActionName,
    render: renderIcon
  });
  fabric.fabric.Object.prototype.controls.mb = new fabric.fabric.Control({
    x: 0,
    y: 0.5,
    offsetY: 1,
    cursorStyleHandler: fabric.fabric.controlsUtils.scaleSkewCursorStyleHandler,
    actionHandler: fabric.fabric.controlsUtils.scalingYOrSkewingX,
    getActionName: fabric.fabric.controlsUtils.scaleOrSkewActionName,
    render: renderIconHoz
  });
  fabric.fabric.Object.prototype.controls.mt = new fabric.fabric.Control({
    x: 0,
    y: -0.5,
    offsetY: -1,
    cursorStyleHandler: fabric.fabric.controlsUtils.scaleSkewCursorStyleHandler,
    actionHandler: fabric.fabric.controlsUtils.scalingYOrSkewingX,
    getActionName: fabric.fabric.controlsUtils.scaleOrSkewActionName,
    render: renderIconHoz
  });
}
function peakControl() {
  var img = document.createElement('img');
  img.src = edgeImg;
  function renderIconEdge(ctx, left, top, styleOverride, fabricObject) {
    drawImg(ctx, left, top, img, 25, 25, fabricObject.angle);
  }
  fabric.fabric.Object.prototype.controls.tl = new fabric.fabric.Control({
    x: -0.5,
    y: -0.5,
    cursorStyleHandler: fabric.fabric.controlsUtils.scaleCursorStyleHandler,
    actionHandler: fabric.fabric.controlsUtils.scalingEqually,
    render: renderIconEdge
  });
  fabric.fabric.Object.prototype.controls.bl = new fabric.fabric.Control({
    x: -0.5,
    y: 0.5,
    cursorStyleHandler: fabric.fabric.controlsUtils.scaleCursorStyleHandler,
    actionHandler: fabric.fabric.controlsUtils.scalingEqually,
    render: renderIconEdge
  });
  fabric.fabric.Object.prototype.controls.tr = new fabric.fabric.Control({
    x: 0.5,
    y: -0.5,
    cursorStyleHandler: fabric.fabric.controlsUtils.scaleCursorStyleHandler,
    actionHandler: fabric.fabric.controlsUtils.scalingEqually,
    render: renderIconEdge
  });
  fabric.fabric.Object.prototype.controls.br = new fabric.fabric.Control({
    x: 0.5,
    y: 0.5,
    cursorStyleHandler: fabric.fabric.controlsUtils.scaleCursorStyleHandler,
    actionHandler: fabric.fabric.controlsUtils.scalingEqually,
    render: renderIconEdge
  });
}
function rotationControl() {
  var img = document.createElement('img');
  img.src = rotateImg;
  function renderIconRotate(ctx, left, top, styleOverride, fabricObject) {
    drawImg(ctx, left, top, img, 60, 60, fabricObject.angle);
  }
  fabric.fabric.Object.prototype.controls.rotate = new fabric.fabric.Control({
    y: 0.5,
    cursorStyleHandler: fabric.fabric.controlsUtils.rotationStyleHandler,
    actionHandler: fabric.fabric.controlsUtils.rotationWithSnapping,
    offsetY: 25,
    actionName: 'rotate',
    cursorStyle: 'pointer',
    render: renderIconRotate
  });
}
function initMainControl() {
  var topBgEl = document.createElement('img');
  topBgEl.src = topBgImg;
  var copyImageEl = document.createElement('img');
  copyImageEl.src = copyImg;
  var deleteImageEl = document.createElement('img');
  deleteImageEl.src = deleteImg;
  var clipImageEl = document.createElement('img');
  clipImageEl.src = clipImg;
  function cloneObject(eventData, transform) {
    var target = transform.target;
    if (!target) return;
    var canvas = target.canvas;
    events.emit(Types.SHOW_LOADING, true);
    target.clone(function (cloned) {
      cloned.set({
        id: uuid(),
        left: target.left + 20,
        top: target.top + 20,
        sourceSrc: target.sourceSrc,
        rawScaleX: target.rawScaleX,
        rawScaleY: target.rawScaleY,
        rectDiffLeft: target.rectDiffLeft,
        rectDiffTop: target.rectDiffTop,
        prevWidth: target.prevWidth,
        prevHeight: target.prevHeight
      });
      cloned.setCoords();
      canvas.add(cloned);
      canvas.setActiveObject(cloned);
      canvas.renderAll();
      events.emit(Types.SHOW_LOADING, false);
    });
  }
  function deleteObject(eventData, transform) {
    var target = transform.target;
    if (!target) return;
    var canvas = target.canvas;
    var clipRect = canvas.getObjects().find(function (item) {
      return item.id === 'currentClipRect';
    });
    if (clipRect) {
      canvas.remove(clipRect);
    }
    canvas.remove(target);
    canvas.requestRenderAll();
  }
  function clipObject(eventData, transform) {
    var image = transform.target;
    if (image.type !== 'image') return;
    var canvas = image.canvas;
    var rectLeft = image.left;
    var rectTop = image.top;
    var sourceSrc = image.sourceSrc;
    var rawScaleX = image.rawScaleX || image.scaleX;
    var rawScaleY = image.rawScaleY || image.scaleY;
    var rectDiffLeft = image.rectDiffLeft;
    var rectDiffTop = image.rectDiffTop;
    var index = canvas.getObjects().findIndex(function (item) {
      return item.id === image.id;
    });
    var sourceWidth = image.getScaledWidth();
    var sourceHeight = image.getScaledHeight();
    image.clone(function (o) {
      return image.set({
        cloneObject: o
      });
    });
    if (sourceSrc) {
      image.setSrc(sourceSrc, function () {
        canvas.renderAll();
      }, {
        crossOrigin: 'anonymous'
      });
      image.set({
        id: 'clipRawImage',
        scaleX: rawScaleX,
        scaleY: rawScaleY,
        left: !isUndef(rectDiffLeft) ? image.left - rectDiffLeft * image.scaleX : image.left,
        top: !isUndef(rectDiffTop) ? image.top - rectDiffTop * image.scaleY : image.top
      });
    }
    image.bringToFront();
    setHighControlVisible(image, false);
    var selectionRect = new fabric.fabric.Rect({
      left: rectLeft,
      top: rectTop,
      fill: "rgba(0,0,0,0.3)",
      originX: "left",
      originY: "top",
      stroke: "black",
      opacity: 1,
      width: sourceWidth,
      height: sourceHeight,
      hasRotatingPoint: false,
      transparentCorners: false,
      cornerColor: "white",
      cornerStrokeColor: "black",
      borderColor: "black",
      cornerSize: 12,
      padding: 0,
      cornerStyle: "circle",
      borderDashArray: [5, 5],
      borderScaleFactor: 1.3,
      id: 'currentClipRect',
      lockMovementX: true,
      lockMovementY: true,
      hoverCursor: 'default'
    });
    image.set({
      sourceSrc: image.sourceSrc || image._element.src
    });
    var selectionRectDown = false;
    var imageDown = false;
    selectionRect.on('mousedown', function (_ref) {
      _objectDestructuringEmpty(_ref);
      return selectionRectDown = true;
    });
    selectionRect.on('scaling', function () {
      return selectionRectDown = false;
    });
    selectionRect.on('mousemove', function (_ref2) {
      var e = _ref2.e;
      if (!selectionRectDown) return;
      setBaseControlVisible(selectionRect, false);
      image.set({
        left: image.left + e.movementX,
        top: image.top + e.movementY
      });
      if (image.left > selectionRect.left) {
        image.set({
          left: selectionRect.left
        });
      }
      var rectWidth = selectionRect.getScaledWidth();
      if (image.left + image.getScaledWidth() <= selectionRect.left + rectWidth) {
        image.set({
          left: selectionRect.left + rectWidth - image.getScaledWidth()
        });
      }
      if (image.top > selectionRect.top) {
        image.set({
          top: selectionRect.top
        });
      }
      var rectHeight = selectionRect.getScaledHeight();
      if (image.top + image.getScaledHeight() <= selectionRect.top + rectHeight) {
        image.set({
          top: selectionRect.top + rectHeight - image.getScaledHeight()
        });
      }
      canvas.renderAll();
    });
    selectionRect.on('mouseup', function () {
      selectionRectDown = false;
      setBaseControlVisible(selectionRect, true);
      canvas.renderAll();
    });
    selectionRect.on('scaling', function (e) {
      var rect = e.transform.target;
      if (rect.left < image.left) {
        rect.set({
          left: image.left
        });
      }
      if (rect.top < image.top) {
        rect.set({
          top: image.top
        });
      }
      if (rect.left + rect.getScaledWidth() > image.left + image.getScaledWidth()) {
        rect.set({
          left: image.left + image.getScaledWidth() - rect.getScaledWidth()
        });
      }
      if (rect.top + rect.getScaledHeight() > image.top + image.getScaledHeight()) {
        rect.set({
          top: image.top + image.getScaledHeight() - rect.getScaledHeight()
        });
      }
      if (image.getScaledWidth() / rect.getScaledWidth() < 1) {
        rect.set({
          scaleX: image.getScaledWidth() / selectionRect.getScaledWidth() * rect.get('scaleX'),
          left: image.left
        });
      }
      if (image.getScaledHeight() / rect.getScaledHeight() < 1) {
        rect.set({
          scaleY: image.getScaledHeight() / selectionRect.getScaledHeight() * rect.get('scaleY'),
          top: image.top
        });
      }
      canvas.renderAll();
    });
    image.on('moving', function (e) {
      var image = e.transform.target;
      if (image.left > selectionRect.left) {
        image.set({
          left: selectionRect.left
        });
      }
      if (image.top > selectionRect.top) {
        image.set({
          top: selectionRect.top
        });
      }
      var rectWidth = selectionRect.getScaledWidth();
      if (image.left < selectionRect.left + rectWidth - image.getScaledWidth()) {
        image.set({
          left: selectionRect.left + rectWidth - image.getScaledWidth()
        });
      }
      var rectHeight = selectionRect.getScaledHeight();
      if (image.top < selectionRect.top + rectHeight - image.getScaledHeight()) {
        image.set({
          top: selectionRect.top + rectHeight - image.getScaledHeight()
        });
      }
      canvas.renderAll();
    });
    image.on('scaling', function (e) {
      var image = e.transform.target;
      if (image.left > selectionRect.left) {
        image.set({
          left: selectionRect.left
        });
      }
      if (image.top > selectionRect.top) {
        image.set({
          top: selectionRect.top
        });
      }
      if (selectionRect.getScaledWidth() / image.getScaledWidth() > 1) {
        image.set({
          scaleX: selectionRect.getScaledWidth() * image.get('scaleX') / image.getScaledWidth()
        });
      }
      if (selectionRect.getScaledHeight() / image.getScaledHeight() > 1) {
        image.set({
          scaleY: selectionRect.getScaledHeight() * image.get('scaleY') / image.getScaledHeight()
        });
      }
      canvas.renderAll();
    });
    image.on('mousedown', function () {
      return imageDown = true;
    });
    image.on('mousemove', function () {
      if (imageDown) {
        setBaseControlVisible(image, false);
        canvas.renderAll();
      }
    });
    image.on('mouseup', function () {
      imageDown = false;
      setBaseControlVisible(image, true);
      canvas.renderAll();
    });
    setHighControlVisible(selectionRect, false);
    canvas.add(selectionRect);
    canvas.setActiveObject(selectionRect);
    canvas.renderAll();
    events.emit(Types.CLIP_IMAGE, {
      visible: true,
      rawIndex: index,
      clipImageId: image.id
    });
  }
  fabric.fabric.Object.prototype.controls.topBg = new fabric.fabric.Control({
    y: -0.5,
    cursorStyleHandler: fabric.fabric.controlsUtils.rotationStyleHandler,
    mouseUpHandler: function mouseUpHandler() {},
    offsetY: -25,
    cursorStyle: 'pointer',
    render: function render(ctx, left, top, styleOverride, fabricObject) {
      if (fabricObject.type === 'image') {
        drawImg(ctx, left, top, topBgEl, 136, 68, fabricObject.angle);
      }
      if (fabricObject.type === 'i-text') {
        drawImg(ctx, left, top, topBgEl, 90, 68, fabricObject.angle);
      }
    }
  });
  fabric.fabric.Object.prototype.controls.copy = new fabric.fabric.Control({
    y: -0.5,
    cursorStyleHandler: fabric.fabric.controlsUtils.rotationStyleHandler,
    mouseUpHandler: cloneObject,
    offsetY: -25,
    offsetX: -30,
    cursorStyle: 'pointer',
    render: function render(ctx, left, top, styleOverride, fabricObject) {
      if (fabricObject.type === 'image') {
        drawImg(ctx, left, top, copyImageEl, 30, 30, fabricObject.angle);
      }
    }
  });
  fabric.fabric.Object.prototype.controls["delete"] = new fabric.fabric.Control({
    y: -0.5,
    cursorStyleHandler: fabric.fabric.controlsUtils.rotationStyleHandler,
    mouseUpHandler: deleteObject,
    offsetY: -25,
    offsetX: 30,
    cursorStyle: 'pointer',
    render: function render(ctx, left, top, styleOverride, fabricObject) {
      if (fabricObject.type === 'image') {
        drawImg(ctx, left, top, deleteImageEl, 30, 30, fabricObject.angle);
      }
    }
  });
  fabric.fabric.Object.prototype.controls.clip = new fabric.fabric.Control({
    y: -0.5,
    cursorStyleHandler: fabric.fabric.controlsUtils.rotationStyleHandler,
    mouseUpHandler: clipObject,
    offsetY: -25,
    offsetX: 0,
    cursorStyle: 'pointer',
    render: function render(ctx, left, top, styleOverride, fabricObject) {
      if (fabricObject.type === 'image') {
        drawImg(ctx, left, top, clipImageEl, 30, 30, fabricObject.angle);
      }
    }
  });
  fabric.fabric.Object.prototype.controls.textC = new fabric.fabric.Control({
    y: -0.5,
    cursorStyleHandler: fabric.fabric.controlsUtils.rotationStyleHandler,
    mouseUpHandler: cloneObject,
    offsetY: -25,
    offsetX: -15,
    cursorStyle: 'pointer',
    render: function render(ctx, left, top, styleOverride, fabricObject) {
      if (fabricObject.type === 'i-text') {
        drawImg(ctx, left, top, copyImageEl, 30, 30, fabricObject.angle);
      }
    }
  });
  fabric.fabric.Object.prototype.controls.textdelete = new fabric.fabric.Control({
    y: -0.5,
    cursorStyleHandler: fabric.fabric.controlsUtils.rotationStyleHandler,
    mouseUpHandler: deleteObject,
    offsetY: -25,
    offsetX: 15,
    cursorStyle: 'pointer',
    render: function render(ctx, left, top, styleOverride, fabricObject) {
      if (fabricObject.type === 'i-text') {
        drawImg(ctx, left, top, deleteImageEl, 30, 30, fabricObject.angle);
      }
    }
  });
}
function initControls(canvas) {
  peakControl();
  intervalControl();
  rotationControl();
  initMainControl();
  fabric.fabric.Object.prototype.set({
    transparentCorners: false,
    borderColor: '#51B9F9',
    cornerColor: '#FFF',
    borderScaleFactor: 2.5,
    cornerStyle: 'circle',
    cornerStrokeColor: '#0E98FC',
    borderOpacityWhenMoving: 1
  });
}

var getGap = function getGap(zoom) {
  var zooms = [0.02, 0.03, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10, 18];
  var gaps = [5000, 2500, 1000, 500, 250, 100, 50, 25, 10, 5, 2];
  var i = 0;
  while (i < zooms.length && zooms[i] < zoom) {
    i++;
  }
  return gaps[i - 1] || 5000;
};
var mergeLines = function mergeLines(rect, isHorizontal) {
  var axis = isHorizontal ? 'left' : 'top';
  var length = isHorizontal ? 'width' : 'height';
  rect.sort(function (a, b) {
    return a[axis] - b[axis];
  });
  var mergedLines = [];
  var currentLine = Object.assign({}, rect[0]);
  for (var _iterator = _createForOfIteratorHelperLoose(rect), _step; !(_step = _iterator()).done;) {
    var item = _step.value;
    var line = Object.assign({}, item);
    if (currentLine[axis] + currentLine[length] >= line[axis]) {
      currentLine[length] = Math.max(currentLine[axis] + currentLine[length], line[axis] + line[length]) - currentLine[axis];
    } else {
      mergedLines.push(currentLine);
      currentLine = Object.assign({}, line);
    }
  }
  mergedLines.push(currentLine);
  return mergedLines;
};
var darwLine = function darwLine(ctx, options) {
  ctx.save();
  var left = options.left,
    top = options.top,
    width = options.width,
    height = options.height,
    stroke = options.stroke,
    lineWidth = options.lineWidth;
  ctx.beginPath();
  stroke && (ctx.strokeStyle = stroke);
  ctx.lineWidth = lineWidth || 1;
  ctx.moveTo(left, top);
  ctx.lineTo(left + width, top + height);
  ctx.stroke();
  ctx.restore();
};
var darwText = function darwText(ctx, options) {
  ctx.save();
  var left = options.left,
    top = options.top,
    text = options.text,
    fill = options.fill,
    align = options.align,
    angle = options.angle,
    fontSize = options.fontSize;
  fill && (ctx.fillStyle = fill);
  ctx.textAlign = align || 'left';
  ctx.textBaseline = 'top';
  ctx.font = (fontSize || 10) + "px sans-serif";
  if (angle) {
    ctx.translate(left, top);
    ctx.rotate(Math.PI / 180 * angle);
    ctx.translate(-left, -top);
  }
  ctx.fillText(text, left, top);
  ctx.restore();
};
var darwRect = function darwRect(ctx, options) {
  ctx.save();
  var left = options.left,
    top = options.top,
    width = options.width,
    height = options.height,
    fill = options.fill,
    stroke = options.stroke,
    strokeWidth = options.strokeWidth;
  ctx.beginPath();
  fill && (ctx.fillStyle = fill);
  ctx.rect(left, top, width, height);
  ctx.fill();
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = strokeWidth || 1;
    ctx.stroke();
  }
  ctx.restore();
};
var drawMask = function drawMask(ctx, options) {
  ctx.save();
  var isHorizontal = options.isHorizontal,
    left = options.left,
    top = options.top,
    width = options.width,
    height = options.height,
    backgroundColor = options.backgroundColor;
  var gradient = isHorizontal ? ctx.createLinearGradient(left, height / 2, left + width, height / 2) : ctx.createLinearGradient(width / 2, top, width / 2, height + top);
  var transparentColor = new fabric.fabric.Color(backgroundColor);
  transparentColor.setAlpha(0);
  gradient.addColorStop(0, transparentColor.toRgba());
  gradient.addColorStop(0.33, backgroundColor);
  gradient.addColorStop(0.67, backgroundColor);
  gradient.addColorStop(1, transparentColor.toRgba());
  darwRect(ctx, {
    left: left,
    top: top,
    width: width,
    height: height,
    fill: gradient
  });
  ctx.restore();
};

function setupGuideLine() {
  if (fabric.fabric.GuideLine) {
    return;
  }
  fabric.fabric.GuideLine = fabric.fabric.util.createClass(fabric.fabric.Line, {
    type: 'GuideLine',
    selectable: false,
    hasControls: false,
    hasBorders: false,
    stroke: '#4bec13',
    originX: 'center',
    originY: 'center',
    padding: 4,
    globalCompositeOperation: 'difference',
    axis: 'horizontal',
    initialize: function initialize(points, options) {
      var _this = this;
      var isHorizontal = options.axis === 'horizontal';
      this.hoverCursor = isHorizontal ? 'ns-resize' : 'ew-resize';
      var newPoints = isHorizontal ? [-999999, points, 999999, points] : [points, -999999, points, 999999];
      options[isHorizontal ? 'lockMovementX' : 'lockMovementY'] = true;
      this.callSuper('initialize', newPoints, options);
      this.on('mousedown:before', function (e) {
        if (_this.activeOn === 'down') {
          _this.canvas.setActiveObject(_this, e.e);
        }
      });
      this.on('moving', function (e) {
        if (_this.canvas.ruler.options.enabled && _this.isPointOnRuler(e.e)) {
          _this.moveCursor = 'not-allowed';
        } else {
          _this.moveCursor = _this.isHorizontal() ? 'ns-resize' : 'ew-resize';
        }
        _this.canvas.fire('guideline:moving', {
          target: _this,
          e: e.e
        });
      });
      this.on('mouseup', function (e) {
        if (_this.canvas.ruler.options.enabled && _this.isPointOnRuler(e.e)) {
          _this.canvas.remove(_this);
          return;
        }
        _this.moveCursor = _this.isHorizontal() ? 'ns-resize' : 'ew-resize';
        _this.canvas.fire('guideline:mouseup', {
          target: _this,
          e: e.e
        });
      });
      this.on('removed', function () {
        _this.off('removed');
        _this.off('mousedown:before');
        _this.off('moving');
        _this.off('mouseup');
      });
    },
    getBoundingRect: function getBoundingRect(absolute, calculate) {
      this.bringToFront();
      var isHorizontal = this.isHorizontal();
      var rect = this.callSuper('getBoundingRect', absolute, calculate);
      rect[isHorizontal ? 'top' : 'left'] += rect[isHorizontal ? 'height' : 'width'] / 2;
      rect[isHorizontal ? 'height' : 'width'] = 0;
      return rect;
    },
    isPointOnRuler: function isPointOnRuler(e) {
      var isHorizontal = this.isHorizontal();
      var hoveredRuler = this.canvas.ruler.isPointOnRuler(new fabric.fabric.Point(e.offsetX, e.offsetY));
      if (isHorizontal && hoveredRuler === 'horizontal' || !isHorizontal && hoveredRuler === 'vertical') {
        return hoveredRuler;
      }
      return false;
    },
    isHorizontal: function isHorizontal() {
      return this.height === 0;
    }
  });
  fabric.fabric.GuideLine.fromObject = function (object, callback) {
    var clone = fabric.fabric.util.object.clone;
    function _callback(instance) {
      delete instance.xy;
      callback && callback(instance);
    }
    var options = clone(object, true);
    var isHorizontal = options.height === 0;
    options.xy = isHorizontal ? options.y1 : options.x1;
    options.axis = isHorizontal ? 'horizontal' : 'vertical';
    fabric.fabric.Object._fromObject(options.type, options, _callback, 'xy');
  };
}

var CanvasRuler = /*#__PURE__*/function () {
  function CanvasRuler(_options) {
    var _this = this;
    this.activeOn = 'up';
    this.eventHandler = {
      calcObjectRect: throttle(this.calcObjectRect.bind(this), 15),
      clearStatus: this.clearStatus.bind(this),
      canvasMouseDown: this.canvasMouseDown.bind(this),
      canvasMouseMove: throttle(this.canvasMouseMove.bind(this), 15),
      canvasMouseUp: this.canvasMouseUp.bind(this),
      render: function render(e) {
        if (!e.ctx) return;
        _this.render();
      }
    };
    this.lastAttr = {
      status: 'out',
      cursor: undefined,
      selection: undefined
    };
    this.getCommonEventInfo = function (e) {
      if (!_this.tempGuidelLine || !e.absolutePointer) return;
      return {
        e: e.e,
        transform: _this.tempGuidelLine.get('transform'),
        pointer: {
          x: e.absolutePointer.x,
          y: e.absolutePointer.y
        },
        target: _this.tempGuidelLine
      };
    };
    this.options = Object.assign({
      ruleSize: 20,
      fontSize: 10,
      enabled: false,
      backgroundColor: '#fff',
      borderColor: '#ddd',
      highlightColor: '#007fff',
      textColor: '#888'
    }, _options);
    this.ctx = this.options.canvas.getContext();
    fabric.fabric.util.object.extend(this.options.canvas, {
      ruler: this
    });
    setupGuideLine();
    if (this.options.enabled) {
      this.enable();
    }
  }
  var _proto = CanvasRuler.prototype;
  _proto.destroy = function destroy() {
    this.disable();
  };
  _proto.clearGuideline = function clearGuideline() {
    var _this$options$canvas;
    (_this$options$canvas = this.options.canvas).remove.apply(_this$options$canvas, this.options.canvas.getObjects(fabric.fabric.GuideLine.prototype.type));
  };
  _proto.showGuideline = function showGuideline() {
    this.options.canvas.getObjects(fabric.fabric.GuideLine.prototype.type).forEach(function (guideLine) {
      guideLine.set('visible', true);
    });
    this.options.canvas.renderAll();
  };
  _proto.hideGuideline = function hideGuideline() {
    this.options.canvas.getObjects(fabric.fabric.GuideLine.prototype.type).forEach(function (guideLine) {
      guideLine.set('visible', false);
    });
    this.options.canvas.renderAll();
  };
  _proto.enable = function enable() {
    this.options.enabled = true;
    this.options.canvas.on('after:render', this.eventHandler.calcObjectRect);
    this.options.canvas.on('after:render', this.eventHandler.render);
    this.options.canvas.on('mouse:down', this.eventHandler.canvasMouseDown);
    this.options.canvas.on('mouse:move', this.eventHandler.canvasMouseMove);
    this.options.canvas.on('mouse:up', this.eventHandler.canvasMouseUp);
    this.options.canvas.on('selection:cleared', this.eventHandler.clearStatus);
    this.showGuideline();
    this.render();
  };
  _proto.disable = function disable() {
    this.options.canvas.off('after:render', this.eventHandler.calcObjectRect);
    this.options.canvas.off('after:render', this.eventHandler.render);
    this.options.canvas.off('mouse:down', this.eventHandler.canvasMouseDown);
    this.options.canvas.off('mouse:move', this.eventHandler.canvasMouseMove);
    this.options.canvas.off('mouse:up', this.eventHandler.canvasMouseUp);
    this.options.canvas.off('selection:cleared', this.eventHandler.clearStatus);
    this.hideGuideline();
    this.options.enabled = false;
  };
  _proto.render = function render() {
    var _this$startCalibratio, _this$startCalibratio2;
    var vpt = this.options.canvas.viewportTransform;
    if (!vpt) return;
    this.draw({
      isHorizontal: true,
      rulerLength: this.getSize().width,
      startCalibration: (_this$startCalibratio = this.startCalibration) !== null && _this$startCalibratio !== void 0 && _this$startCalibratio.x ? this.startCalibration.x : -(vpt[4] / vpt[0])
    });
    this.draw({
      isHorizontal: false,
      rulerLength: this.getSize().height,
      startCalibration: (_this$startCalibratio2 = this.startCalibration) !== null && _this$startCalibratio2 !== void 0 && _this$startCalibratio2.y ? this.startCalibration.y : -(vpt[5] / vpt[3])
    });
    drawMask(this.ctx, {
      isHorizontal: true,
      left: -10,
      top: -10,
      width: this.options.ruleSize * 2 + 10,
      height: this.options.ruleSize + 10,
      backgroundColor: this.options.backgroundColor
    });
    drawMask(this.ctx, {
      isHorizontal: false,
      left: -10,
      top: -10,
      width: this.options.ruleSize + 10,
      height: this.options.ruleSize * 2 + 10,
      backgroundColor: this.options.backgroundColor
    });
  };
  _proto.getSize = function getSize() {
    return {
      width: this.options.canvas.width || 0,
      height: this.options.canvas.height || 0
    };
  };
  _proto.getZoom = function getZoom() {
    return this.options.canvas.getZoom();
  };
  _proto.draw = function draw(opt) {
    var _this2 = this;
    var isHorizontal = opt.isHorizontal,
      rulerLength = opt.rulerLength,
      startCalibration = opt.startCalibration;
    var zoom = this.getZoom();
    var gap = getGap(zoom);
    var unitLength = rulerLength / zoom;
    var startValue = Math[startCalibration > 0 ? 'floor' : 'ceil'](startCalibration / gap) * gap;
    var startOffset = startValue - startCalibration;
    var canvasSize = this.getSize();
    darwRect(this.ctx, {
      left: 0,
      top: 0,
      width: isHorizontal ? canvasSize.width : this.options.ruleSize,
      height: isHorizontal ? this.options.ruleSize : canvasSize.height,
      fill: this.options.backgroundColor,
      stroke: this.options.borderColor
    });
    var textColor = new fabric.fabric.Color(this.options.textColor);
    for (var i = 0; i + startOffset <= Math.ceil(unitLength); i += gap) {
      var position = (startOffset + i) * zoom;
      var textValue = startValue + i + '';
      var textLength = 10 * textValue.length / 4;
      var textX = isHorizontal ? position - textLength - 1 : this.options.ruleSize / 2 - this.options.fontSize / 2 - 4;
      var textY = isHorizontal ? this.options.ruleSize / 2 - this.options.fontSize / 2 - 4 : position + textLength;
      darwText(this.ctx, {
        text: textValue,
        left: textX,
        top: textY,
        fill: textColor.toRgb(),
        angle: isHorizontal ? 0 : -90
      });
    }
    for (var j = 0; j + startOffset <= Math.ceil(unitLength); j += gap) {
      var _position = Math.round((startOffset + j) * zoom);
      var left = isHorizontal ? _position : this.options.ruleSize - 8;
      var top = isHorizontal ? this.options.ruleSize - 8 : _position;
      var width = isHorizontal ? 0 : 8;
      var height = isHorizontal ? 8 : 0;
      darwLine(this.ctx, {
        left: left,
        top: top,
        width: width,
        height: height,
        stroke: textColor.toRgb()
      });
    }
    if (this.objectRect) {
      var axis = isHorizontal ? 'x' : 'y';
      this.objectRect[axis].forEach(function (rect) {
        if (rect.skip === axis) {
          return;
        }
        var roundFactor = function roundFactor(x) {
          return Math.round(x / zoom + startCalibration) + '';
        };
        var leftTextVal = roundFactor(isHorizontal ? rect.left : rect.top);
        var rightTextVal = roundFactor(isHorizontal ? rect.left + rect.width : rect.top + rect.height);
        var isSameText = leftTextVal === rightTextVal;
        var maskOpt = {
          isHorizontal: isHorizontal,
          width: isHorizontal ? 160 : _this2.options.ruleSize - 8,
          height: isHorizontal ? _this2.options.ruleSize - 8 : 160,
          backgroundColor: _this2.options.backgroundColor
        };
        drawMask(_this2.ctx, _extends({}, maskOpt, {
          left: isHorizontal ? rect.left - 80 : 0,
          top: isHorizontal ? 0 : rect.top - 80
        }));
        if (!isSameText) {
          drawMask(_this2.ctx, _extends({}, maskOpt, {
            left: isHorizontal ? rect.width + rect.left - 80 : 0,
            top: isHorizontal ? 0 : rect.height + rect.top - 80
          }));
        }
        var highlightColor = new fabric.fabric.Color(_this2.options.highlightColor);
        highlightColor.setAlpha(0.5);
        darwRect(_this2.ctx, {
          left: isHorizontal ? rect.left : _this2.options.ruleSize - 8,
          top: isHorizontal ? _this2.options.ruleSize - 8 : rect.top,
          width: isHorizontal ? rect.width : 8,
          height: isHorizontal ? 8 : rect.height,
          fill: highlightColor.toRgba()
        });
        var pad = _this2.options.ruleSize / 2 - _this2.options.fontSize / 2 - 4;
        var textOpt = {
          fill: highlightColor.toRgba(),
          angle: isHorizontal ? 0 : -90
        };
        darwText(_this2.ctx, _extends({}, textOpt, {
          text: leftTextVal,
          left: isHorizontal ? rect.left - 2 : pad,
          top: isHorizontal ? pad : rect.top - 2,
          align: isSameText ? 'center' : isHorizontal ? 'right' : 'left'
        }));
        if (!isSameText) {
          darwText(_this2.ctx, _extends({}, textOpt, {
            text: rightTextVal,
            left: isHorizontal ? rect.left + rect.width + 2 : pad,
            top: isHorizontal ? pad : rect.top + rect.height + 2,
            align: isHorizontal ? 'left' : 'right'
          }));
        }
        var lineSize = isSameText ? 8 : 14;
        highlightColor.setAlpha(1);
        var lineOpt = {
          width: isHorizontal ? 0 : lineSize,
          height: isHorizontal ? lineSize : 0,
          stroke: highlightColor.toRgba()
        };
        darwLine(_this2.ctx, _extends({}, lineOpt, {
          left: isHorizontal ? rect.left : _this2.options.ruleSize - lineSize,
          top: isHorizontal ? _this2.options.ruleSize - lineSize : rect.top
        }));
        if (!isSameText) {
          darwLine(_this2.ctx, _extends({}, lineOpt, {
            left: isHorizontal ? rect.left + rect.width : _this2.options.ruleSize - lineSize,
            top: isHorizontal ? _this2.options.ruleSize - lineSize : rect.top + rect.height
          }));
        }
      });
    }
  };
  _proto.calcObjectRect = function calcObjectRect() {
    var _this3 = this;
    var activeObjects = this.options.canvas.getActiveObjects();
    if (activeObjects.length === 0) return;
    var allRect = activeObjects.reduce(function (rects, obj) {
      var rect = obj.getBoundingRect(false, true);
      if (obj.group) {
        var group = _extends({
          top: 0,
          left: 0,
          width: 0,
          height: 0,
          scaleX: 1,
          scaleY: 1
        }, obj.group);
        rect.width *= group.scaleX;
        rect.height *= group.scaleY;
        var groupCenterX = group.width / 2 + group.left;
        var objectOffsetFromCenterX = (group.width / 2 + (obj.left || 0)) * (1 - group.scaleX);
        rect.left += (groupCenterX - objectOffsetFromCenterX) * _this3.getZoom();
        var groupCenterY = group.height / 2 + group.top;
        var objectOffsetFromCenterY = (group.height / 2 + (obj.top || 0)) * (1 - group.scaleY);
        rect.top += (groupCenterY - objectOffsetFromCenterY) * _this3.getZoom();
      }
      if (obj instanceof fabric.fabric.GuideLine) {
        rect.skip = obj.isHorizontal() ? 'x' : 'y';
      }
      rects.push(rect);
      return rects;
    }, []);
    if (allRect.length === 0) return;
    this.objectRect = {
      x: mergeLines(allRect, true),
      y: mergeLines(allRect, false)
    };
  };
  _proto.clearStatus = function clearStatus() {
    this.objectRect = undefined;
  };
  _proto.isPointOnRuler = function isPointOnRuler(point) {
    if (new fabric.fabric.Rect({
      left: 0,
      top: 0,
      width: this.options.ruleSize,
      height: this.options.canvas.height
    }).containsPoint(point)) {
      return 'vertical';
    } else if (new fabric.fabric.Rect({
      left: 0,
      top: 0,
      width: this.options.canvas.width,
      height: this.options.ruleSize
    }).containsPoint(point)) {
      return 'horizontal';
    }
    return false;
  };
  _proto.canvasMouseDown = function canvasMouseDown(e) {
    if (!e.pointer || !e.absolutePointer) return;
    var hoveredRuler = this.isPointOnRuler(e.pointer);
    if (hoveredRuler && this.activeOn === 'up') {
      this.lastAttr.selection = this.options.canvas.selection;
      this.options.canvas.selection = false;
      this.activeOn = 'down';
      this.tempGuidelLine = new fabric.fabric.GuideLine(hoveredRuler === 'horizontal' ? e.absolutePointer.y : e.absolutePointer.x, {
        axis: hoveredRuler,
        visible: false
      });
      this.options.canvas.add(this.tempGuidelLine);
      this.options.canvas.setActiveObject(this.tempGuidelLine);
      this.options.canvas._setupCurrentTransform(e.e, this.tempGuidelLine, true);
      this.tempGuidelLine.fire('down', this.getCommonEventInfo(e));
    }
  };
  _proto.canvasMouseMove = function canvasMouseMove(e) {
    if (!e.pointer) return;
    if (this.tempGuidelLine && e.absolutePointer) {
      var pos = {};
      if (this.tempGuidelLine.axis === 'horizontal') {
        pos.top = e.absolutePointer.y;
      } else {
        pos.left = e.absolutePointer.x;
      }
      this.tempGuidelLine.set(_extends({}, pos, {
        visible: true
      }));
      this.options.canvas.requestRenderAll();
      var event = this.getCommonEventInfo(e);
      this.options.canvas.fire('object:moving', event);
      this.tempGuidelLine.fire('moving', event);
    }
    var hoveredRuler = this.isPointOnRuler(e.pointer);
    if (!hoveredRuler) {
      if (this.lastAttr.status !== 'out') {
        this.options.canvas.defaultCursor = this.lastAttr.cursor;
        this.lastAttr.status = 'out';
      }
      return;
    }
    if (this.lastAttr.status === 'out' || hoveredRuler !== this.lastAttr.status) {
      this.lastAttr.cursor = this.options.canvas.defaultCursor;
      this.options.canvas.defaultCursor = hoveredRuler === 'horizontal' ? 'ns-resize' : 'ew-resize';
      this.lastAttr.status = hoveredRuler;
    }
  };
  _proto.canvasMouseUp = function canvasMouseUp(e) {
    var _this$tempGuidelLine;
    if (this.activeOn !== 'down') return;
    this.options.canvas.selection = this.lastAttr.selection;
    this.activeOn = 'up';
    (_this$tempGuidelLine = this.tempGuidelLine) === null || _this$tempGuidelLine === void 0 ? void 0 : _this$tempGuidelLine.fire('up', this.getCommonEventInfo(e));
    this.tempGuidelLine = undefined;
  };
  return CanvasRuler;
}();

function initRuler(canvas, options) {
  var ruler = new CanvasRuler(_extends({
    canvas: canvas
  }, options));
  var workspace = undefined;
  var getWorkspace = function getWorkspace() {
    workspace = canvas.getObjects().find(function (item) {
      return item.id === 'workspace';
    });
  };
  var isRectOut = function isRectOut(object, target) {
    var top = object.top,
      height = object.height,
      left = object.left,
      width = object.width;
    if (top === undefined || height === undefined || left === undefined || width === undefined) {
      return false;
    }
    var targetRect = target.getBoundingRect(true, true);
    var targetTop = targetRect.top,
      targetHeight = targetRect.height,
      targetLeft = targetRect.left,
      targetWidth = targetRect.width;
    if (target.isHorizontal() && (top > targetTop + 1 || top + height < targetTop + targetHeight - 1)) {
      return true;
    } else if (!target.isHorizontal() && (left > targetLeft + 1 || left + width < targetLeft + targetWidth - 1)) {
      return true;
    }
    return false;
  };
  canvas.on('guideline:moving', function (e) {
    if (!workspace) {
      getWorkspace();
      return;
    }
    var target = e.target;
    if (isRectOut(workspace, target)) {
      target.moveCursor = 'not-allowed';
    }
  });
  canvas.on('guideline:mouseup', function (e) {
    if (!workspace) {
      getWorkspace();
      return;
    }
    var target = e.target;
    if (isRectOut(workspace, target)) {
      canvas.remove(target);
      canvas.setCursor(canvas.defaultCursor || '');
    }
  });
  return ruler;
}

var EditorGroupText = /*#__PURE__*/function () {
  function EditorGroupText(canvas) {
    this.canvas = canvas;
    this._init();
    this.isDown = false;
  }
  var _proto = EditorGroupText.prototype;
  _proto._init = function _init() {
    var _this = this;
    this.canvas.on('mouse:down', function (opt) {
      _this.isDown = true;
      if (opt.target && opt.target.type === 'group') {
        var textObject = _this._getGroupTextObj(opt);
        if (textObject) {
          _this._bedingEditingEvent(textObject, opt);
          _this.canvas.setActiveObject(textObject);
          textObject.enterEditing();
        } else {
          _this.canvas.setActiveObject(opt.target);
        }
      }
    });
    this.canvas.on('mouse:up', function () {
      _this.isDown = false;
    });
    this.canvas.on('mouse:move', function (opt) {
      if (_this.isDown && opt.target && opt.target.type === 'group') {
        var textObject = _this._getGroupTextObj(opt);
      }
    });
  };
  _proto._getGroupTextObj = function _getGroupTextObj(opt) {
    var _opt$target;
    var pointer = this.canvas.getPointer(opt.e, true);
    var clickObj = this.canvas._searchPossibleTargets((_opt$target = opt.target) === null || _opt$target === void 0 ? void 0 : _opt$target._objects, pointer);
    if (clickObj && this.isText(clickObj)) {
      return clickObj;
    }
    return false;
  };
  _proto._bedingEditingEvent = function _bedingEditingEvent(textObject, opt) {
    var _this2 = this;
    if (!opt.target) return;
    var left = opt.target.left;
    var top = opt.target.top;
    var ids = this._unGroup() || [];
    var resetGroup = function resetGroup() {
      var groupArr = _this2.canvas.getObjects().filter(function (item) {
        return item.id && ids.includes(item.id);
      });
      groupArr.forEach(function (item) {
        return _this2.canvas.remove(item);
      });
      var group = new fabric.fabric.Group([].concat(groupArr));
      group.set('left', left);
      group.set('top', top);
      group.set('id', uuid());
      textObject.off('editing:exited', resetGroup);
      _this2.canvas.add(group);
      _this2.canvas.discardActiveObject().renderAll();
    };
    textObject.on('editing:exited', resetGroup);
  };
  _proto._unGroup = function _unGroup() {
    var ids = [];
    var activeObj = this.canvas.getActiveObject();
    if (!activeObj) return;
    activeObj.getObjects().forEach(function (item) {
      var id = uuid();
      ids.push(id);
      item.set('id', id);
    });
    activeObj.toActiveSelection();
    return ids;
  };
  _proto.isText = function isText(obj) {
    return obj.type && ['i-text', 'text', 'textbox'].includes(obj.type);
  };
  return EditorGroupText;
}();

var Editor = /*#__PURE__*/function (_EventEmitter) {
  _inheritsLoose(Editor, _EventEmitter);
  function Editor(canvas) {
    var _this;
    _this = _EventEmitter.call(this) || this;
    _this.canvas = canvas;
    _this.editorWorkspace = null;
    var _initAligningGuidelin = initAligningGuidelines(canvas),
      disable = _initAligningGuidelin.disable,
      enable = _initAligningGuidelin.enable;
    _this.disableGuidelines = disable;
    _this.enableGuidelines = enable;
    initHotkeys(canvas, _assertThisInitialized(_this));
    initControls();
    initControlsRotate(canvas);
    new EditorGroupText(canvas);
    _this.centerAlign = new CenterAlign(canvas);
    _this.ruler = initRuler(canvas);
    return _this;
  }
  var _proto = Editor.prototype;
  _proto._copyActiveSelection = function _copyActiveSelection(activeObject) {
    var grid = 10;
    var canvas = this.canvas;
    activeObject === null || activeObject === void 0 ? void 0 : activeObject.clone(function (cloned) {
      cloned.clone(function (clonedObj) {
        canvas.discardActiveObject();
        if (clonedObj.left === undefined || clonedObj.top === undefined) return;
        clonedObj.canvas = canvas;
        clonedObj.set({
          left: clonedObj.left + grid,
          top: clonedObj.top + grid,
          evented: true,
          id: uuid()
        });
        clonedObj.forEachObject(function (obj) {
          obj.id = uuid();
          canvas.add(obj);
        });
        clonedObj.setCoords();
        canvas.setActiveObject(clonedObj);
        canvas.requestRenderAll();
      });
    });
  };
  _proto._copyObject = function _copyObject(activeObject) {
    var grid = 10;
    var canvas = this.canvas;
    activeObject === null || activeObject === void 0 ? void 0 : activeObject.clone(function (cloned) {
      if (cloned.left === undefined || cloned.top === undefined) return;
      canvas.discardActiveObject();
      cloned.set({
        left: cloned.left + grid,
        top: cloned.top + grid,
        evented: true,
        id: uuid()
      });
      canvas.add(cloned);
      canvas.setActiveObject(cloned);
      canvas.requestRenderAll();
    });
  };
  _proto.clone = function clone(paramsActiveObeject) {
    var activeObject = paramsActiveObeject || this.canvas.getActiveObject();
    if (!activeObject) return;
    if ((activeObject === null || activeObject === void 0 ? void 0 : activeObject.type) === 'activeSelection') {
      this._copyActiveSelection(activeObject);
    } else {
      this._copyObject(activeObject);
    }
  };
  _proto.unGroup = function unGroup() {
    var activeObject = this.canvas.getActiveObject();
    if (!activeObject) return;
    activeObject.toActiveSelection();
    activeObject.getObjects().forEach(function (item) {
      item.set('id', uuid());
    });
    this.canvas.discardActiveObject().renderAll();
  };
  _proto.group = function group() {
    var _this2 = this;
    var activeObj = this.canvas.getActiveObject();
    if (!activeObj) return;
    var activegroup = activeObj.toGroup();
    var objectsInGroup = activegroup.getObjects();
    activegroup.clone(function (newgroup) {
      newgroup.set('id', uuid());
      _this2.canvas.remove(activegroup);
      objectsInGroup.forEach(function (object) {
        _this2.canvas.remove(object);
      });
      _this2.canvas.add(newgroup);
      _this2.canvas.setActiveObject(newgroup);
    });
  };
  _proto.getWorkspace = function getWorkspace() {
    return this.canvas.getObjects().find(function (item) {
      return item.id === 'workspace';
    });
  };
  _proto.workspaceSendToBack = function workspaceSendToBack() {
    var workspace = this.getWorkspace();
    workspace && workspace.sendToBack();
  };
  _proto.getJson = function getJson() {
    return this.canvas.toJSON(['id', 'gradientAngle', 'selectable', 'hasControls', 'sourceSrc', 'rawScaleX', 'rawScaleY', 'rectDiffLeft', 'rectDiffTop', 'prevWidth', 'prevHeight', 'cloneObject']);
  };
  _proto.dragAddItem = function dragAddItem(event, item) {
    var _this$canvas$getSelec = this.canvas.getSelectionElement().getBoundingClientRect(),
      left = _this$canvas$getSelec.left,
      top = _this$canvas$getSelec.top;
    if (event.x < left || event.y < top || item.width === undefined) return;
    var point = {
      x: event.x - left,
      y: event.y - top
    };
    var pointerVpt = this.canvas.restorePointerVpt(point);
    item.left = pointerVpt.x - item.width / 2;
    item.top = pointerVpt.y;
    this.canvas.add(item);
    this.canvas.requestRenderAll();
  };
  return Editor;
}(EventEmitter);

var noop = function noop() {};
var Context = React.createContext({
  editor: null,
  canvas: null,
  workSpace: null,
  drawMode: '',
  selectMode: '',
  selectIds: [],
  selectOneType: '',
  selectActive: [],
  show: false,
  mainUrl: '',
  isClipImage: false,
  clipRawIndex: null,
  clipImageId: null,
  setClipRawIndex: noop,
  setClipImageId: noop,
  setIsClipImage: noop,
  setMainUrl: noop,
  setSelectOneType: noop,
  setSelectActive: noop,
  setSelectMode: noop,
  setSelectIds: noop,
  setDrawMode: noop,
  setCanvas: noop,
  setEditor: noop,
  setWorkSpace: noop,
  setShow: noop
});
var CanvasProvider = function CanvasProvider(_ref) {
  var children = _ref.children;
  var _useState = React.useState(null),
    canvas = _useState[0],
    setCanvas = _useState[1];
  var _useState2 = React.useState(null),
    editor = _useState2[0],
    setEditor = _useState2[1];
  var _useState3 = React.useState(null),
    workSpace = _useState3[0],
    setWorkSpace = _useState3[1];
  var _useState4 = React.useState('default'),
    drawMode = _useState4[0],
    setDrawMode = _useState4[1];
  var _useState5 = React.useState(''),
    selectMode = _useState5[0],
    setSelectMode = _useState5[1];
  var _useState6 = React.useState([]),
    selectIds = _useState6[0],
    setSelectIds = _useState6[1];
  var _useState7 = React.useState(''),
    selectOneType = _useState7[0],
    setSelectOneType = _useState7[1];
  var _useState8 = React.useState([]),
    selectActive = _useState8[0],
    setSelectActive = _useState8[1];
  var _useState9 = React.useState(false),
    show = _useState9[0],
    setShow = _useState9[1];
  var _useState10 = React.useState(''),
    mainUrl = _useState10[0],
    setMainUrl = _useState10[1];
  var _useState11 = React.useState(false),
    isClipImage = _useState11[0],
    setIsClipImage = _useState11[1];
  var _useState12 = React.useState(null),
    clipImageId = _useState12[0],
    setClipImageId = _useState12[1];
  var _useState13 = React.useState(null),
    clipRawIndex = _useState13[0],
    setClipRawIndex = _useState13[1];
  var context = {
    canvas: canvas,
    editor: editor,
    workSpace: workSpace,
    drawMode: drawMode,
    selectMode: selectMode,
    setSelectMode: setSelectMode,
    selectIds: selectIds,
    setSelectIds: setSelectIds,
    selectOneType: selectOneType,
    setSelectOneType: setSelectOneType,
    selectActive: selectActive,
    setSelectActive: setSelectActive,
    setDrawMode: setDrawMode,
    setWorkSpace: setWorkSpace,
    setCanvas: setCanvas,
    setEditor: setEditor,
    show: show,
    setShow: setShow,
    mainUrl: mainUrl,
    setMainUrl: setMainUrl,
    isClipImage: isClipImage,
    setIsClipImage: setIsClipImage,
    clipImageId: clipImageId,
    setClipImageId: setClipImageId,
    clipRawIndex: clipRawIndex,
    setClipRawIndex: setClipRawIndex
  };
  return React__default.createElement(Context.Provider, {
    value: context
  }, children);
};

var style = {"size":"_index-module__size__25rEe","ratio":"_index-module__ratio__Z8umb","title":"_index-module__title__28Pa_","content":"_index-module__content__2c1fu"};

var customInputStyle = {"customInput":"_index-module__customInput__1bhWg","title":"_index-module__title__9y0uL","inputWrap":"_index-module__inputWrap__3aQ84"};

var Input = function Input(props) {
  var title = props.title,
    afterText = props.afterText,
    value = props.value,
    onChange = props.onChange;
  return React__default.createElement("div", {
    className: customInputStyle.customInput
  }, React__default.createElement("div", {
    className: customInputStyle.title
  }, title), React__default.createElement("div", {
    className: customInputStyle.inputWrap
  }, React__default.createElement("input", {
    onChange: onChange,
    value: value,
    type: "text"
  }), afterText ? React__default.isValidElement(afterText) ? afterText : React__default.createElement("span", null, afterText) : ''));
};

var useAttr = function useAttr() {
  var _useContext = React.useContext(Context),
    canvas = _useContext.canvas;
  var getActiveObject = function getActiveObject() {
    if (!canvas) return;
    var activeObject = canvas === null || canvas === void 0 ? void 0 : canvas.getActiveObject();
    if (!activeObject) return;
    return activeObject;
  };
  var setAttr = function setAttr(attr) {
    if (!canvas) return;
    var activeObject = getActiveObject();
    if (!activeObject) return;
    activeObject.set(attr);
    canvas.renderAll();
  };
  return {
    getActiveObject: getActiveObject,
    setAttr: setAttr
  };
};

var lockAttrs = ['lockMovementX', 'lockMovementY', 'lockRotation', 'lockScalingX', 'lockScalingY'];
var isControlsInRatioVisible = function isControlsInRatioVisible(object) {
  var controls = object._controlsVisibility;
  return !!(controls && !controls.mb && !controls.ml && !controls.mr && !controls.mt);
};
var useLock = function useLock() {
  var _useContext = React.useContext(Context),
    canvas = _useContext.canvas;
  var _useAttr = useAttr(),
    getActiveObject = _useAttr.getActiveObject;
  var changeOwnLock = React.useCallback(function (isLock, object) {
    var activeObject = null;
    if (object) {
      activeObject = object;
    } else {
      activeObject = getActiveObject();
    }
    if (!activeObject) return;
    activeObject.hasControls = isLock;
    lockAttrs.forEach(function (key) {
      activeObject[key] = !isLock;
    });
    activeObject.selectable = isLock;
    canvas === null || canvas === void 0 ? void 0 : canvas.renderAll();
  }, [canvas, getActiveObject]);
  var changeInRatioLock = React.useCallback(function (isLock, object) {
    var activeObject = null;
    if (object) {
      activeObject = object;
    } else {
      activeObject = getActiveObject();
    }
    if (!activeObject) return;
    activeObject.setControlsVisibility({
      mt: isLock,
      mb: isLock,
      ml: isLock,
      mr: isLock
    });
    canvas === null || canvas === void 0 ? void 0 : canvas.renderAll();
  }, [canvas, getActiveObject]);
  return {
    changeOwnLock: changeOwnLock,
    changeInRatioLock: changeInRatioLock
  };
};

function subtract(num1, num2) {
  var num1Digits = (num1.toString().split('.')[1] || '').length;
  var num2Digits = (num2.toString().split('.')[1] || '').length;
  var baseNum = Math.pow(10, Math.max(num1Digits, num2Digits));
  return (multiply(num1, baseNum) - multiply(num2, baseNum)) / baseNum;
}
function multiply(num1, num2) {
  var num1String = num1.toString();
  var num2String = num2.toString();
  var num1Digits = (num1String.split('.')[1] || '').length;
  var num2Digits = (num2String.split('.')[1] || '').length;
  var baseNum = Math.pow(10, num1Digits + num2Digits);
  return Number(num1String.replace('.', '')) * Number(num2String.replace('.', '')) / baseNum;
}
function divide(num1, num2) {
  var num1String = num1.toString();
  var num2String = num2.toString();
  var num1Digits = (num1String.split('.')[1] || '').length;
  var num2Digits = (num2String.split('.')[1] || '').length;
  var baseNum = Math.pow(10, num1Digits + num2Digits);
  var n1 = multiply(num1, baseNum);
  var n2 = multiply(num2, baseNum);
  return Number(n1) / Number(n2);
}
function floatRound(num, len) {
  if (len === void 0) {
    len = 0;
  }
  var n = divide(Math.round(multiply(num, Math.pow(10, len))), Math.pow(10, len));
  return n.toFixed(len);
}

var Size = function Size(_ref) {
  var getActiveObject = _ref.getActiveObject,
    showRation = _ref.showRation,
    isWorkSpace = _ref.isWorkSpace;
  var _useContext = React.useContext(Context),
    canvas = _useContext.canvas,
    workSpace = _useContext.workSpace;
  var _useLock = useLock(),
    changeInRatioLock = _useLock.changeInRatioLock;
  var _useState = React.useState(''),
    width = _useState[0],
    setWidth = _useState[1];
  var _useState2 = React.useState(''),
    height = _useState2[0],
    setHeight = _useState2[1];
  var _useState3 = React.useState(false),
    lockRatio = _useState3[0],
    setLockRatio = _useState3[1];
  React.useEffect(function () {
    getAttr();
  }, [canvas, getActiveObject]);
  React.useEffect(function () {
    if (!canvas) return;
    canvas.on('object:modified', getAttr);
    return function () {
      canvas.off('object:modified', getAttr);
    };
  }, [canvas]);
  var getAttr = function getAttr() {
    var activeObject = getActiveObject();
    if (!activeObject) return;
    setWidth(floatRound(activeObject.width));
    setHeight(floatRound(activeObject.height));
    setLockRatio(isControlsInRatioVisible(activeObject));
  };
  var onWidthChange = function onWidthChange(value) {
    var activeObject = getActiveObject();
    if (!activeObject) return;
    value = retainNumber(value);
    if (isWorkSpace) {
      workSpace === null || workSpace === void 0 ? void 0 : workSpace.setSize(value, height);
      setWidth(value);
      return;
    }
    activeObject.set({
      width: +value
    });
    canvas === null || canvas === void 0 ? void 0 : canvas.renderAll();
    setWidth(value);
  };
  var onHeightChange = function onHeightChange(value) {
    var activeObject = getActiveObject();
    if (!activeObject) return;
    value = retainNumber(value);
    if (isWorkSpace) {
      workSpace === null || workSpace === void 0 ? void 0 : workSpace.setSize(width, value);
      setHeight(value);
      return;
    }
    activeObject.set({
      height: +value
    });
    canvas === null || canvas === void 0 ? void 0 : canvas.renderAll();
    setHeight(value);
  };
  var changeLock = function changeLock() {
    changeInRatioLock(lockRatio);
    setLockRatio(function (prevState) {
      return !prevState;
    });
  };
  return React__default.createElement("div", {
    className: style.size
  }, React__default.createElement(Input, {
    afterText: "\u50CF\u7D20",
    title: "\u5BBD\u5EA6",
    value: width,
    onChange: function onChange(e) {
      return onWidthChange(e.target.value);
    }
  }), React__default.createElement(Input, {
    afterText: "\u50CF\u7D20",
    title: "\u9AD8\u5EA6",
    value: height,
    onChange: function onChange(e) {
      return onHeightChange(e.target.value);
    }
  }), showRation ? React__default.createElement("div", {
    className: style.ratio
  }, React__default.createElement("div", {
    className: style.title
  }, "\u6BD4\u4F8B"), React__default.createElement("div", {
    className: style.content,
    onClick: changeLock
  }, React__default.createElement("img", {
    src: lockRatio ? "https://ossprod.jrdaimao.com/file/1690955813239228.svg" : "https://ossprod.jrdaimao.com/file/1690425288688481.svg",
    alt: ""
  }))) : React__default.createElement("div", {
    className: style.ratio
  }));
};

var style$1 = {"workSpaceAttr":"_index-module__workSpaceAttr__2plhR","base":"_index-module__base__35ejr","division":"_index-module__division__2ohzj","title":"_index-module__title__J5Xgh","colorPicker":"_index-module__colorPicker__3uPze"};

var style$2 = {"position":"_index-module__position__3JjkO","rotate":"_index-module__rotate__pZ0Ae","title":"_index-module__title__ivS8M","content":"_index-module__content__25bwl"};

var Position = function Position() {
  var _useContext = React.useContext(Context),
    canvas = _useContext.canvas;
  var _useAttr = useAttr(),
    getActiveObject = _useAttr.getActiveObject,
    setAttr = _useAttr.setAttr;
  var _useState = React.useState('0'),
    rotate = _useState[0],
    setRotate = _useState[1];
  var _useState2 = React.useState(0),
    x = _useState2[0],
    setX = _useState2[1];
  var _useState3 = React.useState(0),
    y = _useState3[0],
    setY = _useState3[1];
  React.useEffect(function () {
    getAttr();
  }, [canvas]);
  React.useEffect(function () {
    if (!canvas) return;
    canvas.on('object:modified', getAttr);
    return function () {
      canvas.off('object:modified', getAttr);
    };
  }, [canvas]);
  var getAttr = function getAttr() {
    var activeObject = getActiveObject();
    if (!activeObject) return;
    setX(floatRound(activeObject.left || 0));
    setY(floatRound(activeObject.top || 0));
    setRotate(floatRound(activeObject.angle || 0));
  };
  var onRotateChange = function onRotateChange(value) {
    var activeObject = getActiveObject();
    if (!activeObject) return;
    activeObject.rotate(+value);
    canvas === null || canvas === void 0 ? void 0 : canvas.renderAll();
    setRotate(value);
  };
  var onPositionXChange = function onPositionXChange(value) {
    value = retainNumber(value);
    setAttr({
      left: +value
    });
    setX(value);
  };
  var onPositionYChange = function onPositionYChange(value) {
    value = retainNumber(value);
    setAttr({
      top: +value
    });
    setY(value);
  };
  return React__default.createElement("div", {
    className: style$2.position
  }, React__default.createElement(Input, {
    afterText: "\u50CF\u7D20",
    value: x,
    onChange: function onChange(e) {
      return onPositionXChange(e.target.value);
    },
    title: 'X'
  }), React__default.createElement(Input, {
    afterText: "\u50CF\u7D20",
    value: y,
    onChange: function onChange(e) {
      return onPositionYChange(e.target.value);
    },
    title: 'Y'
  }), React__default.createElement("div", {
    className: style$2.rotate
  }, React__default.createElement("div", {
    className: style$2.title
  }, "\u65CB\u8F6C"), React__default.createElement("div", {
    className: style$2.content
  }, React__default.createElement("input", {
    value: rotate,
    onChange: function onChange(e) {
      return onRotateChange(retainNumber(e.target.value));
    },
    type: "text"
  }))));
};

var style$3 = {"transparent":"_index-module__transparent__3zB_Q","title":"_index-module__title__1TUJG","reverseWrap":"_index-module__reverseWrap__2IPAY","visible":"_index-module__visible__37zRW","content":"_index-module__content__1EJOQ"};

var Transparent = function Transparent() {
  var _useContext = React.useContext(Context),
    canvas = _useContext.canvas;
  var _useAttr = useAttr(),
    getActiveObject = _useAttr.getActiveObject,
    setAttr = _useAttr.setAttr;
  var _useState = React.useState(0),
    opacity = _useState[0],
    setOpacity = _useState[1];
  var _useState2 = React.useState(false),
    visible = _useState2[0],
    setVisible = _useState2[1];
  React.useEffect(function () {
    var activeObject = getActiveObject();
    if (!activeObject) return;
    setOpacity(multiply(activeObject.opacity, 100));
    setVisible(activeObject.visible || false);
  }, [getActiveObject]);
  var onOpacityChange = function onOpacityChange(value) {
    if (value > 100) {
      value = 100;
    }
    value = retainNumber(value);
    setAttr({
      opacity: divide(value, 100)
    });
    setOpacity(+value);
  };
  var onFlipChange = function onFlipChange(value) {
    var activeObject = getActiveObject();
    if (!activeObject) return;
    activeObject.set("flip" + value, !activeObject["flip" + value]).setCoords();
    canvas === null || canvas === void 0 ? void 0 : canvas.renderAll();
  };
  var onVisibleChange = function onVisibleChange() {
    setAttr({
      visible: !visible
    });
    setVisible(function (prevState) {
      return !prevState;
    });
  };
  return React__default.createElement("div", {
    className: style$3.transparent
  }, React__default.createElement("div", {
    className: customInputStyle.customInput
  }, React__default.createElement("div", {
    className: customInputStyle.title
  }, "\u4E0D\u900F\u660E\u5EA6"), React__default.createElement("div", {
    className: customInputStyle.inputWrap
  }, React__default.createElement("input", {
    style: {
      width: 48
    },
    onChange: function onChange(e) {
      return onOpacityChange(e.target.value);
    },
    value: opacity,
    type: "text"
  }), React__default.createElement("span", null, "%"))), React__default.createElement("div", {
    className: style$3.reverse
  }, React__default.createElement("div", {
    className: style$3.title
  }, "\u7FFB\u8F6C"), React__default.createElement("div", {
    className: style$3.reverseWrap
  }, React__default.createElement("div", {
    onClick: function onClick() {
      return onFlipChange('X');
    }
  }, React__default.createElement("img", {
    src: "https://ossprod.jrdaimao.com/file/1690428298144872.svg",
    alt: ""
  })), React__default.createElement("div", {
    onClick: function onClick() {
      return onFlipChange('Y');
    }
  }, React__default.createElement("img", {
    src: "https://ossprod.jrdaimao.com/file/1690428330458222.svg",
    alt: ""
  })))), React__default.createElement("div", {
    className: style$3.visible
  }, React__default.createElement("div", {
    className: style$3.title
  }, "\u53EF\u89C1\u6027"), React__default.createElement("div", {
    className: style$3.content,
    onClick: onVisibleChange
  }, visible ? React__default.createElement("img", {
    src: "https://ossprod.jrdaimao.com/file/1690428533888278.svg",
    alt: ""
  }) : React__default.createElement("img", {
    src: "https://ossprod.jrdaimao.com/file/1690883271867109.svg",
    alt: ""
  }))));
};

var usePageAlign = function usePageAlign() {
  var _useContext = React.useContext(Context),
    canvas = _useContext.canvas,
    workSpace = _useContext.workSpace;
  var setPosition = React.useCallback(function (value, target) {
    if (!canvas) return;
    var activeObject;
    if (target) {
      activeObject = target;
    } else {
      activeObject = canvas.getActiveObject();
    }
    if (!activeObject) return console.log('no allow activeObject');
    var left = value.left,
      top = value.top;
    var pos = {};
    if (!isUndef(left)) pos.left = left;
    if (!isUndef(top)) pos.top = top;
    activeObject.set(pos);
    canvas.renderAll();
  }, [canvas, workSpace]);
  var left = function left() {
    setPosition({
      left: 0
    });
  };
  var top = function top() {
    setPosition({
      top: 0
    });
  };
  var alignCenter = function alignCenter() {
    if (!canvas || !workSpace) return;
    var activeObject = canvas.getActiveObject();
    if (!activeObject) return;
    var width = (workSpace === null || workSpace === void 0 ? void 0 : workSpace.width) || 0;
    setPosition({
      left: (width - activeObject.width * activeObject.scaleX) / 2
    });
  };
  var middleCenter = function middleCenter() {
    if (!canvas || !workSpace) return;
    var activeObject = canvas.getActiveObject();
    if (!activeObject) return;
    var height = (workSpace === null || workSpace === void 0 ? void 0 : workSpace.height) || 0;
    setPosition({
      top: (height - activeObject.height * activeObject.scaleY) / 2
    });
  };
  var right = function right() {
    if (!canvas || !workSpace) return;
    var activeObject = canvas.getActiveObject();
    if (!activeObject) return;
    var width = (workSpace === null || workSpace === void 0 ? void 0 : workSpace.width) || 0;
    setPosition({
      left: width - activeObject.width * activeObject.scaleX
    });
  };
  var bottom = function bottom() {
    if (!canvas || !workSpace) return;
    var activeObject = canvas.getActiveObject();
    if (!activeObject) return;
    var height = (workSpace === null || workSpace === void 0 ? void 0 : workSpace.height) || 0;
    setPosition({
      top: height - activeObject.height * activeObject.scaleY
    });
  };
  return {
    left: left,
    top: top,
    alignCenter: alignCenter,
    middleCenter: middleCenter,
    right: right,
    bottom: bottom
  };
};

var alignTypeList = [{
  icon: 'https://ossprod.jrdaimao.com/file/1690799178088909.svg',
  activeIcon: 'https://ossprod.jrdaimao.com/file/1690802921403421.svg',
  title: '左对齐',
  key: 'left'
}, {
  icon: 'https://ossprod.jrdaimao.com/file/1690429259779371.svg',
  activeIcon: 'https://ossprod.jrdaimao.com/file/1690799287561375.svg',
  title: '顶对齐',
  key: 'top'
}, {
  icon: 'https://ossprod.jrdaimao.com/file/1690429281715912.svg',
  activeIcon: 'https://ossprod.jrdaimao.com/file/1690799296804215.svg',
  title: '左右居中对齐',
  key: 'alignCenter'
}, {
  icon: 'https://ossprod.jrdaimao.com/file/1690429302732969.svg',
  activeIcon: 'https://ossprod.jrdaimao.com/file/169079930793443.svg',
  title: '上下居中对齐',
  key: 'middleCenter'
}, {
  icon: 'https://ossprod.jrdaimao.com/file/1690429331770745.svg',
  activeIcon: 'https://ossprod.jrdaimao.com/file/1690799316293458.svg',
  title: '右对齐',
  key: 'right'
}, {
  icon: 'https://ossprod.jrdaimao.com/file/169042936033629.svg',
  activeIcon: 'https://ossprod.jrdaimao.com/file/1690799325119567.svg',
  title: '底对齐',
  key: 'bottom'
}];

var pageAlignStyle = {"pageAlign":"_index-module__pageAlign__1MOiB","title":"_index-module__title__QElwi","shareShapeList":"_index-module__shareShapeList__2raEw","shareShapeListItem":"_index-module__shareShapeListItem__3uaCf"};

var PageAlign = function PageAlign() {
  var alignFunc = usePageAlign();
  var _onClick = function onClick(item) {
    var _alignFunc$item$key;
    (_alignFunc$item$key = alignFunc[item.key]) === null || _alignFunc$item$key === void 0 ? void 0 : _alignFunc$item$key.call(alignFunc);
  };
  return React__default.createElement("div", {
    className: pageAlignStyle.pageAlign
  }, React__default.createElement("div", {
    className: pageAlignStyle.title
  }, "\u9875\u9762\u5BF9\u9F50"), React__default.createElement("div", {
    className: pageAlignStyle.shareShapeList
  }, alignTypeList.map(function (item) {
    return React__default.createElement("div", {
      onClick: function onClick() {
        return _onClick(item);
      },
      key: item.key,
      className: pageAlignStyle.shareShapeListItem
    }, React__default.createElement("img", {
      src: item.icon,
      alt: ""
    }), React__default.createElement("img", {
      src: item.activeIcon,
      alt: ""
    }), React__default.createElement("span", null, item.title));
  })));
};

var coverOrderList = [{
  icon: 'https://ossprod.jrdaimao.com/file/1690802981178203.svg',
  activeIcon: 'https://ossprod.jrdaimao.com/file/1690430789758861.svg',
  title: '上移一层',
  key: 'up'
}, {
  icon: 'https://ossprod.jrdaimao.com/file/1690430798470387.svg',
  activeIcon: 'https://ossprod.jrdaimao.com/file/1690803025753461.svg',
  title: '移到顶层',
  key: 'upTop'
}, {
  icon: 'https://ossprod.jrdaimao.com/file/1690430807961422.svg',
  activeIcon: 'https://ossprod.jrdaimao.com/file/1690803032757409.svg',
  title: '下移一层',
  key: 'down'
}, {
  icon: 'https://ossprod.jrdaimao.com/file/1690430815475268.svg',
  activeIcon: 'https://ossprod.jrdaimao.com/file/1690803040084442.svg',
  title: '移到底层',
  key: 'downTop'
}];

var userOrder = function userOrder() {
  var _useContext = React.useContext(Context),
    canvas = _useContext.canvas,
    editor = _useContext.editor;
  var changeOrder = React.useCallback(function (funcKey, object) {
    var _activeObject$funcKey, _activeObject;
    if (!canvas) return;
    var activeObject;
    if (object) {
      activeObject = object;
    } else {
      var actives = canvas.getActiveObjects();
      if (actives && actives.length === 1) {
        activeObject = canvas.getActiveObjects()[0];
      }
    }
    if (!activeObject) return;
    activeObject && ((_activeObject$funcKey = (_activeObject = activeObject)[funcKey]) === null || _activeObject$funcKey === void 0 ? void 0 : _activeObject$funcKey.call(_activeObject));
    canvas.renderAll();
    editor === null || editor === void 0 ? void 0 : editor.workspaceSendToBack();
  }, [canvas, editor]);
  var up = React.useCallback(function (object) {
    changeOrder('bringForward', object);
  }, [canvas, editor]);
  var upTop = React.useCallback(function (object) {
    changeOrder('bringToFront', object);
  }, [canvas, editor]);
  var down = React.useCallback(function (object) {
    changeOrder('sendBackwards', object);
  }, [canvas, editor]);
  var downTop = React.useCallback(function (object) {
    changeOrder('sendToBack', object);
  }, [canvas, editor]);
  return {
    up: up,
    upTop: upTop,
    down: down,
    downTop: downTop
  };
};

var style$4 = {"coverOrder":"_index-module__coverOrder__h4hzi","coverOrderTitle":"_index-module__coverOrderTitle__2k_YY"};

var CoverOrder = function CoverOrder() {
  var orderFunc = userOrder();
  var changeCoverOrder = function changeCoverOrder(item) {
    var _orderFunc$item$key;
    (_orderFunc$item$key = orderFunc[item.key]) === null || _orderFunc$item$key === void 0 ? void 0 : _orderFunc$item$key.call(orderFunc);
  };
  return React__default.createElement("div", {
    className: style$4.coverOrder
  }, React__default.createElement("div", {
    className: style$4.coverOrderTitle
  }, "\u56FE\u5C42\u987A\u5E8F"), React__default.createElement("div", {
    className: pageAlignStyle.shareShapeList
  }, coverOrderList.map(function (item) {
    return React__default.createElement("div", {
      onClick: function onClick() {
        return changeCoverOrder(item);
      },
      key: item.key,
      className: pageAlignStyle.shareShapeListItem
    }, React__default.createElement("img", {
      src: item.icon,
      alt: ""
    }), React__default.createElement("img", {
      src: item.activeIcon,
      alt: ""
    }), React__default.createElement("span", null, item.title));
  })));
};

var ImageSpaceAttr = function ImageSpaceAttr() {
  var _useAttr = useAttr(),
    getActiveObject = _useAttr.getActiveObject;
  return React__default.createElement("div", {
    className: style$1.workSpaceAttr
  }, React__default.createElement("div", {
    className: style$1.base
  }, React__default.createElement("div", null, React__default.createElement(Size, {
    getActiveObject: getActiveObject,
    showRation: true
  })), React__default.createElement("div", null, React__default.createElement(Position, null)), React__default.createElement("div", null, React__default.createElement(Transparent, null))), React__default.createElement("div", {
    className: style$1.division
  }), React__default.createElement(PageAlign, null), React__default.createElement("div", {
    className: style$1.division
  }), React__default.createElement(CoverOrder, null));
};

var style$5 = {"textArea":"_index-module__textArea__2bdXD","title":"_index-module__title__24HCb","fontFamily":"_index-module__fontFamily__3y7kb","size":"_index-module__size__3QZ4S","color":"_index-module__color__3P8p7","colorContent":"_index-module__colorContent__30T-A","style":"_index-module__style__vb8BV","alignGroup":"_index-module__alignGroup__1S5zb","alignGroupActive":"_index-module__alignGroupActive__ZYMEy","styleGroup":"_index-module__styleGroup__1oIDh","styleGroupActive":"_index-module__styleGroupActive__2_4Pb","fixColorPicker":"_index-module__fixColorPicker__1aFhU","disabledSelect":"_index-module__disabledSelect__2Wd1K","select":"_index-module__select__1s-z0","colorPicker":"_index-module__colorPicker__pHtr_"};

var DropdownIndicator = function DropdownIndicator() {
  return React__default.createElement("img", {
    src: "https://ossprod.jrdaimao.com/file/1690959702767983.svg",
    alt: ""
  });
};
var ReactSelectStyles = {
  singleValue: function singleValue(provided) {
    return _extends({}, provided, {
      color: '#ADADB3',
      fontWeight: 600
    });
  },
  menuList: function menuList(provided) {
    return _extends({}, provided, {
      background: '#1C1D29'
    });
  },
  option: function option(provided) {
    return _extends({}, provided, {
      background: '#1C1D29',
      color: '#ADADB3',
      height: '32px',
      lineHeight: '32px',
      padding: '0px 11px',
      boxSizing: 'border-box',
      cursor: 'pointer',
      '&:hover': {
        color: '#fff',
        background: '#2C375E'
      }
    });
  },
  container: function container(provided) {
    return _extends({}, provided, {
      width: '100%'
    });
  },
  control: function control() {
    return {
      width: '100%',
      cursor: 'pointer',
      paddingRight: 8,
      boxSizing: 'border-box',
      flex: 1,
      height: 28,
      borderRadius: 4,
      background: '#232634',
      color: '#ADADB3',
      fontSize: 14,
      fontWeight: 600,
      display: 'flex'
    };
  }
};

var styles$1 = {"inputNumber":"_index-module__inputNumber__2oJGQ","control":"_index-module__control__1MYtS"};

var InputNumber = function InputNumber(_ref) {
  var value = _ref.value,
    callback = _ref.onChange;
  var _useState = React.useState(value),
    number = _useState[0],
    setNumber = _useState[1];
  var last = React.useRef();
  last.current = number;
  var inputRef = React.useRef();
  React.useEffect(function () {
    setNumber(value);
  }, [value]);
  React.useEffect(function () {
    var _inputRef$current;
    (_inputRef$current = inputRef.current) === null || _inputRef$current === void 0 ? void 0 : _inputRef$current.addEventListener('keydown', keyDownChange);
    return function () {
      var _inputRef$current2;
      (_inputRef$current2 = inputRef.current) === null || _inputRef$current2 === void 0 ? void 0 : _inputRef$current2.removeEventListener('keydown', keyDownChange);
    };
  }, [value, callback]);
  var keyDownChange = function keyDownChange(e) {
    if (e.key === 'ArrowUp') {
      add();
    } else if (e.key === 'ArrowDown') {
      sub();
    }
  };
  var onNumberChange = function onNumberChange(e) {
    var value = retainNumber(e.target.value);
    setNumber(value);
    callback(value);
  };
  var add = function add() {
    var n = +last.current + 1;
    setNumber(n);
    callback(n);
  };
  var sub = function sub() {
    if (last.current <= 12) return;
    var n = +last.current - 1;
    setNumber(n);
    callback(n);
  };
  return React__default.createElement("div", {
    className: styles$1.inputNumber
  }, React__default.createElement("input", {
    ref: inputRef,
    value: number,
    onChange: onNumberChange
  }), React__default.createElement("span", {
    className: styles$1.control
  }, React__default.createElement("span", {
    onClick: add
  }, React__default.createElement("img", {
    src: "https://ossprod.jrdaimao.com/file/1690962892247333.svg",
    alt: ""
  }), React__default.createElement("img", {
    src: "https://ossprod.jrdaimao.com/file/1691034645816626.svg",
    alt: ""
  })), React__default.createElement("span", {
    onClick: sub
  }, React__default.createElement("img", {
    src: "https://ossprod.jrdaimao.com/file/1690962924824666.svg",
    alt: ""
  }), React__default.createElement("img", {
    src: "https://ossprod.jrdaimao.com/file/1691035025689960.svg",
    alt: ""
  }))));
};

var textAlignList = [{
  src: 'https://ossprod.jrdaimao.com/file/1690963862052534.svg',
  activeSrc: 'https://ossprod.jrdaimao.com/file/1690963932538814.svg',
  key: 'left'
}, {
  src: 'https://ossprod.jrdaimao.com/file/1690963869720196.svg',
  activeSrc: 'https://ossprod.jrdaimao.com/file/1690963940992258.svg',
  key: 'center'
}, {
  src: 'https://ossprod.jrdaimao.com/file/1690963877465292.svg',
  activeSrc: 'https://ossprod.jrdaimao.com/file/1690963948610334.svg',
  key: 'right'
}, {
  src: 'https://ossprod.jrdaimao.com/file/1690963884592828.svg',
  activeSrc: 'https://ossprod.jrdaimao.com/file/1690963958787177.svg',
  key: 'justify'
}];
var textStyleList = [{
  label: '常规',
  value: 'normal'
}, {
  label: '粗体',
  value: 600
}];

var getFontManage = function getFontManage() {
  return Promise.resolve([{
    "id": 1,
    "fontlibName": "雨落南泥行楷",
    "key": "ylnnxk",
    "fontlibfile": "https://osstest.jrdaimao.com/file/1684482933910660.ttf",
    "fontImgUrl": "https://osstest.jrdaimao.com/file/1684482969861534.jpg",
    "operator": "",
    "createdAt": "2023-05-19T07:56:12.000Z",
    "updatedAt": "2023-05-19T07:56:12.000Z"
  }, {
    "id": 2,
    "fontlibName": "汉仪孙尚香繁体",
    "key": "hyssxft",
    "fontlibfile": "https://osstest.jrdaimao.com/file/168448426103890.ttf",
    "fontImgUrl": "https://osstest.jrdaimao.com/file/1684484313329597.jpg",
    "operator": "",
    "createdAt": "2023-05-19T08:18:35.000Z",
    "updatedAt": "2023-05-19T08:18:35.000Z"
  }, {
    "id": 3,
    "fontlibName": "DINBLACK",
    "key": "dinblack",
    "fontlibfile": "https://osstest.jrdaimao.com/file/1684926716437711.otf",
    "fontImgUrl": "https://osstest.jrdaimao.com/file/1684926724428125.jpg",
    "operator": "管理员",
    "createdAt": "2023-05-24T11:12:15.000Z",
    "updatedAt": "2023-05-24T11:12:15.000Z"
  }, {
    "id": 4,
    "fontlibName": "Bebas-Regular",
    "key": "bebasRegular",
    "fontlibfile": "https://osstest.jrdaimao.com/file/1684932496362386.ttf",
    "fontImgUrl": "https://osstest.jrdaimao.com/file/1684932519267667.jpg",
    "operator": "管理员",
    "createdAt": "2023-05-24T12:48:43.000Z",
    "updatedAt": "2023-05-24T12:48:43.000Z"
  }, {
    "id": 6,
    "fontlibName": "汉仪小松激浪体",
    "key": "hyxsjl",
    "fontlibfile": "https://osstest.jrdaimao.com/file/1685001304598186.ttf",
    "fontImgUrl": "https://osstest.jrdaimao.com/file/1685001311019992.jpg",
    "operator": "管理员",
    "createdAt": "2023-05-25T07:55:34.000Z",
    "updatedAt": "2023-05-30T08:58:25.000Z"
  }, {
    "id": 13,
    "fontlibName": "叶子",
    "key": "yezi",
    "fontlibfile": "https://osstest.jrdaimao.com/file/168543899068477.ttf",
    "fontImgUrl": "https://osstest.jrdaimao.com/file/1685438995766786.jpg",
    "operator": "管理员",
    "createdAt": "2023-05-30T09:30:14.000Z",
    "updatedAt": "2023-05-30T09:30:14.000Z"
  }, {
    "id": 14,
    "fontlibName": "Aa马克",
    "key": "aamk",
    "fontlibfile": "https://osstest.jrdaimao.com/file/1685439688863813.ttf",
    "fontImgUrl": "https://osstest.jrdaimao.com/file/1685439704617823.jpg",
    "operator": "管理员",
    "createdAt": "2023-05-30T09:41:46.000Z",
    "updatedAt": "2023-05-30T09:41:46.000Z"
  }, {
    "id": 15,
    "fontlibName": "Egosta",
    "key": "egosta",
    "fontlibfile": "https://osstest.jrdaimao.com/file/1685439871684955.ttf",
    "fontImgUrl": "https://osstest.jrdaimao.com/file/1685439875954916.jpg",
    "operator": "管理员",
    "createdAt": "2023-05-30T09:44:45.000Z",
    "updatedAt": "2023-05-30T09:44:45.000Z"
  }, {
    "id": 16,
    "fontlibName": "汉仪永字七巧板",
    "key": "hyyzqqb",
    "fontlibfile": "https://osstest.jrdaimao.com/file/1685440650813535.ttf",
    "fontImgUrl": "https://osstest.jrdaimao.com/file/1685440825332319.jpg",
    "operator": "管理员",
    "createdAt": "2023-05-30T10:00:28.000Z",
    "updatedAt": "2023-05-30T10:00:28.000Z"
  }, {
    "id": 17,
    "fontlibName": "阿里妈妈数黑体",
    "key": "alimamasht",
    "fontlibfile": "https://osstest.jrdaimao.com/file/1688626758184870.ttf",
    "fontImgUrl": "https://osstest.jrdaimao.com/file/1688626774033978.jpg",
    "operator": "管理员",
    "createdAt": "2023-07-06T06:59:37.000Z",
    "updatedAt": "2023-07-06T06:59:37.000Z"
  }]);
};

var GeneralTextList = ['serif'];
var Font = new Map();
var globalFontList = null;
var filterToText = function filterToText(list) {
  if (!Array.isArray(list)) return [];
  return list.filter(function (item) {
    return item.type === 'i-text' && !GeneralTextList.includes(item.fontFamily);
  });
};
var useChangeFontFamily = function useChangeFontFamily() {
  var _useAttr = useAttr(),
    setAttr = _useAttr.setAttr;
  var _useContext = React.useContext(Context$1),
    setLoading = _useContext.setLoading;
  var _useState = React.useState([]),
    fontList = _useState[0],
    setFontList = _useState[1];
  var _useState2 = React.useState(false),
    fontLoaded = _useState2[0],
    setFontLoaded = _useState2[1];
  var useFontListLast = React.useRef();
  useFontListLast.current = fontList;
  React.useEffect(function () {
    (function () {
      try {
        var _temp2 = function _temp2() {
          setFontLoaded(true);
          globalFontList = list;
          setFontList(list);
        };
        var list = [];
        var _temp = function () {
          if (globalFontList) {
            list = globalFontList;
          } else {
            return Promise.resolve(getFontManage()).then(function (res) {
              list = res.map(function (item) {
                return {
                  value: item.key,
                  label: item.fontlibName,
                  url: item.fontlibfile
                };
              });
            });
          }
        }();
        return _temp && _temp.then ? _temp.then(_temp2) : _temp2(_temp);
      } catch (e) {
        Promise.reject(e);
      }
    })();
  }, []);
  var runChange = React.useCallback(function (item) {
    if (Font.has(item.name)) {
      setAttr({
        fontFamily: item.name
      });
      return;
    }
    setLoading(true);
    var styleContent = "\n     @font-face {\n      font-family: " + item.name + ";\n      src: url('" + item.src + "');\n     }";
    var style = document.createElement('style');
    style.innerHTML = styleContent;
    document.body.appendChild(style);
    var font = new FontFaceObserver(item.name);
    return font.load(item.name, 2000000).then(function () {
      Font.set(item.name, true);
      setLoading(false);
      console.log('Font is available');
      setAttr({
        fontFamily: item.name
      });
    }, function (e) {
      setLoading(false);
      document.body.removeChild(style);
      console.log('Font is not available', e);
    });
  }, [setAttr]);
  var loadFont = React.useCallback(function (objectsData) {
    if (!objectsData) return Promise.resolve();
    var textList = filterToText(objectsData);
    var style = '';
    textList.forEach(function (item) {
      useFontListLast.current.forEach(function (r) {
        if (item.fontFamily === r.value && !Font.has(r.value)) {
          style += "@font-face {font-family: " + r.value + ";src: url('" + r.url + "');}";
        }
      });
    });
    if (style === '') return Promise.resolve();
    var el = document.createElement('style');
    el.innerHTML = style;
    document.body.appendChild(el);
    var fontFamiliesAll = textList.map(function (item) {
      return new Promise(function (resolve, reject) {
        var font = new FontFaceObserver(item.fontFamily);
        font.load(item.fontFamily, 2000000).then(function () {
          Font.set(item.fontFamily, true);
          resolve();
        })["catch"](function (err) {
          reject();
          console.log('loadFont', err);
        });
      });
    });
    return Promise.all(fontFamiliesAll);
  }, [fontList, fontLoaded]);
  return {
    fontList: fontList,
    runChange: runChange,
    loadFont: loadFont,
    fontLoaded: fontLoaded
  };
};

var ColorPicker = reactColor.SketchPicker;
var TextAttr = function TextAttr() {
  var _useAttr = useAttr(),
    getActiveObject = _useAttr.getActiveObject,
    setAttr = _useAttr.setAttr;
  var _useChangeFontFamily = useChangeFontFamily(),
    fontList = _useChangeFontFamily.fontList,
    runChange = _useChangeFontFamily.runChange;
  var _useState = React.useState('12'),
    fontSize = _useState[0],
    setFontSize = _useState[1];
  var _useState2 = React.useState('#000000'),
    color = _useState2[0],
    setColor = _useState2[1];
  var _useState3 = React.useState(false),
    visible = _useState3[0],
    setVisible = _useState3[1];
  var _useState4 = React.useState(false),
    fontWeight = _useState4[0],
    setFontWeight = _useState4[1];
  var _useState5 = React.useState(false),
    underline = _useState5[0],
    setUnderline = _useState5[1];
  var _useState6 = React.useState(false),
    incline = _useState6[0],
    setIncline = _useState6[1];
  var _useState7 = React.useState(''),
    align = _useState7[0],
    setAlign = _useState7[1];
  var _useState8 = React.useState(null),
    fontStyle = _useState8[0],
    setFontStyle = _useState8[1];
  var _useState9 = React.useState(null),
    fontFamily = _useState9[0],
    setFontFamily = _useState9[1];
  React.useEffect(function () {
    var activeObject = getActiveObject();
    if (!activeObject) return;
    setFontSize(activeObject.get('fontSize'));
    setColor(activeObject.get('fill'));
    setUnderline(activeObject.get('underline'));
    setAlign(activeObject.get('textAlign'));
    setIncline(activeObject.get('fontStyle') === 'italic');
    var fontWeight = activeObject.get('fontWeight');
    var isWeight = fontWeight === 'bold' || fontWeight > 500;
    setFontWeight(isWeight);
    setFontStyle(isWeight ? textStyleList[1] : textStyleList[0]);
  }, [getActiveObject, fontList]);
  React.useEffect(function () {
    var activeObject = getActiveObject();
    if (!activeObject) return;
    var fontFamily = activeObject.get('fontFamily');
    setFontFamily(fontList.find(function (item) {
      return item.value === fontFamily;
    }));
  }, [getActiveObject, fontList]);
  React.useEffect(function () {
    var el = document.querySelector('#attr-content');
    if (!el) return;
    if (visible) {
      el.style.overflow = 'inherit';
    } else {
      el.style.overflow = 'auto';
    }
    return function () {
      el.style.overflow = 'auto';
    };
  }, [visible]);
  var onFontSizeChange = function onFontSizeChange(e) {
    setAttr({
      fontSize: +e
    });
    setFontSize(e);
  };
  var onChangeComplete = function onChangeComplete(e) {
    setAttr({
      fill: e.hex
    });
    setColor(e.hex);
  };
  var onWeightChange = function onWeightChange() {
    if (fontWeight) {
      setAttr({
        fontWeight: 'normal'
      });
    } else {
      setAttr({
        fontWeight: 'bold'
      });
    }
    setFontWeight(function (prevState) {
      return !prevState;
    });
  };
  var onUnderlineChange = function onUnderlineChange() {
    setAttr({
      underline: !underline
    });
    setUnderline(function (prevState) {
      return !prevState;
    });
  };
  var onAlignChange = function onAlignChange(item) {
    setAttr({
      textAlign: item.key
    });
    setAlign(item.key);
  };
  var onInclineChange = function onInclineChange() {
    if (incline) {
      setAttr({
        fontStyle: 'normal'
      });
    } else {
      setAttr({
        fontStyle: 'italic'
      });
    }
    setIncline(function (prevState) {
      return !prevState;
    });
  };
  var onFontStyleChange = function onFontStyleChange(item) {
    setFontStyle(item);
    setAttr({
      fontWeight: item.value
    });
  };
  var onChangeFontFamily = function onChangeFontFamily(item) {
    runChange({
      src: item.url,
      name: item.value
    });
  };
  return React__default.createElement("div", {
    className: style$5.textArea
  }, React__default.createElement("div", {
    className: style$5.title
  }, "\u6587\u5B57"), React__default.createElement("div", {
    className: style$5.textAreaContent
  }, React__default.createElement("div", {
    className: style$5.fontFamily
  }, React__default.createElement(Select, {
    placeholder: "\u8BF7\u9009\u62E9\u5B57\u4F53",
    onChange: onChangeFontFamily,
    components: {
      DropdownIndicator: DropdownIndicator
    },
    className: style$5.select,
    styles: ReactSelectStyles,
    isSearchable: false,
    options: fontList,
    value: fontFamily
  }), React__default.createElement("div", {
    className: style$5.size
  }, React__default.createElement(InputNumber, {
    value: fontSize,
    onChange: onFontSizeChange
  }))), React__default.createElement("div", {
    className: style$5.color
  }, React__default.createElement(Select, {
    isDisabled: true,
    onChange: onFontStyleChange,
    value: fontStyle,
    components: {
      DropdownIndicator: DropdownIndicator
    },
    className: style$5.select + " " + style$5.disabledSelect,
    styles: ReactSelectStyles,
    isSearchable: false,
    options: textStyleList
  }), React__default.createElement("div", {
    className: style$5.colorContent,
    onClick: function onClick() {
      return setVisible(function (prevState) {
        return !prevState;
      });
    }
  }, React__default.createElement("div", {
    style: {
      background: color
    }
  }), React__default.createElement("span", null, color))), React__default.createElement("div", {
    className: style$5.style
  }, React__default.createElement("div", {
    className: style$5.alignGroup
  }, textAlignList.map(function (item) {
    return React__default.createElement("div", {
      className: item.key === align ? style$5.alignGroupActive : '',
      onClick: function onClick() {
        return onAlignChange(item);
      },
      key: item.key
    }, React__default.createElement("img", {
      src: item.src,
      alt: ""
    }), React__default.createElement("img", {
      src: item.activeSrc,
      alt: ""
    }));
  })), React__default.createElement("div", {
    className: style$5.styleGroup
  }, React__default.createElement("div", {
    onClick: onWeightChange
  }, React__default.createElement("div", {
    className: fontWeight ? style$5.styleGroupActive : ''
  }, React__default.createElement("img", {
    src: "https://ossprod.jrdaimao.com/file/1690964441564257.svg",
    alt: ""
  }), React__default.createElement("img", {
    src: "https://ossprod.jrdaimao.com/file/1690964450733564.svg",
    alt: ""
  }))), React__default.createElement("div", {
    onClick: onInclineChange
  }, React__default.createElement("div", {
    className: incline ? style$5.styleGroupActive : ''
  }, React__default.createElement("img", {
    src: "https://ossprod.jrdaimao.com/file/1690971550502930.svg",
    alt: ""
  }), React__default.createElement("img", {
    src: "https://ossprod.jrdaimao.com/file/1690971566471578.svg",
    alt: ""
  }))), React__default.createElement("div", {
    onClick: onUnderlineChange
  }, React__default.createElement("div", {
    className: underline ? style$5.styleGroupActive : ''
  }, React__default.createElement("img", {
    src: "https://ossprod.jrdaimao.com/file/1690964614214969.svg",
    alt: ""
  }), React__default.createElement("img", {
    src: "https://ossprod.jrdaimao.com/file/1690964622200366.svg",
    alt: ""
  })))))), visible ? React__default.createElement("div", {
    className: style$5.fixColorPicker
  }, React__default.createElement(ColorPicker, {
    className: style$5.colorPicker,
    onChangeComplete: onChangeComplete,
    color: color
  })) : null);
};

var TextSpaceAttr = function TextSpaceAttr() {
  var _useAttr = useAttr(),
    getActiveObject = _useAttr.getActiveObject;
  return React__default.createElement("div", {
    className: style$1.workSpaceAttr
  }, React__default.createElement("div", {
    className: style$1.base
  }, React__default.createElement("div", null, React__default.createElement(Size, {
    getActiveObject: getActiveObject,
    showRation: true
  })), React__default.createElement("div", null, React__default.createElement(Position, null)), React__default.createElement("div", null, React__default.createElement(Transparent, null))), React__default.createElement("div", {
    className: style$1.division
  }), React__default.createElement(TextAttr, null), React__default.createElement("div", {
    className: style$1.division
  }), React__default.createElement(PageAlign, null), React__default.createElement("div", {
    className: style$1.division
  }), React__default.createElement(CoverOrder, null));
};

var attrTabList = [{
  title: '属性',
  key: 'Attr',
  bg: 'https://ossprod.jrdaimao.com/file/1690510922616482.svg'
}, {
  title: '图层',
  key: 'coverage',
  bg: 'https://ossprod.jrdaimao.com/file/1690511949701720.svg'
}];
var attrAreaComponent = {
  'image': ImageSpaceAttr,
  'i-text': TextSpaceAttr
};
var DefaultKey = 'Attr';

var InitState = {
  attrTab: DefaultKey,
  loading: false,
  loadingText: '',
  setLoading: function setLoading() {},
  setLoadingText: function setLoadingText() {},
  setAttrTab: function setAttrTab() {}
};
var Context$1 = React.createContext(InitState);
var EditorProvider = function EditorProvider(_ref) {
  var children = _ref.children;
  var _useState = React.useState(DefaultKey),
    attrTab = _useState[0],
    setAttrTab = _useState[1];
  var _useState2 = React.useState(false),
    loading = _useState2[0],
    setLoading = _useState2[1];
  var _useState3 = React.useState('加载中'),
    loadingText = _useState3[0],
    setLoadingText = _useState3[1];
  var value = {
    attrTab: attrTab,
    loading: loading,
    loadingText: loadingText,
    setLoading: setLoading,
    setLoadingText: setLoadingText,
    setAttrTab: setAttrTab
  };
  return React__default.createElement(Context$1.Provider, {
    value: value
  }, children);
};

var loadImage = function loadImage(src) {
  if (!src) return Promise.resolve();
  return new Promise(function (resolve, reject) {
    var img = new Image();
    img.onload = function () {
      resolve();
    };
    img.onerror = function (err) {
      reject(err);
    };
    img.src = src;
  });
};
function base64ConvertFile(urlData) {
  var arr = urlData.split(',');
  var type = arr[0].match(/:(.*?);/)[1];
  var fileExt = type.split('/')[1];
  var bstr = atob(arr[1]);
  var n = bstr.length;
  var u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], uuid() + "." + fileExt, {
    type: type
  });
}

var request = axios.create({
  baseURL: ''
});
request.interceptors.response.use(function (response) {
  if (response.data.code === '200') {
    return response.data.data;
  } else {
    throw new Error(response.data.message);
  }
}, function (error) {
  throw new Error(error);
});
var fetch = {
  get: function get(url, params) {
    return request.get(url, {
      params: params
    });
  },
  post: function post(url, data) {
    return request.post(url, data);
  }
};

var getImageList = function getImageList(data) {
  return fetch.get('/api_editimg/liststock', data);
};
var postUploadImage = function postUploadImage(file) {
  var form = new FormData();
  form.append('file', file);
  return fetch.post('/api_image/upload', form);
};
var addImageApi = function addImageApi(data) {
  return fetch.post('/api_editimg/addstock', data);
};
var saveHistory = function saveHistory(data) {
  return fetch.post('/api_editimg/save', data);
};
var delstock = function delstock(data) {
  return fetch.get('/api_editimg/delstock', data);
};
var getDetail = function getDetail(data) {
  return fetch.get('/api_editimg/detail', data);
};

var useToast = function useToast() {
  var error = React.useCallback(function (text) {
    toast__default(text, {
      duration: 1500,
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff'
      }
    });
  }, []);
  return {
    error: error
  };
};

var useClipImage = function useClipImage() {
  var _useContext = React.useContext(Context),
    workSpace = _useContext.workSpace,
    canvas = _useContext.canvas,
    clipImageId = _useContext.clipImageId,
    clipRawIndex = _useContext.clipRawIndex,
    setIsClipImage = _useContext.setIsClipImage;
  var _useContext2 = React.useContext(Context$1),
    setLoading = _useContext2.setLoading;
  var toast = useToast();
  var saveClipImage = React.useCallback(function () {
    try {
      if (!canvas || !workSpace) return Promise.resolve();
      var scale = canvas.getZoom();
      return Promise.resolve(_catch(function () {
        var image = null;
        var rect = null;
        var currentClipImageIndex = null;
        canvas.getObjects().forEach(function (item, index) {
          if (item.id === 'currentClipRect') {
            rect = item;
          }
          if (item.id === clipImageId) {
            image = item;
            currentClipImageIndex = index;
          }
        });
        if (!image || !rect) return;
        setLoading(true);
        var newRect = new fabric.fabric.Rect({
          left: rect.left,
          top: rect.top,
          width: rect.getScaledWidth(),
          height: rect.getScaledHeight(),
          absolutePositioned: true
        });
        image.clipPath = newRect;
        var cropped = new Image();
        cropped.crossOrigin = 'anonymous';
        canvas.remove(rect);
        canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
        var base64 = canvas.toDataURL({
          left: newRect.left,
          top: newRect.top,
          width: newRect.width,
          height: newRect.height
        });
        var file = base64ConvertFile(base64);
        return Promise.resolve(postUploadImage(file)).then(function (res) {
          cropped.src = res.url;
          workSpace === null || workSpace === void 0 ? void 0 : workSpace.setZoomAuto(scale);
          cropped.onload = function () {
            canvas.remove(image);
            var newImage = new fabric.fabric.Image(cropped, {
              crossOrigin: 'anonymous'
            });
            newImage.set({
              id: image.id,
              left: newRect.left,
              top: newRect.top,
              rawScaleX: image.scaleX,
              rawScaleY: image.scaleY,
              sourceSrc: image.sourceSrc,
              rectDiffLeft: newRect.left - image.left,
              rectDiffTop: newRect.top - image.top,
              prevWidth: newRect.getScaledWidth(),
              prevHeight: newRect.getScaledHeight()
            });
            canvas.add(newImage);
            if (currentClipImageIndex !== clipRawIndex) {
              while (currentClipImageIndex !== clipRawIndex) {
                newImage.sendBackwards();
                currentClipImageIndex--;
              }
            }
            canvas.renderAll();
            setIsClipImage(false);
            setLoading(false);
          };
        });
      }, function (err) {
        setLoading(false);
        workSpace === null || workSpace === void 0 ? void 0 : workSpace.setZoomAuto(scale);
        cancelClipImage();
        toast.error('裁剪失败，请稍后重试~');
        console.log(err);
      }));
    } catch (e) {
      return Promise.reject(e);
    }
  }, [canvas, workSpace, clipImageId, clipRawIndex]);
  var cancelClipImage = React.useCallback(function () {
    if (!canvas) return;
    var rect = null;
    var clipImage = null;
    var currentClipImageIndex = null;
    canvas.getObjects().forEach(function (item, index) {
      if (item.id === 'currentClipRect') {
        rect = item;
      }
      if (item.id === clipImageId) {
        clipImage = item;
        currentClipImageIndex = index;
      }
    });
    if (!clipImage) return;
    if (rect) canvas.remove(rect);
    canvas.remove(clipImage);
    var cloneObject = clipImage.get('cloneObject');
    if (!clipImage) return;
    cloneObject.set({
      id: uuid(),
      sourceSrc: clipImage.sourceSrc,
      rawScaleX: clipImage.scaleX,
      rawScaleY: clipImage.scaleY,
      rectDiffLeft: clipImage.rectDiffLeft,
      rectDiffTop: clipImage.rectDiffTop
    });
    canvas.add(cloneObject);
    if (cloneObject && currentClipImageIndex !== clipRawIndex) {
      while (currentClipImageIndex !== clipRawIndex) {
        cloneObject.sendBackwards();
        currentClipImageIndex--;
      }
    }
    setIsClipImage(false);
    canvas.renderAll();
  }, [canvas, workSpace, clipImageId, clipRawIndex]);
  return {
    saveClipImage: saveClipImage,
    cancelClipImage: cancelClipImage
  };
};

var useEvents = function useEvents() {
  var _useContext = React.useContext(Context),
    canvas = _useContext.canvas,
    editor = _useContext.editor,
    workSpace = _useContext.workSpace,
    setSelectMode = _useContext.setSelectMode,
    setSelectIds = _useContext.setSelectIds,
    setSelectOneType = _useContext.setSelectOneType,
    clipImageId = _useContext.clipImageId,
    setIsClipImage = _useContext.setIsClipImage,
    isClipImage = _useContext.isClipImage;
  var _useContext2 = React.useContext(Context$1),
    setLoading = _useContext2.setLoading;
  var _useClipImage = useClipImage();
  React.useEffect(function () {
    events.on(Types.SHOW_LOADING, setLoading);
    return function () {
      events.off(Types.SHOW_LOADING, setLoading);
    };
  }, []);
  React.useEffect(function () {
    if (!canvas) return;
    canvas.on({
      'selection:created': selected,
      'selection:updated': selected,
      'selection:cleared': selected,
      'mouse:wheel': onWheel
    });
    return function () {
      canvas.off({
        'selection:created': selected,
        'selection:updated': selected,
        'selection:cleared': selected,
        'mouse:wheel': onWheel
      });
    };
  }, [canvas, editor]);
  React.useEffect(function () {
    hotkeys(KeyNames["delete"], deleteObjects);
    return function () {
      hotkeys.unbind(KeyNames["delete"], deleteObjects);
    };
  }, [canvas, isClipImage, clipImageId]);
  React.useEffect(function () {
    hotkeys(KeyNames.zoom, onZoom);
    return function () {
      hotkeys.unbind(KeyNames.zoom, onZoom);
    };
  }, [canvas, workSpace]);
  var selected = React.useCallback(function () {
    if (!canvas) return;
    var actives = canvas.getActiveObjects().filter(function (item) {
      return !(item instanceof fabric.fabric.GuideLine);
    });
    if (actives && actives.length === 1) {
      var activeObject = actives[0];
      if (activeObject && activeObject.type === 'image') {
        activeObject.set({
          prevWidth: activeObject.getScaledWidth(),
          prevHeight: activeObject.getScaledHeight()
        });
        canvas.renderAll();
      }
      if (activeObject.type === 'i-text') {
        activeObject.setControlsVisibility({
          mt: false,
          ml: false,
          mb: false,
          mr: false
        });
        canvas.renderAll();
      }
      setSelectMode('one');
      setSelectIds([activeObject.id]);
      setSelectOneType(activeObject.type);
    } else if (actives && actives.length > 1) {
      setSelectMode('multiple');
      setSelectIds(actives.map(function (item) {
        return item.id;
      }));
    } else {
      setSelectMode('');
      setSelectIds([]);
      setSelectOneType('');
    }
  }, [canvas, editor]);
  var onZoom = React.useCallback(function (e) {
    if (e.code === 'Minus') {
      workSpace === null || workSpace === void 0 ? void 0 : workSpace.small(0.05);
      e.preventDefault();
      e.stopPropagation();
    }
    if (e.code === 'Equal') {
      workSpace === null || workSpace === void 0 ? void 0 : workSpace.big(0.05);
      e.preventDefault();
      e.stopPropagation();
    }
  }, [canvas, workSpace]);
  React.useEffect(function () {
    if (!canvas) return;
    canvas.on('object:modified', function (e) {
      var _e$transform;
      var target = (_e$transform = e.transform) === null || _e$transform === void 0 ? void 0 : _e$transform.target;
      if (!target) return;
      if (target.type !== 'image') return;
      if (isUndef(target.rawScaleX) || isUndef(target.rawScaleY)) return;
      var prevWidth = target.prevWidth;
      var prevHeight = target.prevHeight;
      target.set({
        rawScaleX: target.getScaledWidth() / prevWidth * target.rawScaleX,
        rawScaleY: target.getScaledHeight() / prevHeight * target.rawScaleY,
        prevWidth: target.getScaledWidth(),
        prevHeight: target.getScaledHeight()
      });
      canvas.renderAll();
    });
  }, [canvas]);
  var onWheel = React.useCallback(function (_ref) {
    var e = _ref.e;
    var delta = e.deltaY;
    if (delta > 0) {
      workSpace === null || workSpace === void 0 ? void 0 : workSpace.small(0.01);
    } else {
      workSpace === null || workSpace === void 0 ? void 0 : workSpace.big(0.01);
    }
    e.preventDefault();
    e.stopPropagation();
  }, [canvas, workSpace]);
  var deleteClipImageAndRect = React.useCallback(function () {
    if (!canvas) return;
    var rect = null;
    var clipImage = null;
    canvas.getObjects().forEach(function (item) {
      if (item.id === 'currentClipRect') {
        rect = item;
      }
      if (item.id === clipImageId) {
        clipImage = item;
      }
    });
    if (!rect || !clipImage) return;
    canvas.remove(rect);
    canvas.remove(clipImage);
    canvas.discardActiveObject();
    canvas.renderAll();
    setIsClipImage(false);
  }, [canvas, clipImageId]);
  var deleteObjects = React.useCallback(function () {
    if (isClipImage) {
      return;
    }
    var activeObject = canvas.getActiveObjects();
    if (activeObject) {
      activeObject.map(function (item) {
        return canvas.remove(item);
      });
      canvas.discardActiveObject();
      canvas.renderAll();
    }
  }, [canvas, isClipImage, clipImageId]);
};

var DefaultWidth = 1024;
var DefaultHeight = 1024;
var DefaultWorkSpaceColor = 'rgba(255,255,255,1)';
var EditorWorkspace = /*#__PURE__*/function () {
  function EditorWorkspace(canvas, option) {
    this.canvas = canvas;
    var workspaceEl = document.querySelector('#workspace');
    if (!workspaceEl) {
      throw new Error('element #workspace is missing, plz check!');
    }
    this.workspaceEl = workspaceEl;
    this.workspace = null;
    this.option = option;
    this.dragMode = false;
    this.fill = DefaultWorkSpaceColor;
    this._initBackground();
    this._initWorkspace();
    this._initResizeObserve();
    this._initDring();
  }
  var _proto = EditorWorkspace.prototype;
  _proto._initBackground = function _initBackground() {
    this.canvas.setWidth(this.workspaceEl.offsetWidth);
    this.canvas.setHeight(this.workspaceEl.offsetHeight);
  };
  _proto._initWorkspace = function _initWorkspace() {
    var _this = this;
    var _this$option = this.option,
      src = _this$option.src,
      canvasData = _this$option.canvasData,
      callback = _this$option.callback;
    if (canvasData && canvasData.objects.length) {
      var rectOptions = canvasData.objects.find(function (item) {
        return item.type === 'rect';
      });
      this.width = rectOptions.width;
      this.height = this.height = rectOptions.height;
      this.fill = rectOptions.fill;
      this.canvas.loadFromJSON(canvasData, function () {
        var workspace = _this.canvas.getObjects().find(function (item) {
          return item.id === 'workspace';
        });
        workspace.set('selectable', false);
        workspace.set('hasControls', false);
        _this.setSize(workspace.width, workspace.height);
        _this.canvas.renderAll();
        callback();
      });
      return;
    }
    if (!src) {
      this.width = DefaultWidth;
      this.height = DefaultHeight;
      this._initRect();
      return;
    }
    fabric.fabric.Image.fromURL(src, function (img) {
      img.set({
        type: 'image',
        left: 0.5,
        top: 0.5,
        id: 'mainImg'
      });
      _this.width = img.width || DefaultWidth;
      _this.height = img.height || DefaultHeight;
      _this._initRect(img);
    }, {
      crossOrigin: 'anonymous'
    });
  };
  _proto._initRect = function _initRect(img) {
    var _this$option$callback, _this$option2;
    var workspace = new fabric.fabric.Rect({
      fill: this.fill,
      width: this.width,
      height: this.height,
      id: 'workspace'
    });
    workspace.w = this;
    workspace.set('selectable', false);
    workspace.set('hasControls', false);
    workspace.hoverCursor = 'default';
    this.canvas.add(workspace);
    if (img && img.width && img.height) {
      this.canvas.add(img);
    }
    this.canvas.renderAll();
    this.workspace = workspace;
    (_this$option$callback = (_this$option2 = this.option).callback) === null || _this$option$callback === void 0 ? void 0 : _this$option$callback.call(_this$option2);
    this.auto();
  };
  _proto.setBgColor = function setBgColor(color) {
    var _this$workspace;
    this.fill = color;
    (_this$workspace = this.workspace) === null || _this$workspace === void 0 ? void 0 : _this$workspace.set({
      fill: color
    });
    this.canvas.renderAll();
  };
  _proto.setCenterFromObject = function setCenterFromObject(obj) {
    var canvas = this.canvas;
    var objCenter = obj.getCenterPoint();
    var viewportTransform = canvas.viewportTransform;
    if (canvas.width === undefined || canvas.height === undefined || !viewportTransform) return;
    viewportTransform[4] = canvas.width / 2 - objCenter.x * viewportTransform[0];
    viewportTransform[5] = canvas.height / 2 - objCenter.y * viewportTransform[3];
    canvas.setViewportTransform(viewportTransform);
    canvas.renderAll();
  };
  _proto._initResizeObserve = function _initResizeObserve() {
    var _this2 = this;
    var resizeObserver = new ResizeObserver(throttle(function () {
      _this2.auto();
    }, 50));
    resizeObserver.observe(this.workspaceEl);
  };
  _proto.setSize = function setSize(width, height) {
    this._initBackground();
    this.width = isNumber(width) ? width : +width;
    this.height = isNumber(height) ? height : +height;
    this.workspace = this.canvas.getObjects().find(function (item) {
      return item.id === 'workspace';
    });
    this.workspace.set('width', this.width);
    this.workspace.set('height', this.height);
    this.auto();
  };
  _proto.setZoomAuto = function setZoomAuto(scale, cb) {
    var _this3 = this;
    var workspaceEl = this.workspaceEl;
    var width = workspaceEl.offsetWidth;
    var height = workspaceEl.offsetHeight;
    this.canvas.setWidth(width);
    this.canvas.setHeight(height);
    var center = this.canvas.getCenter();
    this.canvas.setViewportTransform(fabric.fabric.iMatrix.concat());
    this.canvas.zoomToPoint(new fabric.fabric.Point(center.left, center.top), scale);
    if (!this.workspace) return;
    this.setCenterFromObject(this.workspace);
    this.workspace.clone(function (cloned) {
      _this3.canvas.clipPath = cloned;
      _this3.canvas.requestRenderAll();
    });
    if (cb) cb(this.workspace.left, this.workspace.top);
  };
  _proto.getScale = function getScale() {
    var viewPortWidth = this.workspaceEl.offsetWidth;
    var viewPortHeight = this.workspaceEl.offsetHeight;
    var width = this.width || 0;
    var height = this.height || 0;
    if (!width || !height) return 0;
    if (viewPortWidth / viewPortHeight < width / height) {
      return subtract(divide(viewPortWidth, width), 0.08);
    }
    return subtract(divide(viewPortHeight, height), 0.08);
  };
  _proto.big = function big(value) {
    var zoomRatio = this.canvas.getZoom();
    zoomRatio += value || 0.05;
    if (zoomRatio >= 3) {
      zoomRatio = 3;
    }
    events.emit(Types.CHANGE_SCALE, zoomRatio);
    var center = this.canvas.getCenter();
    this.canvas.zoomToPoint(new fabric.fabric.Point(center.left, center.top), zoomRatio);
  };
  _proto.small = function small(value) {
    var zoomRatio = this.canvas.getZoom();
    zoomRatio -= value || 0.05;
    if (zoomRatio <= 0.1) {
      zoomRatio = 0.1;
    }
    events.emit(Types.CHANGE_SCALE, zoomRatio);
    var center = this.canvas.getCenter();
    this.canvas.zoomToPoint(new fabric.fabric.Point(center.left, center.top), zoomRatio < 0 ? 0.01 : zoomRatio);
  };
  _proto.auto = function auto() {
    var scale = this.getScale();
    if (scale) {
      this.scale = scale;
      events.emit(Types.CHANGE_SCALE, scale);
      this.setZoomAuto(scale);
    }
  };
  _proto.one = function one() {
    this.setZoomAuto(0.8 - 0.08);
    this.canvas.requestRenderAll();
  };
  _proto.startDring = function startDring() {
    this.dragMode = true;
    this.canvas.defaultCursor = 'grab';
  };
  _proto.endDring = function endDring() {
    this.dragMode = false;
    this.canvas.defaultCursor = 'default';
  };
  _proto._initDring = function _initDring() {
    var This = this;
    this.canvas.on('mouse:down', function (opt) {
      var evt = opt.e;
      if (evt.altKey || This.dragMode) {
        This.canvas.defaultCursor = 'grabbing';
        This.canvas.discardActiveObject();
        This._setDring();
        this.selection = false;
        this.isDragging = true;
        this.lastPosX = evt.clientX;
        this.lastPosY = evt.clientY;
        this.requestRenderAll();
      }
    });
    this.canvas.on('mouse:move', function (opt) {
      if (this.isDragging) {
        This.canvas.discardActiveObject();
        This.canvas.defaultCursor = 'grabbing';
        var e = opt.e;
        if (!this.viewportTransform) return;
        var vpt = this.viewportTransform;
        vpt[4] += e.clientX - this.lastPosX;
        vpt[5] += e.clientY - this.lastPosY;
        this.lastPosX = e.clientX;
        this.lastPosY = e.clientY;
        this.requestRenderAll();
      }
    });
    this.canvas.on('mouse:up', function () {
      if (!this.viewportTransform) return;
      this.setViewportTransform(this.viewportTransform);
      this.isDragging = false;
      this.selection = true;
      this.getObjects().forEach(function (obj) {
        if (obj.id !== 'workspace' && obj.hasControls) {
          obj.selectable = true;
        }
      });
      this.requestRenderAll();
      This.canvas.defaultCursor = 'default';
    });
    this.canvas.on('mouse:wheel', function (opt) {
      var delta = opt.e.deltaY;
      var zoom = this.getZoom();
      zoom *= Math.pow(0.999, delta);
      if (zoom > 20) zoom = 20;
      if (zoom < 0.01) zoom = 0.01;
      var center = this.getCenter();
      this.zoomToPoint(new fabric.fabric.Point(center.left, center.top), zoom);
      opt.e.preventDefault();
      opt.e.stopPropagation();
    });
  };
  _proto._setDring = function _setDring() {
    this.canvas.selection = false;
    this.canvas.defaultCursor = 'grab';
    this.canvas.getObjects().forEach(function (obj) {
      obj.selectable = false;
    });
    this.canvas.renderAll();
    this.canvas.requestRenderAll();
  };
  return EditorWorkspace;
}();

var useSave = function useSave() {
  var toast = useToast();
  var _useContext = React.useContext(Context),
    editor = _useContext.editor,
    canvas = _useContext.canvas,
    workSpace = _useContext.workSpace,
    mainUrl = _useContext.mainUrl,
    isClipImage = _useContext.isClipImage,
    clipImageId = _useContext.clipImageId,
    clipRawIndex = _useContext.clipRawIndex;
  var _useClipImage = useClipImage(),
    cancelClipImage = _useClipImage.cancelClipImage;
  var _useState = React.useState(false),
    saveToImageLoading = _useState[0],
    setSaveToImageLoading = _useState[1];
  var useLast = React.useRef({});
  useLast.current = {
    editor: editor,
    mainUrl: mainUrl
  };
  var unloadSendBeacon = React.useCallback(function () {
    var _useLast$current = useLast.current,
      editor = _useLast$current.editor,
      mainUrl = _useLast$current.mainUrl;
    if (!editor || !mainUrl) return;
    var dataJson = editor.getJson();
    dataJson.objects = dataJson.objects.filter(function (item) {
      return item.id !== 'currentClipRect';
    });
    var data = JSON.stringify({
      data: dataJson ? JSON.stringify(dataJson) : '',
      imgSrc: mainUrl
    });
    var blob = new Blob([data], {
      type: 'application/json'
    });
    var isPush = navigator.sendBeacon('/api_editimg/save', blob);
    console.log('navigator.sendBeacon event', isPush);
  }, [editor, mainUrl]);
  var saveHistory$1 = React.useCallback(function () {
    if (!editor || !mainUrl) return;
    var dataJson = editor.getJson();
    return saveHistory({
      data: dataJson ? JSON.stringify(dataJson) : '',
      imgSrc: mainUrl
    });
  }, [editor, mainUrl]);
  var saveToJson = React.useCallback(function () {
    if (!editor) return;
    saveHistory$1();
    var dataUrl = editor.getJson();
    var fileStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataUrl, null, '\t'));
    fileSaver.saveAs(fileStr, uuid() + ".json");
  }, [editor]);
  var saveToImage = React.useCallback(function () {
    try {
      if (saveToImageLoading) return Promise.resolve();
      if (!canvas || !editor) return Promise.resolve();
      if (isClipImage) {
        cancelClipImage();
      }
      return Promise.resolve(_catch(function () {
        setSaveToImageLoading(true);
        return Promise.resolve(saveHistory$1()).then(function () {
          var workspace = canvas === null || canvas === void 0 ? void 0 : canvas.getObjects().find(function (item) {
            return item.id === 'workspace';
          });
          editor.ruler.hideGuideline();
          if (!workspace) return;
          var left = workspace.left,
            top = workspace.top,
            width = workspace.width,
            height = workspace.height;
          var option = {
            format: 'png',
            quality: 1,
            left: left,
            top: top,
            width: width,
            height: height
          };
          var scale = canvas.getZoom();
          canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
          var dataUrl = canvas.toDataURL(option);
          fileSaver.saveAs(dataUrl, uuid() + ".png");
          workSpace === null || workSpace === void 0 ? void 0 : workSpace.setZoomAuto(scale);
          editor.ruler.showGuideline();
          setSaveToImageLoading(false);
        });
      }, function (err) {
        console.log('onSaveToImage err', err);
        workSpace === null || workSpace === void 0 ? void 0 : workSpace.auto();
        toast.error(err.message);
        setSaveToImageLoading(false);
      }));
    } catch (e) {
      return Promise.reject(e);
    }
  }, [canvas, editor, workSpace, isClipImage, clipImageId, clipRawIndex]);
  return {
    saveToJson: saveToJson,
    saveHistory: saveHistory$1,
    unloadSendBeacon: unloadSendBeacon,
    saveToImage: saveToImage
  };
};

var Draw = function Draw(props) {
  var _useContext = React.useContext(Context),
    setCanvas = _useContext.setCanvas,
    setEditor = _useContext.setEditor,
    setWorkSpace = _useContext.setWorkSpace,
    setShow = _useContext.setShow,
    setMainUrl = _useContext.setMainUrl;
  var _useContext2 = React.useContext(Context$1),
    setLoading = _useContext2.setLoading;
  var _useChangeFontFamily = useChangeFontFamily(),
    loadFont = _useChangeFontFamily.loadFont,
    fontLoaded = _useChangeFontFamily.fontLoaded;
  var _useSave = useSave(),
    unloadSendBeacon = _useSave.unloadSendBeacon;
  useEvents();
  React.useEffect(function () {
    if (!fontLoaded) return;
    init();
    setMainUrl(props.src);
  }, [fontLoaded]);
  React.useEffect(function () {
    window.addEventListener('beforeunload', function () {
      unloadSendBeacon();
    });
  }, []);
  var init = function init() {
    try {
      if (!props.src) {
        return initCanvas();
      }
      var _temp = _catch(function () {
        return Promise.resolve(getDetail({
          imgSrc: props.src
        })).then(function (res) {
          initCanvas(JSON.parse(res));
        });
      }, function () {
        initCanvas();
      });
      return Promise.resolve(_temp && _temp.then ? _temp.then(function () {}) : void 0);
    } catch (e) {
      return Promise.reject(e);
    }
  };
  var initCanvas = function initCanvas(canvasData) {
    try {
      var _temp3 = function _temp3() {
        var canvas = new fabric.fabric.Canvas('fabric-canvas', {
          fireRightClick: true,
          stopContextMenu: true,
          controlsAboveOverlay: true,
          preserveObjectStacking: true
        });
        var workSpace = new EditorWorkspace(canvas, {
          src: props.src,
          callback: function callback() {
            return setShow(true);
          },
          canvasData: canvasData
        });
        var editor = new Editor(canvas);
        setWorkSpace(workSpace);
        setCanvas(canvas);
        setEditor(editor);
      };
      var mainImg = null;
      if (canvasData && canvasData.objects) {
        var _canvasData$objects$f;
        mainImg = (_canvasData$objects$f = canvasData.objects.find(function (item) {
          return item.id === 'mainImg';
        })) === null || _canvasData$objects$f === void 0 ? void 0 : _canvasData$objects$f.src;
      } else {
        mainImg = props.src;
      }
      var _temp2 = _catch(function () {
        setLoading(true);
        return Promise.resolve(loadFont(canvasData === null || canvasData === void 0 ? void 0 : canvasData.objects)).then(function () {
          return Promise.resolve(loadImage(mainImg)).then(function () {
            setLoading(false);
          });
        });
      }, function (err) {
        console.log("initCanvas error", err);
        setLoading(false);
      });
      return Promise.resolve(_temp2 && _temp2.then ? _temp2.then(_temp3) : _temp3(_temp2));
    } catch (e) {
      return Promise.reject(e);
    }
  };
  return React__default.createElement("div", {
    className: styles.workContent,
    id: 'workspace'
  }, React__default.createElement("canvas", {
    className: styles.canvas,
    id: 'fabric-canvas'
  }));
};

var style$6 = {"importFile":"_index-module__importFile__3dqN7","openFile":"_index-module__openFile__2iRcv"};

var ImportFile = function ImportFile(props) {
  var _useSave = useSave(),
    saveHistory = _useSave.saveHistory,
    unloadSendBeacon = _useSave.unloadSendBeacon;
  var back = function back() {
    var _props$onBack;
    saveHistory();
    unloadSendBeacon();
    (_props$onBack = props.onBack) === null || _props$onBack === void 0 ? void 0 : _props$onBack.call(props);
  };
  return React__default.createElement("div", {
    className: style$6.importFile
  }, props.onBack ? React__default.createElement("span", {
    className: style$6.back,
    onClick: back
  }, React__default.createElement("img", {
    src: 'https://ossprod.jrdaimao.com/file/1690265070713402.svg',
    alt: ''
  }), React__default.createElement("img", {
    src: "https://ossprod.jrdaimao.com/file/1690358472515604.svg",
    alt: ""
  }), React__default.createElement("span", null, "\u8FD4\u56DE")) : null);
};

var styles$2 = {"headerControl":"_styles-module__headerControl__231xi","button":"_styles-module__button__1BWG3","active":"_styles-module__active__2gyAH","disabled":"_styles-module__disabled__2q4y6","ratioText":"_styles-module__ratioText__1kiSM","line":"_styles-module__line__319O5","reactTooltip":"_styles-module__reactTooltip__1d1Sx","clipSaveButton":"_styles-module__clipSaveButton__26Y5H"};

function useMemoizedFn(fn) {
  var fnRef = React.useRef(fn);
  fnRef.current = React.useMemo(function () {
    return fn;
  }, [fn]);
  var memoizedFn = React.useRef();
  if (!memoizedFn.current) {
    memoizedFn.current = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      return fnRef.current.apply(this, args);
    };
  }
  return memoizedFn.current;
}

var dumpIndex = function dumpIndex(step, arr) {
  var index = step > 0 ? step - 1 : arr.length + step;
  if (index >= arr.length - 1) {
    index = arr.length - 1;
  }
  if (index < 0) {
    index = 0;
  }
  return index;
};
var split = function split(step, targetArr) {
  var index = dumpIndex(step, targetArr);
  return {
    _current: targetArr[index],
    _before: targetArr.slice(0, index),
    _after: targetArr.slice(index + 1)
  };
};
function useHistoryTravel(initialValue, maxLength) {
  if (maxLength === void 0) {
    maxLength = 0;
  }
  var _useState = React.useState({
      present: initialValue,
      past: [],
      future: []
    }),
    history = _useState[0],
    setHistory = _useState[1];
  var present = history.present,
    past = history.past,
    future = history.future;
  var initialValueRef = React.useRef(initialValue);
  var reset = function reset() {
    var _initial = arguments.length > 0 ? arguments.length <= 0 ? undefined : arguments[0] : initialValueRef.current;
    initialValueRef.current = _initial;
    setHistory({
      present: _initial,
      future: [],
      past: []
    });
  };
  var updateValue = function updateValue(val) {
    var _past = [].concat(past, [present]);
    var maxLengthNum = isNumber(maxLength) ? maxLength : Number(maxLength);
    if (maxLengthNum > 0 && _past.length > maxLengthNum) {
      _past.splice(0, 1);
    }
    setHistory({
      present: val,
      future: [],
      past: _past
    });
  };
  var _forward = function _forward(step) {
    if (step === void 0) {
      step = 1;
    }
    if (future.length === 0) {
      return;
    }
    var _split = split(step, future),
      _before = _split._before,
      _current = _split._current,
      _after = _split._after;
    setHistory({
      past: [].concat(past, [present], _before),
      present: _current,
      future: _after
    });
  };
  var _backward = function _backward(step) {
    if (step === void 0) {
      step = -1;
    }
    if (past.length === 0) {
      return;
    }
    var _split2 = split(step, past),
      _before = _split2._before,
      _current = _split2._current,
      _after = _split2._after;
    setHistory({
      past: _before,
      present: _current,
      future: [].concat(_after, [present], future)
    });
  };
  var go = function go(step) {
    var stepNum = isNumber(step) ? step : Number(step);
    if (stepNum === 0) {
      return;
    }
    if (stepNum > 0) {
      return _forward(stepNum);
    }
    _backward(stepNum);
  };
  return {
    value: present,
    backLength: past.length,
    forwardLength: future.length,
    setValue: useMemoizedFn(updateValue),
    go: useMemoizedFn(go),
    back: useMemoizedFn(function () {
      go(-1);
    }),
    forward: useMemoizedFn(function () {
      go(1);
    }),
    reset: useMemoizedFn(reset)
  };
}

var useHistory = function useHistory() {
  var _useContext = React.useContext(Context),
    canvas = _useContext.canvas,
    workSpace = _useContext.workSpace,
    editor = _useContext.editor,
    clipImageId = _useContext.clipImageId,
    isClipImage = _useContext.isClipImage;
  var _useHistoryTravel = useHistoryTravel(undefined, 50),
    value = _useHistoryTravel.value,
    setValue = _useHistoryTravel.setValue,
    go = _useHistoryTravel.go,
    reset = _useHistoryTravel.reset,
    backLength = _useHistoryTravel.backLength,
    forwardLength = _useHistoryTravel.forwardLength;
  var historyFlagRef = React.useRef(false);
  React.useEffect(function () {
    canvas === null || canvas === void 0 ? void 0 : canvas.on({
      'object:added': save,
      'object:modified': save,
      'object:removed': save
    });
    return function () {
      canvas === null || canvas === void 0 ? void 0 : canvas.off({
        'object:added': save,
        'object:modified': save,
        'object:removed': save
      });
    };
  }, [canvas, editor, setValue, isClipImage, clipImageId]);
  React.useEffect(function () {
    if (!workSpace || !editor) return;
    reset(editor.getJson());
  }, [editor, workSpace]);
  React.useEffect(function () {
    if (!canvas) return;
    if (!historyFlagRef.current) return;
    canvas === null || canvas === void 0 ? void 0 : canvas.clear();
    canvas === null || canvas === void 0 ? void 0 : canvas.loadFromJSON(value, function () {
      historyFlagRef.current = false;
      canvas.renderAll();
    });
  }, [value, canvas]);
  var save = React.useCallback(function (event) {
    var isSelect = event.action === undefined && event.e;
    if (isSelect || !canvas) return;
    if (historyFlagRef.current) return;
    if (event.target && event.target.id === "currentClipRect") {
      return;
    }
    if (isClipImage && event.target.id === clipImageId || event.target.id === 'clipRawImage') {
      return;
    }
    setValue(editor === null || editor === void 0 ? void 0 : editor.getJson());
  }, [canvas, editor, setValue, isClipImage, clipImageId]);
  var undo = React.useCallback(function () {
    historyFlagRef.current = true;
    go(-1);
  }, [go]);
  var redo = React.useCallback(function () {
    historyFlagRef.current = true;
    go(1);
  }, [go]);
  return {
    undo: undo,
    redo: redo,
    backLength: backLength,
    forwardLength: forwardLength
  };
};

var HeaderControl = function HeaderControl() {
  var _useContext = React.useContext(Context),
    workSpace = _useContext.workSpace,
    drawMode = _useContext.drawMode,
    setDrawMode = _useContext.setDrawMode,
    canvas = _useContext.canvas,
    editor = _useContext.editor,
    isClipImage = _useContext.isClipImage,
    setIsClipImage = _useContext.setIsClipImage,
    setClipImageId = _useContext.setClipImageId,
    setClipRawIndex = _useContext.setClipRawIndex,
    clipImageId = _useContext.clipImageId,
    clipRawIndex = _useContext.clipRawIndex;
  var _useClipImage = useClipImage(),
    saveClipImage = _useClipImage.saveClipImage,
    cancelClipImage = _useClipImage.cancelClipImage;
  var _useHistory = useHistory(),
    undo = _useHistory.undo,
    redo = _useHistory.redo,
    backLength = _useHistory.backLength,
    forwardLength = _useHistory.forwardLength;
  var _useState = React.useState(0),
    scale = _useState[0],
    setScale = _useState[1];
  var drawModeRef = React.useRef('default');
  drawModeRef.current = drawMode;
  React.useEffect(function () {
    hotkeys(KeyNames.enter, saveClipImage);
    hotkeys(KeyNames.esc, cancelClipImage);
    return function () {
      hotkeys.unbind(KeyNames.enter, saveClipImage);
      hotkeys.unbind(KeyNames.esc, cancelClipImage);
    };
  }, [canvas, workSpace, clipImageId, clipRawIndex]);
  React.useEffect(function () {
    hotkeys(KeyNames.ctrlz, undo);
    hotkeys(KeyNames.ctrlshiftz, redo);
    events.on(Types.CLIP_IMAGE, onClipImage);
    return function () {
      hotkeys.unbind(KeyNames.ctrlz, undo);
      hotkeys.unbind(KeyNames.ctrlshiftz, redo);
      events.off(Types.CLIP_IMAGE, onClipImage);
    };
  }, []);
  React.useEffect(function () {
    if (workSpace !== null && workSpace !== void 0 && workSpace.scale) {
      setScale(floatRound(workSpace.scale * 100));
    }
  }, [workSpace === null || workSpace === void 0 ? void 0 : workSpace.scale]);
  React.useEffect(function () {
    events.on(Types.CHANGE_SCALE, function (scale) {
      setScale(floatRound(scale * 100));
    });
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return function () {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [workSpace, drawMode]);
  var onClipImage = function onClipImage(_ref) {
    var visible = _ref.visible,
      rawIndex = _ref.rawIndex,
      clipImageId = _ref.clipImageId;
    setIsClipImage(visible);
    setClipRawIndex(rawIndex);
    setClipImageId(clipImageId);
  };
  var onKeyDown = function onKeyDown(e) {
    if (e.code !== 'Space') return;
    if (drawModeRef.current === 'move') return;
    switchDragMode();
  };
  var onKeyUp = function onKeyUp(e) {
    if (e.code !== 'Space') return;
    switchDefaultMode();
  };
  var switchDragMode = function switchDragMode() {
    var _editor$disableGuidel;
    editor === null || editor === void 0 ? void 0 : (_editor$disableGuidel = editor.disableGuidelines) === null || _editor$disableGuidel === void 0 ? void 0 : _editor$disableGuidel.call(editor);
    workSpace === null || workSpace === void 0 ? void 0 : workSpace.startDring();
    setDrawMode('move');
  };
  var switchDefaultMode = function switchDefaultMode() {
    var _editor$enableGuideli;
    editor === null || editor === void 0 ? void 0 : (_editor$enableGuideli = editor.enableGuidelines) === null || _editor$enableGuideli === void 0 ? void 0 : _editor$enableGuideli.call(editor);
    workSpace === null || workSpace === void 0 ? void 0 : workSpace.endDring();
    setDrawMode('default');
  };
  if (isClipImage) {
    return React__default.createElement("div", {
      className: styles$2.headerControl
    }, React__default.createElement("span", {
      className: styles$2.clipSaveButton,
      onClick: saveClipImage
    }, React__default.createElement("img", {
      src: "https://ossprod.jrdaimao.com/file/1691980964433863.svg",
      alt: ""
    }), React__default.createElement("img", {
      src: "https://ossprod.jrdaimao.com/file/1691981310968623.svg",
      alt: ""
    }), React__default.createElement("span", null, "\u4FDD\u5B58")), React__default.createElement("span", {
      className: styles$2.clipSaveButton,
      onClick: cancelClipImage
    }, React__default.createElement("img", {
      src: "https://ossprod.jrdaimao.com/file/1691980998460679.svg",
      alt: ""
    }), React__default.createElement("img", {
      src: "https://ossprod.jrdaimao.com/file/1691981320881591.svg",
      alt: ""
    }), React__default.createElement("span", null, "\u53D6\u6D88")));
  }
  return React__default.createElement("div", {
    className: styles$2.headerControl
  }, React__default.createElement("div", null, React__default.createElement("div", {
    "data-tooltip-content": "\u64A4\u9500 Ctrl Z",
    "data-tooltip-place": "bottom",
    onClick: undo,
    className: styles$2.button + " " + (backLength ? '' : styles$2.disabled)
  }, React__default.createElement("img", {
    src: backLength ? "https://ossprod.jrdaimao.com/file/1690509281581673.svg" : "https://ossprod.jrdaimao.com/file/1690789676330313.svg",
    alt: ""
  }), React__default.createElement("img", {
    src: "https://ossprod.jrdaimao.com/file/1690509933132558.svg",
    alt: ""
  })), React__default.createElement("div", {
    onClick: redo,
    className: styles$2.button + " " + (forwardLength ? '' : styles$2.disabled),
    id: 'control-tooltip',
    "data-tooltip-content": "\u91CD\u505A Ctrl Shift Z",
    "data-tooltip-place": "bottom"
  }, React__default.createElement("img", {
    src: forwardLength ? "https://ossprod.jrdaimao.com/file/1690509311318726.svg" : "https://ossprod.jrdaimao.com/file/1690789758114451.svg",
    alt: ""
  }), React__default.createElement("img", {
    src: "https://ossprod.jrdaimao.com/file/1690509942889198.svg",
    alt: ""
  }))), React__default.createElement("div", {
    className: styles$2.line
  }), React__default.createElement("div", null, React__default.createElement("div", {
    className: styles$2.button + " " + (drawMode === 'move' ? styles$2.active : ''),
    onClick: switchDragMode,
    id: 'control-tooltip',
    "data-tooltip-content": "\u79FB\u52A8\u89C6\u56FE Space",
    "data-tooltip-place": "bottom"
  }, React__default.createElement("img", {
    src: "https://ossprod.jrdaimao.com/file/1690509577879796.svg",
    alt: ""
  }), React__default.createElement("img", {
    src: "https://ossprod.jrdaimao.com/file/1690509952709638.svg",
    alt: ""
  })), React__default.createElement("div", {
    className: styles$2.button + " " + (drawMode === 'default' ? styles$2.active : ''),
    onClick: switchDefaultMode,
    id: 'control-tooltip',
    "data-tooltip-content": "\u9009\u62E9",
    "data-tooltip-place": "bottom"
  }, React__default.createElement("img", {
    src: "https://ossprod.jrdaimao.com/file/1690509620102920.svg",
    alt: ""
  }), React__default.createElement("img", {
    src: "https://ossprod.jrdaimao.com/file/1690509961015895.svg",
    alt: ""
  }))), React__default.createElement("div", {
    className: styles$2.line
  }), React__default.createElement("div", null, React__default.createElement("div", {
    className: styles$2.button,
    onClick: function onClick() {
      return workSpace === null || workSpace === void 0 ? void 0 : workSpace.big();
    },
    id: 'control-tooltip',
    "data-tooltip-content": "\u653E\u5927\u89C6\u56FE Ctrl +",
    "data-tooltip-place": "bottom"
  }, React__default.createElement("img", {
    src: "https://ossprod.jrdaimao.com/file/1690509650392929.svg",
    alt: ""
  }), React__default.createElement("img", {
    src: "https://ossprod.jrdaimao.com/file/169050996966396.svg",
    alt: ""
  })), React__default.createElement("div", {
    className: styles$2.button,
    onClick: function onClick() {
      return workSpace === null || workSpace === void 0 ? void 0 : workSpace.small();
    },
    id: 'control-tooltip',
    "data-tooltip-content": "\u7F29\u5C0F\u89C6\u56FE Ctrl -",
    "data-tooltip-place": "bottom"
  }, React__default.createElement("img", {
    src: "https://ossprod.jrdaimao.com/file/1690509673723181.svg",
    alt: ""
  }), React__default.createElement("img", {
    src: "https://ossprod.jrdaimao.com/file/1690509977928322.svg",
    alt: ""
  })), React__default.createElement("div", {
    style: {
      visibility: scale ? 'visible' : 'hidden'
    },
    className: styles$2.ratioText
  }, scale, "%")));
};

var styles$3 = {"headerRightControl":"_index-module__headerRightControl__1SUwQ","saveButton":"_index-module__saveButton__3Wh6y","previewButton":"_index-module__previewButton__1UAg_","saveWrap":"_index-module__saveWrap__Mk1Te","fixButton":"_index-module__fixButton__2n_FI","showButton":"_index-module__showButton__3Qae8"};

var SaveButton = function SaveButton() {
  var _useSave = useSave(),
    saveToImage = _useSave.saveToImage;
  return React__default.createElement("div", {
    className: styles$3.headerRightControl
  }, React__default.createElement("span", {
    className: styles$3.saveWrap
  }, React__default.createElement("span", {
    onClick: saveToImage,
    className: styles$3.saveButton
  }, "\u4E0B\xA0\u8F7D")));
};

var styles$4 = {"imageResource":"_index-module__imageResource__1mciG","searchBox":"_index-module__searchBox__iEuoB","uploadFile":"_index-module__uploadFile__3rrLu","fileList":"_index-module__fileList__1lwJG","empty":"_index-module__empty__1dOE_","fileListItem":"_index-module__fileListItem__3PLjp","image":"_index-module__image__evLSw","more":"_index-module__more__3qqMp"};

var useDropDown = function useDropDown() {
  var clickRef = React.useRef();
  var cacheItem = React.useRef();
  var _useState = React.useState(false),
    show = _useState[0],
    setShow = _useState[1];
  var _useContext = React.useContext(Context$1),
    setLoading = _useContext.setLoading;
  var shareEl = React.useRef();
  React.useEffect(function () {
    var el = document.querySelector('#img-file-list');
    if (!el) return;
    if (show) {
      el.style.overflow = 'hidden';
    } else {
      el.style.overflow = 'auto';
    }
  }, [show]);
  React.useEffect(function () {
    window.addEventListener('click', removeEl);
    return function () {
      removeEl();
      window.removeEventListener('click', removeEl);
    };
  }, []);
  var removeEl = React.useCallback(function (e) {
    if ((e === null || e === void 0 ? void 0 : e.target) === clickRef.current) return;
    if (shareEl.current) {
      document.body.removeChild(shareEl.current);
      shareEl.current = null;
      setShow(false);
    }
  }, []);
  var onClick = function onClick(e) {
    try {
      if (!e.target || !cacheItem.current) return Promise.resolve();
      var _cacheItem$current = cacheItem.current,
        imgSrc = _cacheItem$current.imgSrc,
        stockName = _cacheItem$current.stockName,
        _id = _cacheItem$current._id,
        callback = _cacheItem$current.callback;
      if (e.target.innerHTML === '下载') {
        fileSaver.saveAs(imgSrc, "" + stockName + imgSrc.slice(imgSrc.lastIndexOf('.')));
      }
      var _temp2 = function () {
        if (e.target.innerHTML === '删除') {
          var _temp = _catch(function () {
            setLoading(true);
            return Promise.resolve(delstock({
              id: _id
            })).then(function () {
              return Promise.resolve(callback === null || callback === void 0 ? void 0 : callback()).then(function () {
                setLoading(false);
              });
            });
          }, function () {
            setLoading(false);
          });
          if (_temp && _temp.then) return _temp.then(function () {});
        }
      }();
      return Promise.resolve(_temp2 && _temp2.then ? _temp2.then(function () {}) : void 0);
    } catch (e) {
      return Promise.reject(e);
    }
  };
  var run = function run(e, item) {
    setShow(true);
    cacheItem.current = item;
    if (shareEl.current) {
      document.body.removeChild(shareEl.current);
      shareEl.current = null;
    }
    clickRef.current = e.target;
    var parentNode = e.target.parentNode;
    var _parentNode$getBoundi = parentNode.getBoundingClientRect(),
      top = _parentNode$getBoundi.top,
      left = _parentNode$getBoundi.left;
    var div = shareEl.current = document.createElement('div');
    div.addEventListener('click', onClick);
    div.innerHTML = "<div class='customMenu' style='left:" + (left + parentNode.offsetWidth + 10) + "px;top:" + top + "px'>\n<!--    <div class='editName'>-->\n<!--      <span>\u67D0\u67D0\u6587\u4EF6\u540D...\u540D\u79F0.png</span>-->\n<!--      <img src=\"https://ossprod.jrdaimao.com/file/1690528866207938.svg\" alt=\"\"/>-->\n<!--    </div>-->\n    <div class='buttons'>\n      <div>\u4E0B\u8F7D</div>\n      <div>\u5220\u9664</div>\n    </div>\n  </div>";
    document.body.appendChild(div);
  };
  return {
    run: run
  };
};

var DefaultOptions = {
  text: {
    fill: '#000000'
  },
  image: {}
};
var useAddObject = function useAddObject() {
  var _useContext = React.useContext(Context),
    workSpace = _useContext.workSpace,
    canvas = _useContext.canvas,
    isClipImage = _useContext.isClipImage,
    clipImageId = _useContext.clipImageId,
    clipRawIndex = _useContext.clipRawIndex;
  var _useClipImage = useClipImage(),
    cancelClipImage = _useClipImage.cancelClipImage;
  var _useContext2 = React.useContext(Context$1),
    setLoading = _useContext2.setLoading;
  var addImage = React.useCallback(function (src, options, callback) {
    if (!workSpace) return;
    setLoading(true);
    if (isClipImage) cancelClipImage();
    var scale = workSpace.getScale();
    fabric.fabric.Image.fromURL(src + "?t=" + Date.now(), function (img) {
      if (!img.width || !img.height) {
        setLoading(false);
        return;
      }
      img.set(_extends({}, DefaultOptions.image, {
        id: uuid(),
        scaleY: scale,
        scaleX: scale,
        left: (workSpace.width - img.width * scale) / 2,
        top: (workSpace.height - img.height * scale) / 2
      }, options));
      canvas === null || canvas === void 0 ? void 0 : canvas.add(img);
      canvas === null || canvas === void 0 ? void 0 : canvas.setActiveObject(img);
      callback === null || callback === void 0 ? void 0 : callback(img);
      canvas === null || canvas === void 0 ? void 0 : canvas.renderAll();
      setLoading(false);
    }, {
      crossOrigin: 'anonymous'
    });
  }, [workSpace, canvas, clipImageId, clipRawIndex]);
  var addText = React.useCallback(function (item) {
    if (!workSpace) return;
    if (isClipImage) cancelClipImage();
    var text = new fabric.fabric.IText(item.title, _extends({
      fontFamily: 'serif',
      fontSize: item.style.fontSize * 3,
      fontWeight: item.style.fontWeight,
      id: uuid(),
      lockScalingX: false,
      lockScalingY: false
    }, DefaultOptions.text));
    text.set({
      left: (workSpace.width - text.width) / 2,
      top: (workSpace.height - text.height) / 2
    });
    canvas === null || canvas === void 0 ? void 0 : canvas.add(text);
    canvas === null || canvas === void 0 ? void 0 : canvas.setActiveObject(text);
    canvas === null || canvas === void 0 ? void 0 : canvas.renderAll();
  }, [workSpace, canvas, clipImageId, clipRawIndex]);
  return {
    addImage: addImage,
    addText: addText
  };
};

var ImageResource = function ImageResource() {
  var _useContext = React.useContext(Context$1),
    setLoading = _useContext.setLoading;
  var toast = useToast();
  var _useContext2 = React.useContext(Context),
    canvas = _useContext2.canvas;
  var EDIT_IMAGE_LIST = sessionStorage.getItem('EDIT_IMAGE_LIST');
  var _useState = React.useState(false),
    uploading = _useState[0],
    setUploading = _useState[1];
  var _useAddObject = useAddObject(),
    addImage = _useAddObject.addImage;
  var _useState2 = React.useState(EDIT_IMAGE_LIST ? JSON.parse(EDIT_IMAGE_LIST) : []),
    list = _useState2[0],
    setList = _useState2[1];
  var _useDropDown = useDropDown(),
    run = _useDropDown.run;
  React.useEffect(function () {
    queryList();
  }, []);
  React.useEffect(function () {
    if (!canvas) return;
    canvas.on('drop', onDrop);
    canvas.on('dragover', onDragover);
    return function () {
      canvas.off('drop', onDrop);
      canvas.off('dragover', onDragover);
    };
  }, [canvas]);
  var onDrop = function onDrop(_ref) {
    var e = _ref.e;
    e.preventDefault();
    var imageUrl = e.dataTransfer.getData('text/plain');
    var offset = {
      left: canvas.getSelectionElement().getBoundingClientRect().left,
      top: canvas.getSelectionElement().getBoundingClientRect().top
    };
    var point = {
      x: e.x - offset.left,
      y: e.y - offset.top
    };
    var pointerVpt = canvas.restorePointerVpt(point);
    addImage(imageUrl, {}, function (img) {
      img.set({
        left: pointerVpt.x - img.getScaledWidth() / 2,
        top: pointerVpt.y - img.getScaledHeight() / 2
      });
    });
  };
  var onDragover = function onDragover(_ref2) {
    var e = _ref2.e;
    e.preventDefault();
  };
  var onClickMore = function onClickMore(e, item) {
    run(e, _extends({}, item, {
      callback: queryList
    }));
  };
  var queryList = function queryList() {
    try {
      var _temp = _catch(function () {
        return Promise.resolve(getImageList()).then(function (res) {
          if (res) {
            sessionStorage.setItem('EDIT_IMAGE_LIST', JSON.stringify(res));
          }
          setList(res);
        });
      }, function (err) {
        console.log(err);
      });
      return Promise.resolve(_temp && _temp.then ? _temp.then(function () {}) : void 0);
    } catch (e) {
      return Promise.reject(e);
    }
  };
  var onUploadFile = function onUploadFile(e) {
    try {
      if (uploading) return Promise.resolve();
      var fileList = e.target.files;
      var _temp4 = _finallyRethrows(function () {
        return _catch(function () {
          function _temp3() {
            return Promise.resolve(queryList()).then(function () {});
          }
          setUploading(true);
          setLoading(true);
          var _temp2 = _forTo(fileList, function (i) {
            var file = fileList[i];
            if (!/(png|jpg|jpeg)/g.test(file.type)) return;
            return Promise.resolve(postUploadImage(file)).then(function (res) {
              return Promise.resolve(addImageApi({
                imgSrc: res.url,
                stockName: file.name
              })).then(function () {});
            });
          });
          return _temp2 && _temp2.then ? _temp2.then(_temp3) : _temp3(_temp2);
        }, function (err) {
          console.log(err);
          toast.error(err.message);
        });
      }, function (_wasThrown, _result) {
        setUploading(false);
        setLoading(false);
        if (_wasThrown) throw _result;
        return _result;
      });
      return Promise.resolve(_temp4 && _temp4.then ? _temp4.then(function () {}) : void 0);
    } catch (e) {
      return Promise.reject(e);
    }
  };
  var onDragStart = function onDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.src);
  };
  return React__default.createElement("div", {
    className: styles$4.imageResource
  }, React__default.createElement("div", {
    className: styles$4.uploadFile
  }, React__default.createElement("span", null, uploading ? '上传中...' : '上传文件'), React__default.createElement("input", {
    multiple: true,
    disabled: uploading,
    type: "file",
    accept: '.png,.jpg,.jpeg',
    onChange: onUploadFile
  })), !(list !== null && list !== void 0 && list.length) ? React__default.createElement("div", {
    className: styles$4.empty
  }, React__default.createElement("img", {
    src: "https://ossprod.jrdaimao.com/file/169035729200810.png",
    alt: ""
  }), React__default.createElement("p", null, "\u8FD8\u6CA1\u6709\u6587\u4EF6\u54E6~")) : null, list !== null && list !== void 0 && list.length ? React__default.createElement("div", {
    className: styles$4.fileList,
    id: 'img-file-list'
  }, list.map(function (item) {
    return React__default.createElement("div", {
      key: item._id,
      className: styles$4.fileListItem
    }, React__default.createElement("img", {
      onDragStart: onDragStart,
      onClick: function onClick() {
        return addImage(item.imgSrc);
      },
      className: styles$4.image,
      src: item.imgSrc,
      alt: ""
    }), React__default.createElement("img", {
      onClick: function onClick(e) {
        return onClickMore(e, item);
      },
      className: styles$4.more,
      src: "https://ossprod.jrdaimao.com/file/1690363754666532.svg",
      alt: ""
    }));
  })) : null);
};

var textList = [{
  title: '添加标题',
  key: 'addTitle',
  style: {
    fontSize: 20,
    fontWeight: 600
  }
}, {
  title: '添加副标题',
  key: 'addSubTitle',
  style: {
    fontSize: 16,
    fontWeight: 600
  }
}, {
  title: '添加正文',
  key: 'addText',
  style: {
    fontSize: 14
  }
}, {
  title: '添加注释',
  key: 'addAnnotation',
  style: {
    fontSize: 12
  }
}];

var styles$5 = {"textResource":"_index-module__textResource__qOoMp","addShareTextButton":"_index-module__addShareTextButton__3uKaf","textListItem":"_index-module__textListItem__3_inJ"};

var TextResource = function TextResource() {
  var _useAddObject = useAddObject(),
    addText = _useAddObject.addText;
  return React__default.createElement("div", {
    className: styles$5.textResource
  }, React__default.createElement("div", {
    className: styles$5.addShareTextButton
  }, React__default.createElement("span", {
    onClick: function onClick() {
      return addText(_extends({}, textList[3], {
        title: '文本框'
      }));
    }
  }, "\u6DFB\u52A0\u6587\u672C\u6846")), React__default.createElement("div", {
    className: styles$5.textList
  }, textList.map(function (item) {
    return React__default.createElement("div", {
      onClick: function onClick() {
        return addText(item);
      },
      key: item.key,
      style: item.style,
      className: styles$5.textListItem
    }, React__default.createElement("span", null, item.title));
  })));
};

var _ResourceContentComEn;
var ResourceTypeEnum = {
  ALREADY_UPLOAD: 'alreadyUpload',
  TEXT: 'i-text'
};
var resourceNavList = [{
  title: '已上传',
  icon: 'https://ossprod.jrdaimao.com/file/1690351687096238.svg',
  activeIcon: 'https://ossprod.jrdaimao.com/file/1690351735822596.svg',
  key: ResourceTypeEnum.ALREADY_UPLOAD
}, {
  title: '文 字',
  icon: 'https://ossprod.jrdaimao.com/file/1690351715036668.svg',
  activeIcon: 'https://ossprod.jrdaimao.com/file/1690351759741179.svg',
  key: ResourceTypeEnum.TEXT
}];
var ResourceContentComEnum = (_ResourceContentComEn = {}, _ResourceContentComEn[ResourceTypeEnum.ALREADY_UPLOAD] = ImageResource, _ResourceContentComEn[ResourceTypeEnum.TEXT] = TextResource, _ResourceContentComEn);
var DefaultSelectKey = ResourceTypeEnum.ALREADY_UPLOAD;

var styles$6 = {"resourceNav":"_index-module__resourceNav__2Z57U","resourceContent":"_index-module__resourceContent__IR3Ff","resourceNavItem":"_index-module__resourceNavItem__1cunE","resourceNavPlace":"_index-module__resourceNavPlace__2CAgV","resourceNavItemActive":"_index-module__resourceNavItemActive__MUADE","resourceNavItemPrevActive":"_index-module__resourceNavItemPrevActive__1OMMf","resourceArea":"_index-module__resourceArea__1SeNE","packUp":"_index-module__packUp__LUVGf"};

var ResourceArea = function ResourceArea() {
  var _useState = React.useState(false),
    collapsed = _useState[0],
    setCollapsed = _useState[1];
  var _useState2 = React.useState(DefaultSelectKey),
    activeKey = _useState2[0],
    setActiveKey = _useState2[1];
  var onResourceNavChange = function onResourceNavChange(item) {
    setActiveKey(item.key);
  };
  var activeIndex = resourceNavList.findIndex(function (item) {
    return item.key === activeKey;
  });
  var ResourceComponent = ResourceContentComEnum[activeKey];
  var onSetCollapsed = function onSetCollapsed() {
    if (!collapsed) {
      document.body.style.setProperty('--dm-change-resource-content-width', '0');
      setCollapsed(true);
    } else {
      document.body.style.setProperty('--dm-change-resource-content-width', '240px');
      setCollapsed(false);
    }
  };
  return React__default.createElement("div", {
    className: styles$6.resourceArea
  }, React__default.createElement("div", {
    className: styles$6.resourceNav
  }, resourceNavList.map(function (item, index) {
    var active = activeIndex === index;
    var className = styles$6.resourceNavItem + " " + (active ? styles$6.resourceNavItemActive : '');
    if (index === activeIndex - 1) {
      className += styles$6.resourceNavItemPrevActive;
    }
    return React__default.createElement("div", {
      onClick: function onClick() {
        return onResourceNavChange(item);
      },
      className: className,
      key: item.key
    }, React__default.createElement("img", {
      src: active ? item.activeIcon : item.icon,
      alt: ""
    }), React__default.createElement("span", null, item.title));
  }), React__default.createElement("div", {
    className: styles$6.resourceNavPlace
  })), React__default.createElement("div", {
    className: styles$6.resourceContent
  }, React__default.createElement(ResourceComponent, null), React__default.createElement("div", {
    className: styles$6.packUp,
    onClick: onSetCollapsed
  }, React__default.createElement("img", {
    src: collapsed ? 'https://ossprod.jrdaimao.com/file/1690513793832702.svg' : 'https://ossprod.jrdaimao.com/file/1690445829374723.svg',
    alt: ""
  }))));
};

var style$7 = {"attrWrap":"_index-module__attrWrap__1Um4N","attrTab":"_index-module__attrTab__2Zu3W","attrTabActive":"_index-module__attrTabActive__3Q6Gq","attrContent":"_index-module__attrContent__yV77-"};

var style$8 = {"orderWrap":"_index-module__orderWrap__1OXXV","orderListTitle":"_index-module__orderListTitle__3Taww","orderList":"_index-module__orderList__2rRt5","orderListItem":"_index-module__orderListItem__1VS8z","active":"_index-module__active__saBU6","button":"_index-module__button__226hu","move":"_index-module__move__16YUk","content":"_index-module__content__3hSBb","text":"_index-module__text__1r5UD","image":"_index-module__image__yBptY","empty":"_index-module__empty__14aJw"};

var SortableItem = reactSortableHoc.sortableElement(function (props) {
  var _useLock = useLock(),
    changeOwnLock = _useLock.changeOwnLock;
  var item = props.item;
  var _useContext = React.useContext(Context),
    selectIds = _useContext.selectIds,
    canvas = _useContext.canvas;
  var isLock = item.object.hasControls;
  var isVisible = item.object.visible;
  var clickItem = React.useCallback(function () {
    if (!canvas) return;
    canvas.setActiveObject(item.object);
    canvas.renderAll();
  }, [item, canvas]);
  var onLockObject = function onLockObject(e) {
    e.stopPropagation();
    changeOwnLock(!isLock, item.object);
  };
  var onHiddenObject = function onHiddenObject(e) {
    e.stopPropagation();
    item.object.set({
      visible: !isVisible
    });
    canvas === null || canvas === void 0 ? void 0 : canvas.renderAll();
  };
  var fontFamily = item.object.get('fontFamily');
  return React__default.createElement("div", {
    onClick: clickItem,
    className: style$8.orderListItem + " " + (selectIds.includes(item.id) ? style$8.active : '')
  }, React__default.createElement("div", {
    className: style$8.button
  }, React__default.createElement("img", {
    draggable: false,
    onClick: onHiddenObject,
    src: isVisible ? 'https://ossprod.jrdaimao.com/file/1690437893570728.svg' : 'https://ossprod.jrdaimao.com/file/1690945206225980.svg',
    alt: ""
  }), React__default.createElement("img", {
    draggable: false,
    onClick: onLockObject,
    src: isLock ? 'https://ossprod.jrdaimao.com/file/1690437902259961.svg' : 'https://ossprod.jrdaimao.com/file/1690944574168632.svg',
    alt: ""
  })), React__default.createElement("div", {
    className: style$8.content
  }, item.type === 'image' ? React__default.createElement("div", {
    className: style$8.image
  }, React__default.createElement("img", {
    draggable: false,
    src: item.src,
    alt: ""
  })) : React__default.createElement("div", {
    className: style$8.text,
    style: {
      fontFamily: fontFamily || 'serif'
    }
  }, item.text)), React__default.createElement(DragHandle, null));
});
var DragHandle = function DragHandle() {
  return React__default.createElement("div", {
    className: style$8.move
  }, React__default.createElement("img", {
    draggable: false,
    src: "https://ossprod.jrdaimao.com/file/1690437934587361.svg",
    alt: ""
  }));
};
var SortableContainer = reactSortableHoc.sortableContainer(function (_ref) {
  var children = _ref.children;
  return children;
});
var OrderList = function OrderList() {
  var _useContext2 = React.useContext(Context),
    canvas = _useContext2.canvas;
  var _userOrder = userOrder(),
    up = _userOrder.up,
    upTop = _userOrder.upTop,
    down = _userOrder.down,
    downTop = _userOrder.downTop;
  var _useState = React.useState([]),
    list = _useState[0],
    setList = _useState[1];
  var onSortEnd = React.useCallback(function (_ref2) {
    var _list$oldIndex;
    var oldIndex = _ref2.oldIndex,
      newIndex = _ref2.newIndex;
    if (oldIndex === newIndex) return;
    var oldObject = (_list$oldIndex = list[oldIndex]) === null || _list$oldIndex === void 0 ? void 0 : _list$oldIndex.object;
    if (!oldObject) return;
    if (newIndex < oldIndex) {
      if (newIndex === 0) return upTop(oldObject);
      for (var i = newIndex; i < oldIndex; i++) {
        up(oldObject);
      }
    } else {
      if (newIndex === list.length - 1) return downTop(oldObject);
      for (var _i = oldIndex; _i < newIndex; _i++) {
        down(oldObject);
      }
    }
    setList(function (prevState) {
      return reactSortableHoc.arrayMove(prevState, oldIndex, newIndex);
    });
  }, [list, setList, up, upTop, down, downTop]);
  React.useEffect(function () {
    if (!canvas) return;
    canvas.on('after:render', getList);
    return function () {
      canvas.off('after:render', getList);
    };
  }, [canvas]);
  var getList = React.useCallback(function () {
    var objects = (canvas === null || canvas === void 0 ? void 0 : canvas.getObjects()) || [];
    var list = [].concat(objects.filter(function (item) {
      return !(item instanceof fabric.fabric.GuideLine || item.id === 'workspace' || item.id === 'currentClipRect');
    })).reverse().map(function (item) {
      var _item$_element;
      var type = item.type,
        id = item.id,
        text = item.text;
      var src = type === 'image' ? (_item$_element = item._element) === null || _item$_element === void 0 ? void 0 : _item$_element.src : undefined;
      return {
        object: item,
        type: type,
        id: id,
        text: text,
        src: src
      };
    });
    setList(list);
  }, [setList, canvas]);
  return React__default.createElement("div", {
    className: style$8.orderWrap
  }, React__default.createElement("div", {
    className: style$8.orderListTitle
  }, "\u56FE\u5C42"), !list.length ? React__default.createElement("div", {
    className: style$8.orderListEmpty
  }, React__default.createElement("div", {
    className: style$8.empty
  }, React__default.createElement("img", {
    src: "https://ossprod.jrdaimao.com/file/169035729200810.png",
    alt: ""
  }), React__default.createElement("p", null, "\u6682\u65E0\u56FE\u5C42~"))) : null, list.length ? React__default.createElement(SortableContainer, {
    distance: 10,
    lockAxis: "y",
    onSortEnd: onSortEnd
  }, React__default.createElement("div", {
    className: style$8.orderList
  }, list.map(function (item, index) {
    return React__default.createElement(SortableItem, {
      index: index,
      key: item.id,
      item: item
    });
  }))) : null);
};

var ColorPicker$1 = reactColor.SketchPicker;
var WorkSpaceAttr = function WorkSpaceAttr() {
  var _useContext = React.useContext(Context),
    workSpace = _useContext.workSpace;
  var _useState = React.useState((workSpace === null || workSpace === void 0 ? void 0 : workSpace.fill) || DefaultWorkSpaceColor),
    color = _useState[0],
    setColor = _useState[1];
  var onChangeColor = function onChangeColor(e) {
    setColor(e.hex);
    console.log('change bg color e.hex', e.hex);
    workSpace === null || workSpace === void 0 ? void 0 : workSpace.setBgColor(e.hex);
  };
  return React__default.createElement("div", {
    className: style$1.workSpaceAttr
  }, React__default.createElement("div", {
    className: style$1.base
  }, React__default.createElement("div", null, React__default.createElement(Size, {
    isWorkSpace: true,
    getActiveObject: function getActiveObject() {
      return workSpace === null || workSpace === void 0 ? void 0 : workSpace.workspace;
    }
  })), React__default.createElement("div", null, React__default.createElement("div", {
    className: style$1.title
  }, "\u80CC\u666F\u8272"), React__default.createElement(ColorPicker$1, {
    color: color,
    onChange: onChangeColor,
    className: style$1.colorPicker
  }))));
};

var AttrArea = function AttrArea() {
  var _useContext = React.useContext(Context),
    selectOneType = _useContext.selectOneType;
  var _useContext2 = React.useContext(Context$1),
    attrTab = _useContext2.attrTab,
    setAttrTab = _useContext2.setAttrTab;
  var bg = React.useMemo(function () {
    var _attrTabList$find;
    return (_attrTabList$find = attrTabList.find(function (item) {
      return item.key === attrTab;
    })) === null || _attrTabList$find === void 0 ? void 0 : _attrTabList$find.bg;
  }, [attrTabList, attrTab]);
  var onChangeTab = function onChangeTab(item) {
    setAttrTab(item.key);
  };
  var AttrCom = attrAreaComponent[selectOneType];
  return React__default.createElement("div", {
    className: style$7.attrWrap
  }, React__default.createElement("div", {
    className: style$7.attrTab,
    style: {
      backgroundImage: "url(" + bg + ")"
    }
  }, attrTabList.map(function (item) {
    return React__default.createElement("div", {
      onClick: function onClick() {
        return onChangeTab(item);
      },
      key: item.key,
      className: attrTab === item.key ? style$7.attrTabActive : ''
    }, React__default.createElement("span", null, item.title));
  })), React__default.createElement("div", {
    id: 'attr-content',
    className: style$7.attrContent
  }, React__default.createElement("div", {
    style: {
      display: attrTab === 'Attr' ? 'block' : 'none'
    }
  }, AttrCom ? React__default.createElement(AttrCom, null) : React__default.createElement(WorkSpaceAttr, null)), React__default.createElement("div", {
    style: {
      display: attrTab === 'coverage' ? 'block' : 'none'
    }
  }, React__default.createElement(OrderList, null))));
};

var styles$7 = {"dmEditImageContainer":"_styles-module__dmEditImageContainer__1PAn4","header":"_styles-module__header__2NqZJ","content":"_styles-module__content__2pvIH","canvasArea":"_styles-module__canvasArea__f4hmY","attrArea":"_styles-module__attrArea__1Dyk-"};

var Editor$1 = function Editor(props) {
  var _useContext = React.useContext(Context$1),
    loading = _useContext.loading,
    loadingText = _useContext.loadingText;
  var _useContext2 = React.useContext(Context),
    show = _useContext2.show;
  return React__default.createElement(LoadingOverlay, {
    active: loading,
    spinner: true,
    text: loadingText
  }, React__default.createElement("div", {
    className: styles$7.dmEditImageContainer
  }, React__default.createElement("div", {
    className: styles$7.header
  }, React__default.createElement(ImportFile, {
    onBack: props.onBack
  }), show ? React__default.createElement(HeaderControl, null) : null, React__default.createElement(SaveButton, null)), React__default.createElement("div", {
    className: styles$7.content
  }, React__default.createElement(ResourceArea, null), React__default.createElement("div", {
    className: styles$7.canvasArea
  }, React__default.createElement(Draw, {
    src: props.src
  })), React__default.createElement("div", {
    className: styles$7.attrArea
  }, React__default.createElement(AttrArea, null)))));
};

var EditImage = function EditImage(props) {
  return React__default.createElement(CanvasProvider, null, React__default.createElement(EditorProvider, null, React__default.createElement(Editor$1, {
    onBack: props.onBack,
    src: props.src
  }), React__default.createElement(toast.Toaster, null)));
};

exports.EditImage = EditImage;
//# sourceMappingURL=index.js.map
