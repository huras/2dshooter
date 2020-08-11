"use strict";

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

function _readOnlyError(name) {
  throw new Error('"' + name + '" is read-only');
}

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

// Touch screen analogic
var TouchAnalogic = /*#__PURE__*/ (function () {
  function TouchAnalogic(options) {
    _classCallCheck(this, TouchAnalogic);

    (this.draging = false), (this.deadZonePercent = 0.35);
    this.isClickStart = true;
    this.canvas = options.canvas;
    this.ctx = options.ctx;
    this.margin = options.margin;
    this.radius = options.radius;
    this.personalizedImage = options.personalizedImage;
    this.circle = {
      x: canvas.width - this.margin - this.radius,
      y: canvas.height - this.margin - this.radius,
      r: this.radius
    };
    this.registerEvents();
  }

  _createClass(TouchAnalogic, [
    {
      key: "registerEvents",
      value: function registerEvents() {
        var _this = this;

        this.canvas.addEventListener("touchstart", function (event) {
          _this.filterXY(event, true);
        });
        this.canvas.addEventListener("touchmove", function (event) {
          _this.filterXY(event, !_this.isClickStart);
        });
        this.canvas.addEventListener("touchend", function (event) {
          _this.filterXY(event, false);
        });

        if (!window.mobileAndTabletCheck()) {
          this.canvas.addEventListener("mousedown", function (event) {
            _this.filterXY(event, true);
          });
          this.canvas.addEventListener("mouseup", function (event) {
            _this.filterXY(event, false);
          });
          this.canvas.addEventListener("mousemove", function (event) {
            _this.filterXY(event, !_this.isClickStart);
          });
        }
      }
    },
    {
      key: "filterXY",
      value: function filterXY(event, clickValue) {
        var x = 0;

        if (event.touches) {
          if (event.touches.length > 0) x = event.touches[0].pageX;
          else x = event.pageX;
        } else x = event.pageX;

        var y = event.touches
          ? event.touches.length > 0
            ? event.touches[0].pageY
            : event.pageY
          : event.pageY;
        x -= canvas.offsetLeft;
        y -= canvas.offsetTop; // Processa clique / desclique

        if (clickValue == true) {
          this.checkTouch(x, y);
          this.isClickStart = false;
        } else {
          this.checkUntouch(x, y);
          this.isClickStart = true;
        }
      }
    },
    {
      key: "checkTouch",
      value: function checkTouch(x, y) {
        if (!this.draging) {
          if (this.isClickStart) {
            this.circle.x = x;
            this.circle.y = y;
          }

          this.draging = true; // const touchDist = Vector2.distance({ x: x, y: y }, { x: this.circle.x, y: this.circle.y });
          // if (touchDist > this.deadZonePercent * this.circle.r) {
          //   // console.log(touchDist, this.circle, touchDist <= this.circle);
          //   if (this.circle && Physics.pointCircle({ x: x, y: y }, this.circle)) {
          //     this.draging = true;
          //   }
          // } else {
          //   this.draging = false;
          //   this.currentDirection = undefined;
          // }
        }

        if (this.draging) {
          var dir = {
            x: 0,
            y: 0
          };
          dir.x = x - this.circle.x;
          dir.y = y - this.circle.y;
          var currDirVec = new Vector2(dir.x, dir.y);
          var currMagnitude = currDirVec.magnitude(); // console.log(currDirVec);

          if (currMagnitude > this.circle.r) {
            dir.x = (dir.x / currMagnitude) * this.circle.r;
            dir.y = (dir.y / currMagnitude) * this.circle.r;
          }

          this.currentDirection = dir;
        }
      }
    },
    {
      key: "checkUntouch",
      value: function checkUntouch(x, y) {
        this.currentDirection = {
          x: 0,
          y: 0
        };
        this.draging = false;
      }
    },
    {
      key: "render",
      value: function render() {
        if (this.draging && this.currentDirection) {
          this.ctx.beginPath();
          this.ctx.arc(
            this.circle.x,
            this.circle.y,
            this.circle.r,
            0,
            2 * Math.PI
          );
          this.ctx.lineWidth = 5;
          this.ctx.strokeStyle = "rgb(255,255,255, 0.6)";
          this.ctx.stroke();
          this.ctx.fillStyle = "rgb(0,0,0, 0.2)";
          this.ctx.fill();
          this.ctx.beginPath();

          if (this.personalizedImage && this.personalizedImage.arrow) {
            var divisions = 4;
            var degrees = 360 / divisions;
            var size = {
              w: this.circle.r * 0.2,
              h: this.circle.r * 0.2
            };
            this.ctx.save();
            this.ctx.translate(this.circle.x, this.circle.y);

            for (var i = 0; i < divisions; i++) {
              this.ctx.rotate(degrees_to_radians(i * degrees));
              this.ctx.drawImage(
                this.personalizedImage.arrow,
                -0.5 * size.w,
                -this.circle.r * 0.75 - 0.5 * size.h,
                size.w,
                size.h
              );
            }

            this.ctx.restore();
          }

          var directionTouse = this.currentDirection; // const angle = Vector2.angleBetween(new Vector2(analogicCircle.r, analogicCircle.r), new Vector2(directionTouse.x, directionTouse.y));
          // const maxX = Math.cos(angle) * analogicCircle.r;
          // const maxY = Math.sin(angle) * analogicCircle.r;
          // console.log(angle);
          // if (Math.abs(directionTouse.x) > Math.abs(maxX))
          //   directionTouse.x = maxX;
          // if (Math.abs(directionTouse.y) > Math.abs(maxY))
          //   directionTouse.y = maxY;
          // if (directionTouse.x > analogicCircle.r)
          //   directionTouse.x = analogicCircle.r
          // else if (directionTouse.x < -analogicCircle.r)
          //   directionTouse.x = -analogicCircle.r
          // if (directionTouse.y > analogicCircle.r)
          //   directionTouse.y = analogicCircle.r
          // else if (directionTouse.y < -analogicCircle.r)
          //   directionTouse.y = -analogicCircle.r

          if (this.personalizedImage && this.personalizedImage.image) {
            var fw = (2 * this.circle.r * (1 - this.deadZonePercent) * 3) / 4;
            var fh = (2 * this.circle.r * (1 - this.deadZonePercent) * 3) / 4;
            this.ctx.drawImage(
              this.personalizedImage.image,
              this.circle.x + directionTouse.x - 0.5 * fw,
              this.circle.y + directionTouse.y - 0.5 * fh,
              fw,
              fh
            );
          } else {
            this.ctx.arc(
              this.circle.x + directionTouse.x,
              this.circle.y + directionTouse.y,
              (this.circle.r * (1 - this.deadZonePercent) * 3) / 4,
              0,
              2 * Math.PI
            );
            this.ctx.lineWidth = 1;
            this.ctx.strokeStyle = "rgb(255,255,255, 0.9)";
            this.ctx.stroke();
            this.ctx.fillStyle = "rgb(255,255,255, 0.7)";
            this.ctx.fill();
          }

          this.ctx.beginPath();
          this.ctx.arc(
            this.circle.x,
            this.circle.y,
            this.circle.r * this.deadZonePercent,
            0,
            2 * Math.PI
          );
          this.ctx.lineWidth = 1;
          this.ctx.strokeStyle = "rgb(0,0,0, 0.2)";
          this.ctx.stroke();
          this.ctx.fillStyle = "rgb(0,0,0, 0.2)";
          this.ctx.fill();
        } else {
          // this.ctx.beginPath();
          // this.ctx.arc(this.circle.x, this.circle.y, this.circle.r * this.deadZonePercent, 0, 2 * Math.PI);
          // this.ctx.lineWidth = 1;
          // this.ctx.strokeStyle = "rgb(255,255,255, 0.4)";
          // this.ctx.stroke();
          // this.ctx.fillStyle = "rgb(255,255,255, 0.4)";
          // this.ctx.fill();
        }
      }
    }
  ]);

  return TouchAnalogic;
})(); // Nave 2D

