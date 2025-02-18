
class Encryption:
    def __init__(self):
        self.char = None

    def ascii_xor(self, data, key="F"):
        # הצפנת כל תו במחרוזת
        encrypted_data = ""
        for char in data:
            encrypted_char = chr((ord(char) ^ ord(key)) % 256)
            encrypted_data += encrypted_char
        return encrypted_data

encryptor = Encryption()