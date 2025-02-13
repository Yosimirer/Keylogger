class Encryption:
    def __init__(self,data):
        self.data = data
        self.ch = None

    def ascii_xor(self,):
        self.ch = ord(self.data) ^ ord("F")
        return chr(self.ch)


# הצפנה
a = Encryption("a")
encrypted = a.ascii_xor()
print(f"Encrypted: {encrypted}")  # לדוגמה: תו מוצפן

