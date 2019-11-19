let money = 1000;
let port;
onmessage = function(e) {
    if (e.data.type === 'init') {
        port = e.ports[0];
        port.onmessage = function({data}) {
            money += data;
            port.postMessage({type: 'done'});
        }
    }
};
