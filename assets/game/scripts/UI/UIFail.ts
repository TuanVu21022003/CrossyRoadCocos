import { _decorator, Component, Node } from 'cc';
import { UICanvas } from './UICanvas';
import { GameManager } from '../GameManager';
const { ccclass, property } = _decorator;

@ccclass('UIFail')
export class UIFail extends UICanvas {
    retry() {
        this.close(0)
        GameManager.Instance.onInit()
    }
}


