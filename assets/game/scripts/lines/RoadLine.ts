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


    onInit(index: number): void {
        super.onInit(index);
        this.direction = this.getRamdomTrueFalse()
        this.durationSpawn = this.getRandomStep(3, 6, 0.3)
        this.speed = this.getRandomStep(5, 7, 0.3)
        this.durationVehicalDestroy = this.getRandomStep(10, 12, 0.3)
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

    spawnPlatform() {
        let platformPrefab = this.getRandomElement<Prefab>(this.listPlatform)
        let platformNode = instantiate(platformPrefab)
        platformNode.parent = this.node
        let platform = platformNode.getComponent(Vehical)
        if (this.direction) {

            platform.onInit(new Vec3(-15, 0, 0), 1, this.speed , this.durationVehicalDestroy)
        }
        else {
            platform.onInit(new Vec3(30, 0, 0), -1, this.speed , this.durationVehicalDestroy)
        }
    }

    destroyLine(): void {
        this.unschedule(this.spawnPlatform)
        super.destroyLine()
    }
}


