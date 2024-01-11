const csrftoken = Cookies.get("csrftoken");

async function fetchData() {
    const response = await fetch("http://43.202.121.88/api/informations", {
        method: "GET",
        headers: {  
            "X-CSRFToken": csrftoken,
            "Content-Type": "application/json",
        },
    });
    data = await response.json();
    // console.log("datadatadatadata",data)
    return data
    //addEventListeners();
}
var error_image = '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';
function createTable(pageData) {
    document.getElementById("info_table_tbody");

    for(let i=0; i<pageData.length; i++){
        let tbody;
        if (i < 6) {
            tbody = document.getElementById("info_table_tbody");
        }  else {
            break;
        }
        
        let temp = document.createElement('tr');
        image = document.createElement('td')
        imgElement = document.createElement("img")
        imgElement.onerror = function() {
            this.src = 'data:image:image/jpeg;base64,'+ error_image
        }
        imgElement.src = 'data:image/jpeg;base64,' + pageData[i]['image']
    
        imgElement.style.width = "140px"
        imgElement.style.height = "80px"
        image.appendChild(imgElement)


        loc = document.createElement('td')
        loc.insertAdjacentHTML("afterbegin",pageData[i]['location']) //loc.innerHTML=data[i]['location']

        
        dateTime = document.createElement('td')
        dateTime.insertAdjacentHTML("afterbegin",pageData[i]['dateTime']) 
        response = document.createElement('td')
        response.setAttribute('id','action') //jiye 추가

        if (pageData[i]['state'] == 1){
            temp.setAttribute('class', 'new_alarm') //jiye추가
            temp.setAttribute('id', pageData[i]['seq']);
            accept = document.createElement('button')
            accept.setAttribute('class', 'accept') //'id'->'class'
            accept.setAttribute('onclick', 'acceptbuttonsetting()')
            accept.innerText = "접수" //innerHTML -> innerText
            del = document.createElement('button')
            del.setAttribute('class', 'delete'); //'id'->'class'
            del.setAttribute('onclick', 'deletebuttonsetting()')
            del.innerText = "삭제" //innerHTML -> innerText
            response.appendChild(accept)
            response.appendChild(del)
        }
        else if (pageData[i]['state'] == 2){
            temp.setAttribute('class', 'old_alarm');
            temp.setAttribute('id', pageData[i]['seq']);
            response.textContent = '접수 완료';
        }
        else{
            temp.setAttribute('class', 'old_alarm_d');
            temp.setAttribute('id', pageData[i]['seq']);
            response.textContent = '삭제 완료';
        }
        temp.appendChild(image)
        temp.appendChild(loc)
        temp.appendChild(dateTime)
        temp.appendChild(response)
        tbody.appendChild(temp)
    }
}

fetchData().then(data => {
    createTable(data);    
});
