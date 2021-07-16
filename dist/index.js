(() => {
  // engine/System.ts
  var System = class {
    registerScene(parentScene) {
      this.$scene = parentScene;
    }
    draw(time, entities) {
    }
    update(time, entities) {
    }
    start(entities) {
    }
    cleanup(entity) {
    }
    end(entities) {
    }
  };

  // engine/Component.ts
  var Component = class {
    registerEntityId(id) {
      this.entityId = id;
    }
  };

  // engine/Components/Collider.Component.ts
  var Collider = class extends Component {
    constructor({
      width,
      height,
      isStatic = false,
      isRigid = false,
      onCollision = (target) => {
      }
    }) {
      super();
      this.width = width;
      this.height = height;
      this.isStatic = isStatic;
      this.isRigid = isRigid;
      this.onCollision = onCollision;
    }
    saveSafePosition(x, y) {
      this.safePosition = { x, y };
    }
    getSafePosition() {
      return this.safePosition;
    }
  };

  // engine/Utils/rounding.ts
  function roundFloat(num, places = 1e3) {
    return parseInt(`${num * places}`) / places;
  }

  // engine/Components/Position.Component.ts
  var Position = class extends Component {
    constructor({ x, y }) {
      super();
      this.x = x;
      this.y = y;
    }
    setPosition(x, y) {
      this.x = isNaN(x) ? this.x : x;
      this.y = isNaN(y) ? this.y : y;
    }
    transformation(x, y) {
      if (x === 0 && y === 0)
        return;
      this.setPosition(roundFloat(this.x + x), roundFloat(this.y + y));
    }
  };

  // engine/Systems/Collision.System.ts
  var Collision = class extends System {
    update(time, entities) {
      this.checkCurrentCollisions(entities);
    }
    checkCurrentCollisions(entities) {
      const entitiesWithCollidors = entities.filter((target) => target.getComponent(Collider) && !target.isDisabled);
      entitiesWithCollidors.forEach((source) => entitiesWithCollidors.filter((target) => target.id !== source.id).forEach((target) => {
        const collisionOccurred = this.checkCollision({
          collider: source.getComponent(Collider),
          position: source.getComponent(Position)
        }, {
          collider: target.getComponent(Collider),
          position: target.getComponent(Position)
        });
        if (collisionOccurred) {
          source.getComponent(Collider).onCollision(target, this.$scene);
        }
      }));
    }
    checkCollision(a, b) {
      if (a.position.x < b.position.x + b.collider.width && a.position.x + a.collider.width > b.position.x && a.position.y < b.position.y + b.collider.height && a.position.y + a.collider.height > b.position.y) {
        return true;
      }
      return false;
    }
  };

  // engine/Components/Input.Component.ts
  var Input = class extends Component {
    constructor({ config }) {
      super();
      this.config = {};
      this.config = config;
    }
  };

  // engine/Systems/Input.System.ts
  var InputManager = class extends System {
    constructor() {
      super(...arguments);
      this.inputs = {};
      this.handleKeyEvent = (event) => {
        const { key, type } = event;
        if (key in this.inputs) {
          if (type === "keydown")
            this.inputs[key].pressed = true;
          if (type === "keyup")
            this.inputs[key].pressed = false;
        }
      };
      this.start = (entities) => {
        entities.filter((entity) => entity.getComponent(Input)).forEach((entity) => {
          Object.entries(entity.getComponent(Input).config).forEach(([key, event]) => this.registerKey(key, event));
        });
        document.addEventListener("keydown", this.handleKeyEvent);
        document.addEventListener("keyup", this.handleKeyEvent);
      };
    }
    update(time, entities) {
      Object.entries(this.inputs).forEach((inputEntry) => {
        const entry = inputEntry[1];
        if (entry.pressed)
          entry.event(time);
      });
    }
    deleteKey(key) {
      delete this.inputs[key];
    }
    registerKey(key, event) {
      this.inputs = { ...this.inputs, [key]: { pressed: false, event } };
    }
    end() {
      document.removeEventListener("keydown", this.handleKeyEvent);
      document.removeEventListener("keyup", this.handleKeyEvent);
    }
  };

  // engine/Components/Movement.Component.ts
  var Movement = class extends Component {
    constructor({
      x,
      y,
      onStart = () => {
      },
      onStop = () => {
      }
    }) {
      super();
      this.x = x;
      this.y = y;
      this.onStart = onStart;
      this.onStop = onStop;
    }
    addSpeed(x, y) {
      this.x = roundFloat(this.x + x, 1e5);
      this.y = roundFloat(this.y + y, 1e5);
    }
    setSpeed(x, y) {
      this.x = x;
      this.y = y;
    }
    multiplySpeed(x, y) {
      this.x = roundFloat(this.x * x, 1e5);
      this.y = roundFloat(this.y * y, 1e5);
    }
    clearSpeed() {
      this.x = 0;
      this.y = 0;
    }
    isMoving() {
      return this.x === 0 && this.y === 0;
    }
  };

  // engine/Systems/Movement.System.ts
  var MovementSystem = class extends System {
    update(timeframe = 0, entities) {
      entities.filter((entity) => !!entity.getComponent(Position) && !!entity.getComponent(Movement) && !!entity.getComponent(Collider)).forEach((entity) => {
        const position = entity.getComponent(Position);
        const movement = entity.getComponent(Movement);
        const collider = entity.getComponent(Collider);
        const { x, y } = movement;
        const { x: currentX, y: currentY } = position;
        collider.saveSafePosition(currentX, currentY);
        position.transformation(x * timeframe, y * timeframe);
        movement.multiplySpeed(0.25, 0.25);
        if (movement.x + movement.y !== 0) {
          movement.onStart({ x, y });
        } else {
          movement.onStop();
        }
      });
    }
  };

  // engine/Components/Sprite.Component.ts
  var Sprite = class extends Component {
    constructor({ src, width = 1, height = 1 }) {
      super();
      this.src = src;
      this.width = width;
      this.height = height;
    }
    replaceSource(src) {
      if (src)
        this.src = src;
    }
  };

  // engine/Components/SpriteAnimation.Component.ts
  var SpriteAnimation = class extends Component {
    constructor(states, defaultState = "") {
      super();
      this.getState = () => this.states.find((searchElement) => searchElement.name === this.current);
      this.changeState = (newState) => {
        if (this.current !== newState) {
          this.current = newState;
        }
        return this.current;
      };
      this.nextState = () => {
        const currentState = this.getState();
        if (currentState.nextState)
          this.changeState(currentState.nextState);
      };
      this.clearTime = () => {
        this.animationTime = 0;
      };
      this.updateTime = (milliseconds) => {
        if (isNaN(milliseconds))
          return;
        this.animationTime = roundFloat(this.animationTime + milliseconds, 1);
      };
      this.updateStep = () => {
        const currentState = this.getState();
        this.animationStep += 1;
        if (currentState.frames.length <= this.animationStep) {
          this.animationStep = 0;
        }
      };
      this.getCurrentFrame = () => {
        const currentState = this.getState();
        return currentState.frames[this.animationStep];
      };
      this.animationStep = 0;
      this.animationTime = 0;
      this.states = states;
      this.current = defaultState || states[0].name;
    }
  };

  // engine/Systems/Animation.System.ts
  var AnimationSystem = class extends System {
    draw(time, entities) {
      entities.filter((entity) => !!entity.getComponent(SpriteAnimation)).forEach((entity) => {
        const animation = entity.getComponent(SpriteAnimation);
        const sprite = entity.getComponent(Sprite);
        const currentState = animation.getState();
        animation.updateTime(time);
        if (animation.animationTime > currentState.interval) {
          animation.updateStep();
          animation.clearTime();
        }
        const currentSrc = sprite.src;
        const currentFrame = animation.getCurrentFrame();
        if (currentSrc !== currentFrame) {
          sprite.replaceSource(currentFrame);
        }
      });
    }
  };

  // engine/Components/Tilemap.Component.ts
  var Tilemap = class extends Component {
    constructor(set, map) {
      super();
      this.set = null;
      this.map = [[]];
      this.set = set;
      this.map = map;
    }
  };

  // engine/Utils/canvasRendering.ts
  var ZOOM = parseInt(2) || 2;
  var TILE_SIZE = parseInt(16) || 16;
  var realTileSize = TILE_SIZE * ZOOM;
  function drawTileMap(ctx, map, tileset, offset) {
    const image = new Image();
    image.src = tileset.src;
    function getTile(col, row) {
      return map[row][col];
    }
    image.onload = () => {
      for (let c = 0; c < map[0].length; c++) {
        for (let r = 0; r < map.length; r++) {
          const tile = getTile(c, r);
          if (tile >= 0) {
            ctx.drawImage(image, tile % tileset.w * TILE_SIZE, Math.floor(tile / tileset.w) * TILE_SIZE, TILE_SIZE, TILE_SIZE, c * realTileSize + offset.x * realTileSize, r * realTileSize + offset.y * realTileSize, realTileSize, realTileSize);
          }
        }
      }
    };
  }

  // engine/Systems/Canvas.System.ts
  var ZOOM2 = parseInt(2) || 2;
  var CanvasRenderer = class extends System {
    constructor(width, height) {
      super();
      this.height = 300;
      this.width = 150;
      this.height = height;
      this.width = width;
    }
    drawTilemapsFromEntities(entities) {
      entities.filter((entity) => !!entity.getComponent(Tilemap) && !!entity.getComponent(Position)).forEach((entity) => {
        const tilemap = entity.getComponent(Tilemap);
        const position = entity.getComponent(Position);
        drawTileMap(this.ctx, tilemap.map, tilemap.set, position);
      });
    }
    start(entities) {
      const canvas = document.createElement("canvas");
      canvas.setAttribute("id", "CanvasRenderer");
      this.ctx = canvas.getContext("2d");
      canvas.setAttribute("width", `${this.width * ZOOM2}`);
      canvas.setAttribute("height", `${this.height * ZOOM2}`);
      this.drawTilemapsFromEntities(entities);
      document.getElementById("root").append(canvas);
    }
    end() {
      document.getElementById("CanvasRenderer").remove();
    }
  };

  // engine/GameLoop.ts
  var ZOOM3 = parseInt(2) || 2;
  var TILE_SIZE2 = parseInt(16) || 16;
  var ROOM_WIDTH = parseInt(20) || 20;
  var ROOM_HEIGHT = parseInt(12) || 12;
  var GameLoop = class {
    constructor(scenes = [], initialScene = scenes[0]) {
      this.getSystems = () => [
        ...this.coreSystems,
        ...this.currentScene.systems
      ];
      this.start = () => {
        this.getSystems().forEach((system) => {
          system.registerScene(this.currentScene);
          system.start(this.currentScene.entities);
        });
        console.log(this.currentScene);
        window.requestAnimationFrame(this.loop);
      };
      this.loop = (timestamp = 0) => {
        const progress = timestamp - this.lastRender;
        this.getSystems().forEach((system) => system.update(progress, this.currentScene.entities));
        this.getSystems().forEach((system) => system.draw(progress, this.currentScene.entities));
        this.lastRender = timestamp;
        window.requestAnimationFrame(this.loop);
      };
      this.end = () => {
        this.getSystems().forEach((system) => system.end(this.currentScene.entities));
      };
      this.coreSystems = [
        new CanvasRenderer(ROOM_WIDTH * TILE_SIZE2, ROOM_HEIGHT * TILE_SIZE2),
        new InputManager(),
        new MovementSystem(),
        new Collision(),
        new AnimationSystem()
      ];
      this.lastRender = 0;
      this.scenes = scenes;
      this.currentScene = initialScene;
    }
  };

  // client/src/constants.ts
  var ROOM_WIDTH2 = 20;
  var ROOM_HEIGHT2 = 12;

  // engine/Systems/PNGSpriteRender.System.ts
  var ZOOM4 = parseInt(2) || 2;
  var TILE_SIZE3 = parseInt(16) || 16;
  var SpriteRenderer = class extends System {
    constructor() {
      super(...arguments);
      this.start = (entities) => {
        entities.filter((entity) => !!entity.getComponent(Sprite)).forEach((entity) => {
          const sprite = document.createElement("img");
          this.updateSprite(sprite, entity);
          document.getElementById("root").append(sprite);
        });
      };
      this.updateSprite = (sprite, entity) => {
        if (entity.id)
          sprite.setAttribute("id", entity.id);
        const { x, y } = entity.getComponent(Position);
        const { src, width, height } = entity.getComponent(Sprite);
        sprite.classList.add(entity.tag);
        sprite.style.position = "absolute";
        sprite.style.left = `${Math.floor(x * ZOOM4 * TILE_SIZE3)}px`;
        sprite.style.top = `${Math.floor(y * ZOOM4 * TILE_SIZE3)}px`;
        sprite.style.width = `${Math.floor(width * ZOOM4 * TILE_SIZE3)}px`;
        sprite.style.height = `${Math.floor(height * ZOOM4 * TILE_SIZE3)}px`;
        sprite.style.display = "block";
        sprite.src = src;
      };
    }
    draw(time, entities) {
      entities.filter((entity) => entity.getComponent(Sprite)).forEach((entity) => {
        const { isDisabled } = entity;
        const sprite = document.getElementById(entity.id);
        if (!sprite)
          return;
        if (!isDisabled)
          this.updateSprite(sprite, entity);
        if (isDisabled)
          this.hideSprite(sprite);
      });
    }
    hideSprite(sprite) {
      sprite.style.display = "none";
    }
    cleanup(entity) {
      if (entity.getComponent(Sprite)) {
        document.getElementById(entity.id).remove();
      }
    }
    end(entities) {
      entities.forEach(this.cleanup);
    }
  };

  // engine/Utils/dice.ts
  function rollDice(min, max) {
    return min - 1 + Math.ceil(Math.random() * (max - min + 1));
  }

  // engine/Scene.ts
  var Scene = class {
    constructor(targetId, entities = [], systems = []) {
      this.addEntity = (newEntity) => {
        this.entities.push(newEntity);
      };
      this.removeEntity = (EntityId) => {
        const assertEntity = (entity) => entity.id === EntityId;
        this.systems.forEach((system) => {
          system.cleanup(this.entities.find(assertEntity));
        });
        this.entities = this.entities.filter((e) => !assertEntity(e));
      };
      this.addSystem = (newSystem) => {
        newSystem.registerScene(this);
        this.systems.push(newSystem);
      };
      this.target = document.getElementById(targetId);
      this.entities = entities;
      this.systems = systems;
      return this;
    }
  };

  // node_modules/uuid/dist/esm-browser/rng.js
  var getRandomValues;
  var rnds8 = new Uint8Array(16);
  function rng() {
    if (!getRandomValues) {
      getRandomValues = typeof crypto !== "undefined" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto !== "undefined" && typeof msCrypto.getRandomValues === "function" && msCrypto.getRandomValues.bind(msCrypto);
      if (!getRandomValues) {
        throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
      }
    }
    return getRandomValues(rnds8);
  }

  // node_modules/uuid/dist/esm-browser/regex.js
  var regex_default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;

  // node_modules/uuid/dist/esm-browser/validate.js
  function validate(uuid) {
    return typeof uuid === "string" && regex_default.test(uuid);
  }
  var validate_default = validate;

  // node_modules/uuid/dist/esm-browser/stringify.js
  var byteToHex = [];
  for (var i = 0; i < 256; ++i) {
    byteToHex.push((i + 256).toString(16).substr(1));
  }
  function stringify(arr) {
    var offset = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
    var uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
    if (!validate_default(uuid)) {
      throw TypeError("Stringified UUID is invalid");
    }
    return uuid;
  }
  var stringify_default = stringify;

  // node_modules/uuid/dist/esm-browser/v4.js
  function v4(options, buf, offset) {
    options = options || {};
    var rnds = options.random || (options.rng || rng)();
    rnds[6] = rnds[6] & 15 | 64;
    rnds[8] = rnds[8] & 63 | 128;
    if (buf) {
      offset = offset || 0;
      for (var i = 0; i < 16; ++i) {
        buf[offset + i] = rnds[i];
      }
      return buf;
    }
    return stringify_default(rnds);
  }
  var v4_default = v4;

  // engine/Entity.ts
  var Entity = class {
    constructor({
      id = v4_default(),
      x = 0,
      y = 0,
      tag = "",
      components = {},
      isDisabled = false
    }) {
      this.id = id;
      this.tag = tag;
      this.components = { ...components };
      this.isDisabled = isDisabled;
      this.addComponent(new Position({ x, y }));
    }
    getComponent(componentClass) {
      return this.components[componentClass.name];
    }
    addComponent(component) {
      this.components[component.constructor.name] = component;
      component.registerEntityId(this.id);
      return this;
    }
    removeComponent(component) {
      delete this.components[component.name];
      return this;
    }
    setDisabled(newState) {
      this.isDisabled = newState;
    }
  };

  // client/src/Sprites/coin/coin.png
  var coin_default = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAMCAYAAACulacQAAAAjUlEQVQoU43QOwoCUQxG4S+jjO5CwQVY+ujcuZ3aCFY2osvQQeHK3BkfiIgpUuRwQv6EHxV/wbRWoXR2jYWylp5mWktOGBDzZp5bWrno6jlgiEIVE/0GbiRH7DB+2Q3cSgrsMaoHxEQ8zIuiXVvDmyrm7dps1wd1MhCzt4MyXKr0c4RrTD+ifHvGzw/dAV6sJg3uHSMDAAAAAElFTkSuQmCC";

  // client/src/Objects/Coin.ts
  var Coin = class extends Entity {
    constructor({ x = 3, y = 3 }) {
      super({ id: v4_default(), x, y, tag: "coin" });
      const [width, height] = [0.3, 0.5];
      const coinSprite = new Sprite({ src: coin_default, width, height });
      const coinCollider = new Collider({ width, height, isStatic: false });
      this.addComponent(coinSprite);
      this.addComponent(coinCollider);
    }
  };

  // client/src/Components/Coins.Component.ts
  var Coins = class extends Component {
    constructor(initialCoins) {
      super();
      this.value = 0;
      this.value = initialCoins;
    }
    earnCoins(value) {
      this.value += value;
    }
    spendCoins(value) {
      this.value -= value;
    }
  };

  // client/src/Systems/SystemCoinMeter.ts
  var SystemCoinMeter = class extends System {
    update(time, entities) {
      entities.filter((entity) => entity.tag === "player").forEach((entity) => {
        if (entity.getComponent(Coins)) {
          const meter = document.getElementById("player-coins-meter");
          if (meter.childElementCount < entity.getComponent(Coins).value) {
            meter.innerHTML = ``;
            let i = 0;
            while (i < entity.getComponent(Coins).value) {
              meter.innerHTML += `<img src="${coin_default}"/>`;
              i++;
            }
          }
        }
      });
    }
    start() {
      const meter = document.createElement("div");
      meter.setAttribute("id", "player-coins-meter");
      document.getElementById("root").append(meter);
    }
    end() {
      const meter = document.getElementById("player-coins-meter");
      meter.remove();
    }
  };

  // client/src/Objects/Doorway.ts
  var DoorwayDirection;
  (function(DoorwayDirection2) {
    DoorwayDirection2[DoorwayDirection2["Vertical"] = 0] = "Vertical";
    DoorwayDirection2[DoorwayDirection2["Horizontal"] = 1] = "Horizontal";
  })(DoorwayDirection || (DoorwayDirection = {}));
  var Doorway = class extends Entity {
    constructor({ x = 0, y = 1, direction = 1 }) {
      super({ tag: "doorway", x, y });
      let width = 1;
      let height = 1;
      if (direction === 0)
        width = 0.1, height = 2;
      if (direction === 1)
        width = 2, height = 0.1;
      this.addComponent(new Collider({ width, height, isRigid: true }));
    }
  };

  // engine/Assets/Tileset.ts
  var Tileset = class {
    constructor({
      src = "",
      width = 11,
      height = 3,
      tileSize = 16
    }) {
      this.src = src;
      this.w = width;
      this.h = height;
      this.tileSize = tileSize;
    }
  };

  // client/src/Tilesets/bricks.png
  var bricks_default = "data:image/png;base64,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";

  // client/src/Tilesets/bricks.ts
  var BricksTileset = new Tileset({ src: bricks_default, width: 11, height: 3, tileSize: 16 });
  var bricks_default2 = BricksTileset;

  // client/src/Objects/Floor.ts
  var Floor = class extends Entity {
    constructor() {
      super({ tag: "floor" });
      const rows = Array.from(Array(ROOM_HEIGHT2), () => new Array(ROOM_WIDTH2).fill(-1));
      rows[0][0] = 0;
      rows[0][ROOM_WIDTH2 - 1] = 2;
      rows[ROOM_HEIGHT2 - 1][0] = 22;
      rows[ROOM_HEIGHT2 - 1][ROOM_WIDTH2 - 1] = 24;
      this.addComponent(new Tilemap(bricks_default2, rows));
    }
  };

  // client/src/Sprites/Link/1.png
  var __default = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAQCAYAAADJViUEAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAG3RFWHRTb2Z0d2FyZQBDZWxzeXMgU3R1ZGlvIFRvb2zBp+F8AAAA5UlEQVQoz4WTMRKCMBBFfyottWS4AqVH0OEKFDo0HMvGofEKGTgCJUeQsaSFKhZkwxI2MVXY7Nu/2R+UMQb+0nOyDwLID1/Fv5UPh0CpwAq/bgZlo/ScmKyaRLB/HhfY5u7g4XGOKqf1GIABDG2H9HqBLnrk72y5it3TGQBEYZ4oxbYwK/BvDW2HtB63ME2a2h3abrmnVdNFDwDIqmmFpSG59qgwA51Vn/vJUDIpcWt2PtvBOZir8FZpT0XoOpQXVCa7/AfDhaKwr8xbR9koB0sDoyHF37bgL3kJYOMGxcS/KpQorR/nELe8z7FStgAAAABJRU5ErkJggg==";

  // client/src/Sprites/Link/2.png
  var __default2 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAQCAYAAADJViUEAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAG3RFWHRTb2Z0d2FyZQBDZWxzeXMgU3R1ZGlvIFRvb2zBp+F8AAAA2ElEQVQoz42TMQ7CMAxFnamMMFa9QkaOAMoVOsDWY7Egll4hEkdg7BFAHVnbyR0iW46dFjxVqt/3d37iEBFKFec6+xGq0ekeJ+HP9ZABw21nRKUIwxrUAqH3ENshE9mcTNWcjmkVAQMAuPdlj83jm6zczxjbAULvk9jzxaCEQzW6ONeYYNEgAf1Na9DeZnLJNoEAANz7C9Y76rjYtlQvRUTlu4mnG1iCdHDkwndTZp9tU0xrsHRmYJl1SeBvuHTDyHIWlX4Y+kGslbmeJl/lQjosTt665xpeAHwfpnWK4RodAAAAAElFTkSuQmCC";

  // client/src/Sprites/Link/3.png
  var __default3 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAQCAYAAAAiYZ4HAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAG3RFWHRTb2Z0d2FyZQBDZWxzeXMgU3R1ZGlvIFRvb2zBp+F8AAAAyUlEQVQoz5WSMRKCMBBF/1ZSaunkCik5QhiuYKFDw7EoYGy4AgNHoOQIMpa2WK2FbggSEH+VZPfN/t0NMTNE1fM4XhzFuzvJmQRYSv6GiHPDSGraBBQRE+eGq1OHLYpL/a7QNy26LFhN1ukAZcKPJQB90wLADNTpAABQJnSaLiIWwIUk2QJJTcTM6C8H7rJgkuBKYur6ILqd9+yz4rX1N2BCWEtr0AyQpa31EJd6nNKvLbvbnlhasiUTshVcQKYBwL7LffJbfUGfXndEiyTKktX3AAAAAElFTkSuQmCC";

  // client/src/Sprites/Link/4.png
  var __default4 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAPCAYAAADUFP50AAAACXBIWXMAAC4jAAAuIwF4pT92AAAAG3RFWHRTb2Z0d2FyZQBDZWxzeXMgU3R1ZGlvIFRvb2zBp+F8AAAA5ElEQVQoz3WSPRKCMBBGv62w1E6HK1B6BGdyBQodG45lR8MRyMARLHMEGUraUK2FLmxC2Co/+5K32RAzIw47X4JFk40U55AGYwAAisoH87yeaAE1YJoCtnRJSMPU+nOo1RQAgKF/70IAQK0/s8lGklsFFDi/XX9llO639+woqNHOFxY1SdagHm8eZ3iclolOCuLZ0fA4McXt2LRCqSdBrepeB6TqFZOhf6+qWjOla0uHovIhqG9LgbqveT2tqlJXDIuyhsSOPvcjx0l73829DjDZSAG4B6cOyuuJiJnD/v11dKT2v8JqqgZtM480AAAAAElFTkSuQmCC";

  // client/src/Sprites/Link/5.png
  var __default5 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAAQCAYAAADNo/U5AAAACXBIWXMAAC4jAAAuIwF4pT92AAAAG3RFWHRTb2Z0d2FyZQBDZWxzeXMgU3R1ZGlvIFRvb2zBp+F8AAAA20lEQVQoz4WSsRGDMAxFpSopk5LzCi4zQjhWoEiOhrHScDSs4IMRKBkhvpS0UCmFLSKDIap0tp70/WUkIpBh5iQ88JGdPsg5SmgPWIMOqlKCokUzJ6TLKQoMr7ODqpQCyD6vh5NUPa4gALBdD+p+A5MPkDXaSfY534XyBCQLYmc/Izz4L2zXb91jWbbr3Tt8d5MPwCYhEUHMAC5mYLG90YDvx4W4iLtLmze7Ykh2lbI4Z1iXE6h6xN1JbL1cNi/4EFpP4q+0QDEjpAEsbbPcIIoWASBwNoSOlhmBviqxrOMQwn5pAAAAAElFTkSuQmCC";

  // client/src/Sprites/Link/6.png
  var __default6 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAPCAYAAADUFP50AAAACXBIWXMAAC4jAAAuIwF4pT92AAAAG3RFWHRTb2Z0d2FyZQBDZWxzeXMgU3R1ZGlvIFRvb2zBp+F8AAAA20lEQVQoz3WSPQ6DMAyF7amMZURcgZEjgLgCQ9l6LIYiFq4QqUfomCMUMbKWyR3AwTGJJ0TeZz//IBGBDrNl3s/mtqDWIINzl3pi2yeXhDIBEtEF0nAzFWBa6yWIVuTIq3K3L0DPKgw1mdZCMxV7ovfHQRJsbguaLSOkV+UqSbH+ZuvcJ34fd8rHFWGog1YZAgDIx/UcTgzUPemV7GBVusyhvornL2L1AG2fuOFom9quszp3Kcm9xUCuevZ47FJeDFu8HIQEzZZRTCiDNd7JhYQhKHrkcl9uUOr9D7GTpBvMkPF8AAAAAElFTkSuQmCC";

  // client/src/Sprites/Link/7.png
  var __default7 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAQCAYAAAAiYZ4HAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAG3RFWHRTb2Z0d2FyZQBDZWxzeXMgU3R1ZGlvIFRvb2zBp+F8AAAAx0lEQVQoz62SrRGDQBCF36pgIzO0gKSEY2gBk8FQFgIGkxYYKAFJC0wklqgXkexxIUAQeep2br+7tz9CEqr6cZkDR/HpLnoWBbaSl5CwMETayCGgjCgsDOukxxHFt+D1w9B26HNvNznIJvgmfFsCMLQdAHyBQTYBAHwTOkWXERVwIU22QNqIkMRwPbPPvY8EV3rnV+MMrNlZs2aL/itgC69GsV2qk363Bh2ekPy5Fu607S5pp7bszJacbdVu+dUobrwJrGn5yBOUno8ZV4YetgAAAABJRU5ErkJggg==";

  // client/src/Sprites/Link/8.png
  var __default8 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAQCAYAAADJViUEAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAG3RFWHRTb2Z0d2FyZQBDZWxzeXMgU3R1ZGlvIFRvb2zBp+F8AAAA2klEQVQoz32TsRGDMAxFvypo6cKxAiUjcMcKNFyajEVHwwjhkhFSegUfJS1UpuDkyMb2ryzwk/Qtm4wx8LUcpfOxy1ZCQCRhHwKA+rU7cTVt5MAS6uYaS6+CoJ+A3vvDbXGuAQD6+0uCFu6ylbg6w5ygapvLUq+uf88PAYAeCmM9L0dpuE0GJCzXHDsHpofCBnKjo1Dl6JiEjSish8KoMUdM8uSrtvm3LdtVY+5U47HJBFHY9xuEp41s2zHYB+WMo6Ni76mraeHQnQ7JfyC3Ud0siGrJVxWCUwlOsSeww3foGxIAAAAASUVORK5CYII=";

  // client/src/Components/Health.Component.ts
  var Health = class extends Component {
    constructor(initialHealth = 3) {
      super();
      this.value = 3;
      this.value = initialHealth;
    }
    incrementHealth(value) {
      this.value += value;
    }
    decrementHealth(value) {
      this.value -= value;
    }
  };

  // client/src/Objects/Player.ts
  var Player = class extends Entity {
    constructor({ spawn = { x: 0, y: 0 } }) {
      super({ tag: "player", x: spawn.x, y: spawn.y });
      this.playerSpeed = 35e-4;
      this.handleInputMovement = (direction) => {
        const animation = this.getComponent(SpriteAnimation);
        const movement = this.getComponent(Movement);
        animation.changeState(`walking_${direction}`);
        if (direction === "n")
          movement.addSpeed(0, -this.playerSpeed);
        if (direction === "s")
          movement.addSpeed(0, this.playerSpeed);
        if (direction === "w")
          movement.addSpeed(-this.playerSpeed, 0);
        if (direction === "e")
          movement.addSpeed(this.playerSpeed, 0);
      };
      this.handleStop = () => {
        const animation = this.getComponent(SpriteAnimation);
        animation.nextState();
      };
      const sprite = new Sprite({ src: __default, width: 1, height: 1 });
      const health = new Health(3);
      const coins = new Coins(0);
      const collider = new Collider({ width: 1, height: 1, isStatic: false, onCollision: this.handleCollision.bind(this) });
      const movement = new Movement({ x: 0, y: 0, onStop: this.handleStop });
      const animation = new SpriteAnimation([
        { name: "standing_n", frames: [__default3], interval: 300 },
        { name: "standing_s", frames: [__default], interval: 300 },
        { name: "standing_e", frames: [__default4], interval: 300 },
        { name: "standing_w", frames: [__default2], interval: 300 },
        { name: "walking_n", frames: [__default3, __default7], interval: 300, nextState: "standing_n" },
        { name: "walking_s", frames: [__default, __default5], interval: 300, nextState: "standing_s" },
        { name: "walking_e", frames: [__default4, __default8], interval: 300, nextState: "standing_e" },
        { name: "walking_w", frames: [__default2, __default6], interval: 300, nextState: "standing_w" }
      ], "standing_s");
      this.addComponent(sprite);
      this.addComponent(health);
      this.addComponent(coins);
      this.addComponent(collider);
      this.addComponent(movement);
      this.addComponent(animation);
      const input = new Input({
        config: {
          "w": () => this.handleInputMovement("n"),
          "a": () => this.handleInputMovement("w"),
          "s": () => this.handleInputMovement("s"),
          "d": () => this.handleInputMovement("e")
        }
      });
      this.addComponent(input);
    }
    handleCollision(target, scene) {
      if (target.tag === "doorway") {
      }
      if (target.tag === "coin") {
        this.getComponent(Coins).earnCoins(1);
        scene.removeEntity(target.id);
      }
      if (target.getComponent(Collider).isRigid) {
        const position = this.getComponent(Position);
        const collider = this.getComponent(Collider);
        const { x, y } = collider.getSafePosition();
        position.setPosition(x, y);
        collider.saveSafePosition(x, y);
      }
    }
  };

  // client/src/Systems/SystemDebugPlayer.ts
  var SystemDebugPlayer = class extends System {
    update(time, entities) {
      entities.filter((entity) => entity.tag === "player").forEach(({ components }) => {
        const debugText = document.getElementById("player-debugText");
        debugText.textContent = `${JSON.stringify(components, null, 4)}`;
      });
    }
    start() {
      const debugText = document.createElement("pre");
      debugText.setAttribute("id", "player-debugText");
      document.getElementById("root").append(debugText);
    }
    end() {
      const meter = document.getElementById("player-debugText");
      meter.remove();
    }
  };

  // client/src/Objects/Wall.ts
  var tilesPerDirection = {
    n: 1,
    w: 11,
    e: 13,
    s: 23
  };
  var Wall = class extends Entity {
    constructor({ id = "wall", side, x = 0, y = 0, length = 1 }) {
      super({ id, x, y });
      this.side = "n";
      this.side = side;
      let width = 1;
      let height = 1;
      if (side === "n" || side === "s")
        width = length;
      if (side === "w" || side === "e")
        height = length;
      const wallTileMap = new Array(height).fill(new Array(width).fill(tilesPerDirection[side]));
      this.addComponent(new Tilemap(bricks_default2, wallTileMap));
      this.addComponent(new Collider({ width, height, isRigid: true }));
    }
  };

  // client/src/Scenes/Room/index.ts
  var Gameplay = class extends Scene {
    constructor() {
      super("root");
      const randomPosition = () => ({ x: rollDice(2, ROOM_WIDTH2 - 2), y: rollDice(2, ROOM_HEIGHT2 - 2) });
      const player = new Player({ spawn: randomPosition() });
      const floor = new Floor();
      const walls = [
        ...this.generateWall("n"),
        ...this.generateWall("e"),
        ...this.generateWall("s"),
        ...this.generateWall("w")
      ];
      const coins = [];
      let i = 12;
      while (i > 0) {
        coins.push(new Coin(randomPosition()));
        i--;
      }
      const coinMeter = new SystemCoinMeter();
      const spriteRendering = new SpriteRenderer();
      const collisions = new Collision();
      const debug = new SystemDebugPlayer();
      [player, floor, ...coins, ...walls].forEach(this.addEntity);
      [spriteRendering, coinMeter, collisions, debug].forEach(this.addSystem);
    }
    generateWall(direction = "n", doorway = "closed") {
      const wallEntities = [];
      const horLength = 8;
      const verLength = 4;
      if (direction === "n") {
        wallEntities.push(new Wall({ side: "n", id: "wallN1", x: 1, y: 0, length: horLength }), new Wall({ side: "n", id: "wallN2", x: ROOM_WIDTH2 - 9, y: 0, length: horLength }), new Doorway({ x: ROOM_WIDTH2 - 9 - 2, y: 0, direction: DoorwayDirection.Horizontal }));
      }
      if (direction === "w") {
        wallEntities.push(new Wall({ side: "w", id: "wallW1", x: 0, y: 1, length: verLength }), new Wall({ side: "w", id: "wallW2", x: 0, y: ROOM_HEIGHT2 - 5, length: verLength }), new Doorway({ x: 0, y: ROOM_HEIGHT2 - 5 - 2, direction: DoorwayDirection.Vertical }));
      }
      if (direction === "s") {
        const yOffset = ROOM_HEIGHT2 - 1;
        wallEntities.push(new Wall({ side: "s", id: "wallS1", x: 1, y: yOffset, length: horLength }), new Wall({ side: "s", id: "wallS2", x: ROOM_WIDTH2 - 9, y: yOffset, length: horLength }), new Doorway({ x: ROOM_WIDTH2 - 9 - 2, y: yOffset + 1, direction: DoorwayDirection.Horizontal }));
      }
      if (direction === "e") {
        const xOffset = ROOM_WIDTH2 - 1;
        wallEntities.push(new Wall({ side: "e", id: "wallE1", x: xOffset, y: 1, length: verLength }), new Wall({ side: "e", id: "wallE2", x: xOffset, y: ROOM_HEIGHT2 - 5, length: verLength }), new Doorway({ x: xOffset + 1, y: ROOM_HEIGHT2 - 5 - 2, direction: DoorwayDirection.Vertical }));
      }
      return [...wallEntities];
    }
  };

  // client/src/index.ts
  document.addEventListener("readystatechange", (event) => {
    if (event.target.readyState === "interactive") {
    }
    if (event.target.readyState === "complete") {
      const dungeonRoom = new Gameplay();
      const game = new GameLoop([dungeonRoom]);
      game.start();
    }
  });
})();
//# sourceMappingURL=index.js.map
