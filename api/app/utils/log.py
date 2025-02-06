import os
import datetime
from logging.handlers import BaseRotatingHandler


class DayRotatingHandler(BaseRotatingHandler):
    def __init__(self, filename, mode, encoding=None, delay=False):
        self.date = datetime.date.today()
        self.suffix = "%Y-%m-%d.log"
        super(BaseRotatingHandler, self).__init__(filename, mode, encoding, delay)

    def shouldRollover(self, record):
        return self.date != datetime.date.today()

    def doRollover(self):
        if self.stream:
            self.stream.close()
            self.stream = None
        new_log_file = os.path.join(os.path.split(self.baseFilename)[0], datetime.date.today().strftime(self.suffix))
        self.baseFilename = "{}".format(new_log_file)
        self._open()
