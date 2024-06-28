import { _decorator, CCFloat, Component, Input, input, Node, tween, Vec3 } from 'cc';
import { DirectionType } from './Player';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('CameraFollow')
export class CameraFollow extends Component {
    @property(CCFloat)
    speed : number = 1

    @property(CCFloat)
    distanceDie : number = 1

    @property(CCFloat)
    distanceHandleLine : number = 5

    private offSet : Vec3;

    private isMove : boolean = false;

    tweenCurrent : any

    onInit(posPlayer: Vec3) {
        this.offSet = this.node.getPosition().clone().subtract(posPlayer)
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    onTouchEnd() {
        this.isMove = true;
        input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    followPlayer(posPlayer : Vec3, directionType : DirectionType) {
        if(posPlayer.z < this.node.getPosition().clone().subtract(this.offSet).z - 2 || directionType === DirectionType.DOWN) {
            return
        }
        this.tweenCurrent = tween(this.node)
        .to(
            1, 
            { position: posPlayer.clone().add(this.offSet)},
        )
        .start()
    }

    update(dt : number) {
        if(this.isMove) {
            this.checkDiePlayer()
            this.move(dt)
            // this.checkHandleLine()
        }
    }

    move(dt : number) {
        let pos = this.node.getPosition();
        pos = pos.add(new Vec3(0, 0, this.speed * dt))
        this.node.setPosition(pos)
    }

    checkDiePlayer() {
        if(!GameManager.Instance.player.getIsDie()) {
            let posDie = this.node.getPosition().clone().subtract(this.offSet).z - this.distanceDie
            if(posDie > GameManager.Instance.player.getPos().z) {
                console.log("NHAN VAT DA DIE")
                GameManager.Instance.player.setIsDie(true)
                GameManager.Instance.diePlayer()
                this.isMove = false
            }

        }
    }

    checkHandleLine() {
        let posHandle = this.node.getPosition().clone().subtract(this.offSet).z - this.distanceHandleLine
        let line = GameManager.Instance.firstLine
        if(line != null) {

            if(posHandle > line.getPos().z) {
                GameManager.Instance.onHandleLine()
            }
        }
    }

    reset() {
        this.node.setPosition(new Vec3(0, 1, 0).add(this.offSet))
        this.isMove = false;
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    setIsMove(active) {
        this.isMove = active
    }

    setPos(pos) {
        if(this.tweenCurrent != null) {

            this.tweenCurrent.stop();
        }
        this.tweenCurrent = null
        this.node.setPosition(pos.clone().add(this.offSet))
    }
}


