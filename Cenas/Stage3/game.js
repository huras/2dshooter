// =================================================== External Funcitons


function loadNewScene() {
  alert("loadNewScene está vazio");
}

function onFinishGame() {
  console.log("undefined function");
}

function showResults() {
  console.log("undefined function");
  engine.engineState = engineStates.RESULT;
}

function setFrag(frag) {
  engine.frag = frag;
}

var loadedData = undefined;
function loadPreviousStageData() {
  if (engine) {
    if (loadedData != undefined) {
      engine.crystalCounter.counter = loadedData.crystals;
    }
  }
}

// =================================================== Engine Base

const drawColliders = false;
const debugEngine = false;
const revivePrice = 30;
var engineLife = 0;

const canvas = document.getElementById("canvas");
const canvasInt = new CanvasInterface({
  canvas: canvas,
  pixelBeauty: false
})

const engineStates = {
  StagePlaying: 0,
  LOADING: 1,

  WAITING_NEW_SCENE: 99,
};

class GameEngine {
  constructor(ctx, canvas) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.engineState = undefined;
    this.animationCounter = 0;
    this.lastExecution = undefined;

    this.fpsBuffer = [];
    this.maxFPSBuffer = 10;
  }

  registerEvents() {
    canvas.addEventListener(
      "mousedown",
      (event) => {
        this.touchOrClickCanvas(event, true);
      },
      false
    );
    canvas.addEventListener(
      "touchstart",
      (event) => {
        this.touchOrClickCanvas(event, true);
      },
      false
    );

    canvas.addEventListener(
      "mouseup",
      (event) => {
        this.touchOrClickCanvas(event, false);
        this.botaoClicado = false;
      },
      false
    );
    canvas.addEventListener(
      "touchend",
      (event) => {
        this.touchOrClickCanvas(event, false);
        this.botaoClicado = false;
      },
      false
    );
  }

  changeState(newState) {
    switch (newState) {
      case engineStates.StagePlaying:
        this.hasGameloop = true;
        this.engineState = newState;
        break;
      case engineStates.LOADING:
        this.engineState = newState;
        break;
      case engineStates.WAITING_NEW_SCENE:
        this.hasGameloop = false;
        this.engineState = newState;
        break;

      default:
        break;
    }
  }



  start() {
    if (debugEngine)
      console.log('Engine iniciada!');

    this.changeState(engineStates.StagePlaying);
    this.gameLoop();
  }

  gameLoop() {
    var deltaTime = 0;
    if (this.lastExecution != undefined) {
      deltaTime = Math.abs(performance.now() - this.lastExecution) / 1000; //tempo em segundos
    }
    this.lastExecution = performance.now();

    this.layout = window.mobileAndTabletCheck() ? "mobile" : "desktop";

    // this.fps = 1 / (deltaTime / 1000);
    // if (this.fpsBuffer.length + 1 > this.fpsmaxFPSBuffer) {
    //   this.fpsBuffer.splice(0, 1);
    // }
    // if (this.fps != Infinity)
    //   this.fpsBuffer.push({ fps: this.fps, deltaTime: deltaTime });

    this.tempDeBotaoClicado++;
    this.animationCounter++;
    if (this.animationCounter > 9999999) {
      this.animationCounter = 0;
    }

    // setInterval(() => {
    //   // window.r equ estAnimationFrame(() => {
    //   this.gameLoop();
    //   // });
    // }, 1000 / 30);



    // this.evolveState(deltaTime / (1 / 30));
    this.evolveState(1);

    if (this.hasGameloop) {
      window.requestAnimationFrame(() => {
        this.hasGameloop = true;
        this.gameLoop();
      });
    }
  }

  evolveState(deltaTime = 1) {
    switch (this.engineState) {
      case engineStates.StagePlaying: {

      } break;
      case engineStates.LOADING: {

      } break;
      case engineStates.WAITING_NEW_SCENE: {

      } break;
    }

    this.update(deltaTime);
  }

  touchOrClickCanvas(event, clickValue = true) {

    // Get X and Y dop mouse / toque
    var x = 0;
    if (event.touches) {
      if (event.touches.length > 0)
        x = event.touches[0].pageX
      else
        x = event.pageX;
    }
    else
      x = event.pageX;

    var y = event.touches ? event.touches.length > 0 ? event.touches[0].pageY : event.pageY
      : event.pageY;

    x -= canvas.offsetLeft;
    y -= canvas.offsetTop;

    // this.checkEnunciadoBtnClick(x, y);

    // Frescuras pra possibilitar que a leitura do toque / clique seja impedida
    // if (document.fullscreenElement == null && this.layout == 'mobile') {
    //   return;
    // }

    // if (this.mayDrag == false) {
    //   return;
    // }
    // if (this.mayReadClick == false)
    //   return;

    // Processa clique / desclique
    if (clickValue == true) {

    } else {

    }
  }

  // =========================== renderizar  

  onLoadStage(stage = 1) {
    this.engineLife = engineLife;
    this.currentStage = stage;
    this.currentScene = 'fase' + stage;
    this.firstFrame(stage);
    this.changeState(engineStates.StagePlaying);
    document.querySelector('.gameover-screen').style.display = 'none'; //Esconde tela de gameover
    // document.querySelector('.menu-screen').style.display = 'none'; //Esconde tela de menu
  }

  firstFrame(stageToLoad = 1) {
    // === Set Inputs
    this.inputManager = new InputManager({
      right: InputManager.Keys.Right_Arrow,
      left: InputManager.Keys.Left_Arrow,
      up: InputManager.Keys.Up_Arrow,
      down: InputManager.Keys.Down_Arrow,
    });

    this.analogic = new TouchAnalogic({
      canvas: this.canvas,
      ctx: this.ctx,
      margin: 24,
      radius: 65,
      personalizedImage: {
        image: analogicCircle,
        scale: 0.1,
        arrow: chevronup
      }
    });

    // === Set Layout
    this.ceu = new BGGradiente([
      {
        keyframe: 0, // 100 duration
        points: [
          { id: 0, color: { r: 0, g: 0, b: 0 }, position: 0 },
          { id: 1, color: { r: 0, g: 0, b: 0 }, position: 0.2 },
          { id: 2, color: { r: 0, g: 0, b: 0 }, position: 0.4 },
          { id: 3, color: { r: 10, g: 0, b: 17 }, position: 0.6 },
          { id: 4, color: { r: 10, g: 0, b: 17 }, position: 0.8 },
          { id: 5, color: { r: 22, g: 0, b: 37 }, position: 1 },          
        ]
      },
      {
        keyframe: 2000, // 1000 duration
        points: [
          { id: 0, color: { r: 30, g: 0, b: 51 }, position: 0 },
          { id: 1, color: { r: 30, g: 0, b: 51 }, position: 0.2 },
          { id: 2, color: { r: 33, g: 0, b: 57 }, position: 0.4 },
          { id: 3, color: { r: 44, g: 0, b: 75 }, position: 0.6 },
          { id: 4, color: { r: 50, g: 0, b: 85 }, position: 0.8 },
          { id: 5, color: { r: 52, g: 0, b: 89 }, position: 1 },          
        ]
      },
      {
        keyframe: 4000, // 1000 duration
        points: [
          { id: 0, color: { r: 73, g: 0, b: 125 }, position: 0 },
          { id: 1, color: { r: 79, g: 0, b: 136 }, position: 0.2 },
          { id: 2, color: { r: 96, g: 0, b: 164 }, position: 0.4 },
          { id: 3, color: { r: 107, g: 0, b: 184 }, position: 0.6 },
          { id: 4, color: { r: 118, g: 0, b: 203 }, position: 0.8 },
          { id: 5, color: { r: 132, g: 0, b: 226 }, position: 1 },          
        ]
      },
    ], this.canvas, this.ctx);

    this.cloudFall = new ParticleFall({
      canvas: this.canvas,
      ctx: this.ctx,
      amount: 45,
      maxWidth: 100,
      generationParams: {
        scale: { min: 0.05, max: 0.25 },
        rotation: { min: -3, max: 3 },
        images: [estrela],
      },
      fallCondition: () => {
        return this.ceu.mayRise;
      },
      fallBehaviour: (item, canvas) => {
        if (item) {
          item.position.y += item.speed.y;
          item.position.x += item.speed.x;
        }
      },
      resetTest: (item, canvas) => {
        var retorno = false;

        if (item.position.y > canvas.height)
          retorno = true;
        else if (item.position.x > canvas.width * 1.2 || item.position.x < canvas.width * -0.2)
          retorno = true;

        return retorno;
      },
      generateBehaviour: (item, params) => {

        item.scale = (randomInt(5, 55) / 100) * (params.scale.max - params.scale.min) + params.scale.min;
        item.rotation = (randomInt(0, 100) / 100) * (params.rotation.max - params.rotation.min) + params.rotation.min;
        item.image = params.images[0];
        item.alpha = 1;
        item.speed = {
          x: ((randomInt(0, 200) - 100) / 100) * 0.25 * (0.9 * item.scale),
          y: (randomInt(75, 100) / 100) * (0.9 * item.scale)
        }
        item.position = {
          x: (randomInt(0, 100) / 100) * this.canvas.width,
          y: this.canvas.height * randomInt(10, 100) / 100
        };
        item.pivot = { x: 0.5, y: 0.5 }
        return item;
      }
    })
    this.cloudFall.generateBehaviour = (item, params) => {

      item.scale = (randomInt(5, 55) / 100) * (params.scale.max - params.scale.min) + params.scale.min;
      item.rotation = (randomInt(0, 100) / 100) * (params.rotation.max - params.rotation.min) + params.rotation.min;
      item.image = params.images[0];
      item.alpha = 1;
      item.speed = {
        x: ((randomInt(0, 200) - 100) / 100) * 0.25 * (0.9 * item.scale),
        y: (randomInt(75, 100) / 100) * (0.9 * item.scale)
      }
      item.position = {
        x: (randomInt(20, 80) / 100) * this.canvas.width,
        y: -0.1 * this.canvas.height * randomInt(10, 100) / 100
      };
      item.pivot = { x: 0.5, y: 0.5 }
      return item;
    }

    this.spaceship = new Nave2D({
      initialPosition: {
        x: () => { return this.canvas.width * 0.5; },
        y: () => { return 0.94 * this.canvas.height; },
      },
      position: {
        x: 0.5 * this.canvas.width,
        y: 1 * this.canvas.height,
      },
      pivot: {
        x: 0.5,
        y: 1,
      },
      accel: { x: 0.085, y: 0.0370 },
      speed: { x: 0, y: 0 },
      maxSpeed: { x: 5, y: 7.5 },
      iddleFriction: { x: 0.95, y: 0.85 },
      zoom: 1,
      image: spaceBus,
      canvas: this.canvas,
      ctx: this.ctx,
      rockets: {
        left: [
          new ParticleFire({
            canvas: this.canvas,
            ctx: this.ctx,
            position: {
              y: 0,
              x: -0.28
            },
            scale: { x: 1, y: 0.5 },
            image: rocketFire
          })],
        right: [
          new ParticleFire({
            canvas: this.canvas,
            ctx: this.ctx,
            position: {
              y: 0,
              x: 0.22
            },
            scale: { x: 1, y: 0.5 },
            image: rocketFire
          })],
        central: [
          new ParticleFire({
            canvas: this.canvas,
            ctx: this.ctx,
            position: {
              y: -0.1,
              x: 0
            },
            scale: { x: 1, y: 0.75 },
            image: rocketFire
          })],
      }
    })

    const initialCheckpoints = {
      // param1: 2,
      // param2: 2,
      // operation: 'x',
      // readyToBeSolved: '=',

      param1: false,
      param2: false,
      operation: false,
      readyToBeSolved: false
    }

    this.stageBuilder = new ChallengeDynamicBuilder({
      currentSpeed: 1,
      speedStep: 0.15,
      param1Range: [5, 6, 7, 7, 7],
      param2Range: [4, 5, 6, 7, 8, 9, 10],
      currentCheckpoints: initialCheckpoints,
      currentCheckpointCount: 0,
      chooseNextChallenge: () => {
        this.stageBuilder.updateCheckpointCounter();

        const maxCheckpoints = 4;
        const minCheckpointsWanted = (this.stageBuilder.currentCheckpointCount < 4) ? 1 : 0;
        const maxCheckpointsWanted = (maxCheckpoints - this.stageBuilder.currentCheckpointCount);

        const checkPointsWanted = randomInt(minCheckpointsWanted, maxCheckpointsWanted + 1);
        // consolelog(minCheckpointsWanted, maxCheckpointsWanted, this.stageBuilder.currentCheckpointCount, checkPointsWanted)
        // consolelog(this.stageBuilder.currentCheckpointCount, checkPointsWanted, minCheckpointsWanted, maxCheckpointsWanted + 1);
        if (checkPointsWanted > 0) {
          var newChallenge = this.layoutManager.randomNextChallengeByCheckpoints(maxCheckpointsWanted);
          this.stageBuilder.buildChallenge(newChallenge);
          this.layoutManager.estado = 'challenge';
        } else if (this.layoutManager.estado != "question") {
          var newQuestion = this.layoutManager.randomNextQuestion();
          this.stageBuilder.buildQuestion(newQuestion);
          // this.layoutManager.estado = 'question';
        }
        // consolelog('checkPointsWanted =' + checkPointsWanted, newChallenge);

        // randomNextChallengeByCheckpoints
        // console.log(this.layoutManager);
        // this.layoutManager.randomNextChallenge();
      },
      buildChallenge: (stage) => { //Converte as nuvens de um desafio em checkpoints coletáveis
        // console.log('nova faze para ser formada', stage);

        var tempCurrCheckpoint = this.stageBuilder.currentCheckpointCount;
        var lastNeighbour = undefined;

        var checkpointValue = "", generateCheckpointValue = undefined;
        var possibilities = [];

        var param1Pushed = false;
        var param2Pushed = false;


        if (this.stageBuilder.currentCheckpoints.param1 == false) {
          param1Pushed = true;
          possibilities.push(() => {
            generateCheckpointValue = (myObj) => {
              if (this.lastRandomParam1 == undefined) {
                checkpointValue = shuffle([...this.stageBuilder.param1Range])[0];
                this.lastRandomParam1 = checkpointValue;
              }
              myObj.properties.checkpointValue = this.lastRandomParam1;
            }
          })
        }

        const tryPushParam2 = () => {
          if (this.stageBuilder.currentCheckpoints.param2 == false && this.lastRandomParam1 && param2Pushed == false) {
            param2Pushed = true;
            possibilities.push(() => {
              generateCheckpointValue = (myObj) => {
                checkpointValue = shuffle([...this.stageBuilder.param2Range])[0];
                engine.divisionAnswer = checkpointValue;
                myObj.properties.checkpointValue = this.lastRandomParam1 * checkpointValue;
              }
            })
          }
        }

        if (this.stageBuilder.currentCheckpoints.operation == false) {
          possibilities.push(() => {
            generateCheckpointValue = (myObj) => {
              myObj.properties.checkpointValue = "÷";
            }
          })
        }
        if (this.stageBuilder.currentCheckpoints.readyToBeSolved == false) {
          possibilities.push(() => {
            generateCheckpointValue = (myObj) => {
              myObj.properties.checkpointValue = "=";
            }
          })
        }


        stage.objects.map(obj => {
          if (obj.properties.type == 'checkpoint') {
            tryPushParam2();

            if (lastNeighbour) {
              lastNeighbour.properties.nextCheckpoint = obj;
              obj.properties.previousCheckpoint = lastNeighbour;
            }

            if (possibilities.length == 0) {
              console.log("Erro! Sem possibilidade de checkpoints")
            }

            const currentPossibilityIdx = randomInt(0, possibilities.length);
            const currPossibility = possibilities[currentPossibilityIdx];
            currPossibility();
            possibilities.splice(currentPossibilityIdx, 1);

            lastNeighbour = obj;
            obj.properties.generateCheckpointValue = generateCheckpointValue;
            obj.properties.generateCheckpointValue(obj);
          }
        })
      },
      buildQuestion: (stage) => {
        // console.log(stage, 'Hora de construir a questão');

        var answerAmount = 0;
        stage.objects.map((obj, idx) => {
          if (obj.properties.type == 'result-option') {
            answerAmount++;
          }
        });

        var answerType = ['T'];
        while (answerType.length < answerAmount) {
          answerType.push('F');
        }
        answerType = shuffle(answerType);

        const param1 = this.stageBuilder.currentCheckpoints.param1;
        const param2 = this.stageBuilder.currentCheckpoints.param2;
        const expectedAnswer = param2 / param1;

        this.stageBuilder.expectedAnswer = expectedAnswer;

        var resultPool = [];
        stage.objects.map(obj => {
          if (obj.properties.type == 'result-option') {
            resultPool.push(obj);
          }
        });

        var idx = 0;
        var usedWrongAnswers = [];

        var candidates = [];
        // candidates.push(param1 + expectedAnswer);
        // if (param1 != expectedAnswer)
        //   candidates.push(Math.abs(param1 - expectedAnswer));

        // debugger;

        stage.objects.map(obj => {
          if (obj.properties.type == 'result-option') {
            obj.properties.allResults = resultPool;

            if (answerType[idx] == 'T') {
              obj.properties.checkpointValue = expectedAnswer;
            }
            else {

              const limit = 3;
              var tries = 0;
              var newWrongAnswer = undefined;

              do {
                if (tries >= limit || candidates.length == 0) {
                  const newCandidate = randomInt(Math.ceil(Math.min(param1, (param2 / param1)) / 2), Math.min(param1, (param2 / param1)) * 4);
                  if (usedWrongAnswers.indexOf(newCandidate) == -1)
                    candidates.push(newCandidate);
                }

                newWrongAnswer = candidates[randomInt(0, candidates.length)];
                tries++;
              } while (newWrongAnswer == expectedAnswer || newWrongAnswer == undefined)
              candidates.remove(newWrongAnswer);
              usedWrongAnswers.push(newWrongAnswer);
              obj.properties.checkpointValue = newWrongAnswer;
            }

            idx++;
          }
        });
      }
    })
    this.layoutManager = new ObjectLayoutReader({
      velocidade: 3.25,
      canvas: this.canvas,
      ctx: this.ctx,
      currentDificultyLevel: 0,
      currentLayoutIdx: 0,
      currentOffset: { x: 0, y: this.canvas.height * 0.33 },
      layoutSrc: '../../data/stage0.tmx',
      imgScale: 0.5,
      coordScale: 2,
      layoutsToUse: [
        { name: 'Challenge 1' },
        // { name: 'Challenge 2' },
        // { name: 'Challenge 3' }
      ],
      objectPrefabs: [
        //pink-crystal
        {
          typename: 'pink-crystal', image: safiraDaSabedoria, scale: 0.10, pivot: { x: 0.5, y: 0.5 },
          update: (item) => {

          },
          oncollect: (item) => {
            onColetarCrystal(5, item);
            return true;
          }
        },
        //crystal
        {
          typename: 'crystal', image: crystalDaRiqueza, scale: 0.15, pivot: { x: 0.5, y: 0.5 },
          update: (item) => {

          },
          oncollect: (item) => {
            onColetarCrystal(1, item);
            return true;
          }
        },
        //checkpoint
        {
          typename: 'checkpoint', image: Nuvem1, scale: 0.15, pivot: { x: 0.48, y: 0.5 },
          update: (item) => {
            var fontSize = 28;
            this.ctx.font = "bold " + fontSize + "px sans-serif";
            this.ctx.fillStyle = "#000";
            this.ctx.textBaseline = "middle";
            this.ctx.textAlign = "center";

            // console.log(item)

            this.ctx.fillText(
              item.properties.checkpointValue,
              item.rectCollider.x + item.rectCollider.w * 0.5,
              item.rectCollider.y + item.rectCollider.h * 0.55,
              200
            );

          },
          ondestroy: (item) => {
            // console log("o jogador não conseguiu coletar este item", item);

            // const advanceCheckpointValues = (checkpoint) => {
            //   if (checkpoint.properties.nextCheckpoint) {
            //     advanceCheckpointValues(checkpoint.properties.nextCheckpoint)
            //   }
            //   if (checkpoint.properties.previousCheckpoint) {
            //     checkpoint.properties.generateCheckpointValue = checkpoint.properties.previousCheckpoint.properties.generateCheckpointValue;
            //     checkpoint.properties.generateCheckpointValue(checkpoint);
            //   }
            // }
            // advanceCheckpointValues(item);
          },
          personalRender: (item) => {

          },
          oncollect: (item) => {
            // consolelog('checkpoint coletado', item.properties.checkpointValue)
            // consolelog('checkpoint coletado', item)

            // Dá play num som
            if (sounds.sfx.checkpointPickup) {
              sounds.sfx.checkpointPickup.currentTime = 0;
              sounds.sfx.checkpointPickup.play();
              sounds.sfx.checkpointPickup.muted = false;
            }

            this.stageBuilder.onCollectCheckpointPiece(item);
          }
        },
        // result option
        {
          typename: 'result-option', image: nuvemIris, scale: 0.20, pivot: { x: 0.48, y: 0.46 },
          update: (item) => {
            var fontSize = 32;
            this.ctx.font = "bold " + fontSize + "px sans-serif";
            this.ctx.fillStyle = "#000";
            this.ctx.textBaseline = "middle";
            this.ctx.textAlign = "center";

            // console.log(item)

            this.ctx.fillText(
              item.properties.checkpointValue,
              item.rectCollider.x + item.rectCollider.w * 0.6,
              item.rectCollider.y + item.rectCollider.h * 0.5,
              200
            );
          },
          destroy: (item) => {
            // console.log(item);
            item.activeCollider = false;
            item.mustRender = false;
          },
          ondestroy: (item) => {
            // console log("o jogador não conseguiu coletar este item", item);

            // const advanceCheckpointValues = (checkpoint) => {
            //   if (checkpoint.properties.nextCheckpoint) {
            //     advanceCheckpointValues(checkpoint.properties.nextCheckpoint)
            //   }
            //   if (checkpoint.properties.previousCheckpoint) {
            //     checkpoint.properties.generateCheckpointValue = checkpoint.properties.previousCheckpoint.properties.generateCheckpointValue;
            //     checkpoint.properties.generateCheckpointValue(checkpoint);
            //   }
            // }
            // advanceCheckpointValues(item);
          },
          personalRender: (item) => {

          },
          oncollect: (item) => {
            // consolelog('resposta coletado', item.properties.checkpointValue)
            // console.log('resposta coletado', item)
            const valorRespostaColetada = item.properties.checkpointValue;
            const operationString = this.stageBuilder.currentCheckpoints.param1 + ' x ' + this.stageBuilder.currentCheckpoints.param2;
            // console.log('R = ' + valorRespostaColetada);

            // this.stageBuilder.onCollectCheckpointPiece(item);
            if (valorRespostaColetada == this.stageBuilder.expectedAnswer) {
              onAcertarQuestao(valorRespostaColetada, this.stageBuilder.expectedAnswer, operationString);
            }
            else {
              onErrarQuestao(valorRespostaColetada, this.stageBuilder.expectedAnswer, operationString, item);
            }
          }
        }
      ],
      chooseNextChallenge: () => {
        this.stageBuilder.chooseNextChallenge();
      },
    });
    this.layoutManager.readChallenges();

    // === Set HUD
    this.crystalCounter = new HUDCounter(0, 'txt_qtd-moedas');
    this.frag = new FragManager();
    this.heartHUD = new HeartHUD(5, ['#vida1', '#vida2', '#vida3', '#vida4', '#vida5'], args => { onGameOver() }, 5); // this.heartHUD = new HeartHUD(3, ['#vida1', '#vida2', '#vida3']);
    this.acertosHUD = new AcertosHUD('.q-slot', 0, () => { this.onWinGame(); })
    this.rocketCounterHUD = new RocketCounterHUD('#rocket-counter', 3); //Contador regressivo
    // loadPreviousStageData();

    // === Eventos importantes no jogo
    const onAcertarQuestao = (answerGiven, rightAnswer, questionString) => {
      this.frag.incluirAcerto({
        questionString: questionString,
        rightAnswer: rightAnswer,
        answerGiven: answerGiven
      });

      this.acertosHUD.pushRightQuestion();
      // this.heartHUD.applyDamage(-1);

      this.stageBuilder.param2Range.splice(this.stageBuilder.param2Range.indexOf(answerGiven), 1);
      this.stageBuilder.resetCheckpointCounter();
      this.lastRandomParam1 = undefined;
      this.stageBuilder.chooseNextChallenge();

      this.acertosHUD.updateHUD();

      if (sounds.sfx.rightAnswer) { // Dá play num som
        sounds.sfx.rightAnswer.currentTime = 0;
        sounds.sfx.rightAnswer.play();
        sounds.sfx.rightAnswer.muted = false;
      }
    }
    const onErrarQuestao = (answerGiven, rightAnswer, questionString, itemCollected) => {
      this.frag.incluirErro({
        questionString: questionString,
        rightAnswer: rightAnswer,
        answerGiven: answerGiven
      });

      // this.acertosHUD.pushWrongQuestion();
      this.stageBuilder.chooseNextChallenge();
      // if (itemCollected.allResults) {
      // itemCollected.properties.allResults.map(result => {
      //   // console.log(;
      //   // result.destroy(result);
      //   // result.properties.forceNoRender = true;

      //   // result.y -= 150;
      //   // result.properties.xaimba = 'U'
      //   // result.mustRender = false;
      //   // result.activeCollider = false;
      // })
      // // console.log(itemCollected);
      // console.log('==========================');
      // }

      this.heartHUD.applyDamage(1);
      this.heartHUD.updateHUD();

      this.layoutManager.estado = 'challenge';

      if (sounds.sfx.wrongAnswer) { // Dá play num som
        sounds.sfx.wrongAnswer.currentTime = 0;
        sounds.sfx.wrongAnswer.play();
        sounds.sfx.wrongAnswer.muted = false;
      }
    }
    const onColetarCrystal = (crystalValue, col) => {
      col.mustRender = true;
      col.activeCollider = false;
      const icon = document.querySelector('#crystal-icon');
      var clientRectangle = icon.getBoundingClientRect();
      col.animateToCounter = {
        rect: clientRectangle,
        speed: 10,
      };

      // consolelog('frag change:', this.frag);

      // console.log(clientRectangle); //or left, right, bottom

      switch (crystalValue) {
        case 1:
          this.crystalCounter.increase(1);

          if (sounds.sfx.crystalPickup) {
            sounds.sfx.crystalPickup.currentTime = 0;
            sounds.sfx.crystalPickup.play();
            sounds.sfx.crystalPickup.muted = false;
            sounds.sfx.crystalPickup.volume = 0.35;
          }
          break;
        case 5:
          this.crystalCounter.increase(5);

          if (sounds.sfx.safiraPickup) {
            sounds.sfx.safiraPickup.currentTime = 0;
            sounds.sfx.safiraPickup.play();
            sounds.sfx.safiraPickup.muted = false;
            sounds.sfx.safiraPickup.volume = 0.45;
          }
          break;

        default:
          break;
      }


    }
    const onColetarCheckpoint = (checkpointValue, col) => {

    }
    const onGameOver = () => {
      engineLife++;
      this.ceu.mayRise = false;
      this.spaceship.turnedOn = false;
      this.layoutManager.mayRise = false;

      document.querySelector('.gameover-screen').style.display = 'flex'; //Exibe tela de gameover

      // Checa se jogador tem dinheiro o suficiente para reviver
      if (this.crystalCounter.counter < revivePrice) {
        document.querySelector(".continuar-button").style.display = 'none'
      } else {
        document.querySelector(".continuar-button").style.display = 'flex'
      }

      // sounds.sfx.nakaOST.play();
      // this.engineSoundOn = false;
    }
    this.onPauseGame = () => {
      this.gamepaused = true;
      // console.log('pause')
      document.querySelector('.pause-btn').style.display = 'none'; //Bloqueia botão de pausa
      document.querySelector('.pause-screen').style.display = 'flex'; //Exibe tela de pausa

      setRising(false)
    }
    this.onUnpauseGame = () => {
      this.gamepaused = false;
      // console.log('unpause')
      document.querySelector('.pause-btn').style.display = 'flex'; //Libera botão de pausa
      document.querySelector('.pause-screen').style.display = 'none'; //Esconde tela de pausa

      setRising(true)
    }
    this.onWinGame = () => {
      document.querySelector('.result-screen').style.display = 'flex'; //Exibe a tela de resultado

      // var percentage = (this.acertosHUD.slots.length + this.heartHUD.hearts) / (this.acertosHUD.slots.length + this.heartHUD.maxHearts)
      var percentage = this.frag.getPercentage();
      document.querySelector('#nota-final').innerHTML = percentage.toFixed(0) + '%';

      console.log("You're a win!");
      setRising(false);
    }
    this.tryToBuyRevive = () => {
      if (this.crystalCounter.counter >= revivePrice) {
        this.crystalCounter.decrease(revivePrice);
        this.onRevive();
      }
    }
    this.onRevive = () => {
      this.heartHUD.recoverDamage(3);
      document.querySelector('.gameover-screen').style.display = 'none'; //Exibe tela de gameover
      setRising(true)
    }
    this.onResetGame = () => {
      // document.querySelector('.result-screen').style.display = 'none'; //Esconde a tela de resultado
      this.closeAllScreens();
      this.firstFrame();
    }
    this.closeAllScreens = () => {
      document.querySelector('.pause-screen').style.display = 'none'; //Esconde tela
      document.querySelector('.gameover-screen').style.display = 'none';
      document.querySelector('.result-screen').style.display = 'none';
      document.querySelector('.menu-screen').style.display = 'none';
    }
    this.irParaMenuPrincipal = () => {
      this.hasGameloop = false;
      onGameOver();
      this.onPauseGame();
      this.changeState(engineStates.WAITING_NEW_SCENE);
      this.closeAllScreens();
      document.querySelector('.menu-screen').style.display = 'flex'; //Esconde tela de menu
    }

    var setRising = (boolean = true) => {
      this.spaceship.turnedOn = boolean;
      this.ceu.mayRise = boolean;
      this.layoutManager.mayRise = boolean;
    }
    this.spaceship.turnedOn = true;
    this.ceu.mayRise = true;

    // =========================== Filminho inicial
    var lancarFoguete = () => {
      setTimeout(() => {
        document.querySelector('.pause-btn').style.display = 'flex';
        document.querySelector('.info-btn').style.display = 'flex';
        setRising(true)
        this.spaceship.keepPosition = true;
        this.onUnpauseGame();
        // sounds.sfx.nakaOST.play();
        this.engineSoundOn = true;
      }, 100);
    }
    var filminhoInicial = () => {
      if (this.layoutManager.hasLoaded) {
        console.log('filminhoInicial');
        this.rocketCounterHUD.start(() => {
          lancarFoguete();
        })
      } else {
        setTimeout(() => {
          filminhoInicial();
        }, 10);
      }
    }
    filminhoInicial();
  }

  update(deltaTime) {
    // console.log(this.currentScene)
    this.generalScale = 1;
    this.layoutIsMobile = window.mobileAndTabletCheck();

    if (this.currentScene == 'fase1') {
      // Define number of Lanes for Layout
      // Advance or Generate Layout
      if (this.gamepaused != true) {
        if (this.analogic && this.analogic.draging) {
          this.spaceship.readTouchMovimentation(this.analogic);
        } else {
          this.spaceship.readMovimentation(this.inputManager, { up: InputManager.Keys.Up_Arrow, left: InputManager.Keys.Left_Arrow, right: InputManager.Keys.Right_Arrow, down: InputManager.Keys.Down_Arrow }) //Update Ship Movimentation By Keys
        }
        this.spaceship.fisica(deltaTime);


        //Update Colliders
        if (this.spaceship.rectCollider) {
          var collisions = this.layoutManager.checkcollision(this.spaceship.rectCollider); //Check Ship Collisions with Collectibles and Checkpoints      
          collisions.map(col => {
            if (!col.oncollect(col)) {
              col.mustRender = false;
              col.activeCollider = false;
            }
          })
        }
        //Check Ship Collisions with Hazards
        //Check Ship Collisions with Colliders
        if (this.crystalCounter)
          this.crystalCounter.updateHUD();
      }

      this.engineAudioLoop(); //Control Ship Sound

      this.tryRenderThings();
    }
  }

  tryRenderThings() {
    //Draw Cenario
    this.ceu.render(); // Sky BG    
    this.cloudFall.render(); //Clouds
    //Draw Enfeites    
    this.spaceship.drawNave(); //Draw Spaceship
    this.layoutManager.render(); //Draw Stage Layout
    //Obstacles 
    //Pickups    
    //Draw Equation Progress
    //Draw Score
    // this.DesenhaFPS();

    this.analogic.render();
  }

  DesenhaFPS() {
    var fontSize = 36;
    this.ctx.font = fontSize + "px sans-serif";
    this.ctx.textBaseline = "middle";
    this.ctx.textAlign = "left";
    this.ctx.fillStyle = "#FFFFFF";
    this.ctx.strokeStyle = "#000000";
    this.ctx.lineWidth = 1;

    var mediaFPS = 0;
    var mediaDeltaTime = 0;

    this.fpsBuffer.map(amostra => {
      mediaFPS += amostra.fps;
      mediaDeltaTime += amostra.deltaTime;
    })

    if (this.fpsBuffer.length > 0) {
      mediaFPS = mediaFPS / this.fpsBuffer.length;
      mediaDeltaTime = mediaDeltaTime / this.fpsBuffer.length;
    }

    // this.ctx.fillText(mediaFPS.toFixed(0) + ' FPS, ' + (mediaDeltaTime * 1000).toFixed(1) + 'ms, ', 15, 25, this.canvas.width);
    // this.ctx.strokeText(mediaFPS.toFixed(0) + ' FPS, ' + (mediaDeltaTime * 1000).toFixed(1) + 'ms, ', 15, 25, this.canvas.width);

    this.ctx.fillText(this.fps.toFixed(0) + ' FPS', 15, 25, this.canvas.width);
    this.ctx.strokeText(this.fps.toFixed(0) + ' FPS', 15, 25, this.canvas.width);
  }

  engineAudioLoop() {
    if (this.engineSoundOn != true) {
      return;
    }
    if (!this.engineCounter) {
      this.engineCounter = 0;
      // sounds.sfx.engineloop1.play();
      // sounds.sfx.engineloop2.play();
      // sounds.sfx.engineloop1.onended = (event) => {
      //   sounds.sfx.engineloop1.play();
      // }
      // sounds.sfx.engineloop2.onended = (event) => {
      //   sounds.sfx.engineloop2.play();
      // }
    }

    const generalRocketSound = 0.15;
    var isPlaying = function (myaudio) {
      return myaudio
        && myaudio.currentTime > 0
        && !myaudio.paused
        && !myaudio.ended
        && myaudio.readyState > 2;
    }
    if (!isPlaying(sounds.sfx.engineloop1)) {
      // console.log('play!', sounds.sfx.engineloop1)
      // if (Math.abs(this.spaceship.speed.x) > 0.5) {
      if (sounds.sfx.engineloop1.currentTime > 0.6) {
        sounds.sfx.engineloop1.currentTime = 0;
        // sounds.sfx.engineloop1.play();
        sounds.sfx.engineloop1.muted = false;
        sounds.sfx.engineloop1.volume = 0.5;
      }
      // }

      if (!sounds.sfx.engineloop2.hasPlayedFirstTime && !sounds.sfx.engineloop2.hasPlayedFirstTimePromisse) {
        sounds.sfx.engineloop2.hasPlayedFirstTimePromisse = true;
        setTimeout(() => {
          sounds.sfx.engineloop2.hasPlayedFirstTime = true;
          sounds.sfx.engineloop2.currentTime = 0;
          // sounds.sfx.engineloop2.play();
          sounds.sfx.engineloop2.muted = false;
          sounds.sfx.engineloop2.loop = true;
        }, sounds.sfx.engineloop1 * 0.5 * 1000 * 456789)
      }
    }

    if (sounds.sfx.engineloop2.hasPlayedFirstTime) {
      // if (this.spaceship.speed.y <= -0.05) {
      if (sounds.sfx.engineloop2.currentTime > 0.6) {
        sounds.sfx.engineloop2.currentTime = 0;
        // sounds.sfx.engineloop2.play();
      }
      // }
    }

    // sounds.sfx.engineloop2.play();
    sounds.sfx.engineloop1.volume = Math.abs((Math.cos(degrees_to_radians((this.engineCounter % 360))) + 1)) * 0.15 * generalRocketSound;
    // sounds.sfx.engineloop1.volume = 0;
    sounds.sfx.engineloop2.volume = 0.5 * generalRocketSound;
    // sounds.sfx.engineloop2.volume = 0;

    const speedXRate = (Math.abs(this.spaceship.speed.x) / this.spaceship.maxSpeed.x) * 0.6;
    sounds.sfx.engineloop1.volume += sounds.sfx.engineloop1.volume * speedXRate;
    sounds.sfx.engineloop2.volume += sounds.sfx.engineloop2.volume * speedXRate;

    this.engineCounter += Math.PI;
  }
  // ==================================
}

