const csrftoken1= Cookies.get("csrftoken");
async function topalarm() {
    try{
        const response = await fetch("http://43.202.121.88/api/dounut", {
            method: "GET",
            headers: {
                "X-CSRFToken": csrftoken1,
                "Content-Type": "application/json",
            },
        });
    const data = await response.json();
    return data
    } catch (error){
        console.error('Error:', error);
    }
}
topalarm().then(data => alarm_icon_func(data)).catch(error => console.error(error));
async function alarm_icon_func (data){
    var total_nonresponse = data[0]['state_1_count'];
    if (total_nonresponse == 'NaN'){
        total_nonresponse = 0
    }
    total_nonresponse = parseInt(total_nonresponse);
        // 상단 바 icon 및 내용 바꾸기
        const belltext = document.querySelector('.new');
        let bellnumber = parseInt(total_nonresponse);
        if (bellnumber!= 0 && bellnumber > 0){
            img_src= '/../static/images/alarmicon.svg';
            belltext.innerHTML = `신규알람 ${total_nonresponse}건<a href="/site_admin/detail/"> <img class='bell' src=${img_src}></a>`;
        }else{
            img_src = '/../static/images/bell.svg';
            belltext.innerHTML = `신규알람 ${total_nonresponse}건 <a href="/site_admin/detail/"> <img class='bell' src=${img_src}></a>`;
        }
}