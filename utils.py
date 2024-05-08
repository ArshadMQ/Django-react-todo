from rest_framework.response import Response
from rest_framework import status
from dotenv import load_dotenv
import jwt, os

load_dotenv()


class JWTTokenizer:

    @staticmethod
    def _encode(user_data: str, secret: str = os.getenv("JWT_SECRET"), algorithm: str = 'HS256'):
        return jwt.encode(user_data, key=secret, algorithm=algorithm)

    @staticmethod
    def _decode(token: str, secret: str = os.getenv("JWT_SECRET"), algorithm: str = 'HS256'):
        return jwt.decode(token, key=secret, algorithms=algorithm)


def _validations(access_token):
    try:
        decoded_token = JWTTokenizer._decode(access_token)
    except jwt.exceptions.ExpiredSignatureError:
        return Response(status=status.HTTP_401_UNAUTHORIZED)
    except jwt.exceptions.InvalidSignatureError:
        return Response(status=status.HTTP_401_UNAUTHORIZED)
