window.onload = () => {
  return fetch('/tasks')
    .then(response => response.json())
    .then(response => {
      const taskArea = document.getElementById('taskArea');
      for (let i = 0; i < response.length; i += 1) {
        const li = document.createElement('li');
        li.innerHTML = response[i]['description'];
        taskArea.appendChild(li);
      }
    })
    .catch(error => console.log('error in fetching tasks: ', error));
}