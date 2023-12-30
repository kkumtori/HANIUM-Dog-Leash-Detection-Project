from django.contrib import admin
from .models import Information

class InfoAdmin(admin.ModelAdmin) :
    id_field = ("id", )

admin.site.register(Information, InfoAdmin)