import requests
from django.conf import settings


def api_client(end_point):

    response = requests.get(settings.API_URL + end_point)

    return response.json()
