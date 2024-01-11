const csrftoken2= Cookies.get("csrftoken");
async function fetchData2() {
    try{
        const response = await fetch("http://43.202.121.88/api/main_time", {
            method: "GET",
            headers: {
                "X-CSRFToken": csrftoken2,
                "Content-Type": "application/json",
            },
        });
    const data1 = await response.json();
    return data1
    } catch (error){
        console.error('Error:', error);
    }
}
fetchData2().then(data => createtimechart(data)).catch(error => console.error(error));
async function createtimechart(data) {
    var time_data = [];
	// 증복 제거 후 locations에 location 넣기
    for (var i = 0; i < 24; i++) {
        var found = false;
    
        for (var j = 0; j < data.length; j++) {
            if (parseInt(data[j].hour_group) == i) {
                time_data.push(data[j].alarm_count);
                found = true;
                break;
            }
        }
        // 해당 시간대의 데이터가 없으면 0 추가
        if (!found) {
            time_data.push(0);
        }
    }

    const ctx2 = document.getElementById('todaytimechart')
    const timeChart = new Chart(ctx2, {
        type: 'line',
        data: {
            //labels: data.hourly_data.map(item => item.hour_format), // 시간대 레이블 데이터
            labels:['0AM', '1AM','2AM','3AM','4AM','5AM','6AM','7AM','8AM','9AM','10AM','11AM','12PM','1PM','2PM','3PM','4PM','5PM','6PM','7PM','8PM','9PM','10PM','11PM'],
            datasets: [{
                data : time_data,
                backgroundColor: '#10B981',
                borderColor: '#10B981',
                fill: false,
                borderWidth:2,
                tension: 0.1,
                pointRadius : 0,
            }
        ],
        },
        options: {
            aspectRatio: null,
            scales: {
                x: {
                    grid:{
                        borderWidth: 2,
                        borderColor: 'rgba(235, 235, 235, 1',
                    },
                    ticks: {
                            font: {
                                size: 11,
                                style: 'normal',
                                weight: 700,
                                family: 'Spoqa Han Sans Neo', // y축 레이블 폰트 패밀리 
                            },
                            color: '#A1A1AA',
                            },
                    }, 
                y: {
                beginAtZero: true,
                grid:{
                    borderWidth: 2,
                    borderColor: 'rgba(235, 235, 235, 1)',
                },
                ticks: {
                        font: {
                            size: 11,
                            style: 'normal',
                            weight: 700,
                            family: 'Spoqa Han Sans Neo', // y축 레이블 폰트 패밀리 
                        },
                        color: '#A1A1AA',
                        },
                }
            },  
            plugins: {
                legend: {
                    display: false}
            ,}
        },
    });
};