import requests
from django.conf import settings


def api_client(end_point, method='GET', params=None):
    if method == 'POST':
        response = requests.post(settings.API_URL + end_point, json=params)
    elif method == 'GET':
        response = requests.get(settings.API_URL + end_point)

    return response.json()
