
function acceptbuttonsetting() {
    const acceptBtns = document.querySelectorAll('.accept');
    acceptBtns.forEach(btn => {
    btn.addEventListener('click', async function() {
    const row = btn.closest('tr');
    const { value: name } = await Swal.fire({
        title: '담당자를 선택해주세요',
        input: 'select',
        inputOptions: {
            '온수구': {
                홍길동1: '홍길동1',
                홍길동2: '홍길동2',
                홍길동3: '홍길동3',
                홍길동4: '홍길동4'
            },
            '구로구': {
                흥부1: '흥부1',
                흥부2: '흥부2',
                흥부3: '흥부3'
            },
            '가산디': {
                심청이1 : '심청이1',
                심청이2 : '심청이2'
            },
            '노원구':{
                이몽룡 : '이몽룡1'
            },
        },
        inputPlaceholder: '담당자',
        showCancelButton: true,
        confirmButtonColor: '#10B981',
        cancelButtonColor: '#d33',
    })
        if (name) {
            let seq = row.id;
            // 변경된 데이터 서버에 저장
            updateData('http://43.202.121.88/api/main_state', seq, 2)
                .then(updatedData => console.log(updatedData))
                .catch(error => console.error(error));
            Swal.fire(
            {
                title:'접수가 완료되었습니다.', 
                text: `담당자 : ${name}`,
                confirmButtonColor: '#10B981',
                cancelButtonColor: '#d33',
                confirmButtonText: '확인',
                cancelButtonText: '취소'
            })
            row.class = 'old_alarm';
            const actionCell = row.querySelector('td[id="action"]');
            actionCell.textContent = '접수 완료';
    }
    });
    });
}
async function updateData(url, seq, newState) {
    const response = await fetch(`${url}/${seq}/${newState}`, {
        method: 'GET',
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
}

function deletebuttonsetting() {
    const acceptBtns = document.querySelectorAll('.delete');
    acceptBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const row = btn.closest('tr');
            swal.fire({
                icon: 'warning',
                title: '정말 삭제하시겠습니까?',
                text: 'OKAY DOGIE',
                showCancelButton: true,
                confirmButtonColor: '#10B981',
                cancelButtonColor: '#d33',
                confirmButtonText: '확인',
                cancelButtonText: '취소'
            }).then((result) => {
                if (result.isConfirmed) {
                    // state 값을 3으로 변경
                    let seq = row.id;
                    // 변경된 데이터 서버에 저장
                    updateData('http://43.202.121.88/api/main_state', seq, 3)
                        .then(updatedData => console.log(updatedData))
                        .catch(error => console.error(error));

                    Swal.fire({
                        title :'삭제되었습니다.', 
                        text: '', 
                        icon: 'success',
                        confirmButtonColor: '#10B981'
                    })
                    
                    row.className = 'old_alarm_d';
                    const actionCell = row.querySelector('td[id="action"]');
                    actionCell.textContent = '삭제 완료';

                }
            });
        });
    });

}
