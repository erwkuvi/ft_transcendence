# game_conf_files/views.py
from rest_framework.response import Response
from rest_framework.decorators import api_view
import requests

@api_view(['GET'])
def fetch_data(request):
    # Replace with the actual data fetching logic
    # Here we assume you might want to fetch data from another API
    # or a mock data source instead.
    data = {"message": "Sample data returned successfully!"}
    return Response(data)

@api_view(['GET'])
def get_sample_data(request):
    # Simulating fetching data from another service or API
    response = requests.get('http://localhost:8000/sample-data/')
    data = response.json()
    return Response(data)