const list = document.querySelector('#card');

if (list) {
  list.addEventListener('click', (event) => {
    if (event.target.classList.contains('js-remove')) {
      const id = event.target.dataset.id;
      const csrf = event.target.dataset.csrf;

      fetch('list/delete/' + id, { 
        method: 'delete',
        headers: {
          'X-XSRF-TOKEN': csrf
        }
      })
        .then(res => res.json())
        .then(newList => {
          if (newList.list.length) {
            const newToken = newList.csrfToken;
            const html = newList.list.map(c => {
              return `
              <tr>
                <td>${c.name}</td>
                <td>${c.teacher}</td>
                <td>
                  <button class="btn btn-small js-remove" data-id="${c.id}" data-csrf="${newToken}">Delete</button>
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

M.Tabs.init(document.querySelectorAll('.tabs'));