var Nave2D = /*#__PURE__*/ (function () {
  function Nave2D(options) {
    var _this2 = this;

    _classCallCheck(this, Nave2D);

    this.position = options.position;
    this.initialPosition = options.initialPosition || {
      x: function x() {
        return _this2.position.x;
      },
      y: function y() {
        return _this2.position.y;
      }
    };
    this.pivot = options.pivot;
    this.image = options.image;
    this.canvas = options.canvas;
    this.ctx = options.ctx;
    this.zoom = options.zoom || 1;
    this.pivotalRotation = 0;
    this.centralRotation = 0;
    this.accel = options.accel || {
      x: 0.085,
      y: 0.037
    };
    this.speed = options.speed || {
      x: 0,
      y: 0
    };
    this.maxSpeed = options.maxSpeed || {
      x: 5,
      y: 7.5
    };
    this.iddleFriction = options.iddleFriction || {
      x: 0.95,
      y: 0.85
    };
    this.rockets = options.rockets || [];
    this.rocketTurnedOnDelay = 30;
    this.turnedOn = false;
  }

  _createClass(Nave2D, [
    {
      key: "drawNave",
      value: function drawNave() {
        var _this3 = this;

        var maxWidth = 80;

        if (engine.layout == "mobile") {
          maxWidth = canvas.width * 0.155;
        }

        var scale = this.zoom;
        var finalW = maxWidth * scale;
        var finalH = (maxWidth / this.image.width) * this.image.height * scale;
        var positionToUse = this.position;

        if (!this.turnedOn && !this.keepPosition) {
          positionToUse = {
            x: this.initialPosition.x(),
            y: this.initialPosition.y()
          };
          this.position = positionToUse;
        }

        this.ctx.save();
        this.ctx.translate(positionToUse.x, positionToUse.y);
        this.ctx.rotate(
          degrees_to_radians(
            this.pivotalRotation + (this.speed.x / this.maxSpeed.x) * 25
          )
        );

        if (this.turnedOn) {
          if (this.movingLeft > 0) {
            this.rockets.right.map(function (rocket) {
              rocket.render(scale, finalW, finalH);
            });
          }

          if (this.movingRight > 0) {
            this.rockets.left.map(function (rocket) {
              rocket.render(scale, finalW, finalH);
            });
          }

          if (this.speed.y <= 0.5) {
            this.rockets.central.map(function (rocket) {
              rocket.render(
                scale,
                finalW,
                finalH,
                {
                  x: 1,
                  y: 1 + 2 * Math.abs(_this3.speed.y / _this3.maxSpeed.y)
                },
                true
              );
            });
          }
        }

        var fx = -this.pivot.x * finalW;
        var fy = -this.pivot.y * finalH;
        this.ctx.drawImage(
          this.image,
          0,
          0,
          this.image.width,
          this.image.height,
          fx,
          fy,
          finalW,
          finalH
        );
        fx += positionToUse.x;
        fy += positionToUse.y;
        this.rectCollider = {
          x: fx,
          y: fy,
          w: finalW,
          h: finalH
        };
        this.ctx.restore();

        if (this.movingLeft < 0) {
          this.movingLeft = 0;
        }

        if (this.movingRight < 0) {
          this.movingRight = 0;
        }
      }
    },
    {
      key: "fisica",
      value: function fisica() {
        var deltaTime =
          arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
        var scale = this.zoom;
        var maxWidth = 100;

        if (engine.layout == "mobile") {
          maxWidth = canvas.width * 0.15;
        } // Obedece velocidade maxima

        if (Math.abs(this.speed.x) > this.maxSpeed.x)
          this.speed.x = Math.sign(this.speed.x) * this.maxSpeed.x;
        if (Math.abs(this.speed.y) > this.maxSpeed.y)
          this.speed.y = Math.sign(this.speed.y) * this.maxSpeed.y; // Move nave

        this.position.x += this.speed.x * deltaTime * scale;
        this.position.y += this.speed.y * deltaTime * scale; // Impede passar peras paredes laterais horizontais

        var finalW = maxWidth * scale;

        if (this.position.x - finalW * 0.5 < 0) {
          this.position.x = finalW * 0.5;
          this.speed.x *= -0.35;
        } else if (this.position.x + finalW * 0.5 > this.canvas.width) {
          this.position.x = this.canvas.width - finalW * 0.5;
          this.speed.x *= -0.35;
        } // Impede passar pelas laterais verticais

        var finalH = (maxWidth / this.image.width) * this.image.height * scale;

        if (this.position.y - finalH < 0) {
          this.position.y = finalH;
          this.speed.y *= -0.35;
        } else if (this.position.y > this.canvas.height) {
          this.position.y = this.canvas.height;
          this.speed.y *= -0.35;
        }

        this.movingLeft--;
        this.movingRight--;
      }
    },
    {
      key: "readMovimentation",
      value: function readMovimentation(inputmanager) {
        var keys =
          arguments.length > 1 && arguments[1] !== undefined
            ? arguments[1]
            : {
              up: InputManager.Keys.Up_Arrow,
              left: InputManager.Keys.Left_Arrow,
              right: InputManager.Keys.Right_Arrow,
              down: InputManager.Keys.Down_Arrow
            };
        if (!this.turnedOn) return;

        if (inputmanager.isPressed(keys.left)) {
          if (this.speed.x > 0) {
            this.speed.x *= this.iddleFriction.x;
          }

          this.speed.x -= this.accel.x;
          this.movingLeft = this.rocketTurnedOnDelay;
        } else if (inputmanager.isPressed(keys.right)) {
          if (this.speed.x < 0) {
            this.speed.x *= this.iddleFriction.x;
          }

          this.speed.x += this.accel.x;
          this.movingRight = this.rocketTurnedOnDelay;
        } else {
          if (this.speed.x > 0.5) {
            this.movingLeft = 2;
            this.movingRight = 0;
          } else if (this.speed.x < -0.5) {
            this.movingRight = 2;
            this.movingLeft = 0;
          }

          this.speed.x *= this.iddleFriction.x;
        }

        if (inputmanager.isPressed(keys.up)) {
          if (this.speed.y > 0) {
            this.speed.y *= this.iddleFriction.y;
          }

          this.speed.y -= this.accel.y;
          this.movingRight = this.rocketTurnedOnDelay * 0.5;
          this.movingLeft = this.rocketTurnedOnDelay * 0.5;
        } else if (inputmanager.isPressed(keys.down)) {
          if (this.speed.y < 0) {
            this.speed.y *= this.iddleFriction.y;
          }

          this.speed.y += this.accel.y;
        } else {
          this.speed.y *= this.iddleFriction.y;
        }
      }
    },
    {
      key: "readTouchMovimentation",
      value: function readTouchMovimentation(analogic) {
        if (!this.turnedOn) return; // if (analogic.currentDirection)
        //   console.singleLog(analogic);

        if (
          analogic.currentDirection &&
          analogic.currentDirection.x > analogic.deadZonePercent
        ) {
          if (this.speed.x < 0) {
            this.speed.x *= this.iddleFriction.x;
          }

          this.speed.x +=
            (this.accel.x * analogic.currentDirection.x) / analogic.radius;
          this.movingRight = this.rocketTurnedOnDelay;
        } else if (
          analogic.currentDirection &&
          analogic.currentDirection.x < -analogic.deadZonePercent
        ) {
          if (this.speed.x > 0) {
            this.speed.x *= this.iddleFriction.x;
          }

          this.speed.x +=
            (this.accel.x * analogic.currentDirection.x) / analogic.radius;
          this.movingLeft = this.rocketTurnedOnDelay;
        } else {
          if (this.speed.x > 0.5) {
            this.movingLeft = 2;
            this.movingRight = 0;
          } else if (this.speed.x < -0.5) {
            this.movingRight = 2;
            this.movingLeft = 0;
          }

          this.speed.x *= this.iddleFriction.x;
        }

        if (
          analogic.currentDirection &&
          analogic.currentDirection.y > analogic.deadZonePercent
        ) {
          if (this.speed.y < 0) {
            this.speed.y *= this.iddleFriction.y;
          }

          this.speed.y +=
            (this.accel.y * analogic.currentDirection.y) / analogic.radius;
        } else if (
          analogic.currentDirection &&
          analogic.currentDirection.y < -analogic.deadZonePercent
        ) {
          if (this.speed.y > 0) {
            this.speed.y *= this.iddleFriction.y;
          }

          this.speed.y +=
            (this.accel.y * analogic.currentDirection.y) / analogic.radius;
          this.movingRight = this.rocketTurnedOnDelay * 0.5;
          this.movingLeft = this.rocketTurnedOnDelay * 0.5;
        } else {
          this.speed.y *= this.iddleFriction.y;
        }
      }
    }
  ]);

  return Nave2D;
})(); //  Fundo com gradiente

