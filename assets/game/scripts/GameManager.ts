import { _decorator, Component, instantiate, Line, Node, Prefab, Vec3 } from 'cc';
import { Player } from './Player';
import { CameraFollow } from './CameraFollow';
import { BaseLine, LineType } from './lines/BaseLine';
import { ObjectPooling } from '../extentions/pooling/ObjectPooling';
import { UIManager } from './UI/UIManager';
import { UIFail } from './UI/UIFail';
const { ccclass, property } = _decorator;



@ccclass('GameManager')
export class GameManager extends Component {
    public static Instance: GameManager; 

    @property(Player)
    player : Player

    @property(CameraFollow)
    cameraFollow : CameraFollow

    @property(Prefab)
    listLinePrefab: Prefab[] = []

    private saveLineGenerated : [LineType, number] = [LineType.GRASSLINE, 1]
    private listLineGenerated : Array<BaseLine> = new Array<BaseLine>()
    private indexSpawn : number = -10

    firstLine : BaseLine

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
        
    }

    onInit() {
        this.listLineGenerated = new Array<BaseLine>()
        this.cameraFollow.reset()
        this.indexSpawn = -10
        ObjectPooling.Instance.closeAll()
        this.player.reset()
        this.generateLineInit()
    }
    diePlayer() {
        UIManager.Instance.openUI(UIFail)
        this.cameraFollow.setIsMove(false)
        this.player.activeController(false)
    }

    generateLineInit() {
        for(var i = this.indexSpawn; i <= 70; i+=2) {
            let baseLinePrefab
            if(i <= 0) {
                baseLinePrefab = this.listLinePrefab[0]
                this.saveLineGenerated = [LineType.GRASSLINE, 1]
            }
            else {

                baseLinePrefab = this.selectLine()
            }
            this.addLine(baseLinePrefab)
        }
        this.firstLine = this.listLineGenerated[0]
    }

    onHandleLine() {
        // console.log("OKE THAY DOI")
        this.removeLine()
        this.addLine(this.selectLine())
    }

    removeLine() {
        let lineRemove = this.listLineGenerated[0];
        this.listLineGenerated.shift()
        this.firstLine = this.listLineGenerated[0];
        lineRemove.destroyLine()
    }

    selectLine() {
        let baseLinePrefab
        if(this.saveLineGenerated[1] ===3) {
            baseLinePrefab = this.listLinePrefab[0]
            this.saveLineGenerated = [LineType.GRASSLINE, 1]
        }
        else {

            baseLinePrefab = this.getRandomElement<Prefab>(this.listLinePrefab)
        }
        return baseLinePrefab
    }

    addLine(baseLinePrefab : Prefab) {
        let lineNode = ObjectPooling.Instance.GetObject(baseLinePrefab)
        lineNode.active = true
        lineNode.parent = this.node.parent
        lineNode.setPosition(new Vec3(0, 0, this.indexSpawn))
        let line = lineNode.getComponent(BaseLine)
        line.onInit(this.indexSpawn)
        if(line.typeLine === this.saveLineGenerated[0]) {
            this.saveLineGenerated[1] += 1;
        }
        else {
            this.saveLineGenerated = [line.typeLine, 1]
        }
        this.listLineGenerated.push(line)
        this.indexSpawn += 2
    }

    getRandomElement<T>(list: T[]): T {
        const randomIndex = Math.floor(Math.random() * list.length);
        return list[randomIndex];
    }
}


