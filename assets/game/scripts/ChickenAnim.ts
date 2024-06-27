import { _decorator, CCFloat, Component, easing, Node, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ChickenAnim')
export class ChickenAnim extends Component {
    // @property(CCFloat)
    // startJump : number

    @property(CCFloat)
    highJump : number

    private startPos : Vec3
    private highPos: Vec3

    protected onLoad(): void {
        this.startPos = this.node.getPosition()
    }


    setJump() {
        this.node.setPosition(this.startPos)
        this.highPos = this.startPos.clone().add(new Vec3(0, this.highJump, 0))
    }

    jump(time: number) {
        this.setJump()
        tween(this.node)
        .to(
            time, 
            { position: this.highPos },
        )
        .to(
            time, 
            { position: this.startPos},
        )
        .start()
    }
}


