from Encryption_file import encrypted

class Decoding:
    def __init__(self,data):
        self.data = data
        self.ch = None

    def reverse_ascii_xor(self):
        self.ch = ord(self.data) ^ ord("F")
        return chr(self.ch)



# פענוח
decoder = Decoding(encrypted)
decrypted = decoder.reverse_ascii_xor()
print(f"Decrypted: {decrypted}")  # התו המקורי שחזר