var BGGradiente = /*#__PURE__*/ (function () {
  function BGGradiente(tween, canvas, ctx) {
    _classCallCheck(this, BGGradiente);

    this.canvas = canvas;
    this.ctx = ctx;
    this.height = 0;
    this.tween = tween;
    this.mayRise = false;
    this.reachedKeyframes = [];
  }

  _createClass(BGGradiente, [
    {
      key: "render",
      value: function render() {
        var _this4 = this;

        if (this.tween && this.tween.length > 0) {
          var w = this.canvas.width;
          var h = this.canvas.height;
          var gradient = this.ctx.createLinearGradient(w * 0.5, h, w * 0.5, 0);
          var colorPositions = [];
          var colors = [];
          var currentFrame = this.getCurrentCeuKeyframe(this.height);
          var nextFrameIdx = this.tween.indexOf(currentFrame) + 1;
          var nextKeyFrame = this.tween[nextFrameIdx];

          if (this.reachedKeyframes.indexOf(currentFrame) == -1) {
            this.reachedKeyframes.push(currentFrame);
            if (currentFrame.onReach) currentFrame.onReach();
          }

          if (nextKeyFrame) {
            var lerpRatio =
              (this.height - currentFrame.keyframe) /
              (nextKeyFrame.keyframe - currentFrame.keyframe);
            if (lerpRatio == NaN || lerpRatio == Infinity) lerpRatio = 1;
            currentFrame.points.map(function (point) {
              if (point.position != undefined) {
                var nextPoint = _this4.getPointByID(
                  nextKeyFrame.points,
                  point.id
                );

                var currPoint = _this4.getPointByID(
                  currentFrame.points,
                  point.id
                );

                if (nextPoint.position != undefined) {
                  var lerpedPosition = lerp(
                    currPoint.position,
                    nextPoint.position,
                    lerpRatio
                  );
                  var lerpedR = lerp(
                    currPoint.color.r,
                    nextPoint.color.r,
                    lerpRatio
                  );
                  var lerpedG = lerp(
                    currPoint.color.g,
                    nextPoint.color.g,
                    lerpRatio
                  );
                  var lerpedB = lerp(
                    currPoint.color.b,
                    nextPoint.color.b,
                    lerpRatio
                  );
                  gradient.addColorStop(
                    lerpedPosition,
                    "rgb(" + lerpedR + "," + lerpedG + "," + lerpedB + ")"
                  );
                } else {
                  gradient.addColorStop(
                    point.position,
                    "rgb(" +
                    point.color.r +
                    "," +
                    point.color.g +
                    "," +
                    point.color.b +
                    ")"
                  );
                }
              }
            });
          } else {
            currentFrame.points.map(function (point) {
              if (point.position != undefined) {
                gradient.addColorStop(
                  point.position,
                  "rgb(" +
                  point.color.r +
                  "," +
                  point.color.g +
                  "," +
                  point.color.b +
                  ")"
                );
              }
            });
          }

          this.ctx.fillStyle = gradient;
          this.ctx.fillRect(0, 0, w, h);
        }

        if (this.mayRise == true) this.height++; // console.log(this.height, currentFrame);
      }
    },
    {
      key: "getPointByID",
      value: function getPointByID(points, target) {
        var retorno = undefined;
        points.map(function (point) {
          if (point.id == target) retorno = point;
        });
        return retorno;
      }
    },
    {
      key: "getCurrentCeuKeyframe",
      value: function getCurrentCeuKeyframe(counter) {
        var retorno = undefined;
        this.tween.map(function (item) {
          if (item.firstFrame || counter >= item.keyframe) {
            retorno = item;
          }
        });
        return retorno;
      }
    }
  ]);

  return BGGradiente;
})();

