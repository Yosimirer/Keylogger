class Decoding:
    def __init__(self):
        self.char = None

    def reverse_ascii_xor(self, data, key="F"):
        decoded_data = ""
        key_value = ord(key)
        for char in data:
            char_code = ord(char)
            decoded_char = chr(char_code ^ key_value)
            decoded_data += decoded_char
        return decoded_data

