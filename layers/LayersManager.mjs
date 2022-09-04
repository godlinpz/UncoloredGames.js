import EventSourceMixin from "../EventSourceMixin.mjs";

class LayersManager 
{
    constructor() 
    {
        this.layers = [];
    }

    findLayerByName(name)
    {
        return this.layers.find( l => l.name === name);
    }

    add(layer, pos = this.layers.length) 
    {
        this.layers.splice(pos, 0, layer);
        layer.onAdd && layer.onAdd(pos);
        this.trigger('added', layer, pos);
        this.onOrderChanged(pos);
    }

    remove(layer) 
    {
        const pos = this.layers.indexOf(layer);
        this.removeAt(pos);
    }

    removeAt(pos) 
    {
        const layer = this.layers[pos];
        if(layer) 
        {
            this.layers.splice(pos, 1);
            layer.onRemoved && layer.onRemoved(pos);
            this.trigger('removed', layer, pos);
            this.onOrderChanged(pos);
        }
    }

    onOrderChanged(posFrom = 0, posTo = this.layers.length - 1) {
        for (let i = posFrom; i <= posTo; ++i)
            this.layers[i].onOrderChanged && this.layers[i].onOrderChanged(i);

        this.trigger('order-changed', posFrom, posTo);
    }

    getLayerIndex(layer) 
    {
        return this.layers.indexOf(layer);
    }

    move(posFrom, posTo)
    {
        const layer = this.layers[posFrom];
        if(layer)
        {
            if(posTo > this.layers.length)
                posTo = this.layers.length;
            else if(posTo < 0)
                posTo = this.layers.length + posTo;
    
            this.layers.splice(posFrom, 1);
            this.layers.splice(posTo, 0, layer);
    
            const changedFrom = Math.min(posFrom, posTo);
            const changedTo = Math.max(posFrom, posTo);

            this.onOrderChanged(changedFrom, changedTo);
        }
    }

    moveUp(pos)
    {
        this.move(pos, pos+1);
    }

    moveDown(pos)
    {
        this.move(pos, pos-1);
    }

    compact()
    {
        const layers = [];
        let changedFrom = null;

        for (let i = 0; i < this.layers.length; ++i)
        {
            const layer = this.layers[i];
            if (layer)
            {
                const n = layers.length;
                layers[n] = layer;
                if (changedFrom === null && n !== i) 
                    changedFrom = n;
            }
        }

        this.layers = layers;
        
        if (changedFrom !== null)
            this.onOrderChanged(changedFrom);
    }

    [Symbol.iterator]() 
    {
        let n = -1;
        const me = this;
        return {
            next() 
            {
                ++n;
                return {value: me.layers[n], done: n == me.layers.length};
            }
        };
    }
}

Object.assign(LayersManager.prototype, EventSourceMixin);

export default LayersManager;
