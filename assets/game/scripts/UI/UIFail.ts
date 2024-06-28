import { _decorator, Component, Label, Node } from 'cc';
import { UICanvas } from './UICanvas';
import { GameManager } from '../GameManager';
const { ccclass, property } = _decorator;

@ccclass('UIFail')
export class UIFail extends UICanvas {
    @property(Label)
    score: Label

    retry() {
        this.close(0)
        GameManager.Instance.onInit()
    }

    updateScore(score) {
        this.score.string = score
    }
}