// ===========================================================================================================

const forceFullscreen = true;
var forcedOrientation = undefined;
canvas.addEventListener("click", function () {
  if (!document.fullscreenElement && forceFullscreen) {
    openFullscreen(document.querySelector('body'));
    // return;
    if (forcedOrientation) {
      if (screen.orientation.lock) {
        screen.orientation.lock(forcedOrientation);
      }
      else {
        screen.lockOrientationUniversal = screen.orientation.lock || screen.lockOrientation || screen.mozLockOrientation || screen.msLockOrientation;
        screen.lockOrientationUniversal(forcedOrientation)
      }
    }
  }
}, false);

// ========================================= Carrega recursos
var sheetLoader = new SheetLoader();
// Scenery
const bg = sheetLoader.queueSheet('../../img/stage1/bg-foguete.png');
const nuvem_cenario = sheetLoader.queueSheet('../../img/stage1/nuvem_cenario.png');
const estrela = sheetLoader.queueSheet('../../img/stage1/Estrela.png');
// const plataforma = sheetLoader.queueSheet('../../img/stage1/Plataforma.png');
// const campo = sheetLoader.queueSheet('../../img/stage1/campo.png');
// const montanha1 = sheetLoader.queueSheet('../../img/stage1/Montanha1.png');
// const montanha2 = sheetLoader.queueSheet('../../img/stage1/Montanha2.png');
// const montanha3 = sheetLoader.queueSheet('../../img/stage1/Montanha3.png');
// const montanha4 = sheetLoader.queueSheet('../../img/stage1/Montanha4.png');
// const montanha5 = sheetLoader.queueSheet('../../img/stage1/Montanha5.png');
// const montanha6 = sheetLoader.queueSheet('../../img/stage1/Montanha6.png');

