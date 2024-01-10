fetch("dogie_data.json")
    .then(response => response.json())
    .then(data => { 
        createTable(data);
		
    }).catch(error => {
    console.error('Error fetching data:', error);
});

function createTable(data) {
	var locations = [];
	// 증복 제거 후 locations에 location 넣기
	for (var i = 0; i < data.length; i++) {
		var location = data[i]['location'];
		
		if (!locations.includes(location)) {
		locations.push(location);
		}
	}
	let left_css = document.getElementById('left');
	let temp = document.getElementById('cameralist');  // 이미 존재하는 ul 요소 선택
    temp.innerHTML = '';  // 기존 내용 삭제
    for(let i=0; i<locations.length; i++){
        let camera = document.createElement('li');
        camera.setAttribute('id', 'cam'); 

        let cam_location =document.createElement('input');
        cam_location.setAttribute('name', 'camera');
        cam_location.setAttribute('class', 'camcb');
        cam_location.setAttribute('type', 'checkbox');

        let cameraName = document.createElement("a");  // a 태그 생성
        cameraName.className = "cameraname";  // class 이름 설정
        cameraName.textContent = locations[i];  // 카메라 위치 정보 설정
		camera.appendChild(cam_location);
        camera.appendChild(cameraName); 
		temp.appendChild(camera);
	};
	left_css.appendChild(temp);  // 생성한 ul 요소를 body에 추가
}
// 안내멘트를 보여주는 함수
function savePageSettings() {
	const instructionInput = document.getElementById('instruction');
	const instruction = instructionInput.value;
	
	// 입력된 안내멘트가 비어있는지 확인
	if (instruction.trim() === '') {
		Swal.fire({
			icon: 'error',
			title: '설정 실패',
			text: '내용을 입력해주세요.',
			confirmButtonColor: '#10B981',
		})
	} else {
		console.log(`안내멘트: ${instruction}`);
		Swal.fire({
			title: '설정을 저장하겠습니까?',
			showDenyButton: true,
			confirmButtonText: '저장',
			cancelButtonColor:'rgba(113,113,122,1)',
			confirmButtonColor: '#10B981',
			denyButtonText: `취소`,

		  }).then((result) => {
			/* Read more about isConfirmed, isDenied below */
			if (result.isConfirmed) {
			  Swal.fire( {
				title :'설정이 적용되었습니다.', 
				text: '', 
				icon: 'success',
				confirmButtonColor: '#10B981'})
			} 
		  })
		// 여기에서 안내멘트를 사용하여 원하는 동작을 수행하면 됩니다.
	}
}

function count2(type)  {
	// 결과를 표시할 element
	const resultElement2 = document.getElementById('result2');
	
	// 현재 화면에 표시된 값
	let str_num = resultElement2.innerText;
	let regex = /[^0-9]/g;
	const result = str_num.replace(regex, "");
	let number2 = parseInt(result);
	
	// 더하기/빼기
	if(type === 'decreaseRepeatCount') {
		number2 = parseInt(number2) + 1;
	}else if(type === 'increaseRepeatCount' && number2 > 0)  {
		number2 = parseInt(number2) - 1;
	}
	
	// 결과 출력
	resultElement2.innerText = `${number2}분`
}

function count(type)  {
	// 결과를 표시할 element	
	const resultElement = document.getElementById('result');
	
	// 현재 화면에 표시된 값
	let str_num = resultElement.innerText;
	let regex = /[^0-9]/g;
	const result = str_num.replace(regex, "");
	let number = parseInt(result);
	
	// 더하기/빼기
	if(type === 'plus') {
	  number = parseInt(number) + 1;
	}else if(type === 'minus' && number > 0)  {
	  number = parseInt(number) - 1;
	}
	
	// 결과 출력
	resultElement.innerText = number+ '회';
}
	    

function count3(type)  {
	// 결과를 표시할 element
	const resultElement3 = document.getElementById('startTimeDisplay');
	
	// 현재 화면에 표시된 값
	let str_num = resultElement3.innerText;
	let regex = /[^0-9]/g;
	const result = str_num.replace(regex, "");
	let number3 = parseInt(result);
	
	// 더하기/빼기
	if(type === 'increaseTime1' && number3 < 24) {
		number3 = parseInt(number3) + 1;
	}else if(type === 'decreaseTime1' && number3 > 0)  {
		number3 = parseInt(number3) - 1;
	}
	
	// 결과 출력
	resultElement3.innerText = number3 +'시';
}

function count4(type)  {
	// 결과를 표시할 element
	const resultElement4 = document.getElementById('endTimeDisplay');
	
	// 현재 화면에 표시된 값
	let str_num = resultElement4.innerText;
	let regex = /[^0-9]/g;
	const result = str_num.replace(regex, "");
	let number4 = parseInt(result);
	
	// 더하기/빼기
	if(type === 'increaseTime2' && number4 < 24) {
	  number4 = parseInt(number4) + 1;
	}else if(type === 'decreaseTime2' && number4 > 0)  {
	  number4 = parseInt(number4) - 1;
	}
	
	// 결과 출력
	resultElement4.innerText = number4+'시';
  }

function setVolume(){
	var volSlider = document.getElementById('volumeSlider');
	const volume = volSlider.value;
	volumeText.textContent = volume;
}
// 볼륨 조절 함수
function muteVolume(volume) {
	var slider = document.getElementById("volumeSlider");
	if (slider.value != 0){
		lastVolume = slider.value;
		slider.value = 0;
	}
	else {
        slider.value = lastVolume; // 음소거 해제, 마지막 볼륨으로 복구
    }
}
	


const checkboxes = document.querySelectorAll('.camcb');
for (const checkbox of checkboxes) {
    checkbox.addEventListener('click', function () {
        const totalCnt = checkboxes.length;
        const checkedCnt = document.querySelectorAll('.camcb:checked').length;
        if (totalCnt === checkedCnt) {
            document.querySelector('#checkAll').checked = true;
        } else {
            document.querySelector('#checkAll').checked = false;
        }
    });
}


function toggleAll(source) {
	var checkboxes = document.querySelectorAll('input[type="checkbox"]');
	for (var i = 0; i < checkboxes.length; i++) {
		checkboxes[i].checked = source.checked;
	}
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
function filter(){
	var value, item, name
	value = document.getElementById('spacelist').value.toUpperCase();
    item = document.querySelectorAll('#cam');
  //indexOf()를 활용한 검색기능 구현
    for(i=0;i<item.length;i++){
		name = item[i].getElementsByClassName("cameraname");
    	if(name[0].innerHTML.toUpperCase().indexOf(value) > -1){
        	item[i].style.display = "flex";
		}else{
			item[i].style.display = "none";
		}
    }
} 		