import { _decorator, Component, Label, Node } from 'cc';
import { UICanvas } from './UICanvas';
import { UIManager } from './UIManager';
import { UISetting } from './UISetting';
import { GameManager } from '../GameManager';
const { ccclass, property } = _decorator;

@ccclass('UIGamePlay')
export class UIGamePlay extends UICanvas {
    @property(Label)
    score: Label

    settingButton() {
        GameManager.Instance.onInit()
    }

    updateScore(score) {
        this.score.string = "Score: " + score
    }
}


