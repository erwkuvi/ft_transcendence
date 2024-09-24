# game_conf_files/views.py
import requests
from rest_framework.response import Response
from rest_framework.decorators import api_view

@api_view(['GET'])
def fetch_data(request):
    response = requests.get('http://localhost:8000/sample-data/')
    data = response.json()
    return Response(data)