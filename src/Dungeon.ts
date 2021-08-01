import Position from "__Components/Position.Component";
import GameLoop from "__Core/GameLoop";
import Entity from "__Core/Entity";
import Doorway from "__Entities/Doorway"
import { ROOM_HEIGHT, ROOM_WIDTH } from "./constants";
import { DoorwayDirection } from "./Entities/Doorway";
import RoomSet from "./Sets/Room.set";

const layoutTemplate = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""]
];

export default class Dungeon {
    constructor(gameLoop: GameLoop, layout = layoutTemplate) {
        this.gameLoop = gameLoop;
        this.layout = layout;
        this.generateRooms();
        this.fillScene(this.getRoom(this.roomIndex));
    }

    gameLoop: GameLoop;

    layout: Array<Array<string>> = [[]];
    rooms: Array<Array<Entity[]>> = [[]];
    roomIndex = [1, 1];

    generateRooms() {
        this.rooms = Array(this.layout.length);
        this.layout.forEach((row, y) => {
            this.rooms[y] = [];
            row.forEach((column, x) => {
                const roomContent = new RoomSet(
                    [/* new Coin({ x, y }) */]
                ).contents;
                this.rooms[y].push(roomContent)
            })
        });
    }

    getRoom = (index) => this.rooms[index[1]][index[0]];
    fillScene = (room) => room.forEach(entity => this.gameLoop.currentScene.addEntity(entity))
    clearScene = (room) => room.forEach(entity => this.gameLoop.currentScene.removeEntity(entity.id));
    updatePlayerPosition = (direction) => {
        const playerPosition = this.gameLoop.currentScene.entities
            .find(entity => entity.tag === "player")
            .getComponent(Position) as Position;

        const newPlayerPosition: number[] = this.wrapPlayerDirection(direction, playerPosition);
        playerPosition.setPosition(newPlayerPosition[0], newPlayerPosition[1]);
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
        if (x === this.layout[0].length) this.getDirectionDoorway(DoorwayDirection.Right).setDisabled(true);
        if (y === this.layout.length) this.getDirectionDoorway(DoorwayDirection.Bottom).setDisabled(true);
    }

    getDoorways(): Doorway[] {
        return this.gameLoop.currentScene.entities.filter(entity => entity.tag === "doorway") as Doorway[];
    }

    getDirectionDoorway = (direction: DoorwayDirection): Doorway => this.getDoorways().find(entity => entity.direction === direction);

    changeRoom = (direction: DoorwayDirection): void => {
        console.log("Dungeon.changeRoom");

        const room = this.getRoom(this.roomIndex);
        this.clearScene(room);
        this.updatePlayerPosition(direction);
        this.updateRoomIndex(direction);

        const newRoom = this.getRoom(this.roomIndex);
        this.fillScene(newRoom);
        this.updateDoorwayStates();

        console.log(this.roomIndex);
    }

    wrapPlayerDirection = (direction: DoorwayDirection, currentPosition): Array<number> => (([
        [currentPosition.x, ROOM_HEIGHT],
        [0, currentPosition.y],
        [currentPosition.x, 0],
        [ROOM_WIDTH, currentPosition.y]
    ])[direction]);
    directionToXY = (direction: DoorwayDirection): Array<number> => (([
        [0, -1],
        [1, 0],
        [0, 1],
        [-1, 0]
    ])[direction])
}
