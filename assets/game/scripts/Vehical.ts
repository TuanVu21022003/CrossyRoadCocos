import { _decorator, CCFloat, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Vehical')
export class Vehical extends Component {
    @property(CCFloat)
    speed: number

    @property(CCFloat) 
    duration: number

    private isMove: boolean = false

    protected start(): void {
    }
    
    onInit(posStart: Vec3, horizontal : number) {
        this.scheduleOnce(this.deActiveVehical, this.duration)
        this.node.setPosition(posStart)
        this.speed *= horizontal
        if(horizontal === -1) {
            this.node.setRotationFromEuler(new Vec3(0, 180 ,0))
        }
        this.isMove = true
    }

    protected update(dt: number): void {
        if(this.isMove) {

            let pos = this.node.getPosition();
            pos = pos.add(new Vec3(this.speed * dt, 0, 0))
            this.node.setPosition(pos)
        }
    }

    deActiveVehical() {
        this.node.destroy()
    }
}


