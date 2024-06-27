import { _decorator, Component, Enum, instantiate, Node, Prefab, Vec3 } from 'cc';
import { ItemMapBase, ItemMapType } from '../ItemMapBase';
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

    protected ground = null

    onInit(index : number) {
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
        this.node.active = false
    }

    getPos() {
        return this.node.getPosition()
    }
}


