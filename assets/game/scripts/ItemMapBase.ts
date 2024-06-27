import { _decorator, Component, Enum, Node } from 'cc';
const { ccclass, property } = _decorator;

export enum ItemMapType {
    GROUND = 0,
    BARRIER = 1,
    DIE = 2,
    WOOD = 3
}

@ccclass('ItemMapBase')
export class ItemMapBase extends Component {
    @property({type : Enum(ItemMapType)})
    typeItemMap : ItemMapType
}


