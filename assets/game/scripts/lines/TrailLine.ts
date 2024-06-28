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

    private lightWawn: LightWarn = null

    
    onInit(index: number): void {
        super.onInit(index);
        this.direction = this.getRamdomTrueFalse()
        this.durationSpawn = this.getRandomStep(7, 10, 0.3)
        this.speed = this.getRandomStep(20, 25, 0.3)
        this.durationVehicalDestroy = this.getRandomStep(3, 4, 0.1)
    }

    generateGround(index) {
        if(this.ground == null) {

            this.ground = instantiate(this.groundPrefab)
            this.ground.parent = this.node
        }

        if (this.lightWawn == null) {
            let lightWawnNode = instantiate(this.lightWawnPrefab)
            lightWawnNode.parent = this.node
            lightWawnNode.setPosition(new Vec3(this.getRandomOddMinMax(-5, 5), 0, -0.8))

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
        super.spawnPlatform()
        this.lightWawn.handleWarn()
    }

    destroyLine(): void {
        this.unschedule(this.spawnPlatform)
        super.destroyLine()
    }

}


