import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ObjectPooling')
export class ObjectPooling extends Component {
    public static Instance: ObjectPooling

    protected onLoad(): void {
        if (ObjectPooling.Instance == null) {
            ObjectPooling.Instance = this;
        }
        else {
            this.destroy();
        }
    }

    poolObject: Map<Prefab, Array<Node>> = new Map<Prefab, Array<Node>>()

    public GetObject(key : Prefab) : Node {
        let itemPool : Array<Node> = new Array<Node>()
        if(!this.poolObject.has(key)) {
            this.poolObject.set(key, itemPool)
        }
        else {
            itemPool = this.poolObject.get(key)
        }

        for(var g of itemPool) {
            if(g.active) {
                continue;
            }
            console.log("SINH LAI")
            return g
        }

        let g2: Node = instantiate(key)
        g2.active = false
        itemPool.push(g2)
        this.poolObject.set(key, itemPool)
        return g2
    }
}


