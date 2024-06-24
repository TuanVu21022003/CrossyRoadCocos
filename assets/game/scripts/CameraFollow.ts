import { _decorator, CCFloat, Component, Node, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CameraFollow')
export class CameraFollow extends Component {
    @property(CCFloat)
    speed : number = 1

    private offSet : Vec3;

    onInit(posPlayer: Vec3) {
        this.offSet = this.node.getPosition().clone().subtract(posPlayer)
    }

    followPlayer(posPlayer : Vec3) {
        if(posPlayer.z > this.node.getPosition().clone().subtract(this.offSet).z) {
            tween(this.node)
            .to(
                2, 
                { position: posPlayer.clone().add(this.offSet)},
            )
            .start()

        }
    }

    update(dt : number) {
        // this.move(dt)
    }

    move(dt : number) {
        let pos = this.node.getPosition();
        pos = pos.add(new Vec3(0, 0, this.speed * dt))
        this.node.setPosition(pos)
    }
}


