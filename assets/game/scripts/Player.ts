import { _decorator, CCFloat, ColliderComponent, Component, easing, find, geometry, Graphics, Input, input, instantiate, Node, PhysicsSystem, Prefab, tween, Vec3 } from 'cc';
import { ChickenAnim } from './ChickenAnim';
import { GameManager } from './GameManager';
import { ItemMapBase, ItemMapType } from './ItemMapBase';
import { UIManager } from './UI/UIManager';
import { UIFail } from './UI/UIFail';
import { UIGamePlay } from './UI/UIGamePlay';
import { Vehical } from './Vehical';
const { ccclass, property } = _decorator;

export enum DirectionType {
    UP = 0,
    DOWN = 1,
    LEFT = 2,
    RIGHT = 3
}

@ccclass('Player')
export class Player extends Component {



    @property(CCFloat)
    swipeRange: number = 50

    @property(ChickenAnim)
    anim: ChickenAnim = null

    @property(CCFloat)
    timeMove: number = 0.2

    @property(Prefab)
    linePrefab: Prefab

    private touchStart: Vec3
    private touchEnd: Vec3
    private direction: Vec3

    private isDie: boolean = false
    private isWood: boolean = false

    private angleChicken: number = 0
    private directionType: DirectionType = DirectionType.UP
    private level: number = 0
    private posSave: number = 0

    private wood: Node = null
    private posCurrent: Vec3
    private tweenCurrent: any
    collider : ColliderComponent
    protected onLoad(): void {
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    start() {
        this.collider = this.node.getComponent(ColliderComponent);
        
    }

    onTriggerEnter(event) {
        let itemMap: ItemMapBase = event.otherCollider.node.getComponent(ItemMapBase)
        if (itemMap.typeItemMap === ItemMapType.DIE) {
            GameManager.Instance.diePlayer()
            if(this.tweenCurrent != null) {

                this.tweenCurrent.stop();
            }
            this.tweenCurrent = null
        }
        if (itemMap.typeItemMap === ItemMapType.WOOD) {
            this.wood = itemMap.node
            this.updateLevel()
            if(this.tweenCurrent != null) {
                
                this.tweenCurrent.stop();
            }
            this.tweenCurrent = null
            tween(this.node).to(0.05, {position : this.wood.getWorldPosition().clone().add(new Vec3(0, 0.8, 0))}).call(() => {
                this.isWood = true
            }).start()
            let parent = itemMap.node.parent.getComponent(Vehical)
            let time = 1
            console.log("POS1: " + this.posCurrent.x + "----> " + "POS2 : " + this.posCurrent.clone().add(new Vec3(parent.caculateDistance(time), 0, 0)).x)
            GameManager.Instance.cameraFollow.followWood(this.posCurrent.clone().add(new Vec3(parent.caculateDistance(time), 0, 0)), time, parent.speed * parent.horizontal)
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


        }
        else {
            this.setDirection(new Vec3(0, 0, 2), 0, DirectionType.UP)
        }
        this.rotate(this.angleChicken)
        this.move(this.direction)

    }

    protected update(dt: number): void {
        if (this.isWood) {
            this.node.setPosition(this.wood.getWorldPosition().add(new Vec3(0, 0.8, 0)))
            this.posCurrent = this.node.getPosition()
            if(Math.abs(this.posCurrent.x) > 9 && !this.isDie) {
                GameManager.Instance.diePlayer()
            }
        }
    }

    move(direction: Vec3) {
        let typeItem = this.checkMove(direction)
        if (typeItem !== ItemMapType.BARRIER) {
            this.anim.jump(this.timeMove / 2)
            let pos = this.posCurrent
            this.wood = null
            this.isWood = false
            GameManager.Instance.cameraFollow.setIsMove(true)
            GameManager.Instance.cameraFollow.setIsWood(false)
            
            pos = pos.clone().add(direction)
            let result = this.decimalRemainder(pos.x, 2)
            if (result[1] > 1) {
                pos = new Vec3((result[0] + 1) * 2, pos.y, pos.z)
            }
            else {
                pos = new Vec3((result[0]) * 2, pos.y, pos.z)
            }
            this.posCurrent = pos
            GameManager.Instance.cameraFollow.followPlayer(pos, this.directionType)
            this.tweenCurrent = tween(this.node)
                .to(
                    this.timeMove,
                    { position: pos },
                )
                .call(() => {
                    if (typeItem != null) {

                        if (typeItem === ItemMapType.DIE || typeItem === ItemMapType.WOOD) {
                            if (this.wood == null) {

                                GameManager.Instance.diePlayer()
                            }
                        }
                    }
                    this.updateLevel()
                })
                .start()

        }

    }

    decimalRemainder(dividend: number, divisor: number) {
        const quotient = Math.floor(dividend / divisor);
        const remainder = dividend - (quotient * divisor);
        return [quotient, remainder];
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
        let startPos = this.node.getPosition().add(direction).add(new Vec3(0, 5, 0))
        // Biến chứa kết quả của raycast

        let ray = new geometry.Ray(startPos.x, startPos.y, startPos.z, 0, -1, 0);
        // Thực hiện raycast
        if (PhysicsSystem.instance.raycast(ray, 0xffffffff, 20, true)) {
            let results = PhysicsSystem.instance.raycastResults;
            let result = results[0]
            let typeItem = result.collider.node.getComponent(ItemMapBase).typeItemMap
            console.log("TYPEITEM: " + ItemMapType[typeItem])
            return typeItem
        }
        // this.drawRay(startPos, startPos.clone().subtract(new Vec3(0, 50, 0)))
        return null
    }

    drawRay(start, end) {
        let tmp1 = instantiate(this.linePrefab)
        tmp1.parent = this.node.parent
        tmp1.setPosition(start)

        let tmp = instantiate(this.linePrefab)
        tmp.parent = this.node.parent
        tmp.setPosition(end)
    }

    updateLevel() {
        if (this.directionType === DirectionType.UP) {
            this.posSave += 1;
            if (this.posSave > this.level && !this.isDie) {
                this.level += 1;
                UIManager.Instance.getUI(UIGamePlay).updateScore(this.level)
                    GameManager.Instance.onHandleLine()
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
        this.node.active = !active
    }

    reset() {
        this.node.active = true
        this.activeController(true)
        this.node.setPosition(0, 0.8, 0)
        this.posCurrent = this.node.getPosition()
        this.level = 0;
        this.posSave = 0;
        this.setIsDie(false)
        this.wood = null
        this.node.setRotationFromEuler(new Vec3(0, 0, 0))
    }

    activeController(active) {
        if (active) {
            this.collider.on('onTriggerEnter', this.onTriggerEnter, this);
            input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
            input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        }
        else {
            this.collider.off('onTriggerEnter', this.onTriggerEnter, this);
            input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
            input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        }
    }
    getLevel() {
        return this.level
    }
}


