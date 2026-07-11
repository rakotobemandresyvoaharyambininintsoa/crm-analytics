from backend.database import get_connection
from backend.security import verify_password, create_token


def authenticate_user(username, password):

    conn = get_connection()

    user = conn.execute(
        """
        SELECT id, username, password_hash, role
        FROM users
        WHERE username=?
        """,
        (username,)
    ).fetchone()

    conn.close()


    if not user:
        return None


    stored_hash = user[2]


    # Protection contre ancien hash cassé
    if not stored_hash.startswith("$pbkdf2-sha256$"):

        return None


    if verify_password(password, stored_hash):

        return {
            "id": user[0],
            "username": user[1],
            "role": user[3],
            "token": create_token(
                {
                    "user_id": user[0],
                    "role": user[3]
                }
            )
        }


    return None