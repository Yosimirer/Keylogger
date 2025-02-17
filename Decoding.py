

class Decoding:
    def __init__(self):

        self.char = None

    def reverse_ascii_xor(self,data):
        self.char = ord(data) ^ ord("F")
        return chr(self.char)



# פענוח
decoder = Decoding()
