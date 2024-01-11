const csrftoken = Cookies.get("csrftoken");

fetch("https://okaydogie-api.store/api/informations/",{
  method: "GET",
        headers: {
            "X-CSRFToken": csrftoken,
            "Content-Type": "application/json",
        },
  })
    .then(response => response.json())
    .then(data => {
        console.log("data", data)
        var tbody = document.getElementById("info_table_tbody")
        for(let i=0; i<data.length; i++){
          
          temp = document.createElement('tr')
        
          camera = document.createElement('td')
          camera.innerHTML = data[i]['camera']
          temp.appendChild(camera)

          image = document.createElement('td')
          imgElement = document.createElement("img")
          imgElement.src = data[i]['image']
          imgElement.style.width = "50px"
          imgElement.style.height = "50px"
          image.appendChild(imgElement)
          temp.appendChild(image)
          
          dateTime = document.createElement('td')
          dateTime.innerHTML = data[i]['dateTime']
          temp.appendChild(dateTime)
          
          loc = document.createElement('td')
          loc.innerHTML = data[i]['location']
          temp.appendChild(loc)

          add = document.createElement('td')
          add.innerHTML = data[i]['add']
          temp.appendChild(add)

          response = document.createElement('td')
          accept = document.createElement('button')
          accept.innerHTML = "접수"
          del = document.createElement('button')
          del.innerHTML = "삭제"
          response.appendChild(accept)
          response.appendChild(del)
          temp.appendChild(response)

          tbody.appendChild(temp)
        }
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
