from rest_framework.response import Response
from rest_framework.decorators import (
        api_view, 
        permission_classes
    ) 
from rest_framework.permissions import IsAuthenticated

from django.contrib.auth import get_user_model

import ipdb

USER = get_user_model()

@api_view(['POST']) # К контроллеру можно получить доступ только с помощью http метода DELETE и POST
@permission_classes([IsAuthenticated]) 
def tweet_detail_view(request, *args, **kwargs):
    return Response({}, status=400)
    

@api_view(['POST']) # К контроллеру можно получить доступ только с помощью http метода DELETE и POST
@permission_classes([IsAuthenticated]) 
def action_follow_view(request, username, *args, **kwargs):
    ipdb.set_trace()
    data = request.data
    if not data:
        # Если данные не переданы
        return Response(
            {'message': 'actions parameters passed'}, 
            status=404
        )
    if 'action' not in data.keys():
        # Если данные существуют, но не имеют ключевого параметра action
        return Response(
            {'message': 'resource is being misused! action key parameter missing'},
            status=404
        )
    action_param = data.get('action')
    if action_param not in ('follow', 'unfollow'):
        # Если в данных есть ключевой параметр action, но значение параметра
        # являются не допустимыми
        return Response(
            {'message': 'resource is being misused! Follow or unfollow parameters are not passed'},
            status=400
        )
    curr_user_profile = request.user.profile    
    other_qs = USER.objects.filter(username=username)
    if not other_qs.exists():
        return Response({'message': 'no such user found'}, status=404)

    other_profile = other_qs.first().profile
    if action_param == 'follow':
        other_profile.follow_to.add(curr_user_profile)
    elif action_param == 'unfollow':
        other_profile.follow_to.remove(curr_user_profile)
    context = {
        'count': other_profile.follow_to.count()
    }
    return Response(context, status=200)
