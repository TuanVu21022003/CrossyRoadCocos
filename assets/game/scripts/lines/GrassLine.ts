import { _decorator, Component, instantiate, Node, Prefab, Vec3 } from 'cc';
import { BaseLine } from './BaseLine';
const { ccclass, property } = _decorator;

@ccclass('GrassLine')
export class GrassLine extends BaseLine {

    @property(Prefab)
    listPlatform: Prefab[] = []

    @property(Prefab)
    grass1: Prefab

    @property(Prefab)
    grass2: Prefab

    generateGround(index) {
        let groundPrefab;
        if (index % 4 === 0) {
            groundPrefab = this.grass1
        }
        else {
            groundPrefab = this.grass2
        }
        let ground = instantiate(groundPrefab)
        ground.parent = this.node
    }

    generatePlatform(index) {
        let amount = 4
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
                    let platform = instantiate(platformPrefab)
                    platform.parent = this.node
                    platform.setPosition(new Vec3(i, platform.getPosition().y, 0))
                }

            }
            else {
                if (amount - count < (8 - i) / 2 + 1) {
                    if (this.getRamdomTrueFalse() && count < amount) {
                        let platform = instantiate(platformPrefab)
                        platform.parent = this.node
                        platform.setPosition(new Vec3(i, platform.getPosition().y, 0))
                        ++count
                    }
                }
                else {
                    let platform = instantiate(platformPrefab)
                    platform.parent = this.node
                    platform.setPosition(new Vec3(i, platform.getPosition().y, 0))
                    ++count
                }
            }
        }
    }

    
}


