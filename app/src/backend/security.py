# security.py
import os
from Crypto.Protocol.KDF import scrypt
from constants import HASHING_SALT_LENGTH, HASHING_N, HASHING_P, HASHING_R


def generate_salt(length=HASHING_SALT_LENGTH):
    return os.urandom(length).hex()


def hash_password(password, salt=None):
    if salt is None:
        salt = generate_salt()
    hash = scrypt(password, salt, 16, N=HASHING_N, r=HASHING_R, p=HASHING_P)
    return hash.hex()


def verify_password(stored_hash, input_password, salt):
    input_hash = hash_password(input_password, salt)
    return input_hash == stored_hash


# Any other security-related functions or constants can go here
