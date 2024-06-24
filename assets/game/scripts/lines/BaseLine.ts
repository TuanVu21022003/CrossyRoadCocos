import { _decorator, Component, instantiate, Node, Prefab, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BaseLine')
export class BaseLine extends Component {
    @property(Prefab)
    groundPrefab: Prefab

    @property(Prefab)
    platformPrefab: Prefab

    onInit() {
        this.generateGround()
        this.generatePlatform()
    }

    generateGround() {
        for (var i = -24; i <= 24; i += 2) {
            let ground = instantiate(this.groundPrefab)
            ground.parent = this.node
            ground.setPosition(new Vec3(i, ground.getPosition().y, 0))
        }
    }

    generatePlatform() {
        let amount = 3
        let count = 0
        for (var i = -24; i <= 24; i += 2) {
            if (Math.abs(i) > 8) {
                if (this.getRamdomTrueFalse()) {
                    let platform = instantiate(this.platformPrefab)
                    platform.parent = this.node
                    platform.setPosition(new Vec3(i, platform.getPosition().y, 0))
                }

            }
            else {
                if (amount - count < (8 - i) / 2 + 1 && amount > count) {
                    if (this.getRamdomTrueFalse()) {
                        let platform = instantiate(this.platformPrefab)
                        platform.parent = this.node
                        platform.setPosition(new Vec3(i, platform.getPosition().y, 0))
                        ++count
                    }
                }
                else {
                    let platform = instantiate(this.platformPrefab)
                    platform.parent = this.node
                    platform.setPosition(new Vec3(i, platform.getPosition().y, 0))
                    ++count
                }
            }
        }
    }

    getRamdomTrueFalse() {
        let random = Math.random()
        return random >= 0.5
    }
}


