from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from products.models import Profile

User = get_user_model()

class RegisterView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        full_name = request.data.get('full_name')

        if User.objects.filter(email=email).exists():
            return Response({'email': ['Barua pepe hii tayari imesajiliwa.']}, status=status.HTTP_400_BAD_REQUEST)

        # Unda User
        user = User.objects.create_user(username=email, email=email, password=password)
        # Unda Profile pamoja naye
        Profile.objects.create(user=user, full_name=full_name, role='buyer')

        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {'id': user.id, 'email': user.email, 'full_name': full_name}
        }, status=status.HTTP_201_CREATED)

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        # Hapa tunarudisha Profile ya user aliyeingia
        profile = request.user.profile
        serializer = ProfileSerializer(profile) # Hakikisha umeunda Serializer
        return Response(serializer.data)