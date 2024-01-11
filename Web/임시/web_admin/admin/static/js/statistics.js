const csrftoken = Cookies.get("csrftoken");

var selectedDate;
var dateParts;
var df1;
var df2;
var df3;

var timeCtx;
var timeChart;
var dayCtx;
var dayChart;
var monthCtx;
var monthChart;

var location_list, pallete;
location_list=['SeSAC1','SeSAC2','SeSAC3','SeSAC4','SeSAC5'] //location 리스트 여기에 저장됨
pallete=['rgba(48, 201, 207, 1)','rgba(60, 206, 160, 1)','rgba(156, 193, 246, 1)','rgba(125, 223, 195, 1)','rgba(139, 128, 248, 1)']

var today = new Date();    
today.setHours(today.getHours() + 9);  // 한국시간으로 조정
var utcYear = today.getUTCFullYear();
var utcMonth = ("0" + (today.getUTCMonth() + 1)).slice(-2);
var utcDay = ("0" + today.getUTCDate()).slice(-2);
selectedDate = `${utcYear}-${utcMonth}-${utcDay}`;
console.log(selectedDate) // 오늘 날짜 출력

dateParts = selectedDate.split("-");
console.log(dateParts[0]); //YYYY
console.log(dateParts[1]); //MM
console.log(dateParts[2]); //DD

async function fetchData1() { //시간별
    try{
        const response = await fetch("http://43.202.121.88//api/hour_location_graph", {
            method: "GET",
            headers: {
                "X-CSRFToken": csrftoken,
                "Content-Type": "application/json",
            },
        });
    const json_data1 = await response.json();
    return json_data1
    } catch (error){
        console.error('Error:', error);
    }
}
async function fetchData2() { //요일별
    try{
        const response = await fetch("http://43.202.121.88//api/day_location_graph", {
            method: "GET",
            headers: {
                "X-CSRFToken": csrftoken,
                "Content-Type": "application/json",
            },
        });
    const json_data2 = await response.json();
    return json_data2
    } catch (error){
        console.error('Error:', error);
    }
}
async function fetchData3() { //월별
    try{
        const response = await fetch("http://43.202.121.88//api/month_location_graph", {
            method: "GET",
            headers: {
                "X-CSRFToken": csrftoken,
                "Content-Type": "application/json",
            },
        });
    const json_data3 = await response.json();
    return json_data3
    } catch (error){
        console.error('Error:', error);
    }
}


async function createDF(df_type) {
    try {

        if (df_type==1){ //선택된 날짜 데이터만 고르기
            try{
                const json_data1 = await fetchData1()
                let t_dateParts=dateParts
                let filteredData1 = json_data1.filter(item => item.hour.startsWith(t_dateParts[0]+'-'+t_dateParts[1]+'-'+t_dateParts[2]))
                temp1 = new dfd.DataFrame(filteredData1)
                temp1.addColumn('HH',temp1['hour'].str.slice(11,13),{inplace:true})
                //temp1.print()
            } catch (error){
                // 데이터 없을 경우 예외처리
                temp1 = new dfd.DataFrame([[0,'0','0','0']], {columns: ["count",'hour','location','HH']})
            }
        } else if (df_type==2){ //선택된 기간 데이터만 고르기
            lst=calculateWeekRange(selectedDate);
            try{
                const json_data2 = await fetchData2()
                df2=new dfd.DataFrame(json_data2)
                df2['day']=df2['day'].str.replace('-','').str.replace('-','')
                df2.asType('day','int32',{inplace:true})
                temp2=df2.query(df2['day'].ge(lst[0]).and(df2['day'].le(lst[6])))
                temp2.print()
            } catch (error){
                
                temp2 = new dfd.DataFrame([[0,'0','0']], {columns: ["count",'day','location']})
            }
        } else if (df_type==3){ // 선택된 연도 데이터만 고르기
            try{
                const json_data3 = await fetchData3()
                let filteredData3 = json_data3.filter(item => item.month.startsWith(dateParts[0]))
                console.log(filteredData3)
                temp3 = new dfd.DataFrame(filteredData3)
                temp3.addColumn('MM',temp3['month'].str.slice(5,7),{inplace:true})
                //temp3.print()
            } catch (error){
                // 데이터 없을 경우 예외처리
                temp3 = new dfd.DataFrame([[0,'0','0','0']], {columns: ["count",'month','location','MM']})
            }
        }
        return 0
    } catch (error) {
        console.log(error)
    }
}

