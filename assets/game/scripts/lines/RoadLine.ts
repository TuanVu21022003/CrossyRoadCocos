import { _decorator, CCFloat, Component, instantiate, Node, Prefab, Vec3 } from 'cc';
import { BaseLine } from './BaseLine';
import { Vehical } from '../Vehical';
const { ccclass, property } = _decorator;

@ccclass('RoadLine')
export class RoadLine extends BaseLine {
    @property(Prefab)
    groundPrefab: Prefab

    @property(Prefab)
    listPlatform: Prefab[] = []

    @property(CCFloat)
    durationSpawn: number

    private direction : boolean

    onInit(index: number): void {
        super.onInit(index);
        this.direction = this.getRamdomTrueFalse()
    }

    generateGround(index) {
        let ground = instantiate(this.groundPrefab)
        ground.parent = this.node
    }

    generatePlatform(index: any): void {
        setTimeout(() => {
            this.schedule(this.spawnPlatform, this.durationSpawn)

        }, this.getRandomStep(1,2,0.4) * 1000)
    }

    spawnPlatform() {
        let platformPrefab = this.getRandomElement<Prefab>(this.listPlatform)
        let platformNode = instantiate(platformPrefab)
        platformNode.parent = this.node
        let platform = platformNode.getComponent(Vehical)
        setTimeout(() => {
            if(this.direction) {

                platform.onInit(new Vec3(-23, 0, 0), 1)
            }
            else {
                platform.onInit(new Vec3(33, 0, 0), -1)
            }
        }, this.getRandomStep(1,2,0.3) * 1000)
    }
}


