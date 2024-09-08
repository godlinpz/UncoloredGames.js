import randomInt from "../../random/randomInt.mjs";
import randomFloat from "../../random/randomFloat.mjs";

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

ctx.fillStyle = 'black';
ctx.fillRect(0, 0, canvas.width, canvas.height);
const depthColors = ['white', 'green', 'yellow', 'red', 'blue', 'gray', 'orange', 'cyan', 'violet', 'beige', '#AA0000', '#770000', '#440000', '#220000'];

class DungeonPartition {
    constructor(options) {
        Object.assign(this, {
            topLeft: [0, 0],
            size: [canvas.width, canvas.height],
            minSize: [100,  100],
            depth: 0,
            minDepth: 3,
            splitChance: 0.6,       
            splitDir: null, // splitted: 0 - verticaly, 1 - horizontaly
            children: [],
            room: null,
            canvas: null,          
            ctx: null, 
            parent:  null,
            bridge: null,
            area: null,
        }, options);
    }

    splitInDirection(dir) {
        let splitted = false;

        const {size, depth, minDepth, splitChance, canvas, ctx, minSize, topLeft} = this;
        const minSizeDir = this.minSize[dir];
        const topLeftDir = topLeft[dir];
        const sizeDir = size[dir];

        if (sizeDir >= minSizeDir * 2 
            && (depth < minDepth 
                || randomFloat() < splitChance 
                || size[dir]/size[1 - dir] > 3
               )
            )
        {
            this.splitDir = dir;
            const splitPoint = randomInt(topLeftDir + minSizeDir, topLeftDir + sizeDir - minSizeDir);

            const children = [null, null].map(() => {
                return new DungeonPartition({ 
                    depth: depth + 1,
                    topLeft: [...topLeft], 
                    size: [...size],
                    minSize, 
                    minDepth, 
                    splitChance, 
                    canvas, 
                    ctx, 
                    parent: this,
                })
            });

            children[0].size[dir] = splitPoint - topLeftDir;
            children[1].size[dir] = topLeftDir + sizeDir - splitPoint;
            children[1].topLeft[dir] = splitPoint;

            this.children = children;

            splitted = true;
        }

        return splitted;
    }
    
    split() {
        const dir = randomInt(0, 1);
        let splitted = this.splitInDirection(dir) || this.splitInDirection(1 - dir);
            
        if (!splitted) 
            this.createRoom();
            
        let area = this.updateArea();        

        // area.center = [area.topLeft[0] + (area.size[0]/2)

        return { ...area }
    }

    updateArea() {
        if (this.children.length) {
            let area = {};
            const childSizes = this.children.map(child => child.split());

            const { topLeft: [x0, y0], size: [w0, h0] } = childSizes[0];
            const { topLeft: [x1, y1], size: [w1, h1] } = childSizes[1];

            area.topLeft = [ Math.min(x0, x1), Math.min(y0, y1)];

            area.size =
                [ Math.max(x0 + w0, x1 + w1) - area.topLeft[0],
                Math.max(y0 + h0, y1 + h1) - area.topLeft[1]];

            this.area = area;
        }
        else this.area = this.room;
        return this.area;
    }

    createRoom() {
        const { topLeft, size } = this;
        this.room = { 
            size: [ randomInt( size[0]*0.6 |0, size[0] - 2 ),
                    randomInt( size[1]*0.6 |0, size[1] - 2 ) ]
        }
        this.room.topLeft = 
            [   topLeft[0] + randomInt(1, size[0] - this.room.size[0] - 2 ), 
                topLeft[1] + randomInt(1, size[1] - this.room.size[1] - 2 )]; 

        return this.room;
    }

    render() {
        const { ctx, topLeft, depth, size, room, area, bridge, children } = this;

        // ctx.fillStyle = 'black';
        // const padding = 5;
        // // const coords = [topLeft[0] + padding, topLeft[1] + padding, size[0] - 2 * padding, size[1] - 2 * padding];
        // const coords = [...topLeft, ... size];
        // ctx.fillRect(...coords);

        if (room) {
            ctx.fillStyle = depthColors[depth];
            ctx.fillRect(...room.topLeft, ...room.size);
        }

        ctx.strokeStyle = 'white';
        ctx.beginPath();
        // ctx.rect(...coords);
        ctx.rect(...area.topLeft, ...area.size);
        ctx.stroke();
        
        ctx.fillStyle = 'white';
        ctx.fillText(depth, topLeft[0] + 10, topLeft[1] + 20); 

        children.forEach(child => child.render());
        if(bridge) {
            ctx.strokeStyle = 'green';
            ctx.beginPath();
            ctx.moveTo(...bridge.from);
            ctx.lineTo(...bridge.to);
            ctx.stroke();
        }
    }

    buildBriges() {
        this.buildBrige();
        this.children.forEach(child => child.buildBriges());
    }

    buildBrige() {
        if (this.children.length) {
            const   { children: [
                        { area: { topLeft: topLeftFrom, size: sizeFrom } }, 
                        { area: { topLeft: topLeftTo, size: sizeTo } }
                    ]} = this;
                    
            const [xFrom, yFrom] = topLeftFrom;
            const [wFrom, hFrom] = sizeFrom;
            const [xTo, yTo] = topLeftTo;
            const [wTo, hTo] = sizeTo;
            const dir = this.splitDir;
            const dirOrto = 1 - dir;
            
            const corridorMainAxis = randomInt(
                Math.max(topLeftFrom[dirOrto], topLeftTo[dirOrto]), 
                Math.min(topLeftFrom[dirOrto] + sizeFrom[dirOrto], topLeftTo[dirOrto] + sizeTo[dirOrto])
            );

            // this.bridge = {
            //     from: [xFrom + (wFrom/2 |0), yFrom + (hFrom/2 |0)], 
            //     to:   [xTo + (wTo/2 |0), yTo + (hTo/2 |0)],
            // }; 
            const from = [], to = [];
            
            from[dirOrto] = corridorMainAxis;
            from[dir] = topLeftFrom[dir] + (sizeFrom[dir]/2 |0);
            to[dirOrto] = corridorMainAxis;
            to[dir] = topLeftTo[dir] + (sizeTo[dir]/2 |0);

            this.bridge = { from, to }; 
            
            // this.children.forEach(child => child.bridge = bridge);
        }
    }

}

const root = new DungeonPartition({canvas, ctx});

root.split();
root.buildBriges();
root.render();