from django.shortcuts import render
from backend.utils import api_client


def dashboard(request):
    val = api_client('/dashboard-report/')

    context = {
        'profile_count': val['profile_count'],
        'referral_count': val['referral_count'],
        'categories': val['categories'],
        'categories_keys': val['categories'].keys(),
        'categories_values': val['categories'].values(),
    }
    return render(request, 'dashboard.html', context)
