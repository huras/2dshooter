"use strict";

function _instanceof(left, right) {
  if (
    right != null &&
    typeof Symbol !== "undefined" &&
    right[Symbol.hasInstance]
  ) {
    return !!right[Symbol.hasInstance](left);
  } else {
    return left instanceof right;
  }
}

function _classCallCheck(instance, Constructor) {
  if (!_instanceof(instance, Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

var SheetLoader = /*#__PURE__*/ (function () {
  function SheetLoader() {
    var onLoadAllCallBack =
      arguments.length > 0 && arguments[0] !== undefined
        ? arguments[0]
        : undefined;

    _classCallCheck(this, SheetLoader);

    this.sheetsToLoad = [];
    this.sheetsLoaded = 0;
    this.loadAllCallBack = onLoadAllCallBack;
    this.queue = [];
  }

  _createClass(SheetLoader, [
    {
      key: "onLoadSheet",
      value: function onLoadSheet() {
        this.sheetsLoaded++;

        if (this.sheetsLoaded >= this.queue.length) {
          if (this.loadAllCallBack) {
            this.loadAllCallBack();
          }
        }
      }
    },
    {
      key: "queueSheet",
      value: function queueSheet(filepath) {
        var newSheet = new Image();
        this.queue.push({
          filepath: filepath,
          image: newSheet
        });
        newSheet.src = filepath;
        return newSheet;
      }
    },
    {
      key: "loadSheetQueue",
      value: function loadSheetQueue() {
        var _this = this;

        var onLoadAllCallBack =
          arguments.length > 0 && arguments[0] !== undefined
            ? arguments[0]
            : undefined;

        if (onLoadAllCallBack) {
          this.loadAllCallBack = onLoadAllCallBack;
        }

        this.queue.map(function (item) {
          item.image.addEventListener("load", function () {
            _this.onLoadSheet();
          });
        });
      }
    }
  ]);

  return SheetLoader;
})();