// 시간별 알림 차트
async function createDatasets1(){
    const df_result = await createDF(1);
    let init_datasets=[]
    let init_dataset={label: '',data: [],fill: false,
        borderColor: '',borderWidth:2,backgroundColor:'',tension: 0.1,pointRadius : 0,}

    for (let loc=0; loc<location_list.length;loc++){
        temp_loc=temp1.query(temp1['location'].eq(location_list[loc])).loc({columns: ['HH', 'count']});
        temp_loc_len=temp_loc.shape[0];

        temp_data=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        for (let i = 1; i <= temp_loc_len; i++) {
            temp_loc.resetIndex({inplace:true})
            time= Number(temp_loc.loc({rows:[i-1],columns:['HH','count']}).$data[0][0]);
            count= Number(temp_loc.loc({rows:[i-1],columns:['HH','count']}).$data[0][1]);
            temp_data[time-1]=count;
        }
        init_dataset.label=' '+location_list[loc]
        init_dataset.data=temp_data;
        init_dataset.borderColor=pallete[loc];
        init_dataset.backgroundColor=pallete[loc];
        
        //console.log(init_dataset);
        init_datasets.push({...init_dataset});
    }
    //console.log(init_datasets);
    return init_datasets;
}
async function drawChart1(){
    timeData=await createDatasets1();
    timeCtx = document.getElementById('timechart');
    timeChart = new Chart(timeCtx, {
        type: 'line',
        data: {
            //labels: data.hourly_data.map(item => item.hour_format), // 시간대 레이블 데이터
            labels:['1AM','2AM','3AM','4AM','5AM','6AM','7AM','8AM','9AM','10AM','11AM','12PM','1PM','2PM','3PM','4PM','5PM','6PM','7PM','8PM','9PM','10PM','11PM','0AM'],
            datasets: timeData,
        },
        options: {
            aspectRatio: null,
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
                            family: 'Spoqa Han Sans Neo', // x축 레이블 폰트 패밀리 
                        },
                        color:'#A1A1AA',
                    }, 
                }, 
                y:{
                    grid:{
                        borderWidth :2,
                        borderColor:'rgba(235, 235, 235,1)',
                    },
                    ticks:{
                        beginAtZero:false,
                        min :2,
                        stepSize :1
                    }
                }
            },  
            plugins:{
                legend:{
                    position:'bottom',
                    align:'start',
                    labels:{
                        usePointStyle:true,
                        font:{size :10 ,style :'normal' ,weight :400 ,family :'Spoqa Han Sans Neo' } ,
                        color:'#000' ,
                        padding :24
                    } ,
                    itemSpacing :20
                }
            }
        }
        // options: {
        //     aspectRatio: null,
        //     scales: {
        //         x: {
        //             grid:{
        //                 borderWidth: 2,
        //                 borderColor: 'rgba(235, 235, 235, 1)',
        //             },
        //             ticks: {
        //                     font: {
        //                         size: 11,
        //                         style: 'normal',
        //                         weight: 700,
        //                         family: 'Spoqa Han Sans Neo', // y축 레이블 폰트 패밀리 
        //                     },
        //                     color: '#A1A1AA',
        //                     },
        //             }, 
        //         y: {
        //             grid:{
        //                 borderWidth: 2,
        //                 borderColor:'rgba(235, 235, 235, 1)',
        //             },
        //             ticks: {
        //                     display:false,
        //                     },
        //             }, 
        //     },  
        //     plugins: {
        //         legend: {
        //             position: 'bottom',
        //             align: 'start',
        //             labels: {
        //                 usePointStyle: true,
        //                 font:{
        //                     size:10,
        //                     style: 'normal',
        //                     weight: 400,
        //                     family: 'Spoqa Han Sans Neo',
        //                 },
        //                 color: '#000',
        //                 padding:24,
        //             },
        //             itemSpacing: 20,
        //         },
        //     },
        // },
    });
};
drawChart1();

