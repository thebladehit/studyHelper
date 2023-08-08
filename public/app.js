const list = document.querySelector('#card');

if (list) {
  list.addEventListener('click', (event) => {
    if (event.target.classList.contains('js-remove')) {
      const id = event.target.dataset.id;

      fetch('list/delete/' + id, { method: 'delete' })
        .then(res => res.json())
        .then(newList => {
          if (newList.length) {
            const html = newList.map(c => {
              return `
              <tr>
                <td>${c.name}</td>
                <td>${c.teacher}</td>
                <td>
                  <button class="btn btn-small js-remove" data-id="${c.id}">Delete</button>
                </td>
              </tr>
              `
            }).join('');
            list.querySelector('tbody').innerHTML = html;
          } else {
            list.innerHTML = '<p>List is empty.</p>'
          }
        })
    }
  });
}
