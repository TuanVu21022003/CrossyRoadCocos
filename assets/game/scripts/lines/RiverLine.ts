import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import { BaseLine } from './BaseLine';
const { ccclass, property } = _decorator;

@ccclass('RiverLine')
export class RiverLine extends BaseLine {
    @property(Prefab)
    groundPrefab: Prefab

    generateGround(index) {
        if(this.ground == null) {

            this.ground = instantiate(this.groundPrefab)
            this.ground.parent = this.node
        }
    }
}


