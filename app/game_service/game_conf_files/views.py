# game_conf_files/views.py
from rest_framework.response import Response
from rest_framework.decorators import api_view
import requests
from django.shortcuts import render

def index(request):
    return render(request, 'index.html')

@api_view(['GET'])
def fetch_data(request):
    # Mock data for demonstration
    data = {"message": "Sample data returned successfully!"}
    return Response(data)
