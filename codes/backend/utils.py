import requests
from django.conf import settings


def api_client(end_point, params):
    response = requests.post(settings.API_URL + end_point, json=params)

    return response.json()
