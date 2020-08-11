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

function _createForOfIteratorHelper(o, allowArrayLike) {
  var it;
  if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
    if (
      Array.isArray(o) ||
      (it = _unsupportedIterableToArray(o)) ||
      (allowArrayLike && o && typeof o.length === "number")
    ) {
      if (it) o = it;
      var i = 0;
      var F = function F() { };
      return {
        s: F,
        n: function n() {
          if (i >= o.length) return { done: true };
          return { done: false, value: o[i++] };
        },
        e: function e(_e) {
          throw _e;
        },
        f: F
      };
    }
    throw new TypeError(
      "Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
    );
  }
  var normalCompletion = true,
    didErr = false,
    err;
  return {
    s: function s() {
      it = o[Symbol.iterator]();
    },
    n: function n() {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function e(_e2) {
      didErr = true;
      err = _e2;
    },
    f: function f() {
      try {
        if (!normalCompletion && it.return != null) it.return();
      } finally {
        if (didErr) throw err;
      }
    }
  };
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

var ShipLayoutReader = /*#__PURE__*/ (function () {
  function ShipLayoutReader() {
    _classCallCheck(this, ShipLayoutReader);

    this.animationCounter = 0;
    this.hasLoaded = false;
  }

  _createClass(ShipLayoutReader, [
    {
      key: "load",
      value: async function load(filepath) {
        var callback =
          arguments.length > 1 && arguments[1] !== undefined
            ? arguments[1]
            : undefined;
        this.filepath = filepath;
        this.read(callback);
      }
    },
    {
      key: "getTilesetByGID",
      value: function getTilesetByGID(gid) {
        var retorno = null;
        this.tilesets.map(function (tileset) {
          // console.log(gid, tileset.firstgid <= gid, gid <= tileset.firstgid + (tileset.tilecount - 1), tileset);
          if (tileset.imageLoaded) {
            if (
              tileset.firstgid <= gid &&
              gid <= tileset.firstgid + (tileset.tilecount - 1)
            ) {
              retorno = tileset;
            }
          }
        });
        return retorno;
      }
    },
    {
      key: "getLayerByZIndex",
      value: function getLayerByZIndex(zIndex) {
        var _this = this;

        var retorno = null;
        this.layers.map(function (layer) {
          if (_this.layers.properties["z-index"] == zIndex) retorno = layer;
        });
        return retorno;
      }
    },
    {
      key: "getProperties",
      value: function getProperties(objectToAttach) {
        var properties = [];
        var propertyTags = objectToAttach.querySelector("properties");

        if (propertyTags) {
          propertyTags = propertyTags.querySelectorAll("property");
        } else {
          propertyTags = [];
        }

        var _iterator = _createForOfIteratorHelper(propertyTags),
          _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var propTag = _step.value;
            var key = propTag.getAttribute("name");
            var value = JSON.parse(propTag.getAttribute("value"));
            properties[key] = value;
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        return properties;
      }
    },
    {
      key: "getObjects",
      value: function getObjects(objectgroup) { }
    },
    {
      key: "read",
      value: async function read() {
        var _this2 = this;

        var callback =
          arguments.length > 0 && arguments[0] !== undefined
            ? arguments[0]
            : undefined;
        // For reading .txt file code block
        TxtReader.loadTextFile(this.filepath, function (fileString) {
          var parser, xmlDoc;
          parser = new DOMParser();
          xmlDoc = parser.parseFromString(fileString, "text/xml"); // Read Stages

          _this2.challenges = [];
          _this2.questions = [];

          var _iterator2 = _createForOfIteratorHelper(
            xmlDoc.querySelectorAll("objectgroup")
          ),
            _step2;

          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var objectgroup = _step2.value;
              var newStage = {
                name: null,
                objects: []
              };
              newStage.name = objectgroup.getAttribute("name");
              newStage.properties = _this2.getProperties(objectgroup);

              var _iterator3 = _createForOfIteratorHelper(
                objectgroup.querySelectorAll("object")
              ),
                _step3;

              try {
                for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                  var object = _step3.value;
                  var tempType = object.getAttribute("type");
                  var tempX = parseInt(object.getAttribute("x"));
                  var tempY = parseInt(object.getAttribute("y"));
                  var tempW = parseInt(object.getAttribute("width"));
                  var tempH = parseInt(object.getAttribute("height"));
                  var newObject = {
                    gid: parseInt(object.getAttribute("gid")),
                    type: tempType,
                    x: tempX + tempW * 0.5,
                    y: 1600 - tempY,
                    w: tempW,
                    h: tempH,
                    name: object.getAttribute("name"),
                    // collider: newPolyColider,
                    properties: _this2.getProperties(object)
                  };
                  newStage.objects.push(newObject);
                }
              } catch (err) {
                _iterator3.e(err);
              } finally {
                _iterator3.f();
              }

              switch (newStage.properties.type) {
                case "challenge":
                  _this2.challenges.push(newStage);

                  break;

                case "question":
                  _this2.questions.push(newStage);

                  break;

                default:
                  break;
              }
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }

          _this2.hasLoaded = true;
          if (callback) callback(); // console.log(this.layers);
          // console.log(xmlDoc);
        });
      }
    }
  ]);

  return ShipLayoutReader;
})();
