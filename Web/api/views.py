from django.contrib.auth.models import User
from rest_framework import viewsets, status
from api.serializers import UserSerializer, InformationSerializer
from api.models import Information
from rest_framework.response import Response




    
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class InformationViewSet(viewsets.ModelViewSet):
    model = Information
    queryset = Information.objects.all()
    serializer_class = InformationSerializer
    
    def create(self, request, *args ,**kwargs):
        # reqeust.data는 mutable 형태이기 때문에 바로 사용을 못해요. 그래서, 카피를 사용 해서 이뮤터블한 자료인 딕셔너리로 바꿨어요
        request_data = request.data.copy()
        # request라고 나중에 프린트 찍어보시면 아시겠지만 여기엔 요청을 보낸 데이터가 다 들어와있어요 딕셔너리 형태로, 그 중에 user 데이터만 뽑아온거고, user안에는 id값이 무조건 포함 되어 있으니 그 데이터를 가지고 왔어요
        request_data["user"] = request.user.id
        # 겟 시리얼라이저는 위에서 선언 해준 시리얼라이저를 불러온거에요
        serializer = self.get_serializer(data=request_data)
        # save 하기 전에 valid한 데이터인지 검증을 해야하는데, 안했기 때문에 아까 에러가 떴었던 거라서 밸리드 구문을 넣어줬어요, 이건 공식문서에서 지정해준 형식이라 옵션 값을 같이 넣어줬어요
        serializer.is_valid(raise_exception=True) 

        # 그리고 이제 이 create를 하는데 유저가 누군지 알아야겠죠? 그래서 User데이터에서 누군지 찾았어요
        user_instance = User.objects.get(id=request.user.id)
        # 그래서 그 유저 쿼리셋 객체를 유저의 ForeingKey 필드에 넘겨서 저장했습니다
        _saved = serializer.save(user=user_instance)
        # 이러한 요청이 성공하면 201 코드, 만약 실패하면 400 Bad Request를 줄 수도 있겠죠?
        return Response(serializer.data, status=status.HTTP_201_CREATED)

