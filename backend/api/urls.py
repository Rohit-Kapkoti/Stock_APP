from django.contrib import admin
from django.urls import path
from api import views


urlpatterns = [
    path('register/', views.register),
    path('login/', views.login),
    path('profile/', views.profile),
    path('watchlist/', views.watchlist, name='watchlist'),
    path('watchlist/add/', views.add_to_watchlist, name='add_to_watchlist'),
    path('watchlist/remove/<str:symbol>/', views.remove_from_watchlist, name='remove_from_watchlist'),
    path('watchlist/data/', views.get_watchlist_stock_data, name='get_watchlist_stock_data'),    
]