// 요일별 알림 차트
async function createDatasets2(){
    const df_result = await createDF(2);
    let init_datasets=[]
    let init_dataset={label: '',data: [],fill: false,
        borderColor: '',borderWidth:2,backgroundColor:'',tension: 0.1,pointRadius : 0,}

    for (let loc=0; loc<location_list.length;loc++){
        console.log(location_list[loc])
        let filteredData2 = temp2.$data.filter(item => item[2] === location_list[loc]);
        temp_loc=new dfd.DataFrame(filteredData2,{columns:['count','day','location']})
        temp_loc.print()
        temp_loc_len=temp_loc.shape[0];

        temp_data=[0,0,0,0,0,0,0];

        for (let i = 1; i <= temp_loc_len; i++) {
            temp_loc.resetIndex({inplace:true})
            time= Number(temp_loc.loc({rows:[i-1],columns:['day', 'count']}).$data[0][0]);
            count= Number(temp_loc.loc({rows:[i-1],columns:['day', 'count']}).$data[0][1]);
            //console.log(time); console.log(count); console.log(lst.indexOf(time));
            temp_data[lst.indexOf(time)]=count;
        }
        init_dataset.label=' '+location_list[loc]
        init_dataset.data=temp_data;
        init_dataset.borderColor=pallete[loc];
        init_dataset.backgroundColor=pallete[loc];
        
        //console.log(init_dataset);
        init_datasets.push({...init_dataset});
    }
    //console.log(init_datasets);
    return init_datasets;
}
async function drawChart2(){
    dayData=await createDatasets2();
    dayCtx = document.getElementById('daychart');
    dayChart = new Chart(dayCtx, {
        type: 'line',
        data: {
            //labels: data.daily_data.map(item => item.day), // 요일 레이블 데이터
            labels:['일','월','화','수','목','금','토'],
            datasets:dayData,
        },
        options: {
            aspectRatio: null,
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
                            family: 'Spoqa Han Sans Neo', // x축 레이블 폰트 패밀리 
                        },
                        color:'#A1A1AA',
                    }, 
                }, 
                y:{
                    grid:{
                        borderWidth :2,
                        borderColor:'rgba(235, 235, 235,1)',
                    },
                    ticks:{
                        beginAtZero:false,
                        min :2,
                        stepSize :1
                    }
                }
            },  
            plugins:{
                legend:{
                    position:'bottom',
                    align:'start',
                    labels:{
                        usePointStyle:true,
                        font:{size :10 ,style :'normal' ,weight :400 ,family :'Spoqa Han Sans Neo' } ,
                        color:'#000' ,
                        padding :24
                    } ,
                    itemSpacing :20
                }
            }
        }
    });
};
drawChart2();

// 월별 알림 차트
async function createDatasets3(){
    const df_result = await createDF(3);
    let init_datasets=[]
    let init_dataset={label: '',data: [],fill: false,
        borderColor: '',borderWidth:2,backgroundColor:'',tension: 0.1,pointRadius : 0,}

    for (let loc=0; loc<location_list.length;loc++){
        temp_loc=temp3.query(temp3['location'].eq(location_list[loc])).loc({columns: ['MM', 'count']});
        temp_loc_len=temp_loc.shape[0];
        temp_loc.print()

        temp_data=[0,0,0,0,0,0,0,0,0,0,0,0];

        for (let i = 1; i <= temp_loc_len; i++) {
            temp_loc.resetIndex({inplace:true})
            time= Number(temp_loc.loc({rows:[i-1],columns:['MM','count']}).$data[0][0]);
            count= Number(temp_loc.loc({rows:[i-1],columns:['MM','count']}).$data[0][1]);
            temp_data[time-1]=count;
        }
        init_dataset.label=' '+location_list[loc]
        init_dataset.data=temp_data;
        init_dataset.borderColor=pallete[loc];
        init_dataset.backgroundColor=pallete[loc];
        
        //console.log(init_dataset);
        init_datasets.push({...init_dataset});
    }
    //console.log(init_datasets);
    return init_datasets;
}
async function drawChart3(){
    monthData=await createDatasets3();
    monthCtx = document.getElementById('monthchart').getContext('2d')
    monthChart = new Chart(monthCtx, {
        type: 'line',
        data: {
            //labels: data.monthly_data.map(item => item.month), // 월 레이블 데이터
            labels:[1,2,3,4,5,6,7,8,9,10,11,12],
            datasets: monthData,
        },
        options: {
            aspectRatio: null,
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
                            family: 'Spoqa Han Sans Neo', // x축 레이블 폰트 패밀리 
                        },
                        color:'#A1A1AA',
                    }, 
                }, 
                y:{
                    grid:{
                        borderWidth :2,
                        borderColor:'rgba(235, 235, 235,1)',
                    },
                    ticks:{
                        beginAtZero:false,
                        min :2,
                        stepSize :1
                    }
                }
            },  
            plugins:{
                legend:{
                    position:'bottom',
                    align:'start',
                    labels:{
                        usePointStyle:true,
                        font:{size :10 ,style :'normal' ,weight :400 ,family :'Spoqa Han Sans Neo' } ,
                        color:'#000' ,
                        padding :24
                    } ,
                    itemSpacing :20
                }
            }
        }
    
    });
}
drawChart3();

