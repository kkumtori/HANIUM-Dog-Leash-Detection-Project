from django.shortcuts import render
from django.views import View
from django.views.generic import TemplateView
import requests

class MainView(View):
    template_name = "site_admin/main_.html"

    def get(self, request):
        return render(request, self.template_name)
    
class StatisticsView(View):
    template_name = "site_admin/statistics.html"
    def get(self, request):
        return render(request, self.template_name)

class liveCamView(View):
    template_name = "site_admin/liveCam.html"

    def get(self, request):
        return render(request, self.template_name)

class DetailView(View):
    template_name = "site_admin/detail.html"
    def get(self, request):
        return render(request, self.template_name)
    
# class SettingView(View):
#     template_name = "site_admin/setting.html"

#     def get(self, request):
#         # 게시물 목록 출력
#         postList = Information.objects.order_by('-dateTime')
#         context = {'postList': postList}
#         return render(request, 'site_admin/setting.html', context)

class SettingView(View):
    template_name = "site_admin/setting.html"

    def get(self, request):
        return render(request, self.template_name)
    
class TestView(View):
    template_name = "site_admin/test.html"

    def get(self, request):
        return render(request, self.template_name)


def test(request):
    if request.method == 'POST':
        image = request.FILES.get('camera-image')
        CameraImage.objects.create(image=image)
    images = CameraImage.objects.all()
    context = {
        'images': images
    }
    return render(request, 'camera_view.html', context)
'''
def index(request):
    # 게시물 목록 출력
    postList = Information.objects.order_by('-dateTime')
    context = {'postList': postList}
    return render(request, 'site_admin/setting.html', context)
'''