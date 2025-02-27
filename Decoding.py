class Decoding:
    def __init__(self):
        self.char = None

    def reverse_ascii_xor(self, data, key="F"):
        decoded_data = ""
        key_value = ord(key)

        if isinstance(data, dict):
            result = {}
            for timestamp, encrypted_chars in data.items():
                decoded_chars = []
                for encrypted_char in encrypted_chars:
                    decoded_char = chr(ord(encrypted_char) ^ key_value)
                    decoded_chars.append(decoded_char)
                result[timestamp] = ''.join(decoded_chars)
            return result
        else:
            for char in data:
                decoded_char = chr(ord(char) ^ key_value)
                decoded_data += decoded_char
            return decoded_data