// 캘린더 선택
$(document).ready(function() {
     // 시간별 알림 횟수 -> 날짜 선택
    $("#datepicker1").datepicker({
        format: 'yyyy-mm-dd',
        language: 'ko',
        autoclose: true,
        todayHighlight: true,
    }).on('changeDate', async function(e){
        selectedDate = $('#datepicker1').datepicker('getFormattedDate'); // 전역 변수에 값 할당
        console.log(selectedDate)
        dateParts = selectedDate.split("-");
        console.log(dateParts[0]); //YYYY
        console.log(dateParts[1]); //MM
        console.log(dateParts[2]); //DD

        // 차트 데이터 업데이트
        let newDataset = await createDatasets1();
        timeChart.data.datasets = newDataset;
        timeChart.update();


    });

    // 요일별 알림 횟수 -> week 선택
    $('#datepicker2').datepicker( { 
            format: "yyyy-mm-dd",
            autoclose: true,
            language:'ko'
        }).on('show', function(e){
            var tr = $('body').find('.datepicker-days table tbody tr');
            tr.mouseover(function(){
                $(this).addClass('week-over');
            });
            tr.mouseout(function(){
                $(this).removeClass('week-over');
            });
            calculate_week_range(e);
        }).on('hide', function(e){
            console.log('date changed');
            calculate_week_range(e);
        });
        var calculate_week_range = async function(e){
            selectedDate = $('#datepicker2').datepicker('getFormattedDate');
            var input = e.currentTarget;
            $('body').find('.datepicker-days table tbody tr').removeClass('week-active');
            var tr = $('body').find('.datepicker-days table tbody tr td.active.day').parent();
            tr.addClass('week-active');
            var date = e.date;
            var start_date = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay() -1);
            var end_date = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay() + 5);
            var friendly_string = start_date.getFullYear() + '-' + ('0'+(start_date.getMonth() + 1)).slice(-2) + '-' + ('0'+(start_date.getDate() + 1)).slice(-2)  + ' ~ '
                                + end_date.getFullYear() + '-' + ('0'+(end_date.getMonth() + 1)).slice(-2) + '-' + ('0'+(end_date.getDate() + 1)).slice(-2);
            console.log(friendly_string);
            $(input).val(friendly_string);

            // 차트 업데이트
            let newDataset = await createDatasets2();
            dayChart.data.datasets = newDataset;
            dayChart.update();

        }

    // 월별 알림 횟수 -> 연도 선택
    $("#datepicker3").datepicker({ // 월별 알림 횟수 -> 연도 선택
        format: 'yyyy',
        viewMode: "years",
        minViewMode: "years",
        language: 'ko',
        autoclose: true,
        todayHighlight: true
    }).on('changeDate', async function(e){
        selectedDate = $('#datepicker3').datepicker('getFormattedDate'); // 전역 변수에 값 할당
        dateParts = selectedDate.split("-");
        console.log(dateParts[0]); //YYYY

        // 차트 데이터 업데이트
        let newDataset = await createDatasets3();
        monthChart.data.datasets = newDataset;
        monthChart.update();
    });

});

