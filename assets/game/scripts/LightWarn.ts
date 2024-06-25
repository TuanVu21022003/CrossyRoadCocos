import { _decorator, Component, Material, MeshRenderer, Node, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LightWarn')
export class LightWarn extends Component {
    @property(Material)
    normal: Material

    @property(Material)
    warn: Material

    @property(MeshRenderer)
    left: MeshRenderer

    @property(MeshRenderer)
    right: MeshRenderer

    onInit() {
        this.changeColor(false)
    }

    handleWarn() {
        let scaleCurrent = this.node.getScale()
        let scaleMin = scaleCurrent.clone().subtract(new Vec3(0.1, 0.1, 0.1))
        let scaleMax = scaleCurrent.clone().add(new Vec3(0.1, 0.1, 0.1))
        let t = tween(this.node)
        for (var i = 0; i < 3; i++) {
            t.to(0.1, { scale: scaleMax })
            t.call(() => {
                this.changeColor(true)
            })
            t.to(0.1, { scale: scaleMin })
            t.call(() => {
                this.changeColor(false)
            })
        }
        t.to(0.05, { scale: scaleCurrent })
        t.start()
    }

    changeColor(active: boolean) {
        if (active) {
            this.left.material = this.warn
            this.right.material = this.warn
        }
        else {
            this.left.material = this.normal
            this.right.material = this.normal
        }
    }
}


