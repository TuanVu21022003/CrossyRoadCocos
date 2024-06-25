import { _decorator, Component, instantiate, Node, Prefab, Vec3 } from 'cc';
import { Player } from './Player';
import { CameraFollow } from './CameraFollow';
import { BaseLine } from './lines/BaseLine';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    public static Instance: GameManager; 

    @property(Player)
    player : Player = null

    @property(CameraFollow)
    cameraFollow : CameraFollow

    @property(Prefab)
    listLinePrefab: Prefab[] = []

    protected onLoad(): void {
        if (GameManager.Instance == null) {
            GameManager.Instance = this;
        }
        else {
            this.destroy();
        }
        this.cameraFollow.onInit(this.player.getPos())
    }

    start() {
        this.generateLine()
    }

    generateLine() {
        let count = 0;
        for(var i = -8; i <= 56; i+=2) {
            let baseLinePrefab = this.getRandomElement<Prefab>(this.listLinePrefab)
            let lineNode = instantiate(baseLinePrefab)
            lineNode.parent = this.node.parent
            lineNode.setPosition(new Vec3(0, 0, i))
            let line = lineNode.getComponent(BaseLine)
            line.onInit(i)
        }
    }
    getRandomElement<T>(list: T[]): T {
        const randomIndex = Math.floor(Math.random() * list.length);
        return list[randomIndex];
    }
}


