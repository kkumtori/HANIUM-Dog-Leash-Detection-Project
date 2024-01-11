
//---------------------------------------시간별 알림 횟수------------------------//
const csrftoken1= Cookies.get("csrftoken");
async function fetchData1() {
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

fetchData1().then(data => createdoughnut(data)).catch(error => console.error(error));
var img_src;
// 도넛 차트
async function createdoughnut(data) {
    // 데이터 분리
    var total_num = data[0]['all_count']
    var total_delete = data[0]['state_3_count'];
    var total_accept = data[0]['state_2_count'];
    var total_nonresponse = data[0]['state_1_count'];
    //숫자변환
    total_accept = parseInt(total_accept);
    total_delete = parseInt(total_delete);
    total_nonresponse = parseInt(total_nonresponse);
    // 건수 수정.
    const accept_num = document.querySelector('#todaytop #chartnumber');
    const accept_percent = document.querySelector('#todaytop #chartpercent');
    const delete_num = document.querySelector('#todaymiddle #chartnumber');
    const delete_percent = document.querySelector('#todaymiddle #chartpercent');
    const nonresposnse_num = document.querySelector('#todaybottom #chartnumber');
    const nonresposnse_percent = document.querySelector('#todaybottom #chartpercent');
    const total_count = document.getElementById('stext');
    if (total_num == 0){
        total_count.innerText = `${total_num}건`;
        accept_num.innerText = `${total_accept}건`;
        accept_percent.innerText = `${0}%`;
        delete_num.innerText = `${total_delete}건`;
        delete_percent.innerText = `${0}%`;
        nonresposnse_num.innerText = `${total_nonresponse}건`;
        nonresposnse_percent.innerText = `${0}%`; 
        total_accept =1
        total_delete =1
        total_nonresponse =1
    }
    else {
        total_count.innerText = `${total_num}건`;
        accept_num.innerText = `${total_accept}건`;
        accept_percent.innerText = `${Math.round(total_accept/total_num*100)}%`;
        delete_num.innerText = `${total_delete}건`;
        delete_percent.innerText = `${Math.round(total_delete/total_num*100)}%`;
        nonresposnse_num.innerText = `${total_nonresponse}건`;
        nonresposnse_percent.innerText = `${Math.round(total_nonresponse/total_num*100)}%`;    
    }

    // 전체 건수 바꾸기


    const ctx = document.getElementById('todaydoughnutchart');
    const myChart1 = new Chart(ctx, {
        type: 'doughnut',
        options: {
            responsive: true,
            plugins: {
                    legend: {
                        display: false
                    },
                }
                },
        data: {
            labels: [
                '접수 건수',
                '삭제 건수',
                '미완료 건수'
            ],
            datasets: [{
                label: ['TodaySumaary'],
                data: [total_accept, total_delete, total_nonresponse],
                backgroundColor: [
                '#10B981',
                '#6EE7B7',
                '#27272A',
                ],
                hoverOffset: 4
            }]
        },
    });
}

window.addEventListener('DOMContentLoaded', function()
{
    
});