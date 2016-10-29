function get (url){
    return new Promise(function (resolve, reject){
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.onreadystatechange = function (e){
            if (xhr.readyState !== 4)
                return;
            if ([0, 200, 304].indexOf(xhr.status) === -1)
                reject();
            else
                resolve(e.target.response);
        };
        xhr.send(null);
    });
}
