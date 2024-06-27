import { _decorator, Component, Node } from 'cc';
import { UICanvas } from './UICanvas';
import { GameManager } from '../GameManager';
import { UIManager } from './UIManager';
import { UIGamePlay } from './UIGamePlay';
const { ccclass, property } = _decorator;

@ccclass('UIHome')
export class UIHome extends UICanvas {
    play() {
        this.close(0)
        GameManager.Instance.onInit()
        UIManager.Instance.openUI(UIGamePlay)
    }
}


