import { _decorator, CCInteger, Component, instantiate, Node, Prefab, Vec3 } from 'cc';
import { BaseLine } from './BaseLine';
import { ObjectPooling } from '../../extentions/pooling/ObjectPooling';
const { ccclass, property } = _decorator;

@ccclass('GrassLine')
export class GrassLine extends BaseLine {

    @property(Prefab)
    listPlatform: Prefab[] = []

    @property(Prefab)
    grass1: Prefab

    @property(Prefab)
    grass2: Prefab

    @property(CCInteger)
    countPlatform: number = 3

    private listPlatformCurrent: Array<Node> = new Array<Node>()

    generateGround(index) {
        let groundPrefab;
        if (index % 4 === 0) {
            groundPrefab = this.grass1
        }
        else {
            groundPrefab = this.grass2
        }
        this.ground = instantiate(groundPrefab)
        this.ground.parent = this.node
    }

    generatePlatform(index) {
        let amount = this.countPlatform
        let count = 0
        if (index === -2 || index === 0 || index === 2) {
            return
        }
        for (var i = -24; i <= 24; i += 2) {
            let platformPrefab = this.getRandomElement<Prefab>(this.listPlatform)
            if (i === 0 && index === 0) {
                continue;
            }
            if (Math.abs(i) > 8) {
                if (this.getRamdomTrueFalse()) {
                    this.addPlatform(platformPrefab, i)
                }

            }
            else {
                if (amount - count < (8 - i) / 2 + 1) {
                    if (this.getRamdomTrueFalse() && count < amount) {
                        this.addPlatform(platformPrefab, i)
                        count ++;
                    }
                }
                else {
                    this.addPlatform(platformPrefab, i)
                    ++count
                }
            }
        }
    }

    addPlatform(platformPrefab, index) {
        let platform = ObjectPooling.Instance.GetObject(platformPrefab)
        platform.active = true
        platform.parent = this.node
        platform.setPosition(new Vec3(index, platform.getPosition().y, 0))
        this.listPlatformCurrent.push(platform)
    }

    removePlatform() {
        while(this.listPlatformCurrent.length > 0) {
            let platform = this.listPlatformCurrent[0];
            platform.active = false;
            this.listPlatformCurrent.shift();
        }
    }

    destroyLine(): void {
        console.log(this.ground.name)
        this.ground.destroy()
        this.removePlatform()

        super.destroyLine()
    }


}