// 신규알람시 bell 이미지 변경 
window.addEventListener('DOMContentLoaded', function()
{
    var iconbell = document.querySelector('.bell');
    const belltext = document.querySelector('.new');

    let str_num = belltext.innerText;
	let regex = /[^0-9]/g;
	const result = str_num.replace(regex, "");
	let bellnumber = parseInt(result);
    if (bellnumber!= 0 && bellnumber > 0){
        iconbell.src = '../../static/images/alarmicon.svg';
    }else{
        iconbell.src = '../../static/images/bell.svg';
    }

});

// week 계산하는 함수
function calculateWeekRange(stringdate) {
    var inputDate = stringdate;
    var date = new Date(inputDate);
    
    // Calculate the start and end dates of the week
    var sun = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay() + 1);  // Sunday of the week
    var mon = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay() + 2);
    var tue = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay() + 3);
    var wed = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay() + 4);
    var thu = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay() + 5);
    var fri = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay() + 6);
    var sat = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay() + 7);

    // Format dates as strings in YYYY-MM-DD format
    sun = Number(sun.toISOString().slice(0,10).replaceAll('-',''));
    mon = Number(mon.toISOString().slice(0,10).replaceAll('-',''));
    tue = Number(tue.toISOString().slice(0,10).replaceAll('-',''));
    wed = Number(wed.toISOString().slice(0,10).replaceAll('-',''));
    thu = Number(thu.toISOString().slice(0,10).replaceAll('-',''));
    fri = Number(fri.toISOString().slice(0,10).replaceAll('-',''));
    sat = Number(sat.toISOString().slice(0,10).replaceAll('-',''));
    
    return [sun,mon,tue,wed,thu,fri,sat];
}

// 단속 우선 위치
fetch('http://43.202.121.88/api/place_three_graph',{
    method: "GET",
    headers: {
        "X-CSRFToken": csrftoken,
        "Content-Type": "application/json",
    },
}) 
    .then(response => response.json())
    .then(data => {
        data.sort((a, b) => b.location_count - a.location_count);

        for(let i=0; i<3; i++) {
            let rank = ['first', 'second', 'third'][i];
            document.querySelector(`.main_place .ranking.${rank} .top_text`).textContent = data[i].location;
            
            let index = location_list.indexOf(data[i].location);
            if(index !== -1){
                document.querySelector(`.main_place .ranking.${rank} .circle`).style.background = pallete[index];
            }
        }
    })
    .catch(error => console.error('Error:', error));

// 단속 주요 시간
fetch('http://43.202.121.88/api/time_three_graph',{
    method: "GET",
    headers: {
        "X-CSRFToken": csrftoken,
        "Content-Type": "application/json",
    },
}) 
    .then(response => response.json())
    .then(data => {
        data.sort((a, b) => b.alarm_count - a.alarm_count);

        document.querySelector('.main_time .ranking.first .top_text').textContent = convertToTimeRange(data[0].hour_group);
        document.querySelector('.main_time .ranking.second .top_text').textContent = convertToTimeRange(data[1].hour_group);
        document.querySelector('.main_time .ranking.third .top_text').textContent = convertToTimeRange(data[2].hour_group);
    })
    .catch(error => console.error('Error:', error));

// 시간 이쁘게 하는 함수
function convertToTimeRange(str) {
    // 입력된 문자열을 숫자로 변환
    var hour = parseInt(str, 10);

    // 다음 시간 계산 (23시 이후에는 0시로)
    var nextHour = hour === 23 ? 0 : hour + 1;

    // 시간을 두 자리 문자열로 포맷팅
    var formattedHour = String(hour).padStart(2, '0');
    var formattedNextHour = String(nextHour).padStart(2, '0');

    // 결과 반환
    return `${formattedHour}시~${formattedNextHour}시`;
}

window.addEventListener('DOMContentLoaded', function()
{
    var iconbell = document.querySelector('.bell');
    const belltext = document.querySelector('.new');

    let str_num = belltext.innerText;
	let regex = /[^0-9]/g;
	const result = str_num.replace(regex, "");
	let bellnumber = parseInt(result);
    if (bellnumber!= 0 && bellnumber > 0){
        iconbell.src = '../../static/images/alarmicon.svg';
    }else{
        iconbell.src = '../../static/images/bell.svg';
    }

});