var ParticleFall = /*#__PURE__*/ (function () {
  function ParticleFall(options) {
    _classCallCheck(this, ParticleFall);

    this.canvas = options.canvas;
    this.ctx = options.ctx;
    this.amount = options.amount || 0;
    this.generationParams = options.generationParams || {};

    this.fallBehaviour =
      options.fallBehaviour ||
      function () {
        console.log("Empty Fuction");
      };

    this.generateBehaviour =
      options.generateBehaviour ||
      function () {
        console.log("Empty Fuction");
      };

    this.resetTest =
      options.resetTest ||
      function () {
        console.log("Empty Fuction");
      };

    this.fallCondition =
      options.fallCondition ||
      function () {
        console.log("Empty Fuction");
        return false;
      };

    this.maxWidth = options.maxWidth;
    this.particles = [];
    this.fillParticles();
  }

  _createClass(ParticleFall, [
    {
      key: "increaseAmount",
      value: function increaseAmount(numberOfNewParticles) {
        this.amount += numberOfNewParticles;
        this.fillParticles();
      }
    },
    {
      key: "fillParticles",
      value: function fillParticles() {
        while (this.particles.length < this.amount) {
          this.particles.push(
            this.generateBehaviour({}, this.generationParams)
          );
        }
      }
    },
    {
      key: "render",
      value: function render() {
        var _this5 = this;

        this.fillParticles();

        if (this.fallCondition()) {
          this.particles.map(function (particle) {
            _this5.fallBehaviour(particle, _this5.canvas);
          });
        }

        this.particles.map(function (particle) {
          if (_this5.resetTest(particle, _this5.canvas)) {
            particle = _this5.generateBehaviour(
              particle,
              _this5.generationParams
            );
          }

          var maxWidth = _this5.maxWidth;

          if (engine.layout == "mobile") {
            maxWidth = canvas.width * 0.15;
          }

          var scale = particle.scale;
          var finalW = particle.image.width * scale;
          var finalH = particle.image.height * scale;

          _this5.ctx.save();

          if (particle.alpha) {
            _this5.ctx.globalAlpha = particle.alpha;
          }

          _this5.ctx.translate(particle.position.x, particle.position.y);

          _this5.ctx.rotate(degrees_to_radians(particle.rotation));

          _this5.ctx.drawImage(
            particle.image,
            0,
            0,
            particle.image.width,
            particle.image.height,
            -particle.pivot.x * finalW,
            -particle.pivot.y * finalH,
            finalW,
            finalH
          );

          if (particle.alpha) {
            _this5.ctx.globalAlpha = 1;
          }

          _this5.ctx.restore();
        });
      }
    }
  ]);

  return ParticleFall;
})();

var ParticleFire = /*#__PURE__*/ (function () {
  function ParticleFire(options) {
    _classCallCheck(this, ParticleFire);

    this.canvas = options.canvas;
    this.ctx = options.ctx;
    this.position = options.position;
    this.scale = options.scale;
    this.image = options.image;
    this.animCounter = 0;
    this.defaultDelay = 2;
    this.currentState = 0;
    this.delayCounter = 0;
    this.states = [
      {
        sx: 0.75,
        sy: 0.5,
        delay: this.defaultDelay
      },
      {
        sx: 0.75,
        sy: 1,
        delay: this.defaultDelay
      },
      {
        sx: 1.1,
        sy: 0.7,
        delay: this.defaultDelay
      },
      {
        sx: 1,
        sy: 1,
        delay: this.defaultDelay
      },
      {
        sx: 0.6,
        sy: 0.6,
        delay: this.defaultDelay
      },
      {
        sx: 0.1,
        sy: 1.5,
        delay: this.defaultDelay
      },
      {
        sx: 0.25,
        sy: 0.8,
        delay: this.defaultDelay
      },
      {
        sx: 1.5,
        sy: 0.5,
        delay: this.defaultDelay
      }
    ];
  }

  _createClass(ParticleFire, [
    {
      key: "render",
      value: function render(s, w, h) {
        var extraS =
          arguments.length > 3 && arguments[3] !== undefined
            ? arguments[3]
            : {
              x: 1,
              y: 1
            };
        var randomNextFrame =
          arguments.length > 4 && arguments[4] !== undefined
            ? arguments[4]
            : false;
        this.delayCounter++;

        if (this.delayCounter > this.states[this.currentState].delay) {
          this.delayCounter = randomInt(0, 1);
          this.currentState++;

          if (this.currentState >= this.states.length) {
            if (randomNextFrame) {
              if (randomInt(0, 10) > 5) {
                this.currentState = randomInt(0, this.states.length - 1);
              } else {
                this.currentState = 0;
              }
            } else {
              this.currentState = 0;
            }
          }
        }

        var currFrame = this.states[this.currentState]; // console.log(currFrame);

        this.ctx.save();
        this.ctx.translate(this.position.x * w, this.position.y * h);
        var myScaler = 0.2;
        var finalW =
          this.image.width *
          this.scale.x *
          s *
          currFrame.sx *
          myScaler *
          extraS.x;
        var finalH =
          this.image.height *
          this.scale.y *
          s *
          currFrame.sy *
          myScaler *
          extraS.y;
        this.ctx.drawImage(this.image, -0.5 * finalW, 0, finalW, finalH);
        this.ctx.restore();
        this.animCounter++;
      }
    }
  ]);

  return ParticleFire;
})();

