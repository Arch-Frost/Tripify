from selenium.webdriver.common.by import By
from .base_page import BasePage

class LoginPage(BasePage):
    EMAIL_INPUT = (By.NAME, 'email')
    PASSWORD_INPUT = (By.NAME, 'password')
    USER_LOGIN_BUTTON = (By.NAME, 'userLogin')
    ADMIN_LOGIN_BUTTON = (By.NAME, 'adminLogin')
    ALERT_MESSAGE = (By.CLASS_NAME, 'alert')

    def open(self):
        self.driver.get('http://localhost:3000/')  # Change this to your app's URL

    def login_as_user(self, email, password):
        self.send_keys(self.EMAIL_INPUT, email)
        self.send_keys(self.PASSWORD_INPUT, password)
        self.click(self.USER_LOGIN_BUTTON)

    def login_as_admin(self, email, password):
        self.send_keys(self.EMAIL_INPUT, email)
        self.send_keys(self.PASSWORD_INPUT, password)
        self.click(self.ADMIN_LOGIN_BUTTON)

    def get_alert_message(self):
        return self.find_element(self.ALERT_MESSAGE).text
