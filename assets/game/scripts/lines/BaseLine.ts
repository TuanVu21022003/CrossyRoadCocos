import { _decorator, Component, Enum, instantiate, Node, Prefab, Vec3 } from 'cc';
import { ItemMapBase, ItemMapType } from '../ItemMapBase';
import { Vehical } from '../Vehical';
import { ObjectPooling } from '../../extentions/pooling/ObjectPooling';
export enum LineType {
    GRASSLINE = 0,
    ROADLINE = 1,
    TRAILLINE = 2,
    RIVERLINE = 3,
}
const { ccclass, property } = _decorator;

@ccclass('BaseLine')
export class BaseLine extends Component {
    @property({type: Enum(LineType)})
    typeLine: LineType

    @property(Prefab)
    listPlatform: Prefab[] = []

    protected ground : Node = null

    protected durationSpawn: number

    protected direction: boolean
    protected speed : number
    protected durationVehicalDestroy : number
    protected index : number

    protected listPlatformCurrent: Array<Node> = new Array<Node>()

    onInit(index : number) {
        this.index = index
        this.generateGround(index)
        this.generatePlatform(index)
    }

    generateGround(index) {
        
    }

    generatePlatform(index) {
        
    }

    getRamdomTrueFalse() {
        let random = Math.random()
        return random >= 0.5
    }

    getRandomOddMinMax(min: number, max: number): number {
        // Đảm bảo rằng min là số lẻ
        if (min % 2 === 0) {
            min++;
        }
        // Đảm bảo rằng max là số lẻ
        if (max % 2 === 0) {
            max--;
        }
        
        // Tạo một mảng chứa tất cả các số lẻ trong khoảng từ min đến max
        const oddNumbers = [];
        for (let i = min; i <= max; i += 2) {
            oddNumbers.push(i);
        }
    
        // Random một phần tử trong mảng oddNumbers
        const randomIndex = Math.floor(Math.random() * oddNumbers.length);
        return oddNumbers[randomIndex];
    }

    getRandomElement<T>(list: T[]): T {
        const randomIndex = Math.floor(Math.random() * list.length);
        return list[randomIndex];
    }

    getRandomStep(min: number, max: number, step: number): number {
        const range = (max - min) / step;
        const randomStep = Math.floor(Math.random() * (range + 1));
        return min + randomStep * step;
    }

    destroyLine() {
        this.removePlatform()
        this.node.active = false
    }

    getPos() {
        return this.node.getPosition()
    }

    spawnPlatform() {
        let platformPrefab = this.getRandomElement<Prefab>(this.listPlatform)
        let platformNode = ObjectPooling.Instance.GetObject(platformPrefab)
        platformNode.active = true
        this.listPlatformCurrent.push(platformNode)
        platformNode.parent = this.node.parent
        let platform = platformNode.getComponent(Vehical)
        let posStart : Vec3
        if(this.index < 10) {
            posStart = new Vec3(-14, 0, this.index)
        }
        else if(this.index < 20) {
            posStart = new Vec3(-20, 0, this.index)
        }
        else {
            posStart = new Vec3(-30, 0, this.index)
        }
        if (this.direction) {

            platform.onInit(posStart, 1, this.speed, this.durationVehicalDestroy)
        }
        else {
            platform.onInit(new Vec3(posStart.x * -1, posStart.y, posStart.z), -1, this.speed, this.durationVehicalDestroy)
        }
    }

    removePlatform() {
        while(this.listPlatformCurrent.length > 0) {
            let platform = this.listPlatformCurrent[0];
            platform.active = false
            this.listPlatformCurrent.shift();
        }
    }
}


