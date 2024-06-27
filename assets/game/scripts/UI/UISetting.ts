import { _decorator, Component, Node } from 'cc';
import { UICanvas } from './UICanvas';
import { UIManager } from './UIManager';
import { UIGamePlay } from './UIGamePlay';
const { ccclass, property } = _decorator;

@ccclass('UISetting')
export class UISetting extends UICanvas {
    backButton() {
        this.close(0);
        
    }
}


