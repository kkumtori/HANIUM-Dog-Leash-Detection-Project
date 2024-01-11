// 안내멘트를 보여주는 함수
function savePageSettings() {
	const instructionInput = document.getElementById('instruction');
	const instruction = instructionInput.value;
	const resultElement = document.getElementById('repeatnum').innerText;
	const resultElement2 = document.getElementById('repeatTime').innerText;
	const resultElement3 = document.getElementById('startTimeDisplay').innerText;
	const resultElement4 = document.getElementById('endTimeDisplay').innerText;
	let regex = /[^0-9]/g;
	const result1 = resultElement.replace(regex, "");
	const result2 = resultElement2.replace(regex, "");
	const result3 = resultElement3.replace(regex, "");
	const result4 = resultElement4.replace(regex, "");
	var checkboxes = document.querySelectorAll('input[type="checkbox"]');
	
	var volSlider = document.getElementById('volumeSlider');
	const volume = volSlider.value;
	// 체크박스 선택 요소 확인.
	var selectedValues = [];	
	for (var i=0; i<checkboxes.length; i++) {
        var checkbox = checkboxes[i];
		var camera = document.querySelector('.cameraname');
        if (checkbox.checked) {
            selectedValues.push(camera.innerText);
        }
    }
	console.log(selectedValues)
	// 입력된 안내멘트가 비어있는지 확인
	if (instruction.trim() === '') {
		Swal.fire({
			icon: 'error',
			title: '설정 실패',
			text: '내용을 입력해주세요.',
			confirmButtonColor: '#10B981',
		})
	} else {
		Swal.fire({
			title: '설정을 저장하겠습니까?',
			showDenyButton: true,
			confirmButtonText: '저장',
			cancelButtonColor:'rgba(113,113,122,1)',
			confirmButtonColor: '#10B981',
			denyButtonText: `취소`,
		}).then((result) => {
			if (result.isConfirmed) {
				// let updatePromises = selectedValues.map(value => 
				// 	updateData('http://43.202.121.88/api/update_setting', value, volume, result1,
				// 	result2,result3,result4,instruction,'미작동시멘트')
				// );
				Swal.fire( {
					title :'설정이 적용되었습니다.', 
					html: 
					`안내멘트: ${instruction},<br>
					반복횟수: ${resultElement}, 반복주기: ${resultElement2},<br>
					시작시간: ${resultElement3}, 종료시간: ${resultElement4}`, 
					icon: 'success',
					confirmButtonColor: '#10B981'
				})
				.catch(error => console.error(error));
			}
		})
		// 여기에서 안내멘트를 사용하여 원하는 동작을 수행하면 됩니다.
	}
}
// async function updateData(url, location, sound, repeat_number, repeat_cycle, start_time, end_time, vol_ment, nonvio_ment) {
//     const response = await fetch(`${url}/${location}/${sound}/${repeat_number}/${repeat_cycle}/${start_time}/${end_time}/${vol_ment}/${nonvio_ment}`, {
//         method: 'GET',
//     });

//     if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     return await response.json();
// }