var MultilayerBackground = /*#__PURE__*/ (function () {
  function MultilayerBackground(options) {
    _classCallCheck(this, MultilayerBackground);

    this.canvas = options.canvas;
    this.ctx = options.ctx;
    this.layers = options.layers || [];
    this.riseSpeed = options.riseSpeed || 1;
    this.currentHeight = options.currentHeight || 0;
    this.depth = options.depth || 100;
    this.backgroundSpeed = options.backgroundSpeed || 1;
    this.frontSpeed = options.frontSpeed || 1;
  }

  _createClass(MultilayerBackground, [
    {
      key: "render",
      value: function render() {
        var _this6 = this;

        if (this.mayRise == true) {
          this.currentHeight += this.riseSpeed;
        }

        var depth = this.depth;
        var speedInterval = this.frontSpeed - this.backgroundSpeed;
        var currHeigth = this.currentHeight;
        this.layers.map(function (layer) {
          _this6.ctx.save();

          var fW = layer.sizes.x(layer),
            fH = layer.sizes.y(layer);
          var depthRate = (depth - layer.depth) / depth;

          _this6.ctx.translate(0, depthRate * currHeigth * speedInterval);

          _this6.ctx.translate(
            layer.screenPivot.x * _this6.canvas.width,
            layer.screenPivot.y * _this6.canvas.height
          );

          _this6.ctx.translate(
            layer.offset.x * layer.scale,
            layer.offset.y * layer.scale
          );

          _this6.ctx.drawImage(
            layer.image,
            layer.pivot.x * -fW,
            layer.pivot.y * -fH,
            fW,
            fH
          );

          _this6.ctx.restore();
        });
      }
    }
  ]);

  return MultilayerBackground;
})();

