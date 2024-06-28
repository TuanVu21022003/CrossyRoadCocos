import { _decorator, CCFloat, Component, Node, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Vehical')
export class Vehical extends Component {
    speed: number = 0

    duration: number = 0

    private isMove: boolean = false

    tweenCurrent : any
    
    onInit(posStart: Vec3, horizontal : number, speed, duration) {
        this.speed = speed
        this.duration = duration
        this.node.setPosition(posStart)
        let posEnd = posStart.clone().add(new Vec3(45, 0 ,0))
        if(horizontal === -1) {
            posEnd = posStart.clone().subtract(new Vec3(45, 0 ,0))
            this.node.setRotationFromEuler(new Vec3(0, 180 ,0))
        }
        this.isMove = true
        
        this.tweenCurrent = tween(this.node)
                .to(
                    50 / this.speed,
                    { position: posEnd },
                )
                .call(() => {
                    this.node.active = false
                })
                .start()
    }

    protected onDisable(): void {
        console.log("DA BI DISABLE")
        this.tweenCurrent.stop()
        this.tweenCurrent = null
    }
}


