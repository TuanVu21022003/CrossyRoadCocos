import { _decorator, CCFloat, Component, Node, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Vehical')
export class Vehical extends Component {
    speed: number = 0

    duration: number = 0
    horizontal: number = 0

    private isMove: boolean = false

    tweenCurrent : any

    startPos : Vec3
    endPos : Vec3
    
    onInit(posStart: Vec3, horizontal : number, speed, duration) {
        this.speed = speed
        this.duration = duration
        this.horizontal = horizontal
        this.startPos = posStart
        this.node.setPosition(posStart)
        let posEnd = posStart.clone().add(new Vec3(Math.abs(posStart.x) * 2, 0 ,0))
        if(horizontal === -1) {
            posEnd = posStart.clone().subtract(new Vec3(Math.abs(posStart.x) * 2, 0 ,0))
            this.node.setRotationFromEuler(new Vec3(0, 180 ,0))
        }
        this.endPos = posEnd
        this.isMove = true
        
        this.tweenCurrent = tween(this.node)
                .to(
                    Math.abs(this.endPos.x - this.startPos.x) / this.speed,
                    { position: posEnd },
                )
                .call(() => {
                    this.node.active = false
                })
                .start()
    }

    protected onDisable(): void {
        this.tweenCurrent.stop()
        this.tweenCurrent = null
    }

    caculateDistance(time) {
        return (this.endPos.x - this.startPos.x) / (50 / this.speed) * time
    }
}