var ObjectLayoutReader = /*#__PURE__*/ (function () {
  function ObjectLayoutReader(options) {
    _classCallCheck(this, ObjectLayoutReader);

    this.canvas = options.canvas;
    this.ctx = options.ctx;
    this.imgScale = options.imgScale || [];
    this.coordScale = options.coordScale || 0;
    this.currLayoutIdx = options.currLayoutIdx || 0;
    this.currentOffset = options.currentOffset || {
      x: 0,
      y: 0
    };
    this.layoutSrc = options.layoutSrc || null;
    this.chooseNextChallenge = options.chooseNextChallenge || null;
    this.layoutsToUse = options.layoutsToUse || null;
    this.objectPrefabs = options.objectPrefabs || [];
    this.mayRise = false;
    this.hasLoaded = false;
  }

  _createClass(ObjectLayoutReader, [
    {
      key: "readChallenges",
      value: function readChallenges() {
        var _this7 = this;

        this.layoutReader = new ShipLayoutReader();
        this.layoutReader.load(this.layoutSrc, function () {
          _this7.transformObjectsValues();

          _this7.hasLoaded = _this7.layoutReader.hasLoaded;

          if (_this7.challengePool.length > 0 && _this7.chooseNextChallenge) {
            _this7.chooseNextChallenge();
          }
        });
      }
    },
    {
      key: "transformObjectsValues",
      value: function transformObjectsValues() {
        var _this8 = this;

        // Get Challenges
        // this.currLayoutIdx = this.layoutReader.challenges.length - 1;
        this.layoutReader.challenges.map(function (challenge, i, arr) {
          challenge.objects.map(function (obj, j) {
            _this8.objectPrefabs.map(function (prefab) {
              if (obj.properties.type == prefab.typename) {
                obj.image = prefab.image;
                obj.scale = prefab.scale;
                obj.pivot = prefab.pivot;
                obj.update = prefab.update || null;
                obj.oncollect = prefab.oncollect || null;
                obj.destroy = prefab.destroy || null;
                obj.ondestroy = prefab.ondestroy || null;
                obj.personalRender = prefab.personalRender || null;
                obj.transformed = true;
                obj.mustRender = true;
                obj.prefab = prefab;
                obj.originalPosition = {
                  x: obj.x,
                  y: obj.y
                }; // console.log(obj.properties.type, prefab.typename, obj.properties.type == prefab.typename, obj)
                // console.log(obj)
              } else if (obj.properties.type == "spacing") {
                challenge.startingY = obj.y;
              }
            });
          });
        });
        this.challengePool = this.layoutReader.challenges; // Sort Challenges by checkpoint count

        this.challengesByCheckpoints = {
          0: [],
          1: [],
          2: [],
          3: [],
          4: []
        };
        this.challengePool.map(function (challenge) {
          _this8.challengesByCheckpoints[challenge.properties.checkpoints].push(
            challenge
          );
        }); // Get questions

        this.layoutReader.questions.map(function (stage, i, arr) {
          stage.objects.map(function (obj, j) {
            _this8.objectPrefabs.map(function (prefab) {
              if (obj.properties.type == prefab.typename) {
                obj.image = prefab.image;
                obj.scale = prefab.scale;
                obj.pivot = prefab.pivot;
                obj.update = prefab.update || null;
                obj.oncollect = prefab.oncollect || null;
                obj.destroy = prefab.destroy || null;
                obj.ondestroy = prefab.ondestroy || null;
                obj.personalRender = prefab.personalRender || null;
                obj.transformed = true;
                obj.mustRender = true;
                obj.prefab = prefab;
                obj.originalPosition = {
                  x: obj.x,
                  y: obj.y
                };
              } else if (obj.properties.type == "spacing") {
                stage.startingY = obj.y;
              }
            });
          });
        });
        this.questionPool = this.layoutReader.questions;
      }
    },
    {
      key: "randomNextChallenge",
      value: function randomNextChallenge() {
        return this.randomNextStage(this.challengePool);
      }
    },
    {
      key: "randomNextQuestion",
      value: function randomNextQuestion() {
        // debugger;
        return this.randomNextStage(this.questionPool, 0);
      }
    },
    {
      key: "randomNextStage",
      value: function randomNextStage(stagePool) {
        var yOffset =
          arguments.length > 1 && arguments[1] !== undefined
            ? arguments[1]
            : 0.15;
        var oldLayout = this.currentChallenge || undefined;
        var tempLayout = undefined; // do {

        var tempIdx = randomInt(0, stagePool.length);
        if (tempIdx >= stagePool.length)
          tempIdx = (_readOnlyError("tempIdx"), stagePool.length - 1);
        tempLayout = stagePool[tempIdx]; // } while (tempLayout == oldLayout && this.stagePool.length > 1);
        // if (this.currLayoutIdx >= this.stagePool.length)
        //   this.currLayoutIdx = this.stagePool.length - 1;

        this.currentOffset.y = this.canvas.height * yOffset;
        this.setChallengeInMemory(tempLayout);
        return tempLayout;
      }
    },
    {
      key: "randomNextChallengeByCheckpoints",
      value: function randomNextChallengeByCheckpoints(maxCheckpointsWanted) {
        var targetChallengePool = [];

        for (var i = maxCheckpointsWanted; i >= 0; i--) {
          var targetChallengeGroup = this.challengesByCheckpoints[i]; // console.log(targetChallengeGroup)

          targetChallengeGroup.map(function (challenge) {
            targetChallengePool.push(challenge);
          });
        }

        var tempNextChallenge = {};
        var oldName = this.currLayoutIdx;

        do {
          tempNextChallenge =
            targetChallengePool[randomInt(0, targetChallengePool.length)]; // consolelog(tempNextChallenge);
        } while (
          targetChallengePool.length > 1 &&
          tempNextChallenge.name == oldName
        );

        this.currentOffset.y = this.canvas.height * 0.33;
        this.setChallengeInMemory(tempNextChallenge);
        return this.currentChallenge;
      }
    },
    {
      key: "setChallengeInMemoryByIndex",
      value: function setChallengeInMemoryByIndex(index) {
        var challengeToCopy = this.challengePool[index];
        this.setChallengeInMemory(challengeToCopy);
      }
    },
    {
      key: "setChallengeInMemory",
      value: function setChallengeInMemory(challenge) {
        var newCurrentChallenge = {
          objects: []
        }; // console.log(challenge)

        var challengeToCopy = challenge;
        challengeToCopy.objects.map(function (item) {
          newCurrentChallenge.objects.push(Object.assign({}, item)); //Copia o desafio de um jeito sacana pra permitir modificação sem avacalhar o molde
        });
        newCurrentChallenge.crystalsCollected = 0;
        newCurrentChallenge.startingY = challengeToCopy.startingY;
        this.currentChallenge = newCurrentChallenge;
      }
    },
    {
      key: "render",
      value: function render() {
        var _this9 = this;

        if (this.hasLoaded) {
          var currentChallenge = this.currentChallenge;
          if (!currentChallenge) return;
          var smallerObjectY = Infinity;
          currentChallenge.objects.map(function (item) {
            if (item.transformed) {
              var currentY =
                -item.y * _this9.coordScale +
                _this9.currentOffset.y -
                currentChallenge.startingY;
              if (currentY < smallerObjectY) smallerObjectY = currentY;
              var fW = item.image.width * item.scale;
              var fH = item.image.height * item.scale;
              var layoutMaxWidth = _this9.canvas.width * 0.4;
              var layoutxOffset = _this9.canvas.width * 0.3;

              if (window.mobileAndTabletCheck()) {
                layoutMaxWidth = _this9.canvas.width;
                layoutxOffset = 0;
              }

              var fx =
                ((item.x + 8) / (15 * 16)) * layoutMaxWidth + layoutxOffset;
              var fy = currentY;
              var tempScale = 1; // if (fy < 0) {
              //   var z = fy * -1;
              //   tempScale = 0.09;
              //   // fx *= 0.03
              //   fy *= -0.12;
              //   fy -= this.canvas.height * 0.1;
              //   fH *= tempScale;
              //   fW *= tempScale;
              //   item.activeCollider = false;
              // } else {
              //   item.activeCollider = true;
              // }

              if (item.activeCollider == undefined) item.activeCollider = true; // console.singleLog([currentY, smallerObjectY, currentChallenge]);
              // console.log(currentY);

              fx += -item.pivot.x * fW;
              fy += -item.pivot.y * fH;
              item.rectCollider = {
                x: fx,
                y: fy,
                w: fW,
                h: fH
              };

              if (item.animateToCounter) {
                //Animação movendo e encolhendo para o contador
                if (!item.animateToCounter.orign) {
                  item.animateToCounter.orign = {
                    x: fx,
                    y: fy
                  };
                }

                fW *= 0.6;
                fH *= 0.6;
                var targetRect = {
                  x: (_this9.canvas.width / 12) * 11,
                  y: _this9.canvas.height
                };
                var xDist = targetRect.x - fx;
                var yDist = targetRect.y - fy;
                var dist = Math.pow(
                  Math.pow(xDist, 2) + Math.pow(yDist, 2),
                  0.5
                ); // console.log('hehe');

                var motion = {
                  x: 0,
                  y: 0
                };
                if (
                  item.animateToCounter.orign.x <
                  targetRect.x - item.animateToCounter.speed
                )
                  motion.x += item.animateToCounter.speed;
                else if (
                  item.animateToCounter.orign.x >
                  targetRect.x + item.animateToCounter.speed
                )
                  motion.x -= item.animateToCounter.speed;
                else {
                  motion.x += xDist;
                }
                if (
                  item.animateToCounter.orign.y <
                  targetRect.y - item.animateToCounter.speed
                )
                  motion.y += item.animateToCounter.speed;
                else if (
                  item.animateToCounter.orign.y >
                  targetRect.x + item.animateToCounter.speed
                )
                  motion.y -= item.animateToCounter.speed;
                else {
                  motion.y += yDist;
                }
                var tempDirectionTouse = {
                  x: xDist / dist,
                  y: yDist / dist
                };
                item.animateToCounter.orign.x +=
                  motion.x * Math.abs(tempDirectionTouse.x);
                item.animateToCounter.orign.y +=
                  motion.y * Math.abs(tempDirectionTouse.y);
                fx = item.animateToCounter.orign.x;
                fy = item.animateToCounter.orign.y;
                dist = Math.pow(
                  Math.pow(fx - targetRect.x, 2) +
                  Math.pow(fy - targetRect.y, 2),
                  0.5
                );

                if (dist <= item.animateToCounter.speed * 5.5) {
                  item.mustRender = false;
                }
              }

              if (item.mustRender == false) {
              } else {
                if (item.properties.forceNoRender) {
                  item.activeCollider = false;
                } else {
                  _this9.ctx.drawImage(item.image, fx, fy, fW, fH);

                  if (item.update) {
                    item.update(item);
                  }
                }
              }

              if (
                fy - fH >= _this9.canvas.height &&
                !item.destroyed &&
                item.mustRender
              ) {
                item.destroyed = true;
                if (item.ondestroy) item.ondestroy(item);
              }
            }
          });

          if (smallerObjectY > this.canvas.height) {
            this.mayChooseNextChallenge = true;

            if (this.chooseNextChallenge) {
              this.chooseNextChallenge();
            } else {
              this.randomNextChallenge();
            }
          } else {
            this.mayChooseNextChallenge = false;
          }
        }

        if (this.mayRise == true) {
          this.currentOffset.y += 3.5;
        }
      }
    },
    {
      key: "checkcollision",
      value: function checkcollision(rect) {
        var retorno = [];

        if (this.hasLoaded) {
          var currentChallenge = this.currentChallenge;

          if (currentChallenge) {
            currentChallenge.objects.map(function (item) {
              if (item.rectCollider && item.activeCollider) {
                if (Physics.rectRect(rect, item.rectCollider)) {
                  retorno.push(item); // console.log(item);
                }
              }
            });
          }
        }

        return retorno;
      }
    }
  ]);

  return ObjectLayoutReader;
})();

