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
    grassLinePrefab: Prefab

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
        for(var i = -4; i <= 44; i+=2) {
            let lineNode = instantiate(this.grassLinePrefab)
            lineNode.parent = this.node.parent
            lineNode.setPosition(new Vec3(0, 0, i))
            let line = lineNode.getComponent(BaseLine)
            line.onInit()
        }
    }
}


