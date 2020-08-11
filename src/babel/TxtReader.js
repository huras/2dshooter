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

var TxtReader = /*#__PURE__*/ (function () {
  function TxtReader() {
    _classCallCheck(this, TxtReader);
  }

  _createClass(TxtReader, null, [
    {
      key: "loadTextFile",
      value: function loadTextFile(fileName, callbackFunction) {
        var req = new XMLHttpRequest();

        req.onreadystatechange = function () {
          if (req.readyState === 4 && req.status !== 200) {
            alert("loading failed ");
          }
        };

        req.onload = function () {
          var fileContent = null;
          fileContent = req.responseText;

          if (callbackFunction !== null && callbackFunction !== undefined) {
            callbackFunction(fileContent);
          }
        };

        req.open("GET", fileName, true);
        req.setRequestHeader("Content-Type", "text/xml");
        req.send();
      }
    }
  ]);

  return TxtReader;
})();
