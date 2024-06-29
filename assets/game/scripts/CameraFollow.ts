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

    speedWood : number = 1

    private offSet : Vec3;

    private isMove : boolean = false;
    private isWood : boolean = false;

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
        if(this.tweenCurrent != null) {

            this.tweenCurrent.stop();
        }
        this.tweenCurrent = null
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

    followWood(posPlayer : Vec3, time, speed) {
        if(this.tweenCurrent != null) {

            this.tweenCurrent.stop();
        }
        this.tweenCurrent = null
        this.speedWood = speed
        console.log(this.speedWood)
        this.isMove = false
        this.tweenCurrent = tween(this.node)
        .to(
            time, 
            { position: posPlayer.clone().add(this.offSet)},
        )
        .call(() => {
            this.isWood = true
        })
        .start()
    }

    update(dt : number) {
        if(this.isMove) {
            this.checkDiePlayer()
            this.move(dt)
            // this.checkHandleLine()
        }
        if(this.isWood) {
            console.log(this.isWood)
            let pos = this.node.getPosition();
            pos = pos.add(new Vec3(this.speedWood * dt, 0, 0))
            this.node.setPosition(pos)
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
        tween(this.node).to(0.5, {position : new Vec3(0, 1, 0).add(this.offSet)}).start()
        // this.node.setPosition(new Vec3(0, 1, 0).add(this.offSet))
        this.isMove = false;
        this.isWood = false;
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    setIsMove(active) {
        this.isMove = active
    }

    setIsWood(active) {
        this.isWood = active
    }

    setPos(pos) {
        if(this.tweenCurrent != null) {

            this.tweenCurrent.stop();
        }
        this.tweenCurrent = null
        this.node.setPosition(pos.clone().add(this.offSet))
    }
}


