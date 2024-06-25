import { _decorator, CCFloat, Component, Input, input, Node, tween, Vec3 } from 'cc';
import { DirectionType } from './Player';
const { ccclass, property } = _decorator;

@ccclass('CameraFollow')
export class CameraFollow extends Component {
    @property(CCFloat)
    speed : number = 1

    private offSet : Vec3;

    private isMove : boolean = false;

    onInit(posPlayer: Vec3) {
        this.offSet = this.node.getPosition().clone().subtract(posPlayer)
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    onTouchEnd() {
        this.isMove = true;
        input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    followPlayer(posPlayer : Vec3, directionType : DirectionType) {
        if(posPlayer.z < this.node.getPosition().clone().subtract(this.offSet).z || directionType === DirectionType.DOWN) {
            return
        }
        tween(this.node)
        .to(
            1.5, 
            { position: posPlayer.clone().add(this.offSet)},
        )
        .start()
    }

    update(dt : number) {
        if(this.isMove) {

            this.move(dt)
        }
    }

    move(dt : number) {
        let pos = this.node.getPosition();
        pos = pos.add(new Vec3(0, 0, this.speed * dt))
        this.node.setPosition(pos)
    }
}


