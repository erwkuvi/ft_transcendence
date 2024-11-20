# friends/utils.py
from rest_framework.response import Response

def respond_success(message):
    return Response({"success": message}, status=200)

def respond_error(message):
    return Response({"error": message}, status=404)

def respond_bad_request(message):
    return Response({"error": message}, status=400)
