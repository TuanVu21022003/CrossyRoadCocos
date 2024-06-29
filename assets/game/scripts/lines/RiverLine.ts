import { _decorator, CCFloat, Component, instantiate, Node, Prefab, Vec3 } from 'cc';
import { BaseLine } from './BaseLine';
import { Vehical } from '../Vehical';
const { ccclass, property } = _decorator;

@ccclass('RiverLine')
export class RiverLine extends BaseLine {
    @property(Prefab)
    groundPrefab: Prefab


    onInit(index: number): void {
        super.onInit(index);
        if(index % 4 === 0) {

            this.direction = true
        }
        else {
            this.direction = false
        }
        this.durationSpawn = this.getRandomStep(3, 5, 0.3)
        this.speed = this.getRandomStep(2, 3, 0.1)
        this.durationVehicalDestroy = this.getRandomStep(12, 14, 0.3)
    }

    generateGround(index) {
        if(this.ground == null) {

            this.ground = instantiate(this.groundPrefab)
            this.ground.parent = this.node
        }
    }

    generatePlatform(index: any): void {
        setTimeout(() => {
            this.schedule(this.spawnPlatform, this.durationSpawn)

        }, this.getRandomStep(0, 1, 0.1) * 1000)
    }

    destroyLine(): void {
        this.unschedule(this.spawnPlatform)
        super.destroyLine()
    }
}


