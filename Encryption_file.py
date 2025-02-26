
class Encryption:
    def __init__(self):
        self.char = None

    def ascii_xor(self, data, key="F"):
        encrypted_data = ""
        key_value = ord(key)
        for char in data:
            char_code = ord(char)
            encrypted_char = chr(char_code ^ key_value)
            encrypted_data += encrypted_char
        return encrypted_data

encryptor = Encryption()