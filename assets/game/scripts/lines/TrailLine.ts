import { _decorator, CCFloat, Component, instantiate, Node, Prefab, Vec3 } from 'cc';
import { BaseLine } from './BaseLine';
import { Vehical } from '../Vehical';
import { LightWarn } from '../LightWarn';
const { ccclass, property } = _decorator;

@ccclass('TrailLine')
export class TrailLine extends BaseLine {
    @property(Prefab)
    groundPrefab: Prefab

    @property(Prefab)
    lightWawnPrefab: Prefab

    @property(Prefab)
    listPlatform: Prefab[] = []

    @property(CCFloat)
    durationSpawn: number

    private direction: boolean
    private lightWawn: LightWarn = null

    onInit(index: number): void {
        super.onInit(index);
        this.direction = this.getRamdomTrueFalse()
    }

    generateGround(index) {
        let ground = instantiate(this.groundPrefab)
        ground.parent = this.node

        if (this.lightWawn == null) {
            let lightWawnNode = instantiate(this.lightWawnPrefab)
            lightWawnNode.parent = this.node
            lightWawnNode.setPosition(new Vec3(this.getRandomOddMinMax(-7, 7), 0, -0.8))

            this.lightWawn = lightWawnNode.getComponent(LightWarn)
            this.lightWawn.onInit()
        }
    }

    generatePlatform(index: any): void {
        setTimeout(() => {
            this.schedule(this.spawnPlatform, this.durationSpawn)

        }, this.getRandomStep(1, 2, 0.4) * 1000)
    }

    spawnPlatform() {
        let platformPrefab = this.getRandomElement<Prefab>(this.listPlatform)
        let platformNode = instantiate(platformPrefab)
        platformNode.parent = this.node
        let platform = platformNode.getComponent(Vehical)
        if (this.direction) {

            platform.onInit(new Vec3(-23, 0, 0), 1)
        }
        else {
            platform.onInit(new Vec3(33, 0, 0), -1)
        }
        this.lightWawn.handleWarn()
    }

    destroyLine(): void {
        this.unschedule(this.spawnPlatform)
        super.destroyLine()
    }

}


