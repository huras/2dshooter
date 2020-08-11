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

function _slicedToArray(arr, i) {
  return (
    _arrayWithHoles(arr) ||
    _iterableToArrayLimit(arr, i) ||
    _unsupportedIterableToArray(arr, i) ||
    _nonIterableRest()
  );
}

function _nonIterableRest() {
  throw new TypeError(
    "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
  );
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr)))
    return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;
  try {
    for (
      var _i = arr[Symbol.iterator](), _s;
      !(_n = (_s = _i.next()).done);
      _n = true
    ) {
      _arr.push(_s.value);
      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }
  return _arr;
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
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

var InputManager = /*#__PURE__*/ (function () {
  function InputManager() {
    var _this = this;

    var keys =
      arguments.length > 0 && arguments[0] !== undefined
        ? arguments[0]
        : {
          right: InputManager.Keys.Right_Arrow,
          left: InputManager.Keys.Left_Arrow,
          up: InputManager.Keys.Up_Arrow,
          down: InputManager.Keys.Down_Arrow // run: InputManager.Keys.X,
          // jump: InputManager.Keys.C
        };

    _classCallCheck(this, InputManager);

    this.keys = keys;
    this.keyData = [];
    this.maxTimeAmount = 9999;
    document.addEventListener("keydown", function (event) {
      if (_this.keyData[event.keyCode.toString()]) {
        var keyData = _this.keyData[event.keyCode.toString()];

        if (!keyData.isPressed) {
          keyData.time = 0;
          keyData.isPressed = true;
        }
      }
    });
    document.addEventListener("keyup", function (event) {
      if (_this.keyData[event.keyCode.toString()]) {
        var keyData = _this.keyData[event.keyCode.toString()];

        if (keyData.isPressed) {
          keyData.time = 0;
          keyData.isPressed = false;
        }
      }
    });
    Object.entries(this.keys).forEach(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
        key = _ref2[0],
        value = _ref2[1];

      _this.keyData[value.toString()] = {
        isPressed: false,
        last: 0,
        time: 0
      };
    });
    setInterval(function () {
      _this.timeCounter(10);
    }, 10);
  }

  _createClass(InputManager, [
    {
      key: "checkKeysUpdate",
      value: function checkKeysUpdate() {
        // this.keyDowns();
        // this.keyUps();
      }
    },
    {
      key: "isPressed",
      value: function isPressed(key) {
        if (this.keyData[key.toString()])
          return this.keyData[key.toString()].isPressed;
        else return undefined;
      }
    },
    {
      key: "timeCounter",
      value: function timeCounter(deltaTime) {
        var _this2 = this;

        this.keyData = this.keyData.map(function (temp) {
          if (!temp.isPressed) {
            if (temp.last < _this2.maxTimeAmount) {
              temp.last += deltaTime;
            } else {
              temp.time = _this2.maxTimeAmount;
            }
          } else {
            if (temp.time < _this2.maxTimeAmount) {
              temp.time += deltaTime;
            } else {
              temp.time = _this2.maxTimeAmount;
            }
          }

          return temp;
        });
      }
    }
  ]);

  return InputManager;
})();

InputManager.Keys = {
  Right_Arrow: 39,
  Left_Arrow: 37,
  Up_Arrow: 38,
  Down_Arrow: 40,
  X: 88,
  C: 67
};
