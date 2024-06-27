import { _decorator, Component, Node } from 'cc';
import { UICanvas } from './UICanvas';
import { UIManager } from './UIManager';
import { UISetting } from './UISetting';
import { GameManager } from '../GameManager';
const { ccclass, property } = _decorator;

@ccclass('UIGamePlay')
export class UIGamePlay extends UICanvas {
    settingButton() {
        GameManager.Instance.onInit()
    }
}


