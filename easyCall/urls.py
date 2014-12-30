from django.conf.urls import patterns, include, url
from django.contrib import admin

urlpatterns = patterns(
    '',
    url(r'^$', include('pledges.urls')),

    url(r'^accounts/login/$', 'django.contrib.auth.views.login',
        {'template_name': 'login.html'},
        name='login'),
    url(r'^accounts/logout/$', 'django.contrib.auth.views.logout_then_login',
        name='logout'),

    url(r'^admin/', include(admin.site.urls)),
)