var ChallengeDynamicBuilder = /*#__PURE__*/ (function () {
  function ChallengeDynamicBuilder(options) {
    _classCallCheck(this, ChallengeDynamicBuilder);

    this.currentSpeed = options.currentSpeed || 1;
    this.currentCheckpointCount = options.currentCheckpointCount || 0;
    this.generateNewChallengeFromSkeleton =
      options.generateNewChallengeFromSkeleton || null;
    this.speedStep = options.speedStep || 0.3333; //Quantidade adicionada ou removida de acordo com o nivel de dificuldade

    this.possibleLayouts = [];
    this.chooseNextChallenge = options.chooseNextChallenge || null;
    this.buildChallenge = options.buildChallenge || null;
    this.buildQuestion = options.buildQuestion || null;
    this.param1Range = options.param1Range || [1];
    this.param2Range = options.param2Range || [1, 2, 3, 4, 5, 6, 7, 8, 9];
    this.difficultyInfo = {
      checkpoints: 1
    };
    this.currentCheckpoints = options.currentCheckpoints || {
      param1: false,
      operation: false,
      param2: false,
      readyToBeSolved: false
    };
    this.updateHUD();
  }

  _createClass(ChallengeDynamicBuilder, [
    {
      key: "onCollectCheckpointPiece",
      value: function onCollectCheckpointPiece(piece) {
        if (piece.properties.checkpointValue == "x") {
          this.currentCheckpoints.operation = piece.properties.checkpointValue;
        } else if (piece.properties.checkpointValue == "=") {
          this.currentCheckpoints.readyToBeSolved =
            piece.properties.checkpointValue;
        } else {
          if (
            this.param1Range.indexOf(piece.properties.checkpointValue) != -1 &&
            this.currentCheckpoints.param1 == false
          ) {
            this.currentCheckpoints.param1 = piece.properties.checkpointValue;
          } else {
            this.currentCheckpoints.param2 = piece.properties.checkpointValue;
          }
        } // console.log('checkpoint coletado!', piece);

        this.updateHUD();
      }
    },
    {
      key: "decideNextChallenge",
      value: function decideNextChallenge() {
        console.log("empty function");
      }
    },
    {
      key: "updateHUD",
      value: function updateHUD() {
        var params = [
          this.currentCheckpoints.param1,
          this.currentCheckpoints.operation,
          this.currentCheckpoints.param2,
          this.currentCheckpoints.readyToBeSolved
        ];
        var pieces = document.querySelectorAll(".checkpoint .piece");

        for (var i = 0; i < pieces.length; i++) {
          var piece = pieces[i];

          if (!params[i]) {
            piece.classList.add("empty");
            piece.classList.add("black");
            piece.innerHTML = "?";
          } else {
            piece.classList.remove("empty");
            piece.classList.remove("black");
            piece.innerHTML = params[i];
          }
        }

        this.updateCheckpointCounter();
      }
    },
    {
      key: "resetCheckpointCounter",
      value: function resetCheckpointCounter() {
        this.currentCheckpoints.param1 = false;
        this.currentCheckpoints.param2 = false;
        this.currentCheckpoints.operation = false;
        this.currentCheckpoints.readyToBeSolved = false;
        this.updateHUD();
      }
    },
    {
      key: "updateCheckpointCounter",
      value: function updateCheckpointCounter() {
        this.currentCheckpointCount = 0;
        if (this.currentCheckpoints.param1 != false)
          this.currentCheckpointCount++;
        if (this.currentCheckpoints.param2 != false)
          this.currentCheckpointCount++;
        if (this.currentCheckpoints.operation != false)
          this.currentCheckpointCount++;
        if (this.currentCheckpoints.readyToBeSolved != false)
          this.currentCheckpointCount++;
      }
    },
    {
      key: "evaluatePlayerAbilityInLastChallenge",
      value: function evaluatePlayerAbilityInLastChallenge() {
        var report =
          arguments.length > 0 && arguments[0] !== undefined
            ? arguments[0]
            : {
              percentageOfCrystals: 0,
              percentageOfCheckpoints: 0,
              HP: 0
            };
      }
    }
  ]);

  return ChallengeDynamicBuilder;
})();

var HUDCounter = /*#__PURE__*/ (function () {
  function HUDCounter(initialAmount, elementID) {
    _classCallCheck(this, HUDCounter);

    this.counterToShow = -1;
    this.counter = initialAmount;
    this.element = document.getElementById(elementID);
    this.animationDelayCounter = 0;
    this.animationDelay = 11;
    this.updateHUD();
  }

  _createClass(HUDCounter, [
    {
      key: "increase",
      value: function increase(amount) {
        this.counter += amount; // this.updateHUD();
      }
    },
    {
      key: "decrease",
      value: function decrease(amount) {
        this.counter -= amount; // this.updateHUD();
      }
    },
    {
      key: "updateHUD",
      value: function updateHUD() {
        this.animationDelayCounter++;

        if (this.animationDelayCounter > this.animationDelay) {
          this.animationDelayCounter = 0;

          if (this.counterToShow != this.counter) {
            this.counterToShow = Math.ceil(
              lerp(this.counterToShow, this.counter, 0.5)
            );
            this.element.innerHTML = this.counterToShow;
          }
        }
      }
    }
  ]);

  return HUDCounter;
})();

var FragManager = /*#__PURE__*/ (function () {
  function FragManager() {
    _classCallCheck(this, FragManager);

    this.reset();
  }

  _createClass(FragManager, [
    {
      key: "reset",
      value: function reset() {
        this.acertos = 0;
        this.erros = 0;
        this.rightQuestions = [];
        this.wrongQuestions = [];
      }
    },
    {
      key: "incluirAcerto",
      value: function incluirAcerto(question) {
        this.acertos++;
        this.rightQuestions.push(question);
      }
    },
    {
      key: "incluirErro",
      value: function incluirErro(question) {
        this.erros++;
        this.wrongQuestions.push(question);
      }
    },
    {
      key: "getPercentage",
      value: function getPercentage() {
        return (this.acertos / (this.erros + this.acertos)) * 100;
      }
    }
  ]);

  return FragManager;
})();

