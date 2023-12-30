from django.db import models
from django.contrib.auth.models import User


class Information(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    
    camera = models.AutoField(
        help_text="할당된 CAM 번호(PK)",
        primary_key=True,
        )
    image = models.ImageField(
        help_text="목줄 미착용 시 저장되는 이미지",
        null=False,
        default=""
        )
    dateTime = models.DateTimeField(
        help_text="목줄 미착용 시 저장되는 DateTime",
        auto_now=True,
        null = False
        )
    prob_dog = models.FloatField(
        help_text="객체가 개일 확률",
        null=False,
    )
    prob_leash = models.FloatField(
        help_text="목줄 착용 확률",
        null=False,
    )
    location = models.CharField(
        help_text="ex. 서울시 금천구 가산동",
        max_length=100,
        null=False,
        )
    add = models.CharField(
        help_text="ex. (전)100P_032",
        max_length=100,
        null=False,
        default="위치 보조 지표 없음",
        )
    class Meta:
        # db_table = 'informaion' # table 이름 설정
        ordering = ('-dateTime',) # 조회 정렬 - 최근순