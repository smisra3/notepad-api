window.onload = function() {
    console.log("DOM CONTENT LOADED");
    fetch("/tasks").then(function(response) {
        response.json().then(function(res) {
            var arr = [];
            for(var i=0;i<res.length;i++){
                arr.push(document.createElement('li').innerHTML = res[i]['description']); 
            }
            document.getElementById('taskArea').innerHTML = arr;
        });
    });
}