var HeartHUD = /*#__PURE__*/ (function () {
  function HeartHUD(heartAmount, selectors, onDie) {
    var currentAmount =
      arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;

    _classCallCheck(this, HeartHUD);

    this.maxHearts = heartAmount;
    this.hearts = currentAmount;
    this.selectors = selectors;
    this.onDie = onDie;
    this.updateHUD();
  }

  _createClass(HeartHUD, [
    {
      key: "applyDamage",
      value: function applyDamage(amount) {
        this.hearts -= amount;

        if (this.hearts <= 0) {
          this.hearts = 0;
          if (this.onDie) this.onDie();
        }

        if (this.hearts > this.maxHearts) this.hearts = this.maxHearts;
        this.updateHUD();
      }
    },
    {
      key: "recoverDamage",
      value: function recoverDamage(amount) {
        this.hearts += amount;

        if (this.hearts >= this.maxHearts) {
          this.hearts = this.maxHearts;
        }

        this.updateHUD();
      }
    },
    {
      key: "updateHUD",
      value: function updateHUD() {
        var _this10 = this;

        if (!this.heartElements) {
          this.heartElements = [];
          this.selectors.map(function (selector) {
            _this10.heartElements.push(document.querySelector(selector));
          });
          this.heartElements.sort(function (a, b) {
            var vA = parseInt(a.getAttribute("ordem"));
            var vB = parseInt(b.getAttribute("ordem"));

            if (vA > vB) {
              return 1;
            } else if (vA < vB) {
              return -1;
            }

            return 0;
          }); // console.log(this.heartElements);
        }

        var heartElements = this.heartElements;
        var currentHeart = 1;
        heartElements.map(function (heart) {
          var hastEmpty = heart.classList.contains("empty");

          if (currentHeart > _this10.hearts && !hastEmpty) {
            heart.classList.add("empty");
          } else if (currentHeart <= _this10.hearts && hastEmpty) {
            heart.classList.remove("empty");
          }

          currentHeart++;
        });
      }
    }
  ]);

  return HeartHUD;
})();

var AcertosHUD = /*#__PURE__*/ (function () {
  function AcertosHUD(questionSlotSelector) {
    var currentQuestion =
      arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var onWinCallback =
      arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    _classCallCheck(this, AcertosHUD);

    this.onWinCallback = onWinCallback;
    this.selector = questionSlotSelector;
    this.slots = document.querySelectorAll(this.selector);
    this.hasWon = false;
    this.data = [];

    for (var i = 0; i < this.slots.length; i++) {
      var slot = this.slots[i];

      if (this.data.length < currentQuestion) {
        this.data.push(true);
      } else this.data.push(undefined);
    }

    this.currentQuestion = currentQuestion;
    this.updateHUD();
  }

  _createClass(AcertosHUD, [
    {
      key: "checkWin",
      value: function checkWin() {
        if (this.hasWon == false) {
          console.log(this.currentQuestion, this.data.length);

          if (this.currentQuestion >= this.data.length) {
            this.hasWon = true;
            if (this.onWinCallback) this.onWinCallback();
          }
        }
      }
    },
    {
      key: "pushRightQuestion",
      value: function pushRightQuestion() {
        if (this.currentQuestion < this.data.length)
          this.data[this.currentQuestion] = true;
        this.currentQuestion++;
        this.checkWin();
      }
    },
    {
      key: "pushWrongQuestion",
      value: function pushWrongQuestion() {
        if (this.currentQuestion < this.data.length)
          this.data[this.currentQuestion] = false;
        this.currentQuestion++;
        this.checkWin();
      }
    },
    {
      key: "clearHUD",
      value: function clearHUD() {
        this.currentQuestion = 0;

        for (var i = 0; i < this.slots.length; i++) {
          this.data[i] = undefined;
          this.slots[i].classList.remove("wrong");
          this.slots[i].classList.remove("correct");
        }
      }
    },
    {
      key: "updateHUD",
      value: function updateHUD() {
        for (var i = 0; i < this.slots.length; i++) {
          if (
            this.data[i] == true &&
            !this.slots[i].classList.contains("correct")
          ) {
            this.slots[i].classList.add("correct");
          } else if (
            this.data[i] == false &&
            !this.slots[i].classList.contains("wrong")
          ) {
            this.slots[i].classList.add("wrong");
          }
        }
      }
    }
  ]);

  return AcertosHUD;
})();

var RocketCounterHUD = /*#__PURE__*/ (function () {
  function RocketCounterHUD(selector) {
    var secondsLeft =
      arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

    _classCallCheck(this, RocketCounterHUD);

    this.selector = selector;
    this.lastInitialSecondsLeft = secondsLeft;
    this.secondsLeft = this.lastInitialSecondsLeft;
    this.txt = document.querySelector(this.selector);
    this.txt.innerHTML = this.secondsLeft;
    this.txt.style.display = "flex";
    this.txt.classList.remove("started");
  }

  _createClass(RocketCounterHUD, [
    {
      key: "start",
      value: function start(onFinishcallback) {
        var _this11 = this;

        this.onFinishcallback = onFinishcallback;
        this.txt.classList.add("started");

        for (var i = 0; i < 10; i++) {
          this.txt.classList.remove("t" + i);
        }

        this.txt.classList.add("t" + this.secondsLeft);
        setTimeout(function () {
          _this11.countDown();
        }, 1000);
      }
    },
    {
      key: "countDown",
      value: function countDown() {
        var _this12 = this;

        this.txt.classList.remove("t" + this.secondsLeft);
        this.secondsLeft -= 1;
        this.txt.classList.add("t" + this.secondsLeft);
        this.txt.innerHTML = this.secondsLeft;

        if (this.secondsLeft < 0) {
          this.secondsLeft = this.lastInitialSecondsLeft;
          this.txt.innerHTML = this.secondsLeft;
          this.txt.style.display = "none";
          return;
        } else if (this.secondsLeft == 0) {
          this.txt.innerHTML = "Vai!";
          this.onFinishcallback();
          setTimeout(function () {
            _this12.countDown();
          }, 2000);
          return;
        }

        setTimeout(function () {
          _this12.countDown();
        }, 1000);
      }
    }
  ]);

  return RocketCounterHUD;
})();

var AudioLooper = /*#__PURE__*/ (function () {
  function AudioLooper(audios) {
    _classCallCheck(this, AudioLooper);

    this.audios = audios;
    this.tempos = audios.length;
  }

  _createClass(AudioLooper, [
    {
      key: "startLoop",
      value: function startLoop() { }
    },
    {
      key: "stopLoop",
      value: function stopLoop() { }
    }
  ]);

  return AudioLooper;
})();

var instrucoes = function instrucoes() {
  var page =
    arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var screens = document.querySelectorAll(".instruction-screen");

  var _iterator = _createForOfIteratorHelper(screens),
    _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var screen = _step.value;
      screen.style.display = "none";
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  if (page > 0 && page <= screens.length) {
    var targetSelector = ".instruction-page" + page + "-screen";
    document.querySelector(targetSelector).style.display = "flex";
  }
};

var FaseManager = function FaseManager(stages) {
  _classCallCheck(this, FaseManager);

  this.stages = stages;
};
