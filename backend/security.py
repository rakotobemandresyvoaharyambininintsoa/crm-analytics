from passlib.context import CryptContext
from jose import jwt



# Accepte plusieurs types de hash
pwd_context = CryptContext(
    schemes=[
        "pbkdf2_sha256",
        "bcrypt"
    ],
    deprecated="auto"
)



SECRET_KEY = "crm-secret-key-change-this"

ALGORITHM = "HS256"



def hash_password(password):

    return pwd_context.hash(password)



def verify_password(password, hashed):

    try:
        return pwd_context.verify(
            password,
            hashed
        )

    except Exception:

        return False



def create_token(data):

    return jwt.encode(
        data,
        SECRET_KEY,
        algorithm=ALGORITHM
    )