import Position from "__Components/Position.Component";
import Player from "__Entities/Player";
import Enemy from "__Entities/Enemy";
import GameLoop from "__Core/GameLoop";
import Entity from "__Core/Entity";
import Doorway from "__Entities/Doorway";
import { ROOM_HEIGHT, ROOM_WIDTH } from "./constants";
import { DoorwayDirection } from "./Entities/Doorway";
import RoomSet, { WallStateEnum } from "./Sets/Room.set";
import CanvasRenderer from "../../engine/Systems/Canvas.System";
import Collider from "../../engine/Components/Collider.Component";
import Link_1 from "./Sprites/Link/1.png";

const layoutTemplate = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""]
];

export default class Dungeon {
    constructor(gameLoop: GameLoop, layout = layoutTemplate) {
        this.gameLoop = gameLoop;
        this.layout = layout;
        this.height = this.layout.length;
        this.width = this.layout[0].length;
        this.generateRooms();
        this.fillScene(this.getRoom(this.roomIndex));
    }

    gameLoop: GameLoop;

    layout: Array<Array<string>> = [[]];
    rooms: Array<Array<Entity[]>> = [[]];
    roomIndex = [1, 1];
    width: number = 0;
    height: number = 0;

    generateRooms() {
        this.rooms = Array(this.layout.length);
        this.layout.forEach((row, y) => {
            this.rooms[y] = [];
            row.forEach((column, x) => {
                const roomContent = new RoomSet(
                    [new Enemy({ spawn: { x: 3, y: 3 }, spriteSrc: Link_1 })],
                    [
                        y === 0 ? WallStateEnum.Closed : WallStateEnum.Open,
                        x === (this.width - 1) ? WallStateEnum.Closed : WallStateEnum.Open,
                        y === (this.height - 1) ? WallStateEnum.Closed : WallStateEnum.Open,
                        x === 0 ? WallStateEnum.Closed : WallStateEnum.Open
                    ]
                ).contents;
                this.rooms[y].push(roomContent)
            })
        });
    }

    getCurrentEntitites = () => this.gameLoop.currentScene.entities;
    getPlayer = () => this.getCurrentEntitites().find(entity => entity.tag === "player") as Player;
    getRoom = (index) => this.rooms[index[1]][index[0]];
    fillScene = (room) => room.forEach(entity => this.gameLoop.currentScene.addEntity(entity))
    clearScene = (room) => room.forEach(entity => this.gameLoop.currentScene.removeEntity(entity.id));

    updatePlayerPosition = (direction) => {
        const player = this.getPlayer();
        const playerPosition = player.getComponent(Position) as Position;
        const playerCollider = player.getComponent(Collider) as Collider;
        const newPlayerPosition: number[] = this.wrapPlayerDirection(direction, playerPosition);
        playerPosition.setPosition(newPlayerPosition[0], newPlayerPosition[1]);
        playerCollider.skip = true;
        this.getPlayer().room = this.roomIndex;
    }

    updateRoomIndex = (direction) => {
        const [x, y] = this.directionToXY(direction);
        const [currX, currY] = this.roomIndex;
        this.roomIndex = [currX + x, currY + y];
    }

    updateDoorwayStates = () => {
        const [x, y] = this.roomIndex;
        this.getDoorways().forEach(doorway => doorway.setDisabled(false));
        if (x === 0) this.getDirectionDoorway(DoorwayDirection.Left).setDisabled(true);
        if (y === 0) this.getDirectionDoorway(DoorwayDirection.Top).setDisabled(true);
        if (x === (this.width - 1)) this.getDirectionDoorway(DoorwayDirection.Right).setDisabled(true);
        if (y === (this.height - 1)) this.getDirectionDoorway(DoorwayDirection.Bottom).setDisabled(true);
    }

    getDoorways(): Doorway[] {
        return this.getCurrentEntitites().filter(entity => entity.tag === "doorway") as Doorway[];
    }

    getDirectionDoorway = (direction: DoorwayDirection): Doorway => (
        this.getDoorways().find(entity => entity.direction === direction)
    );

    changeRoom = (direction: DoorwayDirection): void => {
        const room = this.getRoom(this.roomIndex);
        this.clearScene(room);
        this.updateRoomIndex(direction);
        const newRoom = this.getRoom(this.roomIndex);
        this.fillScene(newRoom);
        this.updateDoorwayStates();

        const canvasRender = this.gameLoop.getSystems().find(
            system => system.constructor.name === CanvasRenderer.name
        ) as CanvasRenderer;

        canvasRender.redrawTilemap();
        this.updatePlayerPosition(direction);
    }

    wrapPlayerDirection = (direction: DoorwayDirection, currentPosition): Array<number> => (([
        [currentPosition.x, ROOM_HEIGHT - 1],
        [0, currentPosition.y],
        [currentPosition.x, 0],
        [ROOM_WIDTH - 1, currentPosition.y]
    ])[direction]);
    directionToXY = (direction: DoorwayDirection): Array<number> => (([
        [0, -1],
        [1, 0],
        [0, 1],
        [-1, 0]
    ])[direction])
}
