import { _decorator, CCFloat, ColliderComponent, Component, easing, find, geometry, Graphics, Input, input, Node, PhysicsSystem, tween, Vec3 } from 'cc';
import { ChickenAnim } from './ChickenAnim';
import { GameManager } from './GameManager';
import { ItemMapBase, ItemMapType } from './ItemMapBase';
import { UIManager } from './UI/UIManager';
import { UIFail } from './UI/UIFail';
const { ccclass, property } = _decorator;

export enum DirectionType {
    UP = 0,
    DOWN = 1,
    LEFT = 2,
    RIGHT = 3
}

@ccclass('Player')
export class Player extends Component {
    private touchStart: Vec3
    private touchEnd: Vec3
    private direction: Vec3

    @property(CCFloat)
    swipeRange: number = 100

    @property(ChickenAnim)
    anim: ChickenAnim = null

    @property(CCFloat)
    timeMove: number = 0.2

    private isDie: boolean = false

    private angleChicken: number = 0
    private directionType: DirectionType = DirectionType.UP
    private level: number = 0
    private posSave: number = 0

    protected onLoad(): void {
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    start() {
        let collider = this.node.getComponent(ColliderComponent);
        collider.on('onTriggerEnter', this.onTriggerEnter, this);
    }

    onTriggerEnter(event) {
        let itemMap: ItemMapBase = event.otherCollider.node.getComponent(ItemMapBase)
        if (itemMap.typeItemMap === ItemMapType.DIE) {
            GameManager.Instance.diePlayer()
        }
    }

    onTouchStart(event) {
        this.touchStart = event.getUILocation()
    }

    onTouchEnd(event) {
        this.touchEnd = event.getUILocation()
        let swipeDirection = this.touchEnd.subtract(this.touchStart)
        if (swipeDirection.length() > this.swipeRange) {
            if (Math.abs(swipeDirection.x) > Math.abs(swipeDirection.y)) {
                if (swipeDirection.x > 0) {
                    this.setDirection(new Vec3(-2, 0, 0), -90, DirectionType.RIGHT)
                }
                else {
                    this.setDirection(new Vec3(2, 0, 0), 90, DirectionType.LEFT)
                }
            }
            else {
                if (swipeDirection.y > 0) {
                    this.setDirection(new Vec3(0, 0, 2), 0, DirectionType.UP)
                }
                else {
                    this.setDirection(new Vec3(0, 0, -2), -180, DirectionType.DOWN)
                }
            }
            this.rotate(this.angleChicken)
            this.move(this.direction)

        }

    }

    move(direction: Vec3) {
        let typeItem = this.checkMove(direction)
        if (typeItem !== ItemMapType.BARRIER) {
            this.anim.jump(this.timeMove / 2)
            let pos = this.node.getPosition()
            pos = pos.clone().add(direction)
            GameManager.Instance.cameraFollow.followPlayer(pos, this.directionType)
            tween(this.node)
                .to(
                    0.2,
                    { position: pos },
                )
                .call(() => {
                    if (typeItem != null) {
                        console.log(ItemMapType[typeItem])
                    }
                    this.updateLevel()
                })
                .start()

        }

    }

    rotate(angle: number) {
        this.node.setRotationFromEuler(new Vec3(0, angle, 0))
    }


    setDirection(direction: Vec3, angle: number, directionType: DirectionType) {
        this.direction = direction;
        this.angleChicken = angle;
        this.directionType = directionType
    }

    getPos() {
        return this.node.getPosition()
    }

    checkMove(direction) {
        let startPos = this.node.getPosition().add(direction).add(new Vec3(0, 20, 0))
        // Biến chứa kết quả của raycast

        let ray = new geometry.Ray(startPos.x, startPos.y, startPos.z, 0, -50, 0);
        // Thực hiện raycast
        if (PhysicsSystem.instance.raycast(ray, 0xffffffff, 50, true)) {
            let results = PhysicsSystem.instance.raycastResults;
            let result = results[0]
            let typeItem = result.collider.node.getComponent(ItemMapBase).typeItemMap
            return typeItem
        }
        return null
    }

    updateLevel() {
        if (this.directionType === DirectionType.UP) {
            this.posSave += 1;
            if (this.posSave > this.level) {
                this.level += 1;
                setTimeout(() => {

                    GameManager.Instance.onHandleLine()
                }, 1000)
            }
        }
        else if (this.directionType === DirectionType.DOWN) {
            this.posSave -= 1;
        }
        // console.log("POSSAVE: " + this.posSave + "--->" + "LEVEL " + this.level)
    }

    getIsDie() {
        return this.isDie
    }

    setIsDie(active: boolean) {
        this.isDie = active
    }

    reset() {
        this.activeController(true)
        this.node.setPosition(0, 1, 0)
        this.level = 0;
        this.posSave = 0;
        this.isDie = false;
    }

    activeController(active) {
        if (active) {
            input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
            input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        }
        else {
            input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
            input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        }
    }
}


