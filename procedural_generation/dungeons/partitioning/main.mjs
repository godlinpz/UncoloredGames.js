import randomInt from "../../random/randomInt.mjs";
import randomFloat from "../../random/randomFloat.mjs";

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

ctx.fillStyle = 'black';
ctx.fillRect(0, 0, canvas.width, canvas.height);
const depthColors = ['white', 'green', 'yellow', 'red', 'blue', 'gray', 'orange', 'cyan', 'violet', 'beige', 'black'];

class DungeonPartition {
    constructor(options) {
        Object.assign(this, {
            topLeft: [0, 0],
            size: [canvas.width, canvas.height],
            minSize: [90, 90],
            depth: 0,
            minDepth: 3,
            splitChance: 0.6,       
            children: [],
            room: null,
            canvas: null,          
            ctx: null,   
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
                || size[dir]/size[1 - dir] > 3))
        {
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
        let splitted = this.splitInDirection(dir);
        if (!splitted)
            splitted = this.splitInDirection(1 - dir);
        
        if(splitted) 
            this.children.forEach(child => child.split());

    }

    render() {
        const { ctx, topLeft, depth, size } = this;
        ctx.fillStyle = depthColors[depth];
        const padding = 5;
        const coords = [topLeft[0] + padding, topLeft[1] + padding, size[0] - 2 * padding, size[1] - 2 * padding];
        // const coords = [...topLeft, ... size];
        ctx.fillRect(...coords);

        ctx.strokeStyle = 'black';
        ctx.beginPath();
        ctx.rect(...coords);
        ctx.stroke();

        ctx.fillStyle = 'black';
        ctx.fillText(depth, topLeft[0] + 10, topLeft[1] + 20); 

        setTimeout(() =>  this.children.forEach(child => child.render()), 1000 + randomInt(0, 1000));

    }
}

const root = new DungeonPartition({canvas, ctx});

root.split();
root.render();