// Player's Rocket
const spaceBus = sheetLoader.queueSheet('../../img/stage1/SpaceBus.png');
const rocketFire = sheetLoader.queueSheet('../../img/stage1/rocketFire.png');

// Coletáveis
const crystalDaRiqueza = sheetLoader.queueSheet('../../img/stage1/CristalDaRiqueza.png');
const safiraDaSabedoria = sheetLoader.queueSheet('../../img/stage1/SafiraDaSabedoria.png');
const chevronup = sheetLoader.queueSheet('../../img/stage1/chevron-up-solid.svg');
const nuvemIris = sheetLoader.queueSheet('../../img/stage1/Nuvem1.png');
const Nuvem1 = sheetLoader.queueSheet('../../img/stage1/nuvem-iris.png');

const analogicCircle = sheetLoader.queueSheet('../../img/ui/analogicCircle.png');

// ======================= Audio Loading
var sounds = {
  desbloqueados: false,
  sfx: {
    crystalPickup: document.getElementById("SFX-crystalPickup"),
    checkpointPickup: document.getElementById("SFX-checkpointPickup"),
    safiraPickup: document.getElementById("SFX-safiraPickup"),
    engineloop1: document.getElementById("SFX-engineLoop1"),
    engineloop2: document.getElementById("SFX-engineLoop2"),
    // nakaOST: document.getElementById("OST-naka"),
    rightAnswer: document.getElementById("SFX-rightAnswer"),
    wrongAnswer: document.getElementById("SFX-wrongAnswer"),
  },
  ost: {

  }
}
var ostStarted = false;
function startOST() {
  if (!ostStarted) {
    ostStarted = true;
    sounds.sfx.nakaOST.play();
    sounds.sfx.nakaOST.muted = false;
    sounds.sfx.nakaOST.play();
    sounds.sfx.nakaOST.muted = false;
    sounds.sfx.nakaOST.volume = 0.5;
  }
}
var ativarSounds = () => {
  startOST();
  engine.engineAudioLoop();

  if (!sounds.allSoundsDescloqueados) {
    var soundsToDesbloquear = 0;
    var soundsDesbloqueados = 0;
    for (var sound in sounds.sfx) {
      if (Object.prototype.hasOwnProperty.call(sounds.sfx, sound)) {
        soundsToDesbloquear++;
        if (!sound.desbloqueado) {
          soundsDesbloqueados++;
          sound.currentTime = 0.99 * sound.duration;
          sound.play();
          // sound.volume = 0.6;
          sound.muted = false;
          sound.desbloqueado = true;
        } else {
          soundsDesbloqueados++;
        }
      }
      if (soundsToDesbloquear == soundsDesbloqueados) {
        sounds.allSoundsDescloqueados = true;
      }
    }
  }
}

// window.addEventListener('load', () => {
//   // window.addEventListener('mousemove', () => {
//   //   // ativarSounds();
//   //   startOST();
//   // })
//   // window.addEventListener('touchstart', () => {
//   //   // ativarSounds();
//   //   startOST();
//   // })
// })

let engine = new GameEngine(canvas.getContext('2d'), canvas);
sheetLoader.loadSheetQueue(() => {
  if (debugEngine)
    console.log('Imagens carregadas!');
  engine.start();
  engine.onLoadStage(1)
});
