const csrftoken3= Cookies.get("csrftoken");
async function fetchData3() {
    try{
        const response = await fetch("http://43.202.121.88/api/main_location", {
            method: "GET",
            headers: {
                "X-CSRFToken": csrftoken3,
                "Content-Type": "application/json",
            },
        });
    const data1 = await response.json();
    return data1
    } catch (error){
        console.error('Error:', error);
    }
}

fetchData3().then(data => createplacechart(data)).catch(error => console.error(error));
async function createplacechart(data) {
    var place_data = [];
    var locations = []
    for (var i = 0; i < data.length; i++) {
		var location = data[i]['location'];
        var count = data[i]['location_count'];
        locations.push(location)
        place_data.push(count)
    }

    const ctx3 = document.getElementById('todayplacechart')
    const placeChart = new Chart(ctx3, {
        type: 'bar',
        data:{
            labels: locations,
            datasets: [{
                data: place_data,
                backgroundColor: [
                    'rgba(48, 201, 207, 0.3)',
                    'rgba(60, 206, 160, 0.3)',
                    'rgba(156, 193, 246, 0.3)',
                    'rgba(125, 223, 195, 0.3)',
                    'rgba(139, 128, 248, 0.3)',
                ],
                borderColor:[               
                    'rgba(48, 201, 207, 1)',
                    'rgba(60, 206, 160, 1)',
                    'rgba(156, 193, 246, 1)',
                    'rgba(125, 223, 195, 1)',
                    'rgba(139, 128, 248, 1)',
                ],
                borderWidth:1
                }]
        },
        options: {
            plugins: {
                legend: {
                    display: false}
                ,}
                ,
            scales: {
                x: {
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
                    }, 
                y: {
                    beginAtZero: true,
                    grid:{
                        borderWidth: 2,
                        borderColor: 'rgba(235, 235, 235, 1)',
                    },
                    ticks: {
                            font: {
                                stepSize : 2,
                                size: 11,
                                style: 'normal',
                                weight: 700,
                                family: 'Spoqa Han Sans Neo', // y축 레이블 폰트 패밀리 
                            },
                            color: '#A1A1AA',
                            },
                    }
            }
        },
    });
}