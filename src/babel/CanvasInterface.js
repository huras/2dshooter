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

var CanvasInterface = /*#__PURE__*/ (function () {
  function CanvasInterface(options) {
    var _this = this;

    _classCallCheck(this, CanvasInterface);

    this.canvas = options.canvas;
    this.pixelBeauty = options.pixelBeauty ? options.pixelBeauty : true;
    window.addEventListener("resize", function () {
      _this.resizeCanvas();
    });
    this.resizeCanvas();
  }

  _createClass(CanvasInterface, [
    {
      key: "resizeCanvas",
      value: function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        this.ctx = canvas.getContext("2d");

        if (this.pixelBeauty) {
          this.ctx.imageSmoothingEnabled = false;
          this.ctx.msImageSmoothingEnabled = false;
          this.ctx.mozImageSmoothingEnabled = false;
        }
      }
    }
  ]);

  return CanvasInterface;
})();
