class Encryption:
    def __init__(self):
        self.char = None

    def ascii_xor(self,data):
        self.char = ord(data) ^ ord("F")
        return chr(self.char)


# הצפנה
a = Encryption()
encrypted = a.ascii_xor("a")
print(f"Encrypted: {encrypted}")  # לדוגמה: תו מוצפן

