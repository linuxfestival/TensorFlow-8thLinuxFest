/**
 * Created by sia on 5/13/16.
 */

sigma.utils.pkg('sigma.canvas.nodes');
sigma.canvas.nodes.image = (function () {
    var _cache = {},
        _loading = {},
        _callbacks = {};

    // Return the renderer itself:
    var renderer = function (node, context, settings) {
        var args = arguments,
            prefix = settings('prefix') || '',
            size = node[prefix + 'size'],
            color = node.color || settings('defaultNodeColor'),
            url = node.url;

        if (_cache[url]) {
            context.save();

            // Draw the clipping disc:
            context.beginPath();
            context.arc(
                node[prefix + 'x'],
                node[prefix + 'y'],
                node[prefix + 'size'],
                0,
                Math.PI * 2,
                true
            );
            context.closePath();
            context.clip();

            // Draw the image
            context.drawImage(
                _cache[url],
                node[prefix + 'x'] - size,
                node[prefix + 'y'] - size,
                2 * size,
                2 * size
            );

            // Quit the "clipping mode":
            context.restore();

            // Draw the border:
            context.beginPath();
            context.arc(
                node[prefix + 'x'],
                node[prefix + 'y'],
                node[prefix + 'size'],
                0,
                Math.PI * 2,
                true
            );
            context.lineWidth = size / 5;
            context.strokeStyle = node.color || settings('defaultNodeColor');
            context.stroke();
        } else {
            sigma.canvas.nodes.image.cache(url);
            sigma.canvas.nodes.def.apply(
                sigma.canvas.nodes,
                args
            );
        }
    };

    // Let's add a public method to cache images, to make it possible to
    // preload images before the initial rendering:
    renderer.cache = function (url, callback) {
        if (callback)
            _callbacks[url] = callback;

        if (_loading[url])
            return;

        var img = new Image();

        img.onload = function () {
            _loading[url] = false;
            _cache[url] = img;

            if (_callbacks[url]) {
                _callbacks[url].call(this, img);
                delete _callbacks[url];
            }
        };

        _loading[url] = true;
        img.src = url;
    };

    return renderer;
})();

// Now that's the renderer has been implemented, let's generate a graph
// to render:
var g = {
        nodes: [],
        edges: []
    },
    urls = [
        'img/plus_sym.jpg',
        'img/sub_sym.png',
    ],
    loaded = 0,
    colors = [
        '#ffffff', // White
        '#617db4', // Blue
        '#668f3c', // Green
        '#c6583e', // Red
        '#b956af', // Purple
        '#000000' // Black
    ];

// Nodes
// First Node
g.nodes.push({
    id: 'x0',
    label: 'x0',
    x: 0,
    y: 0,
    size: 20,
    color: colors[0]
});
g.nodes.push({
    id: 'w0',
    label: 'w0',
    x: 0,
    y: 5,
    size: 20,
    color: colors[0]
});
g.nodes.push({
    id: 'n0',
    label: '+ (sum)',
    x: 5,
    y: 0,
    size: 20,
    color: colors[3]
});

// Second Node
g.nodes.push({
    id: 'x1',
    label: 'x1',
    x: 0,
    y: 15,
    size: 20,
    color: colors[0]
});
g.nodes.push({
    id: 'w1',
    label: 'w1',
    x: 0,
    y: 18,
    size: 20,
    color: colors[0]
});
g.nodes.push({
    id: 'n1',
    label: '+ (sum)',
    x: 5,
    y: 20,
    size: 20,
    color: colors[3]
});
// Third Node
g.nodes.push({
    id: 'x2',
    label: 'x2',
    x: 0,
    y: 27,
    size: 20,
    color: colors[0]
});
g.nodes.push({
    id: 'w2',
    label: 'w2',
    x: 0,
    y: 33,
    size: 20,
    color: colors[0]
});
g.nodes.push({
    id: 'n3',
    label: '- (sub)',
    x: 5,
    y: 30,
    size: 20,
    color: colors[1]
});
// Fourth Node
g.nodes.push({
    id: 'n2',
    label: '* (mul)',
    x: 20,
    y: 5,
    size: 20,
    color: colors[4]
});
// Fifth Node
g.nodes.push({
    id: 'n4',
    label: '* (mul)',
    x: 20,
    y: 35,
    size: 20,
    color: colors[4]
});
// Sixth Node
g.nodes.push({
    id: 'n5',
    label: 'exp',
    x: 30,
    y: 25,
    size: 20,
    color: colors[2]
});

// ******************************************* //
// Edges
// First Node edges
g.edges.push({
    id: 'ee0',
    source: 'x0',
    target: 'n0',
    size: 20
});
g.edges.push({
    id: 'ee1',
    source: 'w0',
    target: 'n0',
    size: 20
});
g.edges.push({
    id: 'e0',
    source: 'n0',
    target: 'n2',
    size: 20
});
// Second Node edges
g.edges.push({
    id: 'ee2',
    source: 'x1',
    target: 'n1',
    size: 20
});
g.edges.push({
    id: 'ee3',
    source: 'w1',
    target: 'n1',
    size: 20
});
g.edges.push({
    id: 'e1',
    source: 'n1',
    target: 'n2',
    size: 20
});
// Third Node edges
g.edges.push({
    id: 'ee4',
    source: 'x2',
    target: 'n3',
    size: 20
});
g.edges.push({
    id: 'ee5',
    source: 'w2',
    target: 'n3',
    size: 20
});
g.edges.push({
    id: 'e6',
    source: 'n3',
    target: 'n4',
    size: 20
});
// Fourth Node
g.edges.push({
    id: 'e7',
    source: 'n2',
    target: 'n5',
    size: 20
});
// Fifth Node
g.edges.push({
    id: 'e4',
    source: 'n4',
    target: 'n5',
    size: 20
});

// Then, wait for all images to be loaded before instanciating sigma:
urls.forEach(function (url) {
    sigma.canvas.nodes.image.cache(
        url,
        function () {
            if (++loaded === urls.length)
            // Instantiate sigma:
                s = new sigma({
                    graph: g,
                    renderer: {
                        // IMPORTANT:
                        // This works only with the canvas renderer, so the
                        // renderer type set as "canvas" is necessary here.
                        container: document.getElementById('graph-container'),
                        type: 'canvas'
                    },
                    settings: {
                        minNodeSize: 8,
                        maxNodeSize: 16
                    }
                });
        }
    );
});