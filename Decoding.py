class Decoding:
    def __init__(self):
        self.char = None

    def reverse_ascii_xor(self, data, key="F"):
        # המרה של כל תו בנתונים תוך שימוש בפעולת XOR
        decoded_data = ""
        for char in data:
            decoded_char = chr((ord(char) ^ ord(key)) % 256)
            decoded_data += decoded_char
        return decoded_data

# פענוח
# decoder = Decoding()
# decrypted_message = decoder.reverse_ascii_xor(encrypted_message, "F")
# print("Decrypted:", decrypted_message)