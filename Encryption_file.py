class Encryption:
    def __init__(self):
        self.char = None

    def ascii_xor(self,data):
        self.char = ord(data) ^ ord("F")
        return chr(self.char)


# הצפנה
encryptor